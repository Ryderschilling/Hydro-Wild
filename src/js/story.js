// HydroWild Our Story page
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav, initCartUI } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initCartUI();

// ── Reveal animations (reuses [data-reveal] pattern from main) ──
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 84%', once: true },
  });
});

// ── Diff cards stagger — set invisible immediately, fade in on scroll ──
gsap.set('.spage-diff__card', { opacity: 0, y: 36 });
gsap.to('.spage-diff__card', {
  opacity: 1, y: 0, stagger: 0.12, duration: 0.75,
  ease: 'power3.out', clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.spage-diff__grid', start: 'top 82%', once: true },
});

// ── Problem visual ──
gsap.from('.spage-problem__img', {
  opacity: 0, scale: 0.92, duration: 0.9, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.spage-problem__visual', start: 'top 80%', once: true },
});

// ── Mission quote ──
gsap.from('.spage-mission__quote', {
  opacity: 0, y: 20, duration: 1.0, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.spage-mission', start: 'top 80%', once: true },
});

// ── Footer ──
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});

// ── Future section packs float in ──
const futurePacks = document.querySelectorAll('.spage-future__pack');
if (futurePacks.length) {
  gsap.from(futurePacks, {
    opacity: 0,
    y: 60,
    scale: 0.75,
    stagger: 0.1,
    duration: 0.9,
    ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.spage-future', start: 'top 78%', once: true },
  });
  futurePacks.forEach((pack, i) => {
    gsap.to(pack, {
      y: `+=${14 + i * 4}`,
      duration: 2.5 + i * 0.3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.3,
    });
  });
}

// ── CTA creature parallax ──
document.querySelectorAll('[data-cta-creature]').forEach((img, i) => {
  gsap.to(img, {
    yPercent: -20 + i * 8,
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
});
