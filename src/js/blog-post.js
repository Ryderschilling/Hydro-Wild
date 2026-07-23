// HydroWild — Static blog post pages
// Content is pre-rendered into the HTML by scripts/generate-blog-posts.mjs;
// this only wires up nav/cart and entrance animations.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav, initCartUI } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initCartUI();

gsap.from('.post-hero__meta', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out', delay: 0.1 });
gsap.from('.post-hero__title', { opacity: 0, y: 24, duration: 0.75, ease: 'power3.out', delay: 0.2 });
gsap.from('.post-hero__author', { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out', delay: 0.35 });

gsap.from('.post-back', {
  opacity: 0, x: -16, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: '.post-body', start: 'top 85%', once: true },
});

document.querySelectorAll('.post-content p, .post-content h2, .post-content h3, .post-content ul').forEach((el) => {
  gsap.from(el, {
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
  });
});

gsap.from('.post-cta', {
  opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.post-cta', start: 'top 85%', once: true },
});

gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});
