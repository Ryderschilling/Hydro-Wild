// ── HydroWild Popup — email capture + discount reveal ──
//
// Flow: 10s delay → tease (masked code) → email input → code reveal
// Shopify: uses customerCreate mutation (Storefront API)
// Requires unauthenticated_write_customers scope on the Headless channel:
//   Shopify Admin → Sales channels → Headless → Storefront API → enable scope
//
// Discount code WILD15 must exist in Shopify Admin → Discounts

const POPUP_SEEN_KEY = 'hw_popup_v1';
const DISCOUNT_CODE  = 'WILD15';
const DELAY_MS       = 10_000;

export function initPopup() {
  // Only show once per session
  if (sessionStorage.getItem(POPUP_SEEN_KEY)) return;

  const root = document.createElement('div');
  root.id = 'hwPopup';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Exclusive discount offer');
  root.innerHTML = buildHTML();
  document.body.appendChild(root);

  // ── Show after delay ──
  const timer = setTimeout(() => show(root), DELAY_MS);

  // Cancel timer if user leaves fast (page hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
  }, { once: true });
}

function show(root) {
  root.classList.add('popup--visible');

  let canClose = false;
  setTimeout(() => { canClose = true; }, 1000);

  const dismiss = () => {
    if (!canClose) return;
    root.classList.add('popup--out');
    setTimeout(() => root.remove(), 450);
    sessionStorage.setItem(POPUP_SEEN_KEY, '1');
  };

  // Close triggers
  root.querySelector('#popupClose').addEventListener('click', dismiss);
  root.querySelector('.popup__backdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) dismiss();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismiss();
  });

  // Step 1 — reveal button
  root.querySelector('#popupRevealBtn').addEventListener('click', () => goStep(root, 2));

  // Step 1 — no thanks
  root.querySelector('#popupNoThanks').addEventListener('click', dismiss);

  // Step 2 — email form
  root.querySelector('#popupEmailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email  = root.querySelector('#popupEmail').value.trim();
    const btn    = root.querySelector('#popupEmailBtn');
    if (!email) return;

    btn.disabled    = true;
    btn.textContent = 'Just a sec…';

    try {
      await saveEmailToShopify(email);
    } catch (err) {
      // Non-blocking — show code regardless of API result
      console.warn('[HydroWild popup] Email save failed:', err.message);
    }

    goStep(root, 3);
    sessionStorage.setItem(POPUP_SEEN_KEY, '1');
  });

  // Step 3 — copy code
  root.querySelector('#popupCopyBtn').addEventListener('click', async () => {
    const btn = root.querySelector('#popupCopyBtn');
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      btn.textContent = '✓ Copied!';
      btn.classList.add('popup__copy-btn--done');
    } catch {
      // Fallback: select the text
      const range = document.createRange();
      range.selectNode(root.querySelector('.popup__code-text'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      btn.textContent = 'Select & copy';
    }
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('popup__copy-btn--done');
    }, 2500);
  });

  // Step 3 — shop now
  root.querySelector('#popupShopBtn').addEventListener('click', () => {
    dismiss();
    setTimeout(() => { window.location.href = '/'; }, 300);
  });
}

function goStep(root, n) {
  root.querySelectorAll('.popup__step').forEach((el) => {
    el.classList.remove('popup__step--active', 'popup__step--exit');
  });
  // Brief exit on current before entering next
  const prev = root.querySelector('.popup__step--active');
  if (prev) {
    prev.classList.add('popup__step--exit');
    setTimeout(() => prev.classList.remove('popup__step--exit'), 300);
  }
  root.querySelector(`.popup__step[data-step="${n}"]`).classList.add('popup__step--active');
}

async function saveEmailToShopify(email) {
  const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
  const TOKEN  = import.meta.env.VITE_SHOPIFY_TOKEN;
  if (!DOMAIN || !TOKEN) throw new Error('No credentials');

  const res = await fetch(`https://${DOMAIN}/api/2025-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({
      query: `
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer { id email }
            customerUserErrors { code field message }
          }
        }
      `,
      variables: {
        input: {
          email,
          acceptsMarketing: true,
          // firstName/lastName left blank — can be collected later
        },
      },
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  console.log('[HydroWild popup] Shopify response:', JSON.stringify(json));
  const errors = json?.data?.customerCreate?.customerUserErrors ?? [];
  // TAKEN = customer already exists — still show them the code
  const fatal = errors.filter((e) => e.code !== 'CUSTOMER_DISABLED' && e.code !== 'TAKEN');
  if (fatal.length) throw new Error(`${fatal[0].code}: ${fatal[0].message}`);
}

function buildHTML() {
  return /* html */`
    <div class="popup__backdrop">
      <div class="popup__card">
        <button class="popup__close" id="popupClose" aria-label="Close offer">✕</button>

        <!-- ══ STEP 1: Tease ══ -->
        <div class="popup__step popup__step--active" data-step="1">
          <div class="popup__eyebrow">✦ MEMBERS ONLY ✦</div>
          <h2 class="popup__title">Unlock 15% Off<br/>Your First Order</h2>
          <p class="popup__sub">Zero sugar. Zero dyes.<br/>Zero full price — for you.</p>

          <div class="popup__code-mask" aria-hidden="true">
            <span class="popup__code-char popup__code-char--hidden">●</span>
            <span class="popup__code-char popup__code-char--hidden">●</span>
            <span class="popup__code-char popup__code-char--hidden">●</span>
            <span class="popup__code-char popup__code-char--hidden">●</span>
            <span class="popup__code-char popup__code-char--hidden">●</span>
            <span class="popup__code-char popup__code-char--hidden">●</span>
            <span class="popup__code-char popup__code-char--hidden">●</span>
          </div>

          <button class="popup__btn popup__btn--primary" id="popupRevealBtn">
            Reveal My Code
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="popup__skip" id="popupNoThanks">No thanks, I'll pay full price</button>
        </div>

        <!-- ══ STEP 2: Email ══ -->
        <div class="popup__step" data-step="2">
          <div class="popup__eyebrow">✦ ONE LAST STEP ✦</div>
          <h2 class="popup__title">Where Should<br/>We Send It?</h2>
          <p class="popup__sub">Your code unlocks the moment<br/>you hit submit.</p>

          <form class="popup__form" id="popupEmailForm" novalidate>
            <input
              class="popup__input"
              type="email"
              id="popupEmail"
              name="email"
              placeholder="your@email.com"
              required
              autocomplete="email"
              inputmode="email"
            />
            <button class="popup__btn popup__btn--primary" type="submit" id="popupEmailBtn">
              Get My Code
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
          <p class="popup__fine">No spam. Unsubscribe anytime.</p>
        </div>

        <!-- ══ STEP 3: Reveal ══ -->
        <div class="popup__step" data-step="3">
          <div class="popup__eyebrow">✦ YOUR CODE IS LIVE ✦</div>
          <h2 class="popup__title">15% Off.<br/>Go Wild.</h2>
          <p class="popup__sub">Applied at checkout. One use only.</p>

          <div class="popup__code-reveal">
            <span class="popup__code-text">WILD15</span>
            <button class="popup__copy-btn" id="popupCopyBtn" aria-label="Copy discount code">
              Copy
            </button>
          </div>

          <button class="popup__btn popup__btn--primary" id="popupShopBtn">
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
