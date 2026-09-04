# NectArray

Marketing site for NectArray, covering the four practices: growth marketing,
software engineering, agentic AI, and the Academy. One route per practice,
plus engagements and contact.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Statically
rendered apart from one route handler for the contact form.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script                 | What it does               |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server with hot reload |
| `npm run build`        | Production build           |
| `npm start`            | Serve the production build |
| `npm run lint`         | ESLint                     |
| `npm run typecheck`    | `tsc --noEmit`             |
| `npm run format`       | Prettier write             |
| `npm run format:check` | Prettier check (use in CI) |

## Project structure

```
src/
├── app/                        One folder per route (App Router)
│   ├── layout.tsx              Fonts, metadata, analytics, <html> shell
│   ├── page.tsx                Home — hero, practices, CTA
│   ├── not-found.tsx           404
│   ├── globals.css             Design tokens, utilities, reveal animation
│   ├── robots.ts               → /robots.txt
│   ├── sitemap.ts              → /sitemap.xml
│   ├── icon.png                Favicon (Next serves it automatically)
│   ├── apple-icon.png          iOS home-screen icon
│   ├── api/contact/route.ts    Contact form endpoint (Resend)
│   ├── marketing/page.tsx
│   ├── software/page.tsx
│   ├── agentic-ai/page.tsx     Long-form service page, dark treatment
│   ├── academy/page.tsx
│   ├── engagements/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/                 Header, Footer, Logo, PageCta
│   ├── sections/               One file per content block, reused across routes
│   └── ui/                     Button, Icon, Reveal, SectionHead
├── hooks/                      useInView, useLockBodyScroll, useEscapeKey
├── lib/
│   ├── analytics.ts            GA4 + GTM ids, trackEvent
│   ├── content/                ALL site copy (see below)
│   ├── seo.ts                  Canonical URL, JSON-LD, pageMetadata()
│   └── utils.ts                cn() class-name helper
└── types/                      Shared content shapes
scripts/
├── prepare-brand-assets.cjs    Logo → transparent PNGs, favicons  (npm run brand)
└── generate-og.cjs             Renders the social card            (npm run og)
public/
├── fonts/                      Brand fonts — see fonts/README.md
├── og.png                      1200×630 social/search preview card
├── logo.png                    Full lockup (transparent)
├── logo-mark.png               Circuit mark only (transparent)
├── logo-square.png             512px mark on ivory — Organization schema logo
└── logo-source.jpg             Original supplied artwork
```

### Routes

| Route          | Content                                                   |
| -------------- | --------------------------------------------------------- |
| `/`            | Hero, the four practice cards, closing CTA                |
| `/marketing`   | Growth & marketing channels                               |
| `/software`    | Software & web services, default stack                    |
| `/agentic-ai`  | Long-form: 5 capability families, MCP servers, evals, FAQ |
| `/academy`     | The Python, SQL & data science cohort                     |
| `/engagements` | Three engagement models + the four-step process           |
| `/contact`     | Contact form + FAQ                                        |

### Sections as pages

Section components under `components/sections/` are written to work in two
places: as one of several blocks on a page, and as the whole body of their own
route. Passing `asPage` promotes the section's heading to that page's `<h1>` —
the only structural difference. The offset for the fixed header lives on
`<main>`, so the section keeps its own vertical rhythm in both positions.

### Editing copy

**Every word on the site lives in `src/lib/content/`.** Components never
hard-code marketing text, so content edits do not touch component code.

| File            | Holds                                                    |
| --------------- | -------------------------------------------------------- |
| `site.ts`       | Company details, nav, hero, trust chips, tech marquee    |
| `practices.ts`  | The four practice cards + marketing, software, AI detail |
| `academy.ts`    | The Academy and the Python/SQL/Data Science cohort       |
| `engagement.ts` | Process, testimonials, pricing, FAQs, contact            |

Everything is typed against `src/types`, so a missing field is a build error
rather than a blank space on the page.

## Design system

Tokens are defined once in the `@theme` block of `src/app/globals.css` and
consumed as Tailwind utilities (`bg-canvas`, `text-ink-soft`, `border-line`).

The palette is sampled from the logo: `--color-brand` is the mark's circuit
blue, `--color-leaf` its green, `--color-amber` its radiating rays, and
`--color-teal` the midpoint of the wordmark gradient. Four accents for four
practices — each one owns a card rule, icon chip, tag pill and hover colour,
in that order.

Each accent has three tones. Use `-deep` for anything carrying text or a
glyph: the display tones sit around 2.5:1 against white and fail as
foregrounds. Use `-wash` for tinted grounds.

`ink-gradient` paints headline accent words with the wordmark gradient;
`brand-band` is the same gradient as a _surface_, at darker stops that clear
5.8:1 against white body copy.

**Vertical rhythm.** The page alternates ground deliberately: night header →
tinted hero → night marquee → recessed practices → white CTA → night footer.
Header and footer are one flat colour on every route, so nothing about them
changes page to page. The CTA stays light on purpose: a full-colour band there
sat directly above the night footer and the two heavy surfaces fought.

Custom utilities worth knowing: `shell` (page gutter), `display` /
`display-serif` (the two headline voices), `card` / `card-hover`,
`grid-paper`, `brand-band`, `eyebrow`, `lede`.

## Motion and accessibility

- Scroll reveals use `IntersectionObserver` + a CSS keyframe, not a motion
  library.
- Content is **never** hidden behind JavaScript: the hiding rule is scoped to
  `[data-reveal="on"]`, a flag the layout sets only when the observer exists.
  No JS, or an old browser, means everything simply renders visible.
- `prefers-reduced-motion` disables reveals and the marquees.
- Native `<details>` powers the FAQ, so it works keyboard-only and without JS.

## Known gaps before launch

- **Testimonials are hidden.** The quotes in `engagement.ts` are placeholders
  attributed to "Client name" / "Student name", so `<Testimonials />` is
  commented out of the routes. Replace them with real, attributable
  quotes and restore the import and the one line to bring the section back —
  the component and its styling are untouched.
- **Contact details** — `company.phone` and `company.email` in `site.ts` are
  real. Of the four social profiles only LinkedIn is `live: true`; Instagram
  and X do not exist yet, and the GitHub org is deliberately unlinked because
  client work is private. `live: false` keeps a profile out of both the footer
  and `sameAs`.
- **No prices are published.** The engagement cards describe how we work, not
  what it costs; quotes go out after the discovery call.

## Contact form

`src/app/api/contact/route.ts` posts enquiries to Resend's REST API — one
`fetch`, no SDK dependency. On a confirmed 200 the client fires a
`generate_lead` GA4 event, so the event counts delivered enquiries rather than
attempted submissions, which is what makes it usable as an ads conversion.

Environment variables, set in Vercel → Settings → Environment Variables:

| Variable             | Required | Notes                                                                                                                       |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_KEY`         | yes      | From resend.com/api-keys                                                                                                    |
| `CONTACT_FROM_EMAIL` | no       | Must be on a domain verified in Resend. Defaults to Resend's `onboarding@resend.dev`, which only sends to the account owner |
| `CONTACT_TO_EMAIL`   | no       | Defaults to `company.email`                                                                                                 |

Until `nectarray.com` is verified in Resend (Domains → Add → add the DKIM
records to Hostinger alongside the existing Zoho ones), leave
`CONTACT_FROM_EMAIL` unset. Failures are logged server-side prefixed
`[contact]` with Resend's own explanation, visible in the Vercel function logs.

## Deploying to Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). The
framework preset, build command and output directory are all detected
automatically. The only configuration is `RESEND_KEY` for the contact
form — see **Contact form** above.

Add your domain under **Project → Settings → Domains**, then point the
registrar at Vercel (an `A` record to `76.76.21.21` for the apex, and a
`CNAME` to `cname.vercel-dns.com` for `www`; Vercel shows the exact values
for your domain). Update `siteUrl` in `src/lib/seo.ts` to the live domain so
canonical URLs and structured data are correct.

## Search and social

Everything a crawler reads is generated from `src/lib/content` — no duplicated
copy to keep in sync.

- `/robots.txt` and `/sitemap.xml` are generated routes (`src/app/robots.ts`,
  `src/app/sitemap.ts`); the sitemap lists every route.
- Sub-page metadata goes through `pageMetadata()` in `lib/seo.ts`, so canonical
  URLs and Open Graph tags stay consistent across routes.
- **Canonical URL** is `siteUrl` in `src/lib/seo.ts`. It must match whichever
  host Vercel serves as primary. Both the apex and `www` resolve, but only one
  can be canonical — pointing canonical tags at the host that 308-redirects
  splits ranking signals between the two.
- **JSON-LD** (`buildStructuredData`) emits Organization, WebSite, WebPage, a
  SiteNavigationElement list of the page sections, the Course, and the FAQ.
  The `logo` on the Organization node is what Google reads to show a brand
  image beside a result; a favicon alone will not do it.
- **Social card** is `public/og.png`, referenced from `openGraph` and `twitter`
  metadata.

### Regenerating brand assets

```bash
npm run brand   # logo → transparent PNGs, favicon, apple icon, schema logo
npm run og      # social card; needs `npm i -D playwright` first
```

Both read `public/logo-source.jpg`, so replacing that file and re-running is
all it takes to rebrand.

### Getting indexed

New domains are not in Google's index by default, and nothing in the code can
change that — it needs a one-time submission:

1. Add the property at [Google Search Console](https://search.google.com/search-console)
   (pick **Domain** and verify with the DNS TXT record Hostinger will accept).
2. Paste the URL into **URL Inspection** → **Request indexing**.
3. Submit `https://nectarray.com/sitemap.xml` under **Sitemaps**.
4. Create a [Google Business Profile](https://business.google.com) — this is
   what produces a logo, map entry and contact details in branded searches.

Expect a few days for the listing to appear and longer for sitelinks, which
Google generates on its own once a site has enough traffic and structure.

If you verify by HTML tag instead of DNS, set
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel's environment variables and
redeploy; the meta tag is emitted only when that variable is present.
