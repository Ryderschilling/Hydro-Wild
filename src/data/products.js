// HydroWild product catalog — real data pulled from hydrowild.com.
// When the Storefront API goes live, this becomes fallback/seed data only.

export const FLAVORS = [
  {
    id: 'blue-raspberry',
    handle: 'kids-daily-hydration-drink-mix-blue-raspberry',
    name: 'Blue Raspberry',
    creature: 'The Yeti',
    creatureImg: '/assets/img/creature-yeti.png',
    packImg: '/assets/img/pack-blue-raspberry.png',
    tagline: 'Mountain-cold. Electric blue flavor.',
    lore: 'The Yeti roams the highest peaks for one thing — a blue raspberry cold enough to match the altitude.',
    color: '#29ABE2',
    colorDark: '#0b5f8a',
    bg: '#062a44',
    price: 14.99,
  },
  {
    id: 'watermelon',
    handle: 'kids-daily-hydration-drink-mix-watermelon',
    name: 'Watermelon',
    creature: 'The Wampus Cat',
    creatureImg: '/assets/img/creature-wampus.png',
    packImg: '/assets/img/pack-watermelon.png',
    tagline: 'Backwoods beast. Summer all day.',
    lore: 'The Wampus Cat prowls the backwoods for one thing — a watermelon that actually hits.',
    color: '#4ADB14',
    colorDark: '#1f7d05',
    bg: '#0b3311',
    price: 14.99,
  },
  {
    id: 'strawberry-lemonade',
    handle: 'kids-daily-hydration-drink-mix-strawberry-lemonade',
    name: 'Strawberry Lemonade',
    creature: 'Loch & Nessie',
    creatureImg: '/assets/img/creature-nessie.png',
    packImg: '/assets/img/pack-strawberry-lemonade.png',
    tagline: 'Lake-born. Pink-lightning sweet.',
    lore: 'Loch & Nessie surface only when the strawberry lemonade is cold enough. Is yours?',
    color: '#FF3ECD',
    colorDark: '#a0007f',
    bg: '#3d0a22',
    price: 14.99,
  },
  {
    id: 'fruit-punch',
    handle: 'kids-daily-hydration-drink-mix-fruit-punch',
    name: 'Fruit Punch',
    creature: 'The Kraken',
    creatureImg: '/assets/img/creature-kraken.png',
    packImg: '/assets/img/pack-fruit-punch.png',
    tagline: 'Deep-sea force. Full-punch flavor.',
    lore: 'The Kraken rises from the deep for one reason — a fruit punch with enough force to shake the ocean floor.',
    color: '#E80011',
    colorDark: '#7a0008',
    bg: '#2a0004',
    price: 14.99,
  },
];

export const BUNDLES = [
  {
    id: 'variety-pack',
    handle: 'wild-variety-pack-all-4-flavors',
    name: 'Wild Variety Pack',
    desc: 'All 4 flavors. All 4 creatures. One box.',
    img: '/assets/img/starter-kit.png',
    price: 14.99,
  },
];

export const getFlavor = (id) => FLAVORS.find((f) => f.id === id);
