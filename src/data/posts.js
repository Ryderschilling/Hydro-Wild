/* ═══════════════════════════════════════════════════════
   HYDROWILD — Blog Posts
   ═══════════════════════════════════════════════════════
   TO ADD A NEW POST:
   1. Copy the object below and paste it at the TOP of the
      POSTS array (newest posts go first)
   2. Fill in every field
   3. Drop your image in /assets/img/ as blog-[name].jpg
   4. In your terminal:
        git add .
        git commit -m "new post: [title]"
        git push
      Vercel auto-deploys in ~30 seconds.

   FIELD GUIDE:
   slug       → URL-safe ID, hyphens only.  e.g. "my-new-post"
   title      → Full title shown on page
   date       → Display date  e.g. "July 10, 2026"
   author     → "Lindey Britton"  or  "CJ Britton"
   category   → Pick one:
                  "Nutrition & Science"
                  "Real Talk"
                  "Recipes"
                  "Behind the Brand"
   image      → Path starting with /assets/img/
                  e.g. "/assets/img/blog-hydration-tips.jpg"
   imageAlt   → Short image description (screen readers / SEO)
   excerpt    → 1–2 sentence teaser shown on the blog listing
   body       → Full HTML content.
                  Use <p> for paragraphs
                  Use <h2> for main section headings
                  Use <h3> for sub-headings
                  Use <ul><li> for bullet lists
                  Use <strong> for bold text
   ═══════════════════════════════════════════════════════ */

export const POSTS = [
  {
    slug: 'why-kids-need-electrolytes',
    title: 'Why Your Kids Need More Than Just Water',
    date: 'July 10, 2026',
    author: 'Lindey Britton',
    category: 'Nutrition & Science',
    image: '/assets/img/blog-strawberry-lemon-packet.jpg',
    imageAlt: 'HydroWild Strawberry Lemonade packet surrounded by fresh strawberries and lemons',
    excerpt: 'Water is essential — but when kids are active and sweating, plain water often isn\'t enough. Here\'s what the science says about electrolytes and why they matter for your kids.',
    body: `
      <p>Every parent knows hydration matters. You hand your kid a water bottle before practice, remind them to drink up, and feel like you're doing the right thing. And you are — mostly.</p>
      <p>But here's what most parents don't know: when kids are sweating heavily during sports or active play, plain water can actually <strong>dilute the electrolytes in their blood faster than their body can replenish them</strong>. Pediatricians call this exercise-induced hyponatremia, and it's more common than you'd think.</p>
      <h2>What Are Electrolytes, Exactly?</h2>
      <p>Electrolytes are minerals that carry an electric charge when dissolved in water. The key players are potassium and magnesium. They regulate fluid balance, nerve signaling, and muscle contractions — meaning your kid's muscles literally cannot fire properly without them.</p>
      <p>When your child sweats, they're not just losing water. They're losing electrolytes. And when those aren't replaced, you get cramping, fatigue, brain fog, and sluggish performance on the field.</p>
      <h2>The Problem With Most Kids Drinks</h2>
      <p>Walk down the sports drink aisle and you'll find plenty of options that claim to "replenish electrolytes." What the label doesn't scream is that most of those drinks also pack <strong>20–30 grams of sugar per serving</strong> — more than a candy bar — along with artificial dyes linked to behavioral changes in some children.</p>
      <p>That's the trade-off parents have been forced to make: hydration or health. We built HydroWild because that trade-off is nonsense.</p>
      <h2>What HydroWild Actually Delivers</h2>
      <p>Every HydroWild packet includes potassium and magnesium — the two key electrolytes most depleted during physical activity. We also stacked in 9 essential vitamins including Vitamin C, Vitamin D, and B-complex vitamins that support energy metabolism and immune function.</p>
      <ul>
        <li>✦ Zero sugar. Zero artificial dyes.</li>
        <li>✦ Potassium &amp; magnesium for real electrolyte replenishment</li>
        <li>✦ 9 essential vitamins kids need daily</li>
        <li>✦ Sweetened with stevia — zero glycemic impact</li>
      </ul>
      <p>Nothing your kid doesn't need. Everything they do.</p>
      <h2>The Bottom Line</h2>
      <p>If your child is active — sports, outdoor play, PE class — plain water after 30–45 minutes of exertion isn't enough. They need electrolytes, and they need them without a sugar bomb attached.</p>
      <p>That's not a sales pitch. That's pediatric sports nutrition 101. We just happen to have built the drink that checks every box.</p>
    `
  }
];
