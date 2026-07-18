// Shared UI: nav scroll state, cart drawer, toast.
import { cart } from '../lib/cart.js';
import { checkout, USE_MOCK, prefetchVariant } from '../lib/shopify.js';

const fmt = (n) => `$${n.toFixed(2)}`;

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initCartUI() {
  const root = document.getElementById('cartRoot');
  if (!root) return;

  root.innerHTML = `
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping cart">
      <div class="cart-drawer__head">
        <h3>Your Wild Stash</h3>
        <button class="cart-drawer__close" id="cartClose" aria-label="Close cart">×</button>
      </div>
      <div class="cart-drawer__items" id="cartItems"></div>
      <div class="cart-drawer__foot">
        <div class="cart-drawer__total"><span>Total</span><span id="cartTotal">$0.00</span></div>
        <button class="btn btn--primary" id="cartCheckout">
          <span id="cartCheckoutLabel">Checkout</span>
        </button>
        ${USE_MOCK ? '<p class="cart-drawer__note">Demo — add your Storefront API token in shopify.js to go live.</p>' : ''}
      </div>
    </aside>
    <div class="toast" id="toast"></div>`;

  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  const toastEl = document.getElementById('toast');

  const open = () => { overlay.classList.add('open'); drawer.classList.add('open'); };
  const close = () => { overlay.classList.remove('open'); drawer.classList.remove('open'); };

  document.getElementById('cartToggle')?.addEventListener('click', open);
  document.getElementById('cartClose').addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());

  const checkoutBtn   = document.getElementById('cartCheckout');
  const checkoutLabel = document.getElementById('cartCheckoutLabel');

  // Reset button if page is restored from bfcache (user pressed back from Shopify checkout)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      checkoutBtn.disabled = false;
      if (checkoutLabel) checkoutLabel.textContent = 'Checkout';
    }
  });

  checkoutBtn.addEventListener('click', async () => {
    if (!cart.items.length) return toast('Your stash is empty — add a flavor first!');

    // Loading state
    checkoutBtn.disabled = true;
    if (checkoutLabel) checkoutLabel.textContent = USE_MOCK ? 'Opening…' : 'Sending to checkout…';

    try {
      await checkout(cart.items);
      // Mock opens a new tab — reset button so user can checkout again
      if (USE_MOCK) {
        checkoutBtn.disabled = false;
        if (checkoutLabel) checkoutLabel.textContent = 'Checkout';
      }
      // Real mode redirects away — bfcache listener handles reset on back
    } catch (err) {
      toast(`Checkout error: ${err.message}`);
      console.error(err);
      checkoutBtn.disabled = false;
      if (checkoutLabel) checkoutLabel.textContent = 'Checkout';
    }
  });

  itemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const item = cart.items.find((i) => i.id === id);
    if (!item) return;
    if (action === 'inc') cart.setQty(id, item.qty + 1);
    if (action === 'dec') cart.setQty(id, item.qty - 1);
    if (action === 'remove') cart.remove(id);
  });

  cart.subscribe((items) => {
    // Pre-warm variant ID cache whenever cart changes so checkout is instant
    items.forEach((item) => { if (item.handle) prefetchVariant(item.handle); });

    if (countEl) {
      countEl.textContent = cart.count;
      countEl.classList.add('pop');
      setTimeout(() => countEl.classList.remove('pop'), 300);
    }
    totalEl.textContent = fmt(cart.total);
    itemsEl.innerHTML = items.length
      ? items
          .map(
            (i) => `
        <div class="cart-item">
          <img src="${i.img}" alt="${i.name}" />
          <div class="cart-item__info">
            <div class="cart-item__name">${i.name}</div>
            <div class="cart-item__price">${fmt(i.price)}</div>
            <div class="cart-item__qty">
              <button data-action="dec" data-id="${i.id}" aria-label="Decrease">−</button>
              <span>${i.qty}</span>
              <button data-action="inc" data-id="${i.id}" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-action="remove" data-id="${i.id}" aria-label="Remove">✕</button>
        </div>`
          )
          .join('')
      : '<p class="cart-drawer__empty">Nothing wild in here yet.</p>';
  });

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  return { open, toast };
}
