// Product page — flavor loaded from ?flavor= param, defaults to blue-raspberry.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLAVORS, getFlavor } from '../data/products.js';
import { cart } from '../lib/cart.js';
import { initCartUI, initNav } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
const cartUI = initCartUI();

const params = new URLSearchParams(location.search);
const flavor = getFlavor(params.get('flavor')) || FLAVORS[0];

// ── Theme the page to the flavor ──
document.title = `HydroWild ${flavor.name} — Kids Daily Hydration`;
const pdp = document.getElementById('pdp');
pdp.style.setProperty('--pdp-glow', `${flavor.color}4d`);
pdp.style.setProperty('--pdp-accent', flavor.color);

document.getElementById('creatureTag').textContent = `Guarded by ${flavor.creature}`;
document.getElementById('title').textContent = flavor.name;
document.getElementById('title').style.color = flavor.color;
document.getElementById('tagline').textContent = flavor.tagline;
document.getElementById('price').textContent = `$${flavor.price.toFixed(2)}`;
document.getElementById('creatureBg').src = flavor.creatureImg;

// ── Gallery ──
const galleryImgs = [flavor.packImg, flavor.creatureImg, '/assets/img/lifestyle-1.png'];
const mainImg = document.getElementById('mainImg');
const thumbs = document.getElementById('thumbs');
mainImg.src = galleryImgs[0];
mainImg.alt = `HydroWild ${flavor.name}`;

galleryImgs.forEach((src, i) => {
  const btn = document.createElement('button');
  btn.className = i === 0 ? 'active' : '';
  btn.innerHTML = `<img src="${src}" alt="View ${i + 1}" />`;
  btn.addEventListener('click', () => {
    thumbs.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    gsap.fromTo(mainImg, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 });
    mainImg.src = src;
  });
  thumbs.appendChild(btn);
});

// Only blue raspberry has flavor-specific facts/science shots pulled; other
// flavors reuse them until we scrape the rest (or the API provides them).

// ── Quantity + add to cart ──
let qty = 1;
const qtyVal = document.getElementById('qtyVal');
document.getElementById('qtyInc').addEventListener('click', () => { qty = Math.min(qty + 1, 10); qtyVal.textContent = qty; });
document.getElementById('qtyDec').addEventListener('click', () => { qty = Math.max(qty - 1, 1); qtyVal.textContent = qty; });
document.getElementById('addBtn').addEventListener('click', () => {
  cart.add(flavor, qty);
  cartUI?.toast(`${qty}× ${flavor.name} added — ${flavor.creature} approves.`);
  cartUI?.open();
});

// ── Accordion ──
document.querySelectorAll('.pdp__acc-item').forEach((item) => {
  const head = item.querySelector('.pdp__acc-head');
  const body = item.querySelector('.pdp__acc-body');
  const sync = () => { body.style.maxHeight = item.classList.contains('open') ? `${body.scrollHeight}px` : '0px'; };
  head.addEventListener('click', () => { item.classList.toggle('open'); sync(); });
  // re-sync open panels once images load
  body.querySelectorAll('img').forEach((img) => img.addEventListener('load', sync));
  sync();
});

// ── Other flavors grid ──
document.getElementById('moreGrid').innerHTML = FLAVORS.filter((f) => f.id !== flavor.id)
  .map(
    (f) => `
    <a class="flavor-card" href="/product.html?flavor=${f.id}" style="--card-color:${f.color}">
      <img class="creature" src="${f.creatureImg}" alt="" loading="lazy" />
      <img class="pack" src="${f.packImg}" alt="HydroWild ${f.name}" loading="lazy" />
      <h3 style="color:${f.color}">${f.name}</h3>
      <p>${f.tagline}</p>
      <span class="btn btn--ghost" style="font-size:0.85rem;padding:0.6rem 1.4rem;">View</span>
    </a>`
  )
  .join('');

// ── Entrance animations ──
gsap.from('.pdp__gallery', { opacity: 0, x: -40, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' });
gsap.from('.pdp__info > *', { opacity: 0, y: 28, stagger: 0.08, duration: 0.75, ease: 'power3.out', delay: 0.15, clearProps: 'transform,opacity' });
gsap.to('#creatureBg', { yPercent: -6, xPercent: 4, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

// ── Other flavors cards stagger ──
gsap.from('.flavor-card', {
  opacity: 0, y: 40, scale: 0.94, stagger: 0.12, duration: 0.75,
  ease: 'back.out(1.4)', clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '#moreGrid', start: 'top 82%', once: true },
});

// ── Footer stagger ──
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});
