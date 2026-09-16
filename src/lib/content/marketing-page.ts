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
 *
 * `shot` is for the few where we can show the thing instead of describing it.
 */
type Tile = IconCard & {
  domain?: string;
  shot?: { src: string; alt: string; width: number; height: number };
};

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
        body: "The same question put to ChatGPT, and a different three businesses come back — named, ranked, pinned on a map, with the rating and whether each is open right now. We ask it what your buyers ask, log what comes back, and work on what it reads to answer: your own pages, and the third-party sources it leans on when yours are thin.",
        shot: {
          src: "/marketing/chatgpt-answer.webp",
          width: 1600,
          height: 800,
          alt: "ChatGPT answering a question about the best cafes in Bengaluru with a map of pinned businesses and a ranked list naming each one and its neighbourhood.",
        },
      },
      {
        icon: "bot",
        title: "Perplexity",
        domain: "perplexity.ai",
        body: "Every line here is footnoted — and look at what it read to write them: two roundup articles, not one cafe's own website. Perplexity rewards pages that answer precisely and say where the figure came from, so the work is both halves: writing yours that way, and being in the third-party lists it actually cites.",
        shot: {
          src: "/marketing/perplexity-sources.webp",
          width: 1600,
          height: 800,
          alt: "Perplexity answering a question about the best cafes in Bengaluru, each claim footnoted, with a sources panel listing the two articles it read.",
        },
      },
      {
        icon: "sparkles",
        title: "Gemini",
        domain: "gemini.google.com",
        body: "Asked for the best cafe in Bengaluru, it names four businesses, rates them, maps them and puts them in an order — and nobody paid for a place on that list. Gemini leans on your Business Profile and on sources that agree with each other, so the work here is consistency across the web rather than more words on your own site.",
        shot: {
          src: "/marketing/gemini-answer.webp",
          width: 1600,
          height: 800,
          alt: "Gemini answering a question about the best cafes in Bengaluru with named businesses, ratings, opening hours and a map of each one.",
        },
      },
      {
        icon: "globe",
        title: "Google Search",
        domain: "google.com",
        body: "Three businesses hold the whole first screen here, and not one of them is a link — they are map listings, with ratings, a price band, a review quote and a route. Winning this is a Business Profile job as much as a website one: categories, hours, photographs, and reviews that say the word somebody searched for.",
        shot: {
          src: "/marketing/google-search-answer.webp",
          width: 1600,
          height: 800,
          alt: "A Google search for the best cafes in Bengaluru, showing a Places pack of three businesses with ratings, prices and review quotes beside a map.",
        },
      },
      {
        icon: "layers",
        title: "Google AI Overviews",
        domain: "google.com",
        body: "Ask the same thing as a question and Google answers it above the results, naming one cafe before anything is clicked. Look at what it cites: Tripadvisor, an Instagram reel, a blog. Being the answer is a writing problem before it is an SEO one — and being in the sources it trusts is a separate job again.",
        shot: {
          src: "/marketing/google-ai-overview.webp",
          width: 1600,
          height: 800,
          alt: "A Google AI Overview naming one cafe as the best in Bengaluru above the results, with Tripadvisor, Instagram and blog sources cited alongside.",
        },
      },
      {
        icon: "video",
        title: "YouTube",
        domain: "youtube.com",
        body: "The search engine everyone forgets is one. The same question here returns a food tour on 430,000 views and a tasting on 63,000 — two and three years old, still ranking, and not one of them made by a cafe. So there are two ways in: be in somebody's video, or shoot one that answers the question better and let it earn for the next three years.",
        shot: {
          src: "/marketing/youtube-search.webp",
          width: 1600,
          height: 800,
          alt: "A YouTube search for the best cafes in Bengaluru returning creator food-tour videos with hundreds of thousands of views, none of them made by a cafe.",
        },
      },
      {
        icon: "image",
        title: "Instagram",
        domain: "instagram.com",
        body: "A hashtag search returns a wall of reels — every tile a video, every one leading with its hook burned into the first frame. That is what being found here means, and it is not a tidy grid of posts on your profile: it is vertical video answering what somebody searched, yours or a creator's, plus what the feed serves that audience while they are only scrolling.",
        shot: {
          src: "/marketing/instagram-search.webp",
          width: 1460,
          height: 730,
          alt: "An Instagram hashtag page for Bengaluru cafes, showing a grid where every tile is a reel with its hook written across the opening frame.",
        },
      },
      {
        icon: "share",
        title: "Facebook",
        domain: "facebook.com",
        body: "Here the first answer is an advert — somebody bought the top of this page for the words somebody else typed. That is the one real difference between this surface and the assistants above it: a place in a Gemini answer cannot be bought, and a place here can. Search, groups, Marketplace and the feed are still where a lot of local demand starts.",
        shot: {
          src: "/marketing/facebook-search.webp",
          width: 1400,
          height: 700,
          alt: "A Facebook search for the best cafe in Bengaluru, where the first result in the list is a paid advert rather than an organic post.",
        },
      },
    ],
  },

  /* ── 02 ─────────────────────────────────────────────────────────────── */
  content: {
    eyebrow: "Content",
    title: "The half that makes the ads work",
    lede: "Ads go much further when there is something behind them worth watching or reading, and it keeps working after the spend stops. We generate it with AI — scripted, made, edited and written here, at a pace and a price a film crew cannot match. Where you already have the real thing, send that instead: your kitchen, your team, your product on a table. We cut the campaign around your footage and make whatever is missing. Most businesses end up with both.",
    items: [
      {
        icon: "smartphone",
        title: "Short videos",
        body: "Reels, Shorts and the paid cuts from them — vertical, hook first, built to be watched with the sound off and the thumb already moving. Generated here from a prompt and a product, or cut from the clips you filmed on a phone, and always in enough versions that one can be tested against another rather than posted and hoped for.",
        shot: {
          src: "/marketing/short-video.webp",
          width: 1600,
          height: 800,
          alt: "One vertical video running as a reel on three phones, one for each of the short-form feeds.",
        },
      },
      {
        icon: "video",
        title: "Long videos",
        domain: "youtube.com",
        body: "Explainers, demos, walkthroughs and customer stories — the format still earning search traffic two years later, and the one the shorts get cut from. If you would rather be the one on camera, you film it and we take the script, the edit, the thumbnail and every short that comes off it.",
        shot: {
          src: "/marketing/long-video.webp",
          width: 1600,
          height: 800,
          alt: "A phone held up showing the YouTube logo, for the long-form half of the work.",
        },
      },
      {
        icon: "image",
        title: "Images",
        body: "Your own photograph on the left, the same one remade on the right — same cafe, same cup, better story. Posts, carousels, product shots and ad creative all work that way: send the picture you already have, or just the product, and the setting, the light and the styling are built around it in enough versions that a test means something.",
        shot: {
          src: "/marketing/images-content.webp",
          width: 1600,
          height: 800,
          alt: "An ordinary photograph of a cafe table beside the same shot remade with AI, labelled original photo and AI-enhanced photo.",
        },
      },
      {
        icon: "file",
        title: "Text & articles",
        body: "Pages that answer one real question completely — definitions, comparisons, prices, limits — plus the copy carrying every ad, email and landing page. Written to be read by a person and quoted by an assistant, which is the same job twice over, and the half of the work that decides whether you turn up in section 01 at all.",
        shot: {
          src: "/marketing/text-articles.webp",
          width: 1600,
          height: 800,
          alt: "A spread of written articles about a city's cafe scene, each with its own headline, standfirst and photograph.",
        },
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
