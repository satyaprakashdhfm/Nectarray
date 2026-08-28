# NectArray

Marketing site for NectArray — a single-page studio site covering the four
practices: growth marketing, software engineering, agentic AI, and the
Academy.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · static,
front-end only.

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
├── app/
│   ├── globals.css        Design tokens, utilities, reveal animation
│   ├── layout.tsx         Fonts, metadata, <html> shell
│   ├── page.tsx           Section order for the one page
│   ├── robots.ts          → /robots.txt
│   ├── sitemap.ts         → /sitemap.xml
│   ├── icon.png           Favicon (Next serves it automatically)
│   └── apple-icon.png     iOS home-screen icon
├── components/
│   ├── layout/            Header, Footer, Logo, SectionRail, SectionBar
│   ├── sections/          One file per page section, in page order
│   └── ui/                Button, Icon, Reveal, SectionHead
├── hooks/                 useActiveSection, useInView, useHasScrolled,
│                          useLockBodyScroll, useEscapeKey
├── lib/
│   ├── content/           ALL site copy (see below)
│   ├── seo.ts             Canonical URL + JSON-LD structured data
│   └── utils.ts           cn() class-name helper
└── types/                 Shared content shapes
scripts/
├── prepare-brand-assets.cjs   Logo → transparent PNGs, favicons  (npm run brand)
└── generate-og.cjs            Renders the social card            (npm run og)
public/
├── fonts/                 Brand fonts — see fonts/README.md
├── og.png                 1200×630 social/search preview card
├── logo.png               Full lockup (transparent)
├── logo-mark.png          Circuit mark only (transparent)
├── logo-square.png        512px mark on ivory — Organization schema logo
└── logo-source.jpg        Original supplied artwork
```

### Section index

`sectionRail` in `src/lib/content/site.ts` is the single list behind both the
desktop side rail and the mobile section bar, and it doubles as the scroll-spy
list — so each `href` must match the `id` on the corresponding `<section>`. Add
a section there and both navigations pick it up.

### Editing copy

**Every word on the site lives in `src/lib/content/`.** Components never
hard-code marketing text, so content edits do not touch component code.

| File            | Holds                                                    |
| --------------- | -------------------------------------------------------- |
| `site.ts`       | Company details, nav, hero, trust chips, tech marquee    |
| `practices.ts`  | The four practice cards + marketing, software, AI detail |
| `academy.ts`    | The Academy and the Python/SQL/Data Science cohort       |
| `engagement.ts` | Process, work, testimonials, pricing, FAQs, contact      |

Everything is typed against `src/types`, so a missing field is a build error
rather than a blank space on the page.

## Design system

Tokens are defined once in the `@theme` block of `src/app/globals.css` and
consumed as Tailwind utilities (`bg-canvas`, `text-ink-soft`, `border-line`).

The palette is sampled from the logo: `--color-brand` is the mark's circuit
blue, `--color-leaf` its green, `--color-amber` its radiating rays. The
`ink-gradient` utility paints headline accent words with the green-to-blue
wordmark gradient.

Custom utilities worth knowing: `shell` (page gutter), `display` /
`display-serif` (the two headline voices), `card` / `card-hover`,
`grid-paper`, `eyebrow`, `lede`.

## Motion and accessibility

- Scroll reveals use `IntersectionObserver` + a CSS keyframe, not a motion
  library.
- Content is **never** hidden behind JavaScript: the hiding rule is scoped to
  `[data-reveal="on"]`, a flag the layout sets only when the observer exists.
  No JS, or an old browser, means everything simply renders visible.
- `prefers-reduced-motion` disables reveals and the marquees.
- Native `<details>` powers the FAQ, so it works keyboard-only and without JS.

## Known gaps before launch

- **Testimonials are placeholders.** `engagement.ts` attributes them to
  "Client name" / "Student name". Replace with real, attributable quotes or
  delete `<Testimonials />` from `src/app/page.tsx`.
- **Contact details are placeholders** — `company.phone`, `calendarUrl` and
  the social URLs in `site.ts` all need real values.
- **The contact form has no backend.** It composes a `mailto:` and hands off
  to the visitor's mail client. To use a real endpoint, replace `handleSubmit`
  in `src/components/sections/Contact.tsx` with a POST — the markup is
  unchanged.
- **Prices are indicative** and should be confirmed before publishing.

## Deploying to Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). The
framework preset, build command and output directory are all detected
automatically — no configuration needed, and there are no environment
variables.

Add your domain under **Project → Settings → Domains**, then point the
registrar at Vercel (an `A` record to `76.76.21.21` for the apex, and a
`CNAME` to `cname.vercel-dns.com` for `www`; Vercel shows the exact values
for your domain). Update `siteUrl` in `src/lib/seo.ts` to the live domain so
canonical URLs and structured data are correct.

## Search and social

Everything a crawler reads is generated from `src/lib/content` — no duplicated
copy to keep in sync.

- `/robots.txt` and `/sitemap.xml` are generated routes (`src/app/robots.ts`,
  `src/app/sitemap.ts`).
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
