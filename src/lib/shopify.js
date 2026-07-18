// ─────────────────────────────────────────────────────────────
// HydroWild Headless Shopify — Storefront API client
//
// SETUP (one-time, done by HydroWild's Shopify admin):
//  1. Shopify Admin → Settings → Apps and sales channels → Develop apps
//  2. Create app → Configure Storefront API scopes, enable:
//       ✓ unauthenticated_read_product_listings
//       ✓ unauthenticated_read_product_inventory
//       ✓ unauthenticated_write_checkouts
//  3. Install app → copy "Storefront API access token"
//  4. Copy .env.example → .env.local and fill in both values
//
// Auto-detects mock mode — no token = demo mode, token present = live.
// ─────────────────────────────────────────────────────────────

export const USE_MOCK = !import.meta.env.VITE_SHOPIFY_TOKEN;

const CONFIG = {
  // Must be the .myshopify.com domain (not the custom domain) for CORS + API routing.
  domain:          import.meta.env.VITE_SHOPIFY_DOMAIN   || 'your-store.myshopify.com',
  storefrontToken: import.meta.env.VITE_SHOPIFY_TOKEN    || '',
  apiVersion:      '2025-04',
};

const ENDPOINT = `https://${CONFIG.domain}/api/${CONFIG.apiVersion}/graphql.json`;

// ── Variant ID cache — pre-warmed on cart.add so checkout is instant ──
const _variantCache = new Map(); // handle → Shopify variant GID

// ── GraphQL client ───────────────────────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':                       'application/json',
      'X-Shopify-Storefront-Access-Token':  CONFIG.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// ── Product queries ──────────────────────────────────────────

/**
 * Get a product's first variant ID by handle.
 * HydroWild's single-SKU products each have one variant.
 */
export async function fetchVariantByHandle(handle) {
  const data = await gql(
    `query VariantByHandle($handle: String!) {
      product(handle: $handle) {
        title
        variants(first: 1) {
          nodes { id availableForSale price { amount currencyCode } }
        }
      }
    }`,
    { handle }
  );
  const variant = data?.product?.variants?.nodes?.[0];
  if (!variant) throw new Error(`No variant found for product: ${handle}`);
  return variant;
}

/**
 * Prefetch + cache a variant ID for a given product handle.
 * Call this immediately when an item is added to cart so checkout
 * doesn't need to wait for the API round-trip.
 */
export async function prefetchVariant(handle) {
  if (USE_MOCK || _variantCache.has(handle)) return;
  try {
    const variant = await fetchVariantByHandle(handle);
    _variantCache.set(handle, variant.id);
  } catch {
    // Non-fatal — checkout will fetch it on demand if cache misses
  }
}

/** Full product with all variants — used for PDP upsells etc. */
export async function fetchProductByHandle(handle) {
  const data = await gql(
    `query Product($handle: String!) {
      product(handle: $handle) {
        id title description handle
        featuredImage { url altText }
        variants(first: 10) {
          nodes { id title availableForSale price { amount currencyCode } }
        }
      }
    }`,
    { handle }
  );
  return data.product;
}

// ── Cart mutations ───────────────────────────────────────────

async function createShopifyCart(lines) {
  const data = await gql(
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl totalQuantity }
        userErrors { field message }
      }
    }`,
    { lines }
  );
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
  return cart;
}

// ── Price hydration ──────────────────────────────────────────

/**
 * Batch-fetch real prices + variant IDs for a list of product handles.
 * Returns a Map: handle → { price: number, variantId: string, available: boolean }
 * Also warms the variant cache so checkout is instant.
 *
 * Call this on page load so displayed prices always match Shopify — even
 * after the client updates pricing in their admin.
 */
export async function hydrateProducts(handles) {
  if (USE_MOCK || !handles.length) return new Map();

  // Single batched GraphQL query — one round-trip for all products
  const fields = `variants(first: 1) { nodes { id availableForSale price { amount } } }`;
  const aliases = handles.map((h, i) => `p${i}: product(handle: "${h}") { ${fields} }`).join('\n');

  let data;
  try {
    data = await gql(`query HydrateProducts { ${aliases} }`);
  } catch {
    return new Map(); // Non-fatal — fall back to static prices
  }

  const result = new Map();
  handles.forEach((handle, i) => {
    const variant = data[`p${i}`]?.variants?.nodes?.[0];
    if (!variant) return;
    const price = parseFloat(variant.price.amount);
    result.set(handle, { price, variantId: variant.id, available: variant.availableForSale });
    _variantCache.set(handle, variant.id); // warm cache for instant checkout
  });
  return result;
}

// ── Checkout entry point ─────────────────────────────────────
/**
 * cartItems: local cart items from cart.js — { id, handle, name, img, price, qty }
 *
 * Real flow:
 *  1. Resolve Shopify variant IDs in parallel (uses prefetch cache where warm)
 *  2. Create a Shopify cart with CartCreate mutation
 *  3. Redirect to Shopify's hosted checkout URL
 *
 * Local cart is intentionally NOT cleared before redirect — if the user
 * hits back from the Shopify checkout page their cart is still intact.
 *
 * Mock flow:
 *  Deep-link to the product page on hydrowild.com so the demo feels
 *  functional without needing an API token.
 */
export async function checkout(cartItems = []) {
  if (!cartItems.length) return;

  if (USE_MOCK) {
    const handles = [...new Set(cartItems.map((i) => i.handle).filter(Boolean))];
    const url = handles.length === 1
      ? `https://hydrowild.com/products/${handles[0]}`
      : `https://hydrowild.com/collections/all`;
    window.open(url, '_blank');
    return;
  }

  // ── Real headless flow ──────────────────────────────────────

  // 1. Resolve variant IDs — cache hit = no extra fetch
  const uniqueHandles = [...new Set(cartItems.map((i) => i.handle))];
  const variantMap = Object.fromEntries(
    await Promise.all(
      uniqueHandles.map(async (handle) => {
        if (_variantCache.has(handle)) return [handle, _variantCache.get(handle)];
        const variant = await fetchVariantByHandle(handle);
        _variantCache.set(handle, variant.id);
        return [handle, variant.id];
      })
    )
  );

  // 2. Build cart lines
  const lines = cartItems.map((item) => ({
    merchandiseId: variantMap[item.handle],
    quantity:      item.qty,
  }));

  // 3. Create Shopify cart + redirect (local cart stays alive)
  const shopifyCart = await createShopifyCart(lines);
  window.location.href = shopifyCart.checkoutUrl;
}
