import { animate } from 'motion';

// TODO: THIS WHOLE FILE NEEDS TO BE REDONE

function seq(fn, delay) {
  return new Promise(resolve => setTimeout(() => { fn(); resolve(); }, delay));
}

function animateList(list, baseDelay = 0, step = 100, opts = {}) {
  Array.from(list).forEach((el, i) => {
    setTimeout(() => {
      animate(el, { opacity: [0, 1], y: [24, 0], scale: [0.98, 1] }, Object.assign({ duration: 0.6, easing: [0.22, 1, 0.36, 1] }, opts));
    }, baseDelay + i * step);
  });
}

export function initMotion() {
  // Hero
  const heroTitle = document.querySelector('.hero h1');
  const heroSub = document.querySelector('.hero .subhead');
  const heroBtn = document.querySelector('.hero .btn');
  const heroCard = document.querySelector('.hero .hero-card');

  if (heroTitle) animate(heroTitle, { opacity: [0, 1], y: [32, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1], delay: 100 });
  if (heroSub) animate(heroSub, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1], delay: 260 });
  if (heroBtn) animate(heroBtn, { opacity: [0, 1], y: [18, 0], scale: [0.98, 1] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1], delay: 460 });
  if (heroCard) animate(heroCard, { opacity: [0, 1], scale: [0.985, 1] }, { duration: 0.9, easing: [0.22, 1, 0.36, 1], delay: 600 });

  // Feature cards
  const featureCards = document.querySelectorAll('#features .card');
  animateList(featureCards, 820, 120);

  // Download cards
  const downloadCards = document.querySelectorAll('#download .card');
  animateList(downloadCards, 1200, 140);

  // Badges (pulse)
  const badges = document.querySelectorAll('.badge');
  badges.forEach((b, i) => {
    // slight stagger for start
    setTimeout(() => {
      animate(b, { scale: [1, 1.04, 1] }, { duration: 1.8, easing: 'ease-in-out', repeat: Infinity });
    }, 1000 + i * 100);
  });

  // Buttons subtle continuous float
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((btn, i) => {
    // don't animate primary buttons too aggressively
    setTimeout(() => {
      animate(btn, { y: [0, -4, 0] }, { duration: 4.0, easing: 'ease-in-out', repeat: Infinity, delay: i * 120 });
    }, 1800 + i * 80);
  });

  // Small reveal for headings inside cards
  const cardHeadings = document.querySelectorAll('.card h3');
  cardHeadings.forEach((h, i) => {
    setTimeout(() => {
      animate(h, { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, easing: [0.22, 1, 0.36, 1] });
    }, 900 + i * 80);
  });

  // Clean up: ensure elements become visible in DOM flow (remove inline hiding if any)
  [...document.querySelectorAll('.card, .hero h1, .hero .subhead, .hero .btn, .badge')].forEach(el => {
    el.style.visibility = '';
  });
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // small timeout to ensure styles applied
    setTimeout(() => initMotion(), 60);
  });
}
