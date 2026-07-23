// HydroWild homepage — immersive scroll experience.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { FLAVORS, BUNDLES } from '../data/products.js';
import { cart } from '../lib/cart.js';
import { initNav, initCartUI } from './ui.js';
import { initPopup } from './popup.js';
import { hydrateProducts } from '../lib/shopify.js';

gsap.registerPlugin(ScrollTrigger);

// ── Smooth scroll ──
const lenis = new Lenis({ lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
if (import.meta.env.DEV) { window.__lenis = lenis; window.__ScrollTrigger = ScrollTrigger; }

initNav();
const cartUI = initCartUI();

// ── Hero entrance ──
// ── Hero — smooth whole-section fade in ──
gsap.set('.hero__inner', { opacity: 0, y: 24 });
gsap.to('.hero__inner', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.15, clearProps: 'transform,opacity' });

// ── Bubbles ──
const bubbleWrap = document.getElementById('bubbles');
if (bubbleWrap) {
  for (let i = 0; i < 26; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const size = 6 + Math.random() * 26;
    b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;--drift:${(Math.random() - 0.5) * 120}px;animation-duration:${7 + Math.random() * 10}s;animation-delay:${Math.random() * 10}s;`;
    bubbleWrap.appendChild(b);
  }
}

// ── Marquee ──
gsap.to('#marqueeTrack', { xPercent: -50, duration: 22, repeat: -1, ease: 'none' });

// ── Spotted in the Wild — real @drinkhydrowild Instagram posts ──
const IG_URL = 'https://www.instagram.com/drinkhydrowild/';
const WALL_POSTS = [
  { type: 'image', src: '/assets/img/ig-blue-raspberry-pour.jpg',  color: '#29ABE2', creatureImg: '/assets/img/creature-yeti.png',   handle: '@drinkhydrowild', caption: 'Plant-based, pediatrician-approved & scientifically-formulated 💙', likes: 1204 },
  { type: 'image', src: '/assets/img/ig-maximo-approved.jpg',      color: '#29ABE2', creatureImg: '/assets/img/creature-yeti.png',   handle: '@drinkhydrowild', caption: 'Maximo approved ✅ #GetWild', likes: 876 },
  { type: 'image', src: '/assets/img/ig-strawberry-lemon.jpg',     color: '#FF3ECD', creatureImg: '/assets/img/creature-nessie.png', handle: '@drinkhydrowild', caption: 'Strawberry Lemonade hits different 🍓🍋', likes: 3102 },
  { type: 'image', src: '/assets/img/ig-swap-that.jpg',            color: '#FF3ECD', creatureImg: '/assets/img/creature-nessie.png', handle: '@drinkhydrowild', caption: 'Swap that for this. 9 essential nutrients, zero junk 🔄', likes: 2210 },
  { type: 'image', src: '/assets/img/ig-all-flavors.jpg',          color: '#4ADB14', creatureImg: '/assets/img/creature-wampus.png', handle: '@drinkhydrowild', caption: 'Four flavors. Four legendary creatures. One wild pack 🌟', likes: 4587 },
];

const wallTrack = document.getElementById('wallTrack');
if (wallTrack) {
  const cardHTML = (p) => `
    <a class="wall__card" href="${IG_URL}" target="_blank" rel="noopener" style="--flavor:${p.color}">
      <img class="wall__badge" src="${p.creatureImg}" alt="" aria-hidden="true" />
      <div class="wall__media">
        ${
          p.type === 'video'
            ? `<video src="${p.src}" poster="${p.poster}" muted loop playsinline preload="metadata"></video><span class="wall__play">▶</span>`
            : `<img src="${p.src}" alt="${p.caption}" loading="lazy" />`
        }
        <div class="wall__info">
          <span class="wall__handle">${p.handle}</span>
          <p class="wall__caption">${p.caption}</p>
          <span class="wall__likes">♥ ${p.likes.toLocaleString()}</span>
        </div>
      </div>
    </a>`;

  // Duplicate the set so the strip can loop seamlessly, same trick as the marquee.
  wallTrack.innerHTML = [...WALL_POSTS, ...WALL_POSTS].map(cardHTML).join('');

  const wallTween = gsap.to(wallTrack, { xPercent: -50, duration: 42, repeat: -1, ease: 'none' });
  wallTrack.addEventListener('mouseenter', () => wallTween.pause());
  wallTrack.addEventListener('mouseleave', () => wallTween.play());

  wallTrack.querySelectorAll('.wall__card').forEach((card) => {
    const vid = card.querySelector('video');
    if (!vid) return;
    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
    });
  });
}

// ── Flavor worlds — build from data ──
const worlds = document.getElementById('flavors');
worlds.innerHTML = FLAVORS.map(
  (f, i) => `
  <section class="world${i % 2 ? ' world--rtl' : ''}" id="world-${f.id}" style="background:${f.bg}">
    <div class="world__inner">
      <div class="world__ghost">${f.name}</div>
      <img class="world__creature" src="${f.creatureImg}" alt="${f.creature}" loading="lazy" />
      <div class="world__content" style="${i % 2 ? 'direction:rtl' : ''}">
        <div class="world__visual" style="direction:ltr">
          <img class="world__pack" src="${f.packImg}" alt="HydroWild ${f.name}" loading="lazy" />
        </div>
        <div class="world__copy" style="direction:ltr">
          <span class="world__creature-tag" style="color:${f.color}">${f.presents}</span>
          <h2 class="world__name" style="color:${f.color}">${f.name}</h2>
          <p class="world__tagline">${f.tagline}</p>
          <p class="world__lore">${f.lore}</p>
          <div class="world__actions">
            <button class="btn btn--primary" data-add="${f.id}">Add to cart</button>
            <a class="btn btn--ghost" href="/products/${f.id}/">Explore</a>
            <span class="world__price">$${f.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </section>`
).join('');

// World scroll choreography
FLAVORS.forEach((f, i) => {
  const el = document.getElementById(`world-${f.id}`);
  // Rows alternate which side the visual sits on (see .world--rtl in CSS).
  // Mirror the creature's slide-in direction and the pack's tilt so the
  // motion always matches which edge is "outer" for that row.
  const flip = i % 2 ? 1 : -1;
  const creature = el.querySelector('.world__creature');
  const pack = el.querySelector('.world__pack');
  const ghost = el.querySelector('.world__ghost');
  const copyBits = el.querySelectorAll('.world__copy > *');

  gsap.fromTo(
    creature,
    { xPercent: flip * 25, yPercent: -45, scale: 0.85, opacity: 0 },
    {
      xPercent: 0, yPercent: -50, scale: 1, opacity: 0.4,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top top', scrub: 2.2 },
    }
  );
  gsap.fromTo(
    pack,
    { yPercent: 30, rotation: flip * 18, opacity: 0 },
    {
      yPercent: -50, rotation: flip * 6, opacity: 1, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'top top', scrub: 2.2 },
    }
  );
  gsap.to(ghost, {
    xPercent: -18,
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
  gsap.from(copyBits, {
    opacity: 0, y: 36, stagger: 0.09, duration: 0.7,
    scrollTrigger: { trigger: el, start: 'top 55%' },
  });
  // No pin, no sticky hold. .world is exactly 100svh, so the section
  // passes through the viewport on native scroll in one continuous move.
  // The scrub'd tween below still eases the creature/pack toward their
  // settled position as the section's top crosses 75%→0% of the viewport,
  // so it reads as a "pull toward center" — but because there's no extra
  // scroll distance to hold on, it never freezes. It arrives and keeps
  // gliding straight into the next world.
});

// ── Bundle section entrance — single clean block, no child conflicts ──
if (document.querySelector('.bundle__visual')) {
  gsap.set('.bundle__copy', { opacity: 0, x: -28 });
  gsap.set('.bundle__visual', { opacity: 0, x: 28 });
  ScrollTrigger.create({
    trigger: '.bundle', start: 'top 78%', once: true,
    onEnter: () => {
      gsap.to('.bundle__copy', { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.to('.bundle__visual', { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity', delay: 0.08 });
    },
  });
}

// ── Price hydration — pull live Shopify prices + compare prices ──
hydrateProducts(BUNDLES.map((b) => b.handle)).then((priceMap) => {
  BUNDLES.forEach((b) => {
    const data = priceMap.get(b.handle);
    if (!data) return;
    b.price = data.price;
    if (data.comparePrice) b.comparePrice = data.comparePrice;
  });

  // Helper: update a price display group
  function applyPrices(currentEl, compareEl, compareTextEl, badgeEl, price, comparePrice) {
    if (currentEl) currentEl.textContent = `$${price.toFixed(2)}`;
    if (comparePrice && compareEl && compareTextEl && badgeEl) {
      compareTextEl.textContent = `$${comparePrice.toFixed(2)}`;
      compareEl.hidden = false;
      badgeEl.textContent = `SAVE $${(comparePrice - price).toFixed(2)}`;
      badgeEl.hidden = false;
    }
  }

  // Variety Pack — bundle section
  const vp = priceMap.get(BUNDLES[0].handle);
  if (vp) applyPrices(
    document.getElementById('bundleCurrentPrice'),
    document.getElementById('bundleComparePrice'),
    document.getElementById('bundleComparePriceText'),
    document.getElementById('bundleSaveBadge'),
    vp.price, vp.comparePrice
  );

  // Variety Pack — CTA section
  if (vp) applyPrices(
    document.getElementById('ctaVarietyPrice'),
    document.getElementById('ctaVarietyCompare'),
    document.getElementById('ctaVarietyCompareText'),
    document.getElementById('ctaVarietyBadge'),
    vp.price, vp.comparePrice
  );

  // Starter Kit — always has comparePrice ($49.99 vs $24.99)
  const sk = priceMap.get(BUNDLES[1]?.handle) ?? { price: BUNDLES[1]?.price, comparePrice: BUNDLES[1]?.comparePrice };
  if (sk) {
    const priceEl = document.getElementById('starterKitPrice');
    const compareEl = document.getElementById('starterKitCompare');
    const badgeEl = document.getElementById('starterKitBadge');
    if (priceEl) priceEl.textContent = `$${sk.price.toFixed(2)}`;
    if (compareEl && sk.comparePrice) compareEl.textContent = `$${sk.comparePrice.toFixed(2)}`;
    if (badgeEl && sk.comparePrice) badgeEl.textContent = `SAVE $${(sk.comparePrice - sk.price).toFixed(2)}`;
  }
}).catch(() => {
  // Non-fatal — static prices already rendered in HTML
  // Still update Starter Kit badge from static data
  const sk = BUNDLES[1];
  if (sk?.comparePrice) {
    const badgeEl = document.getElementById('starterKitBadge');
    const compareEl = document.getElementById('starterKitCompare');
    if (badgeEl) badgeEl.textContent = `SAVE $${(sk.comparePrice - sk.price).toFixed(2)}`;
    if (compareEl) compareEl.textContent = `$${sk.comparePrice.toFixed(2)}`;
  }
});

// Bundle CTA
document.getElementById('bundleAddToCart')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[0], packImg: BUNDLES[0].img });
  cartUI?.toast('Wild Variety Pack added!');
  cartUI?.open();
});

// Starter Kit CTA
document.getElementById('starterKitAddToCart')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[1], packImg: BUNDLES[1].img });
  cartUI?.toast('Wild Starter Kit added!');
  cartUI?.open();
});

// Add-to-cart buttons (event delegation)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const flavor = FLAVORS.find((f) => f.id === btn.dataset.add);
  if (!flavor) return;
  cart.add(flavor);
  cartUI?.toast(`${flavor.name} added — ${flavor.creature} approves.`);
});

// Variety pack CTA
document.getElementById('ctaVariety')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[0], packImg: BUNDLES[0].img });
  cartUI?.toast('Wild Variety Pack added!');
  cartUI?.open();
});

// ── Generic reveals ──
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
  });
});

// ── Stat counters ──
document.querySelectorAll('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        el,
        { innerText: 0 },
        { innerText: target, duration: 1.4, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    },
  });
});

// ── Film section: play when visible, scale-in title ──
const film = document.querySelector('.film__video');
if (film) {
  ScrollTrigger.create({
    trigger: '.film',
    start: 'top 80%',
    end: 'bottom top',
    onEnter: () => film.play().catch(() => {}),
    onLeave: () => film.pause(),
    onEnterBack: () => film.play().catch(() => {}),
    onLeaveBack: () => film.pause(),
  });
  gsap.fromTo(
    '.film__title',
    { scale: 1.3, opacity: 0 },
    { scale: 1, opacity: 1, scrollTrigger: { trigger: '.film', start: 'top 70%', end: 'center center', scrub: 1 } }
  );
}

// ── CTA creatures parallax ──
document.querySelectorAll('[data-cta-creature]').forEach((img, i) => {
  gsap.to(img, {
    yPercent: i % 2 ? -30 : 30,
    rotation: i % 2 ? 8 : -8,
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
  });
});

// ── Email opt-in form ──
const emailForm = document.getElementById('emailOptinForm');
const emailSuccess = document.getElementById('emailSuccess');

if (emailForm) {
  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = emailForm.querySelector('.email-optin__input');
    const submitBtn = emailForm.querySelector('.email-optin__btn');
    const email = input.value.trim();

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const field = emailForm.querySelector('.email-optin__field');
      if (field) { field.style.borderColor = 'var(--pink)'; setTimeout(() => field.style.borderColor = '', 1400); }
      input.focus();
      return;
    }

    // Loading state
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Joining…'; }

    // Save to Shopify
    try {
      const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
      const TOKEN  = import.meta.env.VITE_SHOPIFY_TOKEN;
      if (DOMAIN && TOKEN) {
        const res = await fetch(`https://${DOMAIN}/api/2025-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
          body: JSON.stringify({
            query: `mutation customerCreate($input: CustomerCreateInput!) {
              customerCreate(input: $input) {
                customer { id email }
                customerUserErrors { code message }
              }
            }`,
            variables: {
              input: {
                email,
                password: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36),
                acceptsMarketing: true,
              },
            },
          }),
        });
        const json = await res.json();
        console.log('[HydroWild email] Shopify response:', JSON.stringify(json));
      }
    } catch (err) {
      console.warn('[HydroWild email] Save failed:', err.message);
    }

    // Show success in place of the form
    emailForm.hidden = true;
    if (emailSuccess) emailSuccess.hidden = false;

    // Restore form after 4s
    setTimeout(() => {
      if (emailSuccess) emailSuccess.hidden = true;
      emailForm.hidden = false;
      input.value = '';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Join the Wild'; }
    }, 4000);
  });
}

// ── Email optin section reveal ──
gsap.fromTo(
  '.email-optin__content',
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.email-optin', start: 'top 75%' } }
);

// Bundle entrance handled above (single block)

// ── Wall section heading ──
gsap.from('.wall__head', {
  opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.wall', start: 'top 80%', once: true },
});

// ── Story section (homepage) ──
gsap.from('.story__img', {
  opacity: 0, x: -40, scale: 0.94, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.story', start: 'top 78%', once: true },
});

// ── Footer stagger ──
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  clearProps: 'transform,opacity',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});

// ── Popup — email capture + discount code ──
initPopup();
