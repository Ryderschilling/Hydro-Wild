# HydroWild Brand System
> Source of truth for all brand decisions on this build. Pulled directly from the official brand style guide (HW-0019) and Brand Identity doc (July 2025). Full PDFs in `/brand/docs/`.

---

## Company

- **Product:** Zero-sugar, vitamin-packed kids/youth hydration drink mix (powder sticks)
- **Founded:** 2022 by CJ Britton & Lindey Britton — Birmingham, AL
- **Tagline:** "The Call of the Wild!" (primary marketing line)
- **Secondary tagline:** "get wild. stay hydrated"
- **Positioning:** Clean, science-backed alternative to sugary sports drinks — fun brand, trusted by parents
- **Current site:** hydrowild.com (Shopify)
- **Marketing contact:** marketing@hydrowild.com

---

## Brand Essence

**The Vibe:** 1990s. Free-spirited. Bold. Retro-futurist. Active, creative, adventurous kids who need great hydration without the crap. The 90s era is the design DNA — it speaks to kids AND the parents who were kids then.

**Brand pillars:** Fun. Energetic. Unexpected. Wild.

**Target audience:**
- Kids ages 4–9 → Flavor Critter packaging strategy (character-forward, mascot-led)
- Youth ages 10–18 → Brand Banner packaging strategy (cleaner, more mature, limited edition-ready)
- Parents of both groups (trust = vitamins + 0 sugar)

**Key ingredients story:**
- 9 Essential Vitamins: A, C, D, K, B6, B12, folate + more
- Electrolytes: potassium, magnesium
- Sweetened with stevia. No sugar, no dyes.

---

## Color Palette

| Name | HEX | RGB | PMS | CMYK |
|---|---|---|---|---|
| **Midnight Blue** | `#09005E` | 9 / 0 / 94 | 2189 C | 100 / 100 / 22 / 34 |
| **Berry Blue** | `#0269B7` | 2 / 105 / 183 | 2144 C | 90 / 59 / 0 / 0 |
| **Wild Blue** | `#29ABE2` | 41 / 171 / 226 | 298 C | 75 / 15 / 0 / 0 |
| **Rad Red** | `#E80011` | 232 / 0 / 17 | 185 C | 3 / 100 / 100 / 0 |
| **Punchy Pink** | `#FF3ECD` | 255 / 62 / 205 | 813 C (NEON) | 12 / 81 / 0 / 0 |
| **Orange Orange** | `#FF8327` | 255 / 131 / 39 | 1575 C | 0 / 60 / 93 / 0 |
| **Lemon Yellow** | `#FFE600` | 255 / 230 / 0 | 803 C (NEON) | 2 / 4 / 99 / 0 |
| **Lime Green** | `#4ADB14` | 74 / 219 / 20 | 802 C (NEON) | 64 / 0 / 100 / 0 |
| **Leafy Green** | `#007B34` | 0 / 123 / 52 | 356 C | 91 / 0 / 100 / 26 |

**CSS Custom Properties:**
```css
:root {
  --hw-midnight-blue: #09005E;
  --hw-berry-blue: #0269B7;
  --hw-wild-blue: #29ABE2;
  --hw-rad-red: #E80011;
  --hw-punchy-pink: #FF3ECD;
  --hw-orange: #FF8327;
  --hw-lemon-yellow: #FFE600;
  --hw-lime-green: #4ADB14;
  --hw-leafy-green: #007B34;
}
```

---

## Typography

### Primary — Purista (Bold Italic)
- **Usage:** All headlines, product names, hero text, CTAs, packaging
- **Weights:** Bold Italic (primary), Bold, SemiBold, Medium
- **Personality:** Retro-futurist, bold, rounded geometric — feels like sports science meets 90s nostalgia
- **Note:** Pairs with the freeform brushstrokes in the brandmark

### Secondary — Azo Sans (Bold)
- **Usage:** Body copy, subheadings, informational text, UI labels, nav
- **Weights:** Black, Bold, Medium, Regular, Light, Thin — all with italics
- **Personality:** Clean, modern, geometric — readable and structured

> **Status:** ✅ Font files installed. `@font-face` declarations live in `src/styles/main.css`. Web fonts (woff2/woff) copied to `public/fonts/`. Full font archives in `brand/fonts/`.

---

## Logo System

All logo files in `/brand/logos/`.

| Variant | Folder | When to Use |
|---|---|---|
| **Primary 3-Color** | `HydroWild Logo Primary 3 Color/` | Main use — hero sections, primary brand placement |
| **White** | `HydroWild Logo White/` | On dark/colored/navy backgrounds (most web use) |
| **Black** | `HydroWild Logo Black/` | On light backgrounds, print |
| **Pink** | `HydroWild Logo Pink/` | Accent placements, flavor-specific sections |
| **Yellow** | `HydroWild Logo Yellow/` | Accent placements |
| **Green** | `HydroWild Logo Green/` | Accent placements |
| **Pink Triangle** | `pink triangle logo.png` | Badge/accent element |
| **Tiger Stripe + Pink Triangle** | `tiger strip logo w_ pink triangle.png` | Pattern combo mark |

**Format guide:**
- `.svg` → web (always prefer this)
- `.png` → social/marketing exports
- `.eps` → print vendor handoffs

**Logo rules (never break these):**
- Minimum size: 1 inch wide — use simplified 1-color version below that
- Clear space: equal to height of the word "HYDRO" on all four sides
- Never: introduce new colors, distort proportions, change fonts, alter scale between the two logo parts, recreate the logo

---

## Design System / Toolkit

These are the 4 core visual patterns that define the HydroWild aesthetic. Every page section should reference at least one.

### 1. Wireframe Grids
Low-fi geometric grid and line patterns. 90s digital design throwback. Use as background textures, section overlays, or dividers. Communicates "hydration tech" and science credibility.
- File: `marketing/Line Grid.png`

### 2. Vibrant Gradients
Ultra-bold color gradients from the brand palette (blue-to-pink, pink-to-orange, etc.). The primary energy driver. Use on hero backgrounds, product card backgrounds, CTA sections.
- Files: `marketing/Blue Gradient Background.png`, `marketing/Pink_Orange Gradient Background.png`

### 3. Tiger Waves
The signature HydroWild texture. Tiger stripe wave pattern. Represents both "WILD" and refreshing water movement. Key on section backgrounds, hero overlays, and dividers.
- File: `marketing/Light Blue Tiger Stripes.png`
- Also found in: existing `assets/images/HW-Blue_Raspberry-Stripe_Pattern_3000X1500*.png`

### 4. Crisp Layered Shadows
90s step-and-repeat drop shadows. Applied to text, logo, product images, UI elements. This is the most iconic 90s signal in the design. Stack 2–3 offset shadows using brand colors.

---

## Flavor + Character System

### Flavor Critters (Kids 4–9 market)
Each flavor has a cryptid mascot. These are the main visual hook for the younger demographic.

| Flavor | Character | Notes |
|---|---|---|
| Fruit Punch | The Kraken | |
| Strawberry Lemonade | Loch & Nessie | |
| Orange Dream | Sasquatch | |
| Watermelon | Wampus Cat | |
| Blue Raspberry | — | (no critter assigned yet in brand doc) |

Critter illustration files: ✅ Installed in `/brand/logos/critters/` — Kracken.png, Nessie & Chessie 1.png, Nessie and Chessie 2.png, Wampus Cat.png, Yeti.png. Also available in `/public/assets/img/` (creature-kraken.png, creature-nessie.png, creature-wampus.png, creature-yeti.png).

### Flavor Color Associations (use for flavor-specific UI)
| Flavor | Primary Color | Accent |
|---|---|---|
| Blue Raspberry | Wild Blue `#29ABE2` | Punchy Pink `#FF3ECD` |
| Strawberry Lemonade | Punchy Pink `#FF3ECD` | Lemon Yellow `#FFE600` |
| Fruit Punch | Rad Red `#E80011` | Berry Blue `#0269B7` |
| Watermelon | Lime Green `#4ADB14` | Rad Red `#E80011` |
| Orange Dream | Orange Orange `#FF8327` | Wild Blue `#29ABE2` |

---

## Products

**Price:** $14.99/box

**Current flavors:**
- Blue Raspberry
- Strawberry Lemonade
- Fruit Punch
- Watermelon

**Product formats:**
- Individual box (10–14 sticks)
- Wild Starter Kit
- Wild Variety Pack (all 4 flavors)

**Shopify handles:**
- `kids-daily-hydration-drink-mix-{flavor}`
- `wild-starter-kit`
- `wild-variety-pack-all-4-flavors`

**Product images in `/brand/product-images/`:**
- Box mock-ups — all 4 flavors
- Stick mock-ups — all 4 flavors
- Amazon front listing images — all 4 flavors
- Science/ingredient callout graphics
- Supplement facts panels — all 4 flavors
- Comparison chart, Nutrient Focused graphic, Suggested Use graphic

---

## Photography / Marketing Assets

Lifestyle photography in `/brand/marketing/`. Shot June–July 2026. Current and high quality.

Key shot styles available:
- Poolside / outdoor summer (can + limes, poolside gin spritz style)
- Gym bag / active lifestyle (watermelon gym bag shot)
- Frozen bars in hand (Blue Raspberry)
- Strawberry Lemonade collage
- Product flats on gradient backgrounds
- Multi-product lifestyle arrangements
- "About Us" and "Core Values" graphics (already designed)

---

## Brand Voice

- **Tone:** Bold, fun, confident, irreverent — never corporate or preachy
- **Kids-first language** but parents need to trust it → lean on vitamins + 0 sugar when speaking to parents
- **Power phrase:** "The Call of the Wild!" — hero text, CTAs, section openers
- **Science hook:** "9 Essential Vitamins / 0 Sugar / Kids' Daily Hydration"
- **Not:** over-explained, clinical, overly health-conscious, or boring

---

## Tech / Backend

- Headless frontend (custom JS/HTML/CSS) + Shopify as backend via Storefront API (cart, checkout, products)
- Current build: Vite-based, see `vite.config.js`

---

## Asset Folder Map

```
hydrowild/
├── BRAND.md                           ← YOU ARE HERE (brand source of truth)
├── brand/
│   ├── docs/                          ← Official brand PDFs
│   │   ├── HW-0019—HydroWild—Brand Style Guidelines.pdf
│   │   └── Hydrowild - Brand Identity - July 2025.pdf
│   ├── logos/                         ← All logo variants (SVG/PNG/EPS)
│   │   ├── HydroWild Logo Primary 3 Color/
│   │   ├── HydroWild Logo White/
│   │   ├── HydroWild Logo Black/
│   │   ├── HydroWild Logo Pink/
│   │   ├── HydroWild Logo Yellow/
│   │   ├── HydroWild Logo Green/
│   │   ├── HydroWild Color Palette/
│   │   ├── pink triangle logo.png
│   │   └── tiger strip logo w_ pink triangle.png
│   ├── fonts/                         ← (add Purista + Azo Sans files here when received)
│   ├── marketing/                     ← Lifestyle + photoshoot images + backgrounds
│   └── product-images/               ← Product mockups + listing graphics
└── assets/
    ├── images/                        ← Already-placed site images + critter PNGs
    ├── logos/                         ← HydroWild_Logo_White.svg (in-use)
    └── videos/                        ← HD hero video
```
