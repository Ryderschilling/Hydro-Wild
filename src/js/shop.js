// HydroWild shop page — all 4 flavors with add-to-cart.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLAVORS, BUNDLES } from '../data/products.js';
import { cart } from '../lib/cart.js';
import { initNav, initCartUI } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
const cartUI = initCartUI();

// ── Build product cards ──
const grid = document.getElementById('shopGrid');
grid.innerHTML = FLAVORS.map((f) => `
  <div class="shop-card" style="--card-color:${f.color};--card-bg:${f.bg};cursor:pointer" data-href="/product.html?flavor=${f.id}">
    <div class="shop-card__bg-creature" aria-hidden="true">
      <img src="${f.creatureImg}" alt="" loading="lazy" />
    </div>
    <div class="shop-card__body">
      <span class="shop-card__creature-tag" style="color:${f.color}">Guarded by ${f.creature}</span>
      <img class="shop-card__pack" src="${f.packImg}" alt="HydroWild ${f.name}" loading="lazy" />
      <h2 class="shop-card__name" style="color:${f.color}">${f.name}</h2>
      <p class="shop-card__tagline">${f.tagline}</p>
      <p class="shop-card__price">$${f.price.toFixed(2)}</p>
      <div class="shop-card__actions">
        <button class="btn btn--primary" data-add="${f.id}">Add to Cart</button>
        <a class="btn btn--ghost" href="/product.html?flavor=${f.id}">View Flavor</a>
      </div>
    </div>
  </div>
`).join('');

// ── Card click → product page (ignore button/link clicks) ──
grid.addEventListener('click', (e) => {
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

// ── Bundle ──
document.getElementById('bundleAddCart')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[0], packImg: BUNDLES[0].img });
  cartUI?.toast('Wild Variety Pack added!');
  cartUI?.open();
});

// ── Animations ──
gsap.from('.shop-hero__eyebrow, .shop-hero__title, .shop-hero__sub', {
  opacity: 0,
  y: 30,
  stagger: 0.14,
  duration: 0.85,
  ease: 'power3.out',
  delay: 0.2,
});

gsap.from('.shop-card', {
  opacity: 0,
  y: 60,
  scale: 0.92,
  stagger: 0.12,
  duration: 0.85,
  ease: 'back.out(1.4)',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.shop-grid', start: 'top 80%', once: true },
});

gsap.from('.shop-bundle', {
  opacity: 0,
  x: 30,
  duration: 0.9,
  ease: 'power3.out',
  delay: 0.3,
  clearProps: 'transform,opacity',
});
