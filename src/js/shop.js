// HydroWild shop page — all 4 flavors with add-to-cart.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLAVORS, BUNDLES } from '../data/products.js';
import { cart } from '../lib/cart.js';
import { initNav, initCartUI } from './ui.js';
import { hydrateProducts } from '../lib/shopify.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
const cartUI = initCartUI();

// ── Build product cards ──
const grid = document.getElementById('shopGrid');
grid.innerHTML = FLAVORS.map((f) => `
  <div class="shop-card" style="--card-color:${f.color};--card-bg:${f.bg};cursor:pointer" data-href="/products/${f.id}/">
    <div class="shop-card__bg-creature" aria-hidden="true">
      <img src="${f.creatureImg}" alt="" loading="lazy" />
    </div>
    <div class="shop-card__body">
      <span class="shop-card__creature-tag" style="color:${f.color}">${f.presents}</span>
      <img class="shop-card__pack" src="${f.packImg}" alt="HydroWild ${f.name}" loading="lazy" />
      <h2 class="shop-card__name" style="color:${f.color}">${f.name}</h2>
      <p class="shop-card__tagline">${f.tagline}</p>
      <p class="shop-card__price" data-price-id="${f.id}">$${f.price.toFixed(2)}</p>
      <div class="shop-card__actions">
        <button class="btn btn--primary" data-add="${f.id}">Add to Cart</button>
        <a class="btn btn--ghost" href="/products/${f.id}/">View Flavor</a>
      </div>
    </div>
  </div>
`).join('');

// ── Hydrate prices from Shopify (no-op in mock mode) ──
const allHandles = [
  ...FLAVORS.map((f) => f.handle),
  ...BUNDLES.map((b) => b.handle),
];
hydrateProducts(allHandles).then((priceMap) => {
  FLAVORS.forEach((f) => {
    const data = priceMap.get(f.handle);
    if (!data) return;
    f.price = data.price;
    const el = document.querySelector(`[data-price-id="${f.id}"]`);
    if (el) el.textContent = `$${data.price.toFixed(2)}`;
  });
  BUNDLES.forEach((b) => {
    const data = priceMap.get(b.handle);
    if (!data) return;
    b.price = data.price;
    if (data.comparePrice) b.comparePrice = data.comparePrice;
    // Update price display
    const priceEl = document.getElementById(`${b.id}Price`);
    if (priceEl) priceEl.textContent = `$${data.price.toFixed(2)}`;
    // Update compare price display
    if (data.comparePrice) {
      const compareEl = document.getElementById(`${b.id}ComparePrice`);
      if (compareEl) compareEl.textContent = `$${data.comparePrice.toFixed(2)}`;
      const saveEl = document.getElementById(`${b.id}Save`);
      if (saveEl) saveEl.textContent = `SAVE $${(data.comparePrice - data.price).toFixed(2)}`;
    }
  });
});

// ── Card click → product page (ignore button/link clicks) ──
// Delegated on document so it covers the flavor grid AND the bundle sidebar card.
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-href]');
  if (!card) return;
  if (e.target.closest('button, a')) return; // let buttons handle themselves
  window.location.href = card.dataset.href;
});

// ── Add to cart (delegation) ──
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const flavor = FLAVORS.find((f) => f.id === btn.dataset.add);
  if (!flavor) return;
  cart.add(flavor);
  cartUI?.toast(`${flavor.name} added — ${flavor.creature} approves.`);
  cartUI?.open();
});

// ── Bundles ──
document.getElementById('variety-packAddCart')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[0], packImg: BUNDLES[0].img });
  cartUI?.toast('Wild Variety Pack added!');
  cartUI?.open();
});

document.getElementById('starter-kitAddCart')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[1], packImg: BUNDLES[1].img });
  cartUI?.toast('Wild Starter Kit added!');
  cartUI?.open();
});

// ── Animations ──
gsap.from('.shop-hero__eyebrow, .shop-hero__title, .shop-hero__sub', {
  opacity: 0, y: 30, stagger: 0.14, duration: 0.85,
  ease: 'power3.out', delay: 0.2, clearProps: 'transform,opacity',
});

gsap.from('.shop-bundle', {
  opacity: 0, x: 30, duration: 0.9,
  ease: 'power3.out', delay: 0.25, clearProps: 'transform,opacity',
});

gsap.from('.shop-card', {
  opacity: 0, y: 60, scale: 0.92, stagger: 0.12, duration: 0.85,
  ease: 'back.out(1.4)', clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.shop-grid', start: 'top 80%', once: true },
});

gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});
