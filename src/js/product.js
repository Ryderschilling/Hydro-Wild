// Product page — flavor loaded from ?flavor= param, defaults to blue-raspberry.
// Also serves the Wild Variety Bundle at /product.html?flavor=variety-pack
// and the Wild Starter Kit at /product.html?flavor=starter-kit (legacy —
// the canonical URLs for flavors + starter kit are now /products/<slug>/,
// see src/js/product-static.js and scripts/generate-product-pages.mjs).
import { FLAVORS, getFlavor, getBundle } from '../data/products.js';
import { initCartUI, initNav } from './ui.js';
import { resolveProduct, renderPDP } from './lib/pdp.js';

initNav();
const cartUI = initCartUI();

const params = new URLSearchParams(location.search);
const slug = params.get('flavor');
const bundle = (slug === 'variety-pack' || slug === 'starter-kit') ? getBundle(slug) : null;
const flavor = bundle ? null : (getFlavor(slug) || FLAVORS[0]);
const product = resolveProduct({ bundle, flavor });

renderPDP(product, { bundle, flavor, cartUI });
