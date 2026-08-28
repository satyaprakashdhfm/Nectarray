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
│   └── page.tsx           Section order for the one page
├── components/
│   ├── layout/            Header, Footer, Logo
│   ├── sections/          One file per page section, in page order
│   └── ui/                Button, Icon, Reveal, SectionHead
├── hooks/                 useInView, useHasScrolled, useLockBodyScroll, useEscapeKey
├── lib/
│   ├── content/           ALL site copy (see below)
│   ├── seo.ts             JSON-LD structured data
│   └── utils.ts           cn() class-name helper
└── types/                 Shared content shapes
public/
├── fonts/                 Brand fonts — see fonts/README.md
├── logo.png               Full lockup (transparent)
├── logo-mark.png          Circuit mark only (transparent)
└── logo-source.jpg        Original supplied artwork
```

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

## Regenerating the logo assets

`logo-prep.cjs` turns the supplied JPEG (flat white background) into the
transparent PNGs the site uses. Re-run it if the artwork is replaced:

```bash
node logo-prep.cjs
```
