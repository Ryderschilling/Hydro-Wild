// HydroWild contact page
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav, initCartUI } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initCartUI();

// ── Reveal animations ──
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 84%', once: true },
  });
});

// ── Kraken parallax ──
gsap.to('.contact-hero__creature img', {
  yPercent: 18,
  scrollTrigger: { trigger: '.contact-hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});

gsap.from('.contact-hero__creature img', {
  opacity: 0, x: 80, scale: 0.88, duration: 1.2, ease: 'power3.out', delay: 0.1,
});

gsap.from('.contact-info__card', {
  opacity: 0, x: 30, duration: 0.65, stagger: 0.1, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.contact-info', start: 'top 80%', once: true },
});

// ── Input glow on focus ──
document.querySelectorAll('.contact-field__input').forEach((el) => {
  el.addEventListener('focus', () => gsap.to(el, { boxShadow: '0 0 0 2px var(--hw-wild-blue)', duration: 0.2 }));
  el.addEventListener('blur',  () => gsap.to(el, { boxShadow: '0 0 0 1px rgba(255,255,255,0.12)', duration: 0.2 }));
});

// ── Footer ──
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});

// ── Form submit → mailto ──
const form    = document.getElementById('contactForm');
const success = document.getElementById('contactSuccess');
const resetBtn = document.getElementById('contactReset');

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value.trim();

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:hello@hydrowild.com`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  // Show success after a short delay (email client opens in background)
  setTimeout(() => {
    gsap.to(form, {
      opacity: 0, y: -16, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        form.hidden = true;
        success.hidden = false;
        gsap.from(success, { opacity: 0, y: 20, duration: 0.5, ease: 'back.out(1.4)' });
      },
    });
  }, 400);
});

resetBtn?.addEventListener('click', () => {
  gsap.to(success, {
    opacity: 0, y: -10, duration: 0.3,
    onComplete: () => {
      success.hidden = true;
      form.hidden = false;
      form.reset();
      gsap.from(form, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' });
    },
  });
});
