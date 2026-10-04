/**
 * The Marketing notes in the admin: how each tool is connected, what goes
 * into it and what comes out, written from the official documentation
 * (checked October 2026) and from running adoughcookie.com.
 *
 * Admin only. Nothing here is rendered on the public site.
 *
 * Every topic opens with the same three boxes — connect, fill, get — so the
 * answer to "how do I set this up" is always in the same place, and then
 * goes deeper in sections made of a few block kinds.
 */

export type NoteBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "terms"; items: { term: string; meaning: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "tip"; text: string };

export type NoteSection = { id: string; title: string; blocks: NoteBlock[] };

export type NoteTopic = {
  id: string;
  label: string;
  /** One line under the title, and on the topic's card in the index. */
  blurb: string;
  /** Which group the topic sits in on the index page. */
  group: "Research & search" | "Measure" | "Paid" | "Reach";
  connect: string[];
  fill: string[];
  get: string[];
  sections: NoteSection[];
  links: { label: string; url: string }[];
};

export const NOTE_GROUPS: NoteTopic["group"][] = [
  "Research & search",
  "Measure",
  "Paid",
  "Reach",
];

export const MARKETING_NOTES: NoteTopic[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "market-research",
    label: "Market research",
    group: "Research & search",
    blurb:
      "Who buys, what they type into Google, how many of them there are and who you are up against — before a rupee goes on ads.",
    connect: [
      "Google Trends: trends.google.com, no account needed.",
      "Google Ads Keyword Planner: ads.google.com → Tools → Planning → Keyword Planner. Needs a Google Ads account; skip the first campaign with “Switch to Expert Mode”.",
      "Search Console (once the site is live): what people already find you for.",
      "Meta Ad Library: facebook.com/ads/library, to see every ad a competitor is running.",
    ],
    fill: [
      "Your product in plain words, and 5–10 seed phrases a customer would type (e.g. “cookie gift box”, “cookies delivery bangalore”).",
      "Location (country, state or city) and language.",
      "Two or three competitors' website addresses.",
    ],
    get: [
      "Monthly search volume per keyword and its range (e.g. 1K–10K).",
      "Competition level and the top-of-page bid range, i.e. what a click will cost.",
      "Seasonality: which months demand peaks (Diwali, Christmas, Valentine's).",
      "A shortlist of keywords and angles to build pages and ads around.",
    ],
    sections: [
      {
        id: "base",
        title: "Finding the market base",
        blocks: [
          {
            kind: "steps",
            items: [
              "Describe the customer: age, city, income, what problem they are solving, where they spend time online.",
              "Size the demand: put seed keywords into Keyword Planner → “Discover new keywords”. Add up volumes for the keywords that clearly mean “I want to buy this”.",
              "Check the trend: compare the same phrases in Google Trends over 5 years. Rising or flat is fine; falling needs a different angle.",
              "Study competitors: their site, their prices, their Google reviews, and their live ads in Meta Ad Library. Note what they promise and what customers complain about.",
              "Pick the gap: the promise nobody makes well, a city nobody serves, a price nobody hits.",
              "Test small: one landing page, ₹500–1,000 a day of ads for a week, and see what the clicks and enquiries say.",
            ],
          },
        ],
      },
      {
        id: "intent",
        title: "Search intent, in one line each",
        blocks: [
          {
            kind: "terms",
            items: [
              {
                term: "Informational",
                meaning:
                  "They want to learn. “how to store cookies”. Answer with a blog post.",
              },
              {
                term: "Navigational",
                meaning:
                  "They want a specific site. “adough cookie instagram”. Make sure you rank for your own name.",
              },
              {
                term: "Commercial",
                meaning:
                  "They are comparing. “best cookies in bangalore”. Answer with a comparison or ‘best of’ page.",
              },
              {
                term: "Transactional",
                meaning:
                  "They are ready to buy. “order cookie hamper online”. Send them to a product page with a clear button.",
              },
            ],
          },
          {
            kind: "tip",
            text: "Spend ad money on commercial and transactional keywords first. Informational traffic is cheaper to win with SEO.",
          },
        ],
      },
    ],
    links: [
      { label: "Keyword Planner help", url: "https://support.google.com/google-ads/answer/7337243" },
      { label: "Google Trends", url: "https://trends.google.com" },
      { label: "Meta Ad Library", url: "https://www.facebook.com/ads/library" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "search-console",
    label: "Search Console",
    group: "Research & search",
    blurb:
      "What Google sees of the site: which searches show it, how often people click, which pages are indexed and why the rest are not.",
    connect: [
      "Go to search.google.com/search-console → Add property.",
      "Choose “Domain” (covers www, non-www, http and https) and add the TXT record it gives you at the domain registrar (GoDaddy, Cloudflare). Verification can take a few minutes to a day.",
      "Sitemaps → submit https://www.yoursite.com/sitemap.xml.",
      "Settings → Users and permissions → add teammates. Link it to GA4 under GA4 Admin → Product links → Search Console.",
    ],
    fill: [
      "The domain and the DNS TXT record.",
      "The sitemap address.",
      "Full page addresses (with https://www.) in the inspect bar at the top, to check or request indexing.",
    ],
    get: [
      "Clicks, impressions, CTR and average position per search query, page, country and device.",
      "Indexing status of every page and the reason for any that are not indexed.",
      "Core Web Vitals from real Chrome users, structured data errors, security and manual-action warnings.",
      "Emails when something breaks (like the merchant listing warnings).",
    ],
    sections: [
      {
        id: "performance",
        title: "Performance report: the four numbers",
        blocks: [
          {
            kind: "terms",
            items: [
              {
                term: "Impression",
                meaning:
                  "Your link appeared on a results page the searcher loaded. They did not have to scroll to it or notice it.",
              },
              {
                term: "Click",
                meaning: "Someone clicked through from Google to your site.",
              },
              {
                term: "CTR (click-through rate)",
                meaning:
                  "Clicks ÷ impressions. 100 impressions and 3 clicks is 3%.",
              },
              {
                term: "Average position",
                meaning:
                  "Where your link usually sat. 1 is the top result. Below 10 means page two, which almost nobody clicks.",
              },
            ],
          },
          {
            kind: "table",
            head: ["What you see", "What it means", "What to do"],
            rows: [
              [
                "Many impressions, few clicks",
                "You rank, but the result doesn't tempt anyone, or you rank low on page one.",
                "Rewrite the SEO title and meta description; add structured data for stars or price.",
              ],
              [
                "Few impressions",
                "Google barely shows the page.",
                "Check it is indexed, target a keyword people actually search, add internal links.",
              ],
              [
                "Good CTR, position 8–15",
                "People like it when they see it.",
                "Improve the content and get links, so it climbs onto the top of page one.",
              ],
            ],
          },
        ],
      },
      {
        id: "no-click",
        title: "Searches that end without a click",
        blocks: [
          {
            kind: "terms",
            items: [
              {
                term: "Zero-click search",
                meaning:
                  "The searcher got the answer on Google itself, from a snippet, AI Overview, map pack or knowledge panel, and never clicked. It shows up as an impression without a click.",
              },
              {
                term: "Featured snippet",
                meaning:
                  "The boxed answer above the results, taken from one page. It earns impressions, and sometimes clicks.",
              },
              {
                term: "AI Overview / AI Mode",
                meaning:
                  "Google's generated answer with source links. Clicks and impressions from it are counted in the normal Web search totals.",
              },
              {
                term: "Local pack",
                meaning:
                  "The map and three businesses. It comes from Google Business Profile, not your website, so calls and directions from it are counted there.",
              },
              {
                term: "Knowledge panel",
                meaning: "The brand box on the right, built from your profile and the web.",
              },
            ],
          },
        ],
      },
      {
        id: "indexing",
        title: "Page indexing statuses, grouped",
        blocks: [
          {
            kind: "table",
            head: ["Status", "Plain meaning", "Action"],
            rows: [
              ["Indexed", "Google has stored it and can show it.", "None."],
              [
                "Discovered – currently not indexed",
                "Google knows the address but hasn't visited it yet (“Last crawled: N/A”).",
                "Request indexing, add internal links to it, keep it in the sitemap.",
              ],
              [
                "Crawled – currently not indexed",
                "Visited and decided it is not worth storing yet. Thin, duplicate or old.",
                "Improve the content, or let it go if it is an old URL.",
              ],
              [
                "Duplicate without user-selected canonical",
                "Looks like a copy of another page and has no canonical tag.",
                "Add a canonical pointing to itself, or to the real page.",
              ],
              [
                "Alternate page with proper canonical tag",
                "A variant that correctly points to the main page.",
                "None. This is working as intended.",
              ],
              [
                "Duplicate, Google chose different canonical than user",
                "You said ‘I am the main page’, Google disagreed.",
                "Make pages genuinely different; check the canonical tag.",
              ],
              [
                "Page with redirect",
                "The address redirects elsewhere.",
                "None if it is an old URL you redirected on purpose.",
              ],
              [
                "Not found (404)",
                "The page does not exist.",
                "301 it to the closest new page if it had links or traffic; otherwise leave it.",
              ],
              [
                "Soft 404",
                "Says ‘200 OK’ but looks empty or like an error page.",
                "Return a real 404/410, or put real content on it.",
              ],
              [
                "Blocked by robots.txt",
                "You told Google not to crawl it.",
                "Fine for cart, checkout, account and admin pages.",
              ],
              [
                "Excluded by ‘noindex’ tag",
                "The page asks not to be indexed.",
                "Fine on purpose; a bug if it is a page you want found.",
              ],
              [
                "Server error (5xx)",
                "The site failed when Google visited.",
                "Check hosting and logs; then Validate fix.",
              ],
            ],
          },
          {
            kind: "tip",
            text: "Google allows roughly 10 “Request indexing” clicks a day per property. Spend them on new money pages first, and always paste the full address with https://www.",
          },
        ],
      },
      {
        id: "old-pages",
        title: "Moving to new URLs and getting rid of old pages",
        blocks: [
          {
            kind: "steps",
            items: [
              "List every old URL that had traffic, links or rankings (Search Console → Pages, plus the old sitemap).",
              "Map each one to its closest new page and add a permanent 301 redirect (in Next.js: `redirects()` in next.config). Don't send everything to the homepage; Google treats that as a soft 404.",
              "Pages with no replacement and no value: return 410 Gone (or 404). Google drops them faster with 410.",
              "Update internal links and the sitemap so they list only new URLs.",
              "Changed the whole domain? Use Settings → Change of address in the old property after the redirects are live.",
              "Need something gone from results urgently (private data)? Removals → New request hides it for about 6 months. It is temporary; the real fix is 404/410 or noindex.",
              "Keep the redirects for at least a year. Old URLs fall out of the index over weeks, not days.",
            ],
          },
        ],
      },
      {
        id: "api",
        title: "Google search APIs, in one line each",
        blocks: [
          {
            kind: "terms",
            items: [
              {
                term: "Search Console API: Search Analytics",
                meaning:
                  "The Performance report as data: clicks, impressions, CTR and position by query, page, country, device and date. Our SEO tab reads this.",
              },
              {
                term: "Search Console API: URL Inspection",
                meaning:
                  "Ask whether one URL is indexed and why. It reads only; it cannot request indexing.",
              },
              {
                term: "Search Console API: Sitemaps / Sites",
                meaning: "List and submit sitemaps, and list properties.",
              },
              {
                term: "Indexing API",
                meaning:
                  "Push a URL to Google immediately. Officially only for job postings and livestream pages.",
              },
              {
                term: "PageSpeed Insights API",
                meaning:
                  "The PageSpeed report as data, both lab (Lighthouse) and field (Chrome UX Report).",
              },
              {
                term: "Chrome UX Report (CrUX) API",
                meaning:
                  "Real-user Core Web Vitals for a page or whole site over the last 28 days.",
              },
              {
                term: "Custom Search JSON API",
                meaning:
                  "Run Google searches from code over sites you choose. It is not your site's ranking data.",
              },
            ],
          },
        ],
      },
    ],
    links: [
      { label: "Page indexing report", url: "https://support.google.com/webmasters/answer/7440203" },
      { label: "Performance report", url: "https://support.google.com/webmasters/answer/7576553" },
      { label: "Site moves with URL changes", url: "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes" },
      { label: "Removals tool", url: "https://support.google.com/webmasters/answer/9689846" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "page-seo",
    label: "Page SEO checklist",
    group: "Research & search",
    blurb:
      "Everything that belongs to a single page. Search Console, GA4, sitemaps and Business Profile are site-level and live elsewhere.",
    connect: [
      "Keywords: Google Ads Keyword Planner (see Market research).",
      "Check a live page: Search Console URL Inspection, the Rich Results Test and PageSpeed Insights.",
      "In our admin: the SEO tab, page by page.",
    ],
    fill: [
      "Primary keyword, 3–5 secondary keywords, and the intent.",
      "SEO title, meta description, slug, H1 and headings.",
      "Image file names, alt text, canonical, robots and schema for the page.",
    ],
    get: [
      "A page Google understands, shows for the right search and people click.",
      "Rich results (stars, price, FAQ) where the schema qualifies.",
    ],
    sections: [
      {
        id: "checklist",
        title: "The checklist, item by item",
        blocks: [
          {
            kind: "table",
            head: ["Item", "What to put", "Good looks like"],
            rows: [
              ["Primary keyword", "The one phrase this page should rank for, from Keyword Planner.", "One page per keyword. Two pages on the same keyword compete with each other."],
              ["Secondary keywords", "Close variants and related phrases.", "Used naturally in headings and body text."],
              ["Search intent", "Informational, commercial or transactional.", "The page type matches: guide, comparison or product."],
              ["SEO title", "The blue link in Google (<title>).", "About 50–60 characters, keyword near the start, brand at the end."],
              ["Meta description", "The two lines under the link.", "About 150–160 characters, a reason to click, no keyword stuffing. Google may rewrite it."],
              ["URL / slug", "/cookie-gift-hampers", "Short, lowercase, hyphens, keyword in it. Never change it without a 301."],
              ["H1", "The visible main heading.", "Exactly one, close to the title in meaning."],
              ["H2 / H3", "Section headings.", "In order, describing the section. Good place for secondary keywords."],
              ["Keyword in the intro", "First 100 words.", "Says early what the page is about."],
              ["Natural usage", "Throughout the copy.", "Reads like a person wrote it for a person."],
              ["Content quality", "Real answers, photos, prices, proof.", "Better than what ranks today for that search."],
              ["Internal links", "Links to and from other pages of ours.", "Descriptive anchor text (“cookie tins”), not “click here”."],
              ["External links", "Links out to trusted sources.", "Only where useful. Paid or untrusted links get rel=\"sponsored\" or \"nofollow\"."],
              ["Backlinks", "Other sites linking to this page.", "Earned from local press, directories, partners and suppliers. Never bought."],
              ["Image file name", "chocolate-chunk-cookie-tin.webp", "Describes the picture."],
              ["Alt text", "What the image shows, in one sentence.", "Helps blind readers and image search. Empty alt for purely decorative images."],
              ["Image size", "WebP/AVIF, sized to how big it displays.", "Hero under ~200 KB; width and height set so the page doesn't jump."],
              ["Canonical URL", "<link rel=\"canonical\"> to the page's own address.", "Self-referencing. Never pointing every page to the homepage (the adoughcookie bug)."],
              ["Index / noindex", "robots meta tag.", "index on pages you want found; noindex on thank-you, cart and account pages."],
              ["Follow / nofollow", "Whether Google follows the links.", "follow by default."],
              ["Schema", "JSON-LD: Product, LocalBusiness, FAQ, BreadcrumbList, Article.", "Passes the Rich Results Test with no errors."],
              ["Open Graph", "og:title, og:description, og:image (1200×630).", "A good preview when shared on WhatsApp, Facebook and LinkedIn."],
              ["Mobile", "Works at 360px wide.", "No sideways scroll, tap targets at least 48px, readable text."],
              ["Page speed", "Core Web Vitals.", "LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (see PageSpeed)."],
              ["Broken links", "Every link returns 200.", "Check after every redesign or URL change."],
              ["Duplicate content", "No two pages with the same text.", "City pages need genuinely local content, not a find-and-replace on the city name."],
            ],
          },
        ],
      },
    ],
    links: [
      { label: "SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
      { label: "Title links", url: "https://developers.google.com/search/docs/appearance/title-link" },
      { label: "Canonical URLs", url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls" },
      { label: "Rich Results Test", url: "https://search.google.com/test/rich-results" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "page-speed",
    label: "PageSpeed & Core Web Vitals",
    group: "Research & search",
    blurb:
      "How to read a PageSpeed Insights report: the real-user part at the top, the lab test below it, and which fixes move the score.",
    connect: [
      "pagespeed.web.dev, then paste the full address. No account needed.",
      "Search Console → Core Web Vitals for the whole site.",
      "Chrome DevTools → Lighthouse or Performance panel for a local test.",
    ],
    fill: ["The page address. Check Mobile first, because Google ranks on the mobile version."],
    get: [
      "Field data: what real Chrome users experienced over the last 28 days (pass/fail).",
      "Lab data: one simulated load on a slow phone, scored 0–100, with a list of fixes and estimated savings.",
      "Accessibility, Best Practices and SEO scores.",
    ],
    sections: [
      {
        id: "two-halves",
        title: "Two halves of the report",
        blocks: [
          {
            kind: "terms",
            items: [
              {
                term: "“Discover what your real users are experiencing”",
                meaning:
                  "Field data from the Chrome UX Report. This decides the Core Web Vitals pass/fail and is what Google uses for ranking. “No data” means too few visitors yet.",
              },
              {
                term: "“Diagnose performance issues”",
                meaning:
                  "Lab data: one Lighthouse run on an emulated Moto G Power over slow 4G. It is harsh on purpose and varies between runs. Use it to find fixes, not as the verdict.",
              },
            ],
          },
          {
            kind: "tip",
            text: "adoughcookie.com, Sept 2026: field LCP 2 s and INP 166 ms were fine, but CLS 0.18 failed the assessment. Lab LCP was 8.5 s and total page weight 14 MB, mostly unoptimised images (12 MB of savings) and short cache lifetimes.",
          },
        ],
      },
      {
        id: "metrics",
        title: "The metrics and their targets",
        blocks: [
          {
            kind: "table",
            head: ["Metric", "Plain meaning", "Good", "Poor"],
            rows: [
              ["LCP: Largest Contentful Paint", "When the biggest thing (hero image or headline) appears.", "≤ 2.5 s", "> 4 s"],
              ["INP: Interaction to Next Paint", "How long the page takes to react to a tap or click.", "≤ 200 ms", "> 500 ms"],
              ["CLS: Cumulative Layout Shift", "How much the page jumps while loading.", "≤ 0.1", "> 0.25"],
              ["FCP: First Contentful Paint", "When anything at all appears.", "≤ 1.8 s", "> 3 s"],
              ["TTFB: Time to First Byte", "How long the server takes to start answering.", "≤ 0.8 s", "> 1.8 s"],
              ["TBT: Total Blocking Time (lab)", "Time the page was frozen running JavaScript. Stands in for INP in the lab.", "≤ 200 ms", "> 600 ms"],
              ["Speed Index (lab)", "How quickly the screen fills in visually.", "≤ 3.4 s", "> 5.8 s"],
            ],
          },
          {
            kind: "p",
            text: "The lab Performance score is weighted: TBT 30%, LCP 25%, CLS 25%, FCP 10%, Speed Index 10%. So fixing JavaScript, the hero image and layout jumps moves it most.",
          },
        ],
      },
      {
        id: "fixes",
        title: "What each insight means and the usual fix",
        blocks: [
          {
            kind: "table",
            head: ["Insight", "Fix"],
            rows: [
              ["Improve image delivery", "Serve WebP/AVIF at the size shown, lazy-load below the fold, preload the hero image (Next.js <Image> with priority)."],
              ["Use efficient cache lifetimes", "Cache static files for a year (Cache-Control: max-age=31536000, immutable); fingerprinted file names make that safe."],
              ["Render-blocking requests", "Inline critical CSS, defer scripts, load fonts with font-display: swap."],
              ["Layout shift culprits", "Give images, embeds and ad slots a width and height; don't insert banners above content after load."],
              ["Reduce unused / legacy JavaScript", "Remove unused plugins and trackers, split code per page, stop shipping polyfills for old browsers."],
              ["Avoid enormous network payloads", "Total page weight under ~2–3 MB on mobile; compress video or replace it with a poster image."],
              ["Long main-thread tasks / forced reflow", "Break up heavy scripts, delay chat widgets and third-party tags until after load or interaction."],
              ["3rd parties", "Every pixel, chat and widget costs time. Keep only what you measure or use."],
              ["Optimize DOM size", "Fewer nested wrappers; paginate long lists."],
              ["Buttons do not have an accessible name", "Icon-only buttons need aria-label (“Open menu”)."],
              ["Contrast", "Text needs a 4.5:1 contrast ratio with its background."],
              ["Touch targets", "At least 24×24 px with spacing; 48 px is comfortable."],
            ],
          },
        ],
      },
    ],
    links: [
      { label: "PageSpeed Insights", url: "https://pagespeed.web.dev" },
      { label: "Core Web Vitals", url: "https://web.dev/articles/vitals" },
      { label: "Lighthouse scoring", url: "https://developer.chrome.com/docs/lighthouse/performance/performance-scoring" },
      { label: "Score calculator", url: "https://googlechrome.github.io/lighthouse/scorecalc/" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "structured-data",
    label: "Structured data",
    group: "Research & search",
    blurb:
      "The JSON-LD that gets stars, prices and stock into Google results, and what the Search Console warnings about it mean.",
    connect: [
      "Add a <script type=\"application/ld+json\"> block to the page (in Next.js, render it from the page component).",
      "Test with the Rich Results Test, then watch Search Console → Enhancements (Merchant listings, Product snippets).",
    ],
    fill: [
      "Product: name, image, description, brand, sku, offers (price, priceCurrency \"INR\", availability).",
      "Organization: name, logo, url, contact, return policy and shipping policy.",
      "Reviews: only real ones, with the reviewer's name.",
    ],
    get: [
      "Price, stock and delivery info under your listing (merchant listing).",
      "Star ratings in results (product snippet), which usually lifts CTR.",
      "Eligibility for the free Shopping tab listings.",
    ],
    sections: [
      {
        id: "warnings",
        title: "The four warnings adoughcookie got, and the fix",
        blocks: [
          {
            kind: "table",
            head: ["Warning", "What it wants", "Fix"],
            rows: [
              [
                "Missing hasMerchantReturnPolicy (in offers)",
                "Your return policy: whether returns are allowed, within how many days, and who pays.",
                "Google now prefers it once at the Organization level (MerchantReturnPolicy under Organization), or set it in Merchant Center. For perishables: returnPolicyCategory MerchantReturnNotPermitted, country IN.",
              ],
              [
                "Missing shippingDetails (in offers)",
                "Delivery cost and time to a region.",
                "Organization-level shipping policy or Merchant Center shipping settings: rate in INR, handling days, transit days, regions served.",
              ],
              [
                "Missing aggregateRating",
                "Average star rating and count.",
                "Only if you show real reviews on that page. Never invent them; fake ratings can earn a manual action.",
              ],
              [
                "Missing review",
                "At least one individual review with the author's name.",
                "Same as above. Add when a reviews widget is live on product pages.",
              ],
            ],
          },
          {
            kind: "tip",
            text: "These are non-critical. The page still appears; it just can't show the extra details. Fix return and shipping first, because they are facts you already have.",
          },
        ],
      },
    ],
    links: [
      { label: "Merchant listing structured data", url: "https://developers.google.com/search/docs/appearance/structured-data/merchant-listing" },
      { label: "Product snippet", url: "https://developers.google.com/search/docs/appearance/structured-data/product-snippet" },
      { label: "Return policy markup", url: "https://developers.google.com/search/docs/appearance/structured-data/return-policy" },
      { label: "Review snippet guidelines", url: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "analytics",
    label: "Google Analytics (GA4)",
    group: "Measure",
    blurb:
      "Every question GA4 answers, grouped the way the reports are, with each term in plain words.",
    connect: [
      "analytics.google.com → Admin → Create → Account, then Property (time zone India, currency INR).",
      "Data streams → Web → your domain. Copy the Measurement ID (G-XXXXXXX) into the site (our NEXT_PUBLIC_GA_ID).",
      "Turn on Enhanced measurement (page views, scrolls, outbound clicks, site search, video, file downloads, form interactions).",
      "Admin → Product links: link Google Ads, Search Console and Merchant Center.",
      "Admin → Data retention: change from 2 to 14 months, or explorations only look back 2 months.",
      "For our admin dashboard: a service account with Viewer access on the property (GA4 Data API).",
    ],
    fill: [
      "Property name, time zone, currency, industry and business objectives (choose “Generate leads” and/or “Drive online sales” to get the matching report collections).",
      "Key events: mark generate_lead and purchase as key events.",
      "Custom events and the parameters to send with them, and custom dimensions to report on them.",
      "Internal traffic filter for your own office IP.",
    ],
    get: [
      "Who visits, where they came from, what they do, and which channel brings leads and sales.",
      "Funnels, paths and cohorts in Explorations.",
      "Key events imported into Google Ads so bidding can optimise for them.",
    ],
    sections: [
      {
        id: "words",
        title: "The words, in plain English",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "Active users", meaning: "People who had an engaged visit. GA4's headline “Users”." },
              { term: "New users", meaning: "First visit ever on that browser or device." },
              { term: "Returning users", meaning: "Came back after an earlier visit." },
              { term: "Session", meaning: "One visit. It ends after 30 minutes without activity." },
              { term: "Engaged session", meaning: "A visit that lasted 10+ seconds, or viewed 2+ pages, or had a key event." },
              { term: "Engagement rate", meaning: "Engaged sessions ÷ all sessions." },
              { term: "Bounce rate", meaning: "The opposite: sessions that were not engaged." },
              { term: "Average engagement time", meaning: "How long the page was actually in front of them (tab in focus)." },
              { term: "Event", meaning: "Anything that happens: page_view, click, scroll, form_submit, purchase." },
              { term: "Key event", meaning: "An event you mark as important (formerly “conversion”). Google Ads still calls the imported version a conversion." },
              { term: "Source / medium", meaning: "Where a visit came from (google / organic, instagram / social, newsletter / email)." },
              { term: "Channel group", meaning: "Source and medium sorted into buckets: Organic Search, Paid Search, Organic Social, Paid Social, Email, Referral, Direct, and so on." },
              { term: "First user vs session", meaning: "‘First user source’ is what first brought the person; ‘session source’ is what brought this visit." },
              { term: "Attribution", meaning: "Which touch gets credit for a key event. GA4 defaults to data-driven." },
              { term: "Dimension / metric", meaning: "A dimension is a label (city, page); a metric is a number (users, revenue)." },
            ],
          },
        ],
      },
      {
        id: "questions",
        title: "Questions GA4 answers, by report",
        blocks: [
          {
            kind: "table",
            head: ["Report", "Questions it answers"],
            rows: [
              ["Realtime", "Who is on the site in the last 30 minutes? From where? Did the campaign I just posted bring anyone? Did my test event fire?"],
              ["Acquisition → Overview", "How many people came, and through which channels?"],
              ["Acquisition → User acquisition", "What brought new people for the first time? (first user source)"],
              ["Acquisition → Traffic acquisition", "What brought each visit, including returning people? Which channel has the best engagement and key events?"],
              ["Acquisition → Google Ads / Search Console", "Which ads, keywords and Google searches brought traffic, and did it convert?"],
              ["Engagement → Events", "What do people do? How many form submits, WhatsApp clicks, calls, scrolls?"],
              ["Engagement → Key events", "How many leads or sales happened, and from which source?"],
              ["Engagement → Pages and screens", "Which pages get read the most, and for how long?"],
              ["Engagement → Landing page", "Which first page do visits land on, and which landing pages bring leads?"],
              ["Monetization → Ecommerce purchases", "Which products are viewed, added to cart and bought? Cart-to-view rate?"],
              ["Monetization → Purchase journey / Checkout journey", "Where do buyers drop out between product, cart, checkout and payment?"],
              ["Monetization → Overview", "Revenue, average purchase value, first-time vs repeat buyers."],
              ["Retention", "Do people come back? After how many days? What is their lifetime value?"],
              ["User → Demographics", "Which country, city, language, age and gender (when Google signals are on)?"],
              ["User → Tech", "Mobile or desktop? Which browser, OS, screen size? Is the app version current?"],
              ["Advertising → Attribution", "Which channels started and which closed the journeys? What happens if credit moves from last click to data-driven?"],
            ],
          },
        ],
      },
      {
        id: "leads-sales",
        title: "Lead reports and sales reports",
        blocks: [
          {
            kind: "p",
            text: "Pick the business objective when creating the property and GA4 adds a matching report collection. Both depend on sending Google's recommended events with exactly these names.",
          },
          {
            kind: "table",
            head: ["Lead events (generate leads)", "When to send"],
            rows: [
              ["generate_lead", "Enquiry form submitted, WhatsApp or call button tapped (send value and currency if you know what a lead is worth)."],
              ["qualify_lead", "Your team marks the lead as a real prospect."],
              ["disqualify_lead", "Marked as not a fit (spam, wrong city, no budget)."],
              ["working_lead", "Your team has contacted them."],
              ["close_convert_lead", "They became a customer."],
              ["close_unconvert_lead", "Closed without buying."],
            ],
          },
          {
            kind: "table",
            head: ["Sales events (online sales)", "When to send"],
            rows: [
              ["view_item_list / select_item", "Shown a category list / clicked a product in it."],
              ["view_item", "Opened a product page."],
              ["add_to_wishlist", "Saved it for later."],
              ["add_to_cart / remove_from_cart / view_cart", "Cart activity."],
              ["begin_checkout", "Started checkout."],
              ["add_shipping_info / add_payment_info", "Filled the address / chose a payment method."],
              ["purchase", "Paid (with transaction_id, value, currency INR and items)."],
              ["refund", "Order refunded."],
              ["view_promotion / select_promotion", "Saw / clicked a banner offer."],
            ],
          },
          {
            kind: "tip",
            text: "The later lead stages (qualify, close) happen offline in WhatsApp or a CRM. Send them from the server with the Measurement Protocol, or import them into Google Ads as offline conversions using the gclid.",
          },
        ],
      },
      {
        id: "custom",
        title: "Custom events, dimensions and explorations",
        blocks: [
          {
            kind: "steps",
            items: [
              "Name events in snake_case, under 40 characters: whatsapp_click, call_click, brochure_download, quote_request.",
              "Send parameters with them: e.g. whatsapp_click with button_location: \"hero\", service: \"software\".",
              "Admin → Custom definitions → Create custom dimension for each parameter you want in reports. Data only shows from that day on.",
              "Admin → Events → mark the important ones as key events.",
              "Test in Admin → DebugView (with the GA Debugger extension) before trusting the numbers.",
            ],
          },
          {
            kind: "terms",
            items: [
              { term: "Free-form exploration", meaning: "A drag-and-drop pivot table of any dimension by any metric." },
              { term: "Funnel exploration", meaning: "Step-by-step drop-off: landing → product → cart → purchase, or page → form start → submit." },
              { term: "Path exploration", meaning: "What people did before or after a page or event." },
              { term: "Segment overlap", meaning: "How groups overlap, e.g. mobile users from Instagram who bought." },
              { term: "Cohort exploration", meaning: "Do people who first came in a given week come back?" },
              { term: "User lifetime", meaning: "Revenue and engagement over a person's whole history." },
            ],
          },
        ],
      },
    ],
    links: [
      { label: "Recommended events", url: "https://support.google.com/analytics/answer/9267735" },
      { label: "Default channel group", url: "https://support.google.com/analytics/answer/9756891" },
      { label: "Key events", url: "https://support.google.com/analytics/answer/13128484" },
      { label: "Custom dimensions", url: "https://support.google.com/analytics/answer/14240153" },
      { label: "Measurement Protocol", url: "https://developers.google.com/analytics/devguides/collection/protocol/ga4" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "tracking-links",
    label: "Tracking links (UTM)",
    group: "Measure",
    blurb:
      "How to tag every link you post so GA4 says exactly which post, ad or message brought the visit, and how to shorten it.",
    connect: [
      "Google Ads: Admin → Account settings → Auto-tagging ON. Adds gclid; no UTMs needed.",
      "Meta Ads: in the ad, under Destination → URL parameters → Build a URL parameter.",
      "Everything else (Instagram bio, WhatsApp, email, QR codes, influencers): build the link with GA's Campaign URL Builder.",
    ],
    fill: [
      "utm_source: who sent it (instagram, whatsapp, newsletter, google, influencer-handle).",
      "utm_medium: the kind of channel (social, paid_social, cpc, email, referral, sms, qr).",
      "utm_campaign: the campaign (diwali-2026-hampers).",
      "Optional: utm_content (which creative or button), utm_term (keyword), utm_id (campaign ID).",
    ],
    get: [
      "In GA4 Traffic acquisition: visits, leads and sales per source, medium and campaign.",
      "Correct channel grouping (Paid Social instead of “Unassigned”).",
    ],
    sections: [
      {
        id: "anatomy",
        title: "Anatomy of a tagged link",
        blocks: [
          {
            kind: "p",
            text: "https://www.adoughcookie.com/cookie-gift-hampers?utm_source=instagram&utm_medium=social&utm_campaign=diwali-2026&utm_content=reel-unboxing",
          },
          {
            kind: "list",
            items: [
              "Always lowercase. GA4 treats Instagram and instagram as two sources.",
              "Hyphens, not spaces. Pick one spelling per source and keep a sheet of them.",
              "Never put UTMs on links within your own site. They start a new session and overwrite the real source.",
              "Medium decides the channel: cpc/ppc/paid → Paid; social → Organic Social; email → Email; sms → SMS; affiliate → Affiliates; display/cpm → Display.",
            ],
          },
        ],
      },
      {
        id: "kinds",
        title: "Ready-made patterns by channel",
        blocks: [
          {
            kind: "table",
            head: ["Where", "source", "medium", "Notes"],
            rows: [
              ["Instagram bio link", "instagram", "social", "campaign=bio; one link for months."],
              ["Instagram / Facebook organic post", "instagram / facebook", "social", "content= the post or reel name."],
              ["Meta ads", "{{site_source_name}}", "paid_social", "campaign={{campaign.name}}, content={{ad.name}}. Meta fills these in."],
              ["WhatsApp broadcast / API template", "whatsapp", "messaging (or sms)", "campaign= template name. WhatsApp strips nothing, but many links show as Direct without tags."],
              ["Email newsletter", "newsletter", "email", "content= which button."],
              ["Google Ads", "(auto)", "(auto)", "Leave auto-tagging on; add UTMs only for other tools."],
              ["Influencer", "the creator's handle", "influencer or affiliate", "One link per creator so you can pay on results."],
              ["QR code on packaging or a flyer", "packaging / flyer", "qr", "campaign= where it was printed."],
              ["Google Business Profile website button", "google", "organic", "campaign=gbp. Separates map traffic from normal search."],
            ],
          },
        ],
      },
      {
        id: "short",
        title: "Shortening links",
        blocks: [
          {
            kind: "list",
            items: [
              "Best: a short link on your own domain, e.g. adoughcookie.com/go/diwali → 301 → the full UTM link. Trusted, on-brand, and you can change the destination later. In Next.js, one line in redirects().",
              "Quick: Bitly, Rebrandly or TinyURL. They count clicks too, but a free short domain looks spammy on WhatsApp and you lose the links if the account goes.",
              "QR codes: point them at your own short link, never straight at the long URL, so the printed code still works after a page moves.",
              "Test every short link once: open it and check Realtime in GA4 shows the right source and medium.",
            ],
          },
        ],
      },
    ],
    links: [
      { label: "Campaign URL Builder", url: "https://ga-dev-tools.google/campaign-url-builder/" },
      { label: "URL builders and UTM", url: "https://support.google.com/analytics/answer/10917952" },
      { label: "Meta URL parameters", url: "https://www.facebook.com/business/help/1016122818401732" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "google-ads",
    label: "Google Ads",
    group: "Paid",
    blurb:
      "Account setup, Shopping vs Performance Max vs Search, bidding, budgets and how to read a campaign that isn't working.",
    connect: [
      "ads.google.com with the business Gmail → New campaign → “Switch to Expert Mode” / skip campaign creation.",
      "Billing country India, time zone (GMT+05:30) and currency INR. These can't be changed later.",
      "Payment profile: Organisation, GSTIN, address, card or UPI auto-pay.",
      "Tools → Conversions: import GA4 key events, or add the Google tag and create a conversion for lead or purchase.",
      "Link GA4, Merchant Center (for Shopping) and YouTube under Tools → Data manager.",
    ],
    fill: [
      "Campaign: objective, type, name, budget, bidding, networks, locations, languages.",
      "Ad group: keywords (Search) or products (Shopping).",
      "Ads: headlines (up to 15 × 30 chars), descriptions (up to 4 × 90 chars), final URL, sitelinks, callouts, call and image assets.",
    ],
    get: [
      "Impressions, clicks, CPC, conversions, cost per conversion and conversion value / ROAS per campaign, keyword and search term.",
      "Search terms report: what people really typed.",
      "Auction insights: who you compete with and how often you win.",
    ],
    sections: [
      {
        id: "types",
        title: "Campaign types",
        blocks: [
          {
            kind: "table",
            head: ["Type", "Shows where", "Use for"],
            rows: [
              ["Search", "Text ads on Google results", "Leads and services. You choose keywords."],
              ["Standard Shopping", "Product image, price and store above results and in the Shopping tab", "Selling products when you want control over which products get spend. Needs Merchant Center."],
              ["Performance Max (PMax)", "Everywhere: Search, Shopping, YouTube, Display, Gmail, Maps, Discover", "Once you have conversion data (aim for 30+ conversions in 30 days). Google's AI decides placements."],
              ["Demand Gen", "YouTube, Discover, Gmail", "Visual ads to create demand and retarget."],
              ["Video", "YouTube", "Awareness and reach."],
              ["Display", "Websites in the Google network", "Cheap reach and remarketing."],
            ],
          },
          {
            kind: "table",
            head: ["Standard Shopping", "Performance Max"],
            rows: [
              ["Shopping placements only", "All Google channels from one campaign"],
              ["You control products, bids and negatives", "Google controls most of it; you give assets and signals"],
              ["Works from day one with little data", "Needs conversion data to learn"],
              ["Clear search terms report", "Less visibility (search term insights only)"],
              ["Start here", "Graduate here"],
            ],
          },
        ],
      },
      {
        id: "naming",
        title: "Naming",
        blocks: [
          {
            kind: "p",
            text: "Objective | Product | Country or area. Examples: Sales | Cookie tins | Bangalore, Leads | Corporate gifting | India, Sales | All products | PMax | India. The same pattern for ad groups (product or keyword theme) keeps reports readable a year later.",
          },
        ],
      },
      {
        id: "bidding",
        title: "Bidding strategies",
        blocks: [
          {
            kind: "table",
            head: ["Strategy", "What Google does", "When"],
            rows: [
              ["Manual CPC", "You set the maximum per click, per keyword or product.", "Testing, very small budgets, full control."],
              ["Maximize clicks", "Gets as many clicks as the budget allows. Optional max CPC cap.", "New account with no conversion data, to collect traffic."],
              ["Maximize conversions", "Gets as many conversions as possible for the budget.", "Leads, once conversion tracking works."],
              ["Target CPA", "Aims for an average cost per lead you choose.", "15–30+ conversions a month and a known lead value."],
              ["Maximize conversion value", "Most revenue for the budget.", "Sales with purchase values tracked."],
              ["Target ROAS", "Aims for revenue ÷ spend you choose (e.g. 400% = ₹4 back per ₹1).", "Steady sales data. Set it near what you already achieve, then raise it slowly."],
            ],
          },
          {
            kind: "tip",
            text: "Typical path: Maximize clicks or Manual CPC → Maximize conversions or value once conversions come in → tCPA / tROAS → PMax at 30 conversions in 30 days. Give each change 1–2 weeks of learning before judging it.",
          },
        ],
      },
      {
        id: "budget",
        title: "Daily budget and networks",
        blocks: [
          {
            kind: "list",
            items: [
              "The daily budget is an average. Google can spend up to 2× it on a busy day, but never more than 30.4× it in a calendar month.",
              "Monthly budget ÷ 30.4 = daily budget.",
              "Search network checkbox, “Include Google search partners”: other search sites. Usually cheaper, sometimes lower quality. Turn it off at first if the budget is tight.",
              "“Include Google Display Network” on a Search campaign: turn it off. It mixes cheap banner clicks into search results.",
              "Location option: “Presence: people in or regularly in your targeted locations”, not “interest in”, for a local business.",
            ],
          },
        ],
      },
      {
        id: "quality",
        title: "Keywords, Ad Rank and Quality Score",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "Broad match", meaning: "keyword: related searches too. Pair it with Smart Bidding." },
              { term: "Phrase match", meaning: "\"keyword\": searches that include the meaning of the phrase." },
              { term: "Exact match", meaning: "[keyword]: the same meaning, closest control." },
              { term: "Negative keyword", meaning: "Searches you never want to pay for (free, recipe, jobs)." },
              { term: "Quality Score (1–10)", meaning: "Expected CTR + ad relevance + landing page experience, per keyword." },
              { term: "Ad Rank", meaning: "Decides your position and whether you show: bid × quality, plus assets and context. A better ad can beat a higher bid." },
            ],
          },
        ],
      },
      {
        id: "diagnose",
        title: "Reading a campaign that isn't working",
        blocks: [
          {
            kind: "table",
            head: ["Symptom", "Likely cause", "Fix"],
            rows: [
              ["No impressions", "Ads disapproved, budget or bid too low, keywords too narrow, products disapproved in Merchant Center, billing problem.", "Check policy status and diagnostics, raise bids, broaden match types."],
              ["Impressions, no clicks", "Ad or price not appealing, low position.", "Better headlines, price, images and promotions; check position."],
              ["Clicks, no add-to-cart", "Landing page mismatch, slow page, price shock.", "Send to the exact product, speed up the page, show trust and delivery info."],
              ["Add-to-cart, no purchase", "Shipping cost surprise, checkout friction, payment fails.", "Show shipping early, guest checkout, UPI and COD, fix errors."],
              ["Low conversion rate", "Wrong traffic.", "Search terms report → add negatives; tighten locations."],
            ],
          },
        ],
      },
    ],
    links: [
      { label: "Bidding strategies", url: "https://support.google.com/google-ads/answer/2472725" },
      { label: "Budgets", url: "https://support.google.com/google-ads/answer/2375420" },
      { label: "Performance Max", url: "https://support.google.com/google-ads/answer/10724817" },
      { label: "Quality Score", url: "https://support.google.com/google-ads/answer/6167118" },
      { label: "Keyword match types", url: "https://support.google.com/google-ads/answer/7478529" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "merchant-center",
    label: "Merchant Center",
    group: "Paid",
    blurb:
      "Where products live for Google: the feed behind Shopping ads, free listings, and price and stock in search results.",
    connect: [
      "merchants.google.com with the same Google account as Ads.",
      "Business info: name, address, customer service contact. Verify and claim the website (via the Google tag, Search Console or a DNS record).",
      "Add products: the Shopify “Google & YouTube” app, the WooCommerce “Google for WooCommerce” plugin, a Google Sheet, or automatically from your site's structured data.",
      "Set shipping and returns in Settings. This also fixes the structured data warnings.",
      "Link to Google Ads (Settings → Apps and services), and to GA4.",
    ],
    fill: [
      "Per product: id, title, description, link, image link, price, availability, brand, condition, and GTIN where one exists (otherwise identifier_exists = no).",
      "Shipping rates and delivery times per region; return window and conditions.",
      "Optional custom labels (bestseller, high-margin, seasonal) to split products in campaigns.",
    ],
    get: [
      "Free listings on the Shopping tab and Google Images.",
      "Products available to Shopping and PMax campaigns.",
      "Diagnostics: which products are disapproved and why; price competitiveness and best sellers reports.",
    ],
    sections: [
      {
        id: "segment",
        title: "Segmenting products",
        blocks: [
          {
            kind: "list",
            items: [
              "Split into product groups by category, brand, item ID or custom label, so best sellers get more budget than slow movers.",
              "Custom labels (0–4) are yours to define: margin band, season, price band, best seller. Set them in the feed.",
              "Titles matter most: put what people search first (“Chocolate chunk cookie tin – 12 pcs, eggless”).",
              "Use a white or clean background, no watermark or promo text on the main image.",
            ],
          },
        ],
      },
    ],
    links: [
      { label: "Merchant Center help", url: "https://support.google.com/merchants" },
      { label: "Product data specification", url: "https://support.google.com/merchants/answer/7052112" },
      { label: "Shipping and returns setup", url: "https://support.google.com/merchants/answer/14567150" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "meta-ads",
    label: "Meta ads",
    group: "Paid",
    blurb:
      "Facebook and Instagram ads: Pixel, the three levels of a campaign, audiences, creatives and the numbers to watch.",
    connect: [
      "business.facebook.com → create a Business portfolio. Add the Facebook Page, Instagram account and an ad account (INR, India time zone).",
      "Events Manager → Connect data → Web → Meta Pixel. Install on the site and add the Conversions API (server-side) so iOS and blocked browsers still count.",
      "Verify the domain under Brand safety → Domains.",
      "Add a payment method under Billing.",
    ],
    fill: [
      "Campaign: objective (Sales, Leads, Traffic, Engagement, Awareness, App promotion), Advantage campaign budget on/off.",
      "Ad set: conversion location (website, WhatsApp, instant form, call), the event to optimise for, budget and schedule, audience, placements.",
      "Ad: format, 2+ primary texts, 2+ headlines, images or videos, destination URL with UTM parameters.",
    ],
    get: [
      "Results, cost per result, CPM, CTR (link), CPC, frequency, ROAS (purchase value ÷ spend).",
      "Breakdowns by age, gender, placement and region.",
    ],
    sections: [
      {
        id: "structure",
        title: "Structure and strategy",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "Campaign", meaning: "The goal. One objective per campaign." },
              { term: "Ad set", meaning: "Who, where, when and how much. Test audiences here." },
              { term: "Ad", meaning: "The creative. Test images, videos and texts here." },
              { term: "Advantage campaign budget", meaning: "Meta moves the budget between ad sets to whichever performs." },
              { term: "Advantage+ audience", meaning: "Meta finds the audience; your interests act only as suggestions." },
              { term: "Dynamic / flexible creative", meaning: "Upload several images, texts and headlines; Meta mixes them and shows the winners more." },
              { term: "Frequency", meaning: "Average times each person saw the ad. Above about 3–4 a week, people get tired of it." },
              { term: "Click-to-WhatsApp ad", meaning: "The ad opens a WhatsApp chat. Opens a free 72-hour messaging window on the WhatsApp API." },
            ],
          },
          {
            kind: "list",
            items: [
              "Creative angles that work: problem and solution, them vs us, statistics, testimonials, features pointed out, benefits overlay, founder's story, unboxing, before and after, 3 reasons why.",
              "Test a few creatives in one ad set, keep the winners, and put them into a new dynamic creative ad.",
              "Don't edit a live ad set every day. Each edit restarts learning (about 50 results a week to exit learning).",
            ],
          },
        ],
      },
    ],
    links: [
      { label: "Meta Pixel setup", url: "https://www.facebook.com/business/help/952192354843755" },
      { label: "Conversions API", url: "https://developers.facebook.com/docs/marketing-api/conversions-api" },
      { label: "Ads Manager guide", url: "https://www.facebook.com/business/ads-guide" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "leads-whatsapp",
    label: "Leads, WhatsApp & email",
    group: "Reach",
    blurb:
      "Always collect a phone number or email. In India, follow up on WhatsApp; use email for receipts, newsletters and B2B.",
    connect: [
      "WhatsApp Business app: free, on one phone plus up to 4 linked devices. Fine to start.",
      "WhatsApp Business Platform (Cloud API): developers.facebook.com → create an app → add the WhatsApp product, inside your Meta Business portfolio. Verify the business, add a phone number and a display name, and create a permanent System User token. Or go through a BSP (Interakt, AiSensy, Wati, Gupshup) who handles it for a fee.",
      "Coexistence: connect the number you already use in the Business app to the API without losing the app.",
      "Email: Google Workspace for 1-to-1. For newsletters, a sending service (Brevo, Mailchimp, Amazon SES, Resend) with SPF, DKIM and DMARC set at the domain.",
    ],
    fill: [
      "On every form: name and phone (with +91), optional email, and a tick box for WhatsApp updates (consent).",
      "WhatsApp templates: category (Marketing, Utility, Authentication), language, body with {{1}} variables, buttons. Meta approves each one.",
      "Business profile: description, address, hours, website, catalogue.",
    ],
    get: [
      "A list of reachable people you own, which ad platforms can't take away.",
      "Read rates far above email in India, replies in the same thread, and catalogue and payments inside the chat.",
    ],
    sections: [
      {
        id: "lead",
        title: "What a lead is",
        blocks: [
          {
            kind: "p",
            text: "A lead is someone who gave you a way to reach them but hasn't bought yet: a name plus a phone number or email. Leads matter most where buying takes weeks (property, insurance, cars, education, B2B software, our own software projects). There the funnel is visitor → lead → qualified lead → customer, and ads are optimised for the lead because the sale is months away. For a cookie shop that sells on the spot, optimise for purchases instead, but still collect numbers at checkout for repeat orders.",
          },
        ],
      },
      {
        id: "app-vs-api",
        title: "Business app vs API",
        blocks: [
          {
            kind: "table",
            head: ["", "Business app", "Business Platform (API)"],
            rows: [
              ["Cost", "Free", "Per delivered template message; replies within 24 h are free"],
              ["Users", "1 phone + 4 linked devices", "Unlimited agents through a CRM or inbox"],
              ["Bulk messaging", "Broadcast lists, only to people who saved your number", "Templates to anyone who opted in, at scale"],
              ["Automation", "Greeting and away messages, quick replies", "Chatbots, order updates, triggers from the website"],
              ["Green tick", "No", "Possible (Meta Verified or official business account)"],
            ],
          },
        ],
      },
      {
        id: "pricing",
        title: "API pricing (per message since 1 July 2025)",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "Marketing template", meaning: "Offers, launches, reminders to buy. Charged every time it's delivered, the most expensive category." },
              { term: "Utility template", meaning: "Order confirmed, shipped, payment received. Charged outside the 24 h window; free inside it." },
              { term: "Authentication template", meaning: "One-time passwords. Charged outside the window." },
              { term: "Service message", meaning: "Any free-form reply within 24 hours of the customer's last message. Free." },
              { term: "Free entry point", meaning: "A chat started from a Click-to-WhatsApp ad or Facebook Page button opens 72 hours where everything is free." },
            ],
          },
          {
            kind: "tip",
            text: "India: INR billing is available since 1 January 2026. Accounts must move to INR by 31 December 2026 or they stop being able to send from 1 January 2027.",
          },
        ],
      },
      {
        id: "coexistence",
        title: "Coexistence: app and API on one number",
        blocks: [
          {
            kind: "list",
            items: [
              "Keep using the WhatsApp Business app on the phone while a CRM or bot sends through the API on the same number. Messages show in both.",
              "On connecting, up to 180 days of 1-to-1 chat history and your contacts can sync to the API side.",
              "Turned off in the app afterwards: sending to broadcast lists (they become read-only), disappearing messages, view once and live location in 1-to-1 chats.",
              "Groups stay in the app only. The API can't read or send group messages.",
              "Throughput is capped at about 20 messages per second across app and API, plenty for a small business.",
              "Onboarding is done through Meta's Embedded Signup (usually your BSP's “connect existing number” button). Keep the app updated and open it at least every 14 days or the link drops.",
            ],
          },
        ],
      },
      {
        id: "rules",
        title: "Rules that keep the number alive",
        blocks: [
          {
            kind: "list",
            items: [
              "Only message people who opted in, and say what they'll receive.",
              "Give an easy way out (“Reply STOP”), and honour it.",
              "Don't blast the same marketing template to everyone. Blocks and reports lower the quality rating and the daily sending limit.",
              "Gmail is for conversation and receipts. For bulk email, use a proper sender on a subdomain so a spam complaint doesn't hurt your main inbox.",
            ],
          },
        ],
      },
    ],
    links: [
      { label: "WhatsApp pricing", url: "https://developers.facebook.com/docs/whatsapp/pricing" },
      { label: "Cloud API get started", url: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" },
      { label: "Template categories", url: "https://developers.facebook.com/docs/whatsapp/updates-to-pricing/new-template-guidelines" },
      { label: "Gmail sender guidelines", url: "https://support.google.com/a/answer/81126" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "brand-growth",
    label: "Brand, influencers & ROAS",
    group: "Reach",
    blurb:
      "Logo shapes and brand basics, organic vs paid, running influencers in India, and the money maths: rupees back per rupee spent.",
    connect: [
      "Brand kit: one folder (Drive or Figma) with the logo files (SVG, PNG on light and dark), colours, fonts and tone of voice.",
      "Influencers: Instagram's creator search, Meta's Creator Marketplace, or agencies. Track each with a UTM link and a discount code.",
    ],
    fill: [
      "Logo in square, horizontal and icon-only versions; three colours, each in light, medium and dark.",
      "Influencer brief: product, key message, must-say lines, what not to say, deadline, the #ad disclosure, the link and code.",
      "A sheet of spend vs revenue per channel each month.",
    ],
    get: [
      "A brand people recognise in a crowded feed.",
      "ROAS and cost per order per channel, so money goes where it returns most.",
    ],
    sections: [
      {
        id: "logo",
        title: "Logo types and what shapes say",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "Wordmark", meaning: "The name in a distinctive font (Google, Zomato)." },
              { term: "Lettermark", meaning: "Initials (HP, IBM). Good for long names." },
              { term: "Pictorial", meaning: "A recognisable picture (Apple, Twitter's bird)." },
              { term: "Abstract mark", meaning: "A shape that means nothing until it means you (Nike, Airtel)." },
              { term: "Mascot", meaning: "A character (Amul girl). Warm and friendly, great on social." },
              { term: "Combination", meaning: "Mark plus name, the safest start, and the mark can stand alone later." },
              { term: "Emblem", meaning: "Name inside a badge (Starbucks). Traditional, hard to shrink." },
              { term: "Circles and curves", meaning: "Friendly, community, softness (food, kids, wellness)." },
              { term: "Squares and rectangles", meaning: "Stable, reliable, solid (finance, construction, software)." },
              { term: "Triangles", meaning: "Direction, energy, growth (sport, tech, ambition)." },
              { term: "Vertical lines", meaning: "Strength; horizontal lines read as calm." },
            ],
          },
          {
            kind: "tip",
            text: "Test the logo at 32 px (a favicon or WhatsApp avatar) and in one colour. If it isn't recognisable there, simplify it.",
          },
        ],
      },
      {
        id: "organic-paid",
        title: "Organic vs advertising",
        blocks: [
          {
            kind: "table",
            head: ["", "Organic", "Advertising"],
            rows: [
              ["Cost", "Time and content, no media spend", "Pay per click, view or result"],
              ["Speed", "Months to build", "Traffic the same day"],
              ["When you stop", "Keeps working for a while", "Stops the moment you stop paying"],
              ["Examples", "SEO, Google Business Profile, Instagram posts and reels, WhatsApp community, YouTube", "Google Ads, Meta ads, YouTube ads, influencer posts you pay for"],
              ["Best use", "Trust and a base that grows", "Testing offers fast and scaling what works"],
            ],
          },
        ],
      },
      {
        id: "influencer",
        title: "Influencer marketing",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "Nano (1K–10K followers)", meaning: "Cheapest, often paid in product. High trust in a small local circle." },
              { term: "Micro (10K–100K)", meaning: "The sweet spot for most small brands: niche and engaged." },
              { term: "Macro (100K–1M)", meaning: "Reach for launches; check that the audience fits." },
              { term: "Mega (1M+)", meaning: "Awareness only; hard to make the numbers work for a small brand." },
            ],
          },
          {
            kind: "steps",
            items: [
              "Choose by audience, not follower count: city, age, and real comments (not just emojis). Ask for an Insights screenshot.",
              "Agree deliverables in writing: format (reel, story, post), number, dates, usage rights, payment terms.",
              "Disclosure is required in India (ASCI guidelines and the Consumer Protection Act): #ad, #collab or #sponsored, visible at the start, not buried in hashtags.",
              "Give each creator a UTM link and a unique code. Pay a fixed fee plus a bonus on sales where you can.",
              "Turn the best creator content into ads (Partnership ads on Meta). That usually beats the original post.",
            ],
          },
        ],
      },
      {
        id: "roas",
        title: "The money maths",
        blocks: [
          {
            kind: "terms",
            items: [
              { term: "ROAS (return on ad spend)", meaning: "Revenue from ads ÷ ad spend. ₹40,000 sales from ₹10,000 spend = 4×, or ₹4 back per rupee." },
              { term: "Break-even ROAS", meaning: "1 ÷ gross margin. At a 40% margin, you need 2.5× just to not lose money on the ads." },
              { term: "ROI", meaning: "Profit after all costs ÷ total cost. ROAS ignores product cost and overheads; ROI doesn't." },
              { term: "CPA / CAC", meaning: "Spend ÷ customers gained. What one new customer costs you." },
              { term: "CPL", meaning: "Cost per lead. For services, multiply by your lead-to-customer rate to get CAC." },
              { term: "AOV", meaning: "Average order value. Raising it (hampers, combos, free delivery above ₹999) makes every channel cheaper." },
              { term: "LTV", meaning: "Profit from a customer over all their orders. If people reorder, you can afford a higher CAC." },
            ],
          },
        ],
      },
    ],
    links: [
      { label: "ASCI influencer guidelines", url: "https://www.ascionline.in/the-asci-code/guidelines/" },
      { label: "Meta partnership ads", url: "https://www.facebook.com/business/help/1191451628266279" },
    ],
  },
];

export const noteTopic = (id: string) =>
  MARKETING_NOTES.find((t) => t.id === id);
