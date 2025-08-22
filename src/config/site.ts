export type NavItem = {
    href: string;
    label: string;
};

export type SiteConfig = {
    title: string;
    description: string;
    themeColor: string;
    ownerName: string;
    repoUrl: string;
    issuesUrl: string;
    nav: NavItem[];
    supportedPlatforms: string[];
};

const repo = "https://github.com/eblissss/aurafolio-site";

const site: SiteConfig = {
    title: "AuraFolio — View Sheet Music",
    description: "Practice and perform with a clean, fast sheet music viewer.",
    themeColor: "#3a63ff",
    ownerName: "Ethan Bliss",
    repoUrl: repo,
    issuesUrl: `${repo}/issues`,
    nav: [
        { href: "/#features", label: "Features" },
        { href: "/#download", label: "Download" },
        { href: "/#whats-new", label: "Changelog" },
    ],
    // For the Footer
    supportedPlatforms: ["Windows", "macOS", "Linux"],
};

export default site;
