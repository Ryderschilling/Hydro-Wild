// HydroWild — Blog listing page
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav, initCartUI } from './ui.js';
import { POSTS } from '../data/posts.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initCartUI();

// ── Render blog cards ──────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  if (!POSTS.length) {
    grid.innerHTML = '<p class="blog-empty">No posts yet. Check back soon.</p>';
    return;
  }

  grid.innerHTML = POSTS.map((post) => `
    <article class="blog-card" data-blog-card>
      <a href="/blog/${post.slug}/" class="blog-card__img-link" tabindex="-1" aria-hidden="true">
        <div class="blog-card__img-wrap">
          <img src="${post.image}" alt="${post.imageAlt}" loading="lazy" />
        </div>
      </a>
      <div class="blog-card__body">
        <div class="blog-card__meta">
          <span class="blog-card__category">${post.category}</span>
          <span class="blog-card__date">${post.date}</span>
        </div>
        <h2 class="blog-card__title">
          <a href="/blog/${post.slug}/">${post.title}</a>
        </h2>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <a href="/blog/${post.slug}/" class="blog-card__cta">Read More →</a>
      </div>
    </article>
  `).join('');

  // Animate cards in — clearProps removes inline transform after animation
  // so GPU doesn't hold a stale rasterized layer (fixes blurry images)
  gsap.from('[data-blog-card]', {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.75,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.blog-grid', start: 'top 82%', once: true },
  });
}

// ── Hero text is animated via CSS (@keyframes blogHeroIn) — no GSAP needed ──

// ── Footer ─────────────────────────────────────────────
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});

renderGrid();
