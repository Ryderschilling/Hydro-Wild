// Shared Organization JSON-LD used by every generator script that emits
// static pages. Kept in sync by hand with the Organization block in every
// top-level .html page's <head> — see index.html for the canonical copy.
export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HydroWild',
  alternateName: 'Drink HydroWild',
  url: 'https://hydrowild.com',
  logo: 'https://hydrowild.com/favicon-512.png',
  description:
    'HydroWild makes zero-sugar, zero-dye electrolyte drink mixes for kids and teens, with 7 vitamins and essential electrolytes in cryptid-themed flavors.',
  foundingDate: '2022',
  email: 'support@hydrowild.com',
  founders: [
    { '@type': 'Person', name: 'CJ Britton' },
    { '@type': 'Person', name: 'Lindey Britton' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3179 Green Valley Road, Suite 218',
    addressLocality: 'Vestavia Hills',
    addressRegion: 'AL',
    postalCode: '35243',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@hydrowild.com',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  sameAs: ['https://www.instagram.com/drinkhydrowild/', 'https://www.linkedin.com/company/hydrowild'],
};
