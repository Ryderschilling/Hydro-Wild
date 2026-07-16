// HydroWild Clean Ingredients page
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav, initCartUI } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initCartUI();

// ── Reveals ──
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 84%', once: true },
  });
});

// ── Hero creature parallax ──
gsap.to('.ing-hero__creature', {
  yPercent: 20,
  scrollTrigger: { trigger: '.ing-hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});

// ── Stat counters ──
document.querySelectorAll('.ing-stat__num[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 1.4, snap: { innerText: 1 }, ease: 'power2.out',
    }),
  });
});

// ── Ingredient cards — set invisible immediately, stagger fade in on scroll ──
document.querySelectorAll('.ing-card-grid').forEach((grid) => {
  const cards = grid.querySelectorAll('.ing-card');
  gsap.set(cards, { opacity: 0, y: 32 });
  gsap.to(cards, {
    opacity: 1, y: 0, stagger: 0.1, duration: 0.72,
    ease: 'power3.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
  });
});

// ── FAQ — all open by default, togglable ──
document.querySelectorAll('.ing-acc__item').forEach((item) => {
  const head = item.querySelector('.ing-acc__head');
  const body = item.querySelector('.ing-acc__body');
  const icon = item.querySelector('.ing-acc__icon');

  body.style.overflow = 'hidden';
  body.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)';

  // Start all open
  item.classList.add('open');
  // Use a rAF so the DOM has rendered and scrollHeight is accurate
  requestAnimationFrame(() => { body.style.maxHeight = body.scrollHeight + 'px'; });
  if (icon) icon.textContent = '−';

  head.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    body.style.maxHeight = isOpen ? '0px' : body.scrollHeight + 'px';
    if (icon) icon.textContent = isOpen ? '+' : '−';
  });
});

// ── Stevia section ──
gsap.from('.ing-stevia__img', {
  opacity: 0, scale: 0.92, x: 30, duration: 0.9, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.ing-stevia', start: 'top 80%', once: true },
});

// ── Footer ──
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});

// ── CTA creatures parallax ──
document.querySelectorAll('[data-cta-creature]').forEach((img, i) => {
  gsap.to(img, {
    yPercent: -20 + i * 8,
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
});
