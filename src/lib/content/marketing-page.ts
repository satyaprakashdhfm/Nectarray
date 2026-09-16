/**
 * The growth & marketing practice page.
 *
 * Separate from the `marketing` object in practices.ts, which is the channel
 * cards shared with the homepage and the Service list in the JSON-LD. This is
 * the long-form page built around them.
 */
import type { IconCard, Link } from "@/types";
import type { Brand } from "./practices";

/**
 * A service tile. `domain` only where the service is itself a product —
 * the tile then shows that product's mark instead of a lucide glyph, and
 * the ones that are disciplines rather than brands keep the glyph.
 */
type Tile = IconCard & { domain?: string };

/**
 * One move in the loop under the hero.
 *
 * `services` is the point of the thing: the channel cards used to sit in one
 * flat grid, so Meta Ads and content management read as the same kind of
 * work. Here each platform hangs off the stage it actually belongs to, and
 * `anchor` points at the section further down that covers it properly.
 */
type LoopStage = {
  n: string;
  icon: string;
  title: string;
  short: string;
  lede: string;
  anchor: string;
  services: { title: string; body: string; logos?: Brand[] }[];
};

export const marketingPage: {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline: [string, string];
    lede: string;
    panel: { badge: string; lines: [string, string] };
    primaryCta: Link;
    secondaryCta: Link;
    stats: { value: string; label: string }[];
  };
  loop: {
    eyebrow: string;
    title: string;
    lede: string;
    caption: string;
    stages: LoopStage[];
  };
  find: { eyebrow: string; title: string; lede: string; items: Tile[] };
  content: { eyebrow: string; title: string; lede: string; items: Tile[] };
  measure: { eyebrow: string; title: string; lede: string; items: Tile[] };
  cta: { title: string; body: string; primary: Link; secondary: Link };
} = {
  meta: {
    title:
      "Growth marketing — paid social, Google Ads and SEO, marketplace and WhatsApp, content and measurement",
    description:
      "Meta, Google, YouTube, LinkedIn, marketplace and WhatsApp advertising, the video, images and writing that make them work, and marketing mix modelling to say which of them moved revenue. Plus tracking what ChatGPT, Gemini, Perplexity and Google's AI answers say about you.",
  },

  hero: {
    eyebrow: "Growth & Marketing",
    headline: ["Demand, not just", "impressions."],
    lede: "Ads on every platform that can send you a customer, the video and writing that make them work, and one honest read on which of them moved revenue. Starting with the newest question nobody has a playbook for: what an assistant says when someone asks it about a business like yours.",
    /** Overlaid on the hero panel, the way /academy badges its card. */
    panel: {
      badge: "The channel map",
      lines: ["Every channel.", "Measured properly."] as [string, string],
    },
    primaryCta: { label: "Get a plan", href: "/contact#enquiry" },
    secondaryCta: { label: "See the channels", href: "#run" },
    stats: [
      { value: "7", label: "Channels run in-house" },
      { value: "20+", label: "Platforms and consoles" },
      { value: "4", label: "Practices under one roof" },
    ],
  },

  loop: {
    eyebrow: "How the work runs",
    title: "It runs as a loop, not a launch",
    lede: "Four moves, in this order, every month. The last one decides what the first one looks for next time, which is the only reason any of it improves.",
    caption: "Then it starts again — this month's numbers set next month's plan.",
    stages: [
      {
        n: "01",
        icon: "search",
        title: "See where they find you",
        short: "Watch",
        lede: "Before anything is made or bought: where the people who buy from you actually look you up, and what they are told when they get there. We ask those places the questions your buyers ask, on a schedule, and keep the answers so the change is visible.",
        anchor: "#watch",
        services: [
          {
            title: "AI assistants",
            body: "What ChatGPT, Gemini and Perplexity say when someone asks them to recommend a business like yours.",
            logos: [
              { name: "ChatGPT", domain: "openai.com" },
              { name: "Gemini", domain: "gemini.google.com" },
              { name: "Perplexity", domain: "perplexity.ai" },
            ],
          },
          {
            title: "Google Search & AI Overviews",
            body: "Where you rank, whether the summary above the results mentions you, and who holds the map pack.",
            logos: [
              { name: "Google", domain: "google.com" },
              { name: "Search Console", domain: "search.google.com" },
            ],
          },
          {
            title: "YouTube search",
            body: "What comes up when your category is searched there — and which competitor is answering it instead of you.",
            logos: [{ name: "YouTube", domain: "youtube.com" }],
          },
          {
            title: "Instagram & Facebook",
            body: "What the search tab returns for your name and your category, and what the feed already serves that audience.",
            logos: [
              { name: "Instagram", domain: "instagram.com" },
              { name: "Facebook", domain: "facebook.com" },
            ],
          },
        ],
      },
      {
        n: "02",
        icon: "notebook",
        title: "Make the content",
        short: "Make",
        lede: "The half that makes the ads work. Scripted, shot, edited and written here, in the four shapes that actually get used — and cut to suit each place they run rather than resized to fit.",
        anchor: "#make",
        services: [
          {
            title: "Short videos",
            body: "Reels, Shorts and the ad cuts from them: made to be watched with the sound off and the thumb moving.",
          },
          {
            title: "Long videos",
            body: "Explainers, demos and customer stories — the ones still earning search traffic two years later.",
            logos: [{ name: "YouTube", domain: "youtube.com" }],
          },
          {
            title: "Images",
            body: "Posts, carousels, product shots and the ad creative, in enough versions to actually test one against another.",
          },
          {
            title: "Text & articles",
            body: "The pages that answer a real question completely — and the copy carrying every ad and landing page.",
          },
        ],
      },
      {
        n: "03",
        icon: "megaphone",
        title: "Put the ads out",
        short: "Run",
        lede: "Paid media across every console that can send you a customer, plus the organic side of Google that the ads sit on top of. Each one bid to margin rather than to clicks, and none of them run because it is fashionable.",
        anchor: "#run",
        services: [
          {
            title: "Marketplace ads",
            body: "Amazon and Flipkart: sponsored products, listings and catalogue, and the feed that keeps Shopping in step with stock.",
            logos: [
              { name: "Amazon", domain: "amazon.in" },
              { name: "Flipkart", domain: "flipkart.com" },
            ],
          },
          {
            title: "Meta ads",
            body: "Instagram and Facebook — full-funnel structure, creative tested at volume, and the Conversions API.",
            logos: [
              { name: "Instagram", domain: "instagram.com" },
              { name: "Facebook", domain: "facebook.com" },
            ],
          },
          {
            title: "YouTube ads",
            body: "In-stream, in-feed and Shorts, cut from the videos we already shoot for you.",
            logos: [{ name: "YouTube", domain: "youtube.com" }],
          },
          {
            title: "Google SEO",
            body: "The results you do not pay for: technical health, architecture, the pages worth having, local and Maps.",
            logos: [
              { name: "Google", domain: "google.com" },
              { name: "Search Console", domain: "search.google.com" },
            ],
          },
          {
            title: "Google Ads",
            body: "Search, Shopping, Performance Max and Demand Gen, with the keyword and negative hygiene to match.",
            logos: [{ name: "Google Ads", domain: "ads.google.com" }],
          },
          {
            title: "LinkedIn ads",
            body: "For longer B2B cycles: targeting by job and company, and lead-gen that feeds a CRM.",
            logos: [{ name: "LinkedIn", domain: "linkedin.com" }],
          },
          {
            title: "WhatsApp status ads",
            body: "Ads in the Updates tab, and click-to-WhatsApp campaigns that open a chat instead of a form.",
            logos: [
              { name: "WhatsApp Business", domain: "business.whatsapp.com" },
            ],
          },
        ],
      },
      {
        n: "04",
        icon: "chart",
        title: "Model it, then read it",
        short: "Read",
        lede: "Every platform claims the same sale, so the totals never add up. We model the channels together — including the offline and brand spend no pixel ever sees — then put the result somewhere you will actually look, and say plainly what changes. This is the step that sets what 01 goes looking for next month.",
        anchor: "#measure",
        services: [
          {
            title: "Marketing mix modelling",
            body: "What each channel really contributed, once they stop being measured one at a time.",
          },
          {
            title: "Incrementality testing",
            body: "Geo and holdout tests answering the only question that matters: would this sale have happened anyway?",
          },
          {
            title: "Attribution you can defend",
            body: "One model across channels, so Meta and Google stop both claiming the same conversion.",
          },
          {
            title: "GA4 & Tag Manager",
            body: "Set up correctly, with server-side tracking so ad blockers and iOS stop deleting a third of the data.",
            logos: [
              { name: "Google Analytics", domain: "analytics.google.com" },
              { name: "Tag Manager", domain: "tagmanager.google.com" },
            ],
          },
          {
            title: "Dashboards that say something",
            body: "One view of spend, pipeline and revenue, with the model's read on it — not twelve charts and no conclusion.",
          },
          {
            title: "The monthly call",
            body: "What worked, what gets more, what stops — written down, so the next month starts with a plan.",
          },
        ],
      },
    ],
  },

  /* ── 01 ─────────────────────────────────────────────────────────────── */
  find: {
    eyebrow: "Where you get found",
    title: "Where people look you up, and what they are told",
    lede: "Most of the deciding now happens before anyone reaches your site — a question typed into an assistant, a search, a scroll. Each of these places answers from something different: what it can read about you, who else backs it up, what it has already shown that person. We check all eight on a schedule, keep the answers, and work on whichever ones your buyers actually use. The assistants cannot be bought — there is no ad slot inside an answer — so what we do there is groundwork, not a guarantee.",
    items: [
      {
        icon: "search",
        title: "ChatGPT",
        domain: "openai.com",
        body: "We ask it what your buyers ask and log what it says back, then work on what it reads to answer: your own pages, and the third-party sources it leans on when yours are thin.",
      },
      {
        icon: "bot",
        title: "Perplexity",
        domain: "perplexity.ai",
        body: "Citation-led, so it rewards pages that answer precisely and say where the number came from. We write for that, and track which of your pages it actually cites.",
      },
      {
        icon: "sparkles",
        title: "Gemini",
        domain: "gemini.google.com",
        body: "Leans harder on your Business Profile and on sources agreeing with each other, so the fix here is usually consistency across the web rather than more words on the site.",
      },
      {
        icon: "globe",
        title: "Google Search",
        domain: "google.com",
        body: "Still the biggest single source of intent: rankings, technical health, site architecture, the pages worth having, and the local map pack.",
      },
      {
        icon: "layers",
        title: "Google AI Overviews",
        domain: "google.com",
        body: "The summary that now sits above the results and often answers instead of them. It lifts from pages that state one answer plainly, which is a writing problem before it is an SEO one.",
      },
      {
        icon: "video",
        title: "YouTube",
        domain: "youtube.com",
        body: "The search engine people forget is one. We check what comes up for your category, and whether it is you explaining it or somebody selling against you.",
      },
      {
        icon: "image",
        title: "Instagram",
        domain: "instagram.com",
        body: "Both halves of it: what the search tab returns for your name and your category, and what the feed serves that audience while they are only scrolling.",
      },
      {
        icon: "share",
        title: "Facebook",
        domain: "facebook.com",
        body: "Search, groups, Marketplace and the feed — still where a lot of local demand starts, and where your page gets checked before anyone calls you.",
      },
    ],
  },

  /* ── 02 ─────────────────────────────────────────────────────────────── */
  content: {
    eyebrow: "Content",
    title: "The half that makes the ads work",
    lede: "Ads go much further when there is something behind them worth watching or reading, and it keeps working after the spend stops. We make it rather than only planning it — scripts, shoots, editing, graphics and copy — and it comes in four shapes. Most businesses need all four: a short video to be found with, a long one to be believed by, images to carry the offer, and writing that a search engine and an assistant can both read.",
    items: [
      {
        icon: "smartphone",
        title: "Short videos",
        body: "Reels, Shorts and the paid cuts from them — vertical, hook first, built to be watched with the sound off and the thumb already moving.",
      },
      {
        icon: "video",
        title: "Long videos",
        domain: "youtube.com",
        body: "Explainers, demos, walkthroughs and customer stories. The format that still earns search traffic two years later, and the one the shorts get cut from.",
      },
      {
        icon: "image",
        title: "Images",
        body: "Posts, carousels, product and lifestyle shots, and ad creative in enough versions that a test means something rather than being one guess against another.",
      },
      {
        icon: "file",
        title: "Text & articles",
        body: "Pages that answer one real question completely — definitions, comparisons, prices, limits — plus the copy carrying every ad, email and landing page.",
      },
    ],
  },

  /* ── 04 ─────────────────────────────────────────────────────────────── */
  measure: {
    eyebrow: "Measurement & reporting",
    title: "One read on what actually moved revenue",
    lede: "Every ad platform claims the same sale, so the totals never add up. We model the whole mix together, test it against what really happened, and put the answer into one dashboard and one call a month that names what changes. Modelling nobody reads is not measurement, and a dashboard with no model behind it is decoration.",
    items: [
      {
        icon: "chart",
        title: "Marketing mix modelling",
        body: "Models every channel together — including offline and brand spend the pixels never see — to show what each one really contributed.",
      },
      {
        icon: "target",
        title: "Incrementality testing",
        body: "Geo and holdout tests that answer the only question that matters: would this sale have happened anyway?",
      },
      {
        icon: "share",
        title: "Attribution you can defend",
        body: "One model applied across channels, so Meta and Google stop both claiming the same conversion and the totals reconcile.",
      },
      {
        icon: "gauge",
        title: "Budget allocation & forecasting",
        body: "The model turned into a spend plan, with what a 30% increase is likely to return before you commit it — and the uncertainty stated rather than hidden.",
      },
      {
        icon: "database",
        title: "Cohorts, LTV & payback",
        body: "What a customer is worth over time and how long they take to pay back, so acquisition targets come from margin rather than a guess.",
      },
      {
        icon: "plug",
        title: "GA4, Tag Manager & server-side",
        domain: "analytics.google.com",
        body: "Set up correctly the first time: clean events, consent handled, no double counting, and conversions sent server to server so iOS and ad blockers stop deleting a third of your data.",
      },
      {
        icon: "workflow",
        title: "CRO & A/B testing",
        body: "Tests on the pages that carry the revenue — checkout, pricing, the main landing page — not on button colours.",
      },
      {
        icon: "notebook",
        title: "Dashboards & the monthly call",
        body: "One view of spend, pipeline and revenue with the model's read on it, and a call each month on what worked, what gets more and what stops.",
      },
    ],
  },

  cta: {
    title: "Tell us what you are selling.",
    body: "You will get an audit and a written plan naming the channels, the spend and what each one is accountable for — before any retainer, and with a straight answer if we think a channel is not worth your money.",
    primary: { label: "Get a plan", href: "/contact#enquiry" },
    secondary: { label: "See our other practices", href: "/#services" },
  },
};
