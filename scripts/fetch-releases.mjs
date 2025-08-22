import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const TOKEN = process.env.GITHUB_TOKEN;
const HOW_MANY = parseInt(process.env.RELEASES_LIMIT || '5', 10); // show latest + previous

if (!OWNER || !REPO || !TOKEN) {
  console.error('Missing env: GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN');
  process.exit(1);
}

const api = 'https://api.github.com';

async function gh(url, opts = {}) {
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'aurafolio-site-build'
    },
    ...opts
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('GitHub API error', res.status, t);
    throw new Error(`GitHub API ${res.status}`);
  }
  return res.json();
}

function pickAssetSha256(asset) {
  // GitHub exposes asset digests after upload.
  // This probes common shapes.
  const d = asset?.digest;
  if (!d) return null;
  if (typeof d === 'string') return d;
  if (typeof d === 'object') {
    if (d.sha256) return d.sha256;
    if (d['sha-256']) return d['sha-256'];
  }
  return null;
}

function matchPlatforms(assets) {
  const map = {
    windows_x64: {
      label: 'Windows (x64)',
      pattern: /^AuraFolio-Setup-v[\d.]+-windows-x64.exe$/
    },
    macos_arm64: {
      label: 'macOS (Apple Silicon)',
      pattern: /^AuraFolio-v[\d.]+-macos-arm64.dmg$/
    },
    linux_x64: {
      label: 'Linux (x64)',
      pattern: /^AuraFolio-v[\d.]+-linux-x64.AppImage$/
    }
  };

  const result = {};
  for (const a of assets) {
    for (const key of Object.keys(map)) {
      const { label, pattern } = map[key];
      if (pattern.test(a.name)) {
        const sha256 = pickAssetSha256(a) || '';
        const sizeMb = Math.max(0, (a.size || 0) / 1024 / 1024);
        result[key] = {
          label,
          size_mb: Number(sizeMb.toFixed(1)),
          sha256,
          url: a.browser_download_url,
          filename: a.name
        };
      }
    }
  }
  return result;
}

function normalizeRelease(r) {
  return {
    version: r.tag_name,
    released: r.published_at,
    notes_markdown: r.body || '',
    assets: matchPlatforms(r.assets || [])
  };
}

async function main() {
  // Pull enough releases to cover latest + previous entries
  const releases = await gh(`${api}/repos/${OWNER}/${REPO}/releases?per_page=${Math.max(HOW_MANY, 10)}`);
  const published = releases
    .filter(r => !r.draft)
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  const picked = published.slice(0, HOW_MANY).map(normalizeRelease);
  if (picked.length === 0) {
    console.error('No published releases found.');
    process.exit(1);
  }

  const latest = picked[0];
  const history = picked.slice(1);

  const out = { latest, history };

  const outDir = path.resolve('src/data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'releases.json'), JSON.stringify(out, null, 2));
  console.log('Wrote src/data/releases.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
