/**
 * The growth & marketing practice page.
 *
 * Separate from the `marketing` object in practices.ts, which is the eight
 * channel cards shared with the homepage and the Service list in the JSON-LD.
 * This is the long-form page built around them.
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
 * `services` is the point of the thing: the eight channel cards used to sit
 * in one flat grid, so Meta Ads and content management read as the same kind
 * of work. Here each platform hangs off the stage it actually belongs to, and
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
  families: { eyebrow: string; title: string; lede: string };
  brand: { eyebrow: string; title: string; lede: string; items: Tile[] };
  aiSearch: {
    eyebrow: string;
    title: string;
    lede: string;
    items: Tile[];
  };
  analytics: { eyebrow: string; title: string; lede: string; items: Tile[] };
  read: { eyebrow: string; title: string; lede: string; items: Tile[] };
  cta: { title: string; body: string; primary: Link; secondary: Link };
} = {
  meta: {
    title:
      "Growth marketing — paid search, paid social, SEO, content, creators and AI search",
    description:
      "Paid search and paid social, SEO, short-form video, creator marketing, marketing mix modelling, and optimising your brand to be found and cited by AI search. Run by the team that also builds the site it points at.",
  },

  hero: {
    eyebrow: "Growth & Marketing",
    headline: ["Demand, not just", "impressions."],
    lede: "Paid search, paid social, SEO, content and creators — measured with the analytics to say which of them actually moved revenue. Plus the newest channel nobody has a playbook for: what an AI assistant says when someone asks it to recommend a business like yours.",
    /** Overlaid on the hero panel, the way /academy badges its card. */
    panel: {
      badge: "The channel map",
      lines: ["Every channel.", "Measured properly."] as [string, string],
    },
    primaryCta: { label: "Get a plan", href: "/contact#enquiry" },
    secondaryCta: { label: "See the channels", href: "#run" },
    stats: [
      { value: "8", label: "Channels run in-house" },
      { value: "25+", label: "Platforms and consoles" },
      { value: "4", label: "Practices under one roof" },
    ],
  },

  loop: {
    eyebrow: "How the work runs",
    title: "It runs as a loop, not a launch",
    lede: "Five moves, in this order, every month. The last one decides what the first one looks for next time, which is the only reason any of it improves.",
    caption: "Then it starts again — this month's numbers set next month's plan.",
    stages: [
      {
        n: "01",
        icon: "search",
        title: "See who is watching",
        short: "Watch",
        lede: "Before anything gets made or bought: who your buyers actually are, where their attention already goes, what your competitors are paying to reach them — and whether an assistant recommends you when someone asks.",
        anchor: "#watch",
        services: [
          {
            title: "Audience & competitor research",
            body: "Who is in market, what they search for, and what everyone else in your category is already bidding on.",
          },
          {
            title: "SEO & organic search",
            body: "Technical audits, site architecture, local and Maps, and a real editorial calendar.",
            logos: [
              { name: "Google", domain: "google.com" },
              { name: "Search Console", domain: "search.google.com" },
            ],
          },
          {
            title: "AI search visibility",
            body: "What ChatGPT, Gemini and Perplexity say about you today, and the groundwork that changes it.",
            logos: [
              { name: "ChatGPT", domain: "openai.com" },
              { name: "Gemini", domain: "gemini.google.com" },
              { name: "Perplexity", domain: "perplexity.ai" },
            ],
          },
          {
            title: "Channel selection",
            body: "Which channels are worth your money — and, more usefully, which ones to skip.",
          },
        ],
      },
      {
        n: "02",
        icon: "notebook",
        title: "Make the content",
        short: "Make",
        lede: "The half that makes the ads work. Scripted, shot and edited here — short video, static, copy and the page it all points at, made to suit each place it runs rather than resized to fit.",
        anchor: "#make",
        services: [
          {
            title: "Brand strategy & positioning",
            body: "Who you are for, what you are against, and the one sentence a customer repeats to someone else.",
          },
          {
            title: "Social & content management",
            body: "Calendar, shoots, reels, carousels, captions, scheduling and community replies — handled end to end.",
            logos: [
              { name: "Instagram", domain: "instagram.com" },
              { name: "LinkedIn", domain: "linkedin.com" },
              { name: "YouTube", domain: "youtube.com" },
            ],
          },
          {
            title: "Reels & short-form video",
            body: "Vertical video built to be watched with the sound off and the thumb moving.",
          },
          {
            title: "Creators & UGC",
            body: "Creators chosen on audience overlap and comment quality, with usage rights negotiated up front.",
          },
        ],
      },
      {
        n: "03",
        icon: "megaphone",
        title: "Put the ads out",
        short: "Run",
        lede: "Paid media across every console that can send you a customer — including chatbot ads, which open a conversation instead of dropping someone on a landing page and hoping.",
        anchor: "#run",
        services: [
          {
            title: "Meta Ads",
            body: "Full-funnel structure, creative testing at volume, and Conversions API so iOS traffic stops disappearing.",
            logos: [
              { name: "Meta", domain: "meta.com" },
              { name: "Instagram", domain: "instagram.com" },
              { name: "Facebook", domain: "facebook.com" },
            ],
          },
          {
            title: "Google Ads",
            body: "Search, Performance Max, Shopping, YouTube and Demand Gen, bid to margin rather than clicks.",
            logos: [
              { name: "Google Ads", domain: "ads.google.com" },
              { name: "YouTube", domain: "youtube.com" },
            ],
          },
          {
            title: "Chatbot ads & conversational entry",
            body: "Click-to-WhatsApp and click-to-Messenger campaigns landing in an agent that qualifies, answers and books — not a form.",
            logos: [
              { name: "WhatsApp Business", domain: "business.whatsapp.com" },
              { name: "Meta", domain: "meta.com" },
            ],
          },
          {
            title: "LinkedIn & B2B",
            body: "LinkedIn Ads, founder-led content and lead-gen that feeds a CRM instead of a spreadsheet.",
            logos: [{ name: "LinkedIn", domain: "linkedin.com" }],
          },
          {
            title: "Marketplace & commerce",
            body: "Amazon and Flipkart ad management, listing and catalogue work, and feeds for Shopping.",
            logos: [
              { name: "Amazon", domain: "amazon.in" },
              { name: "Flipkart", domain: "flipkart.com" },
              { name: "Shopify", domain: "shopify.com" },
            ],
          },
          {
            title: "Lifecycle & retention",
            body: "Email, SMS and WhatsApp flows: abandoned cart, onboarding, win-back — wired to your store or CRM.",
            logos: [{ name: "Mailchimp", domain: "mailchimp.com" }],
          },
        ],
      },
      {
        n: "04",
        icon: "layers",
        title: "Model the mix",
        short: "Model",
        lede: "Every platform claims the same sale, so the totals never add up. We model the channels together — including the offline and brand spend no pixel ever sees — and test what would have happened anyway.",
        anchor: "#model",
        services: [
          {
            title: "Marketing mix modelling",
            body: "What each channel really contributed once they stop being measured one at a time.",
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
            title: "Budget allocation & forecasting",
            body: "The model turned into a spend plan, with what a 30% increase is likely to return before you commit it.",
          },
        ],
      },
      {
        n: "05",
        icon: "chart",
        title: "Read the numbers",
        short: "Read",
        lede: "Tracking that is right in the first place, dashboards someone actually opens, and a straight read on what to cut. This is the step that sets what stage 01 goes looking for next month.",
        anchor: "#read",
        services: [
          {
            title: "GA4 & Tag Manager",
            body: "Set up correctly, with server-side tracking and offline conversion imports where they matter.",
            logos: [
              { name: "Google Analytics", domain: "analytics.google.com" },
              { name: "Tag Manager", domain: "tagmanager.google.com" },
            ],
          },
          {
            title: "CRO & A/B testing",
            body: "Tests on the pages that carry the revenue, not on button colours.",
          },
          {
            title: "Cohorts, LTV & payback",
            body: "What a customer is worth over time, so acquisition targets come from margin rather than a guess.",
          },
          {
            title: "Reporting you will read",
            body: "One view of spend, pipeline and revenue — and a call each month on what changes.",
          },
        ],
      },
    ],
  },

  families: {
    eyebrow: "Channels",
    title: "Every channel that can send you a customer",
    lede: "We start by finding where your buyers already spend their time, then run those channels properly and move the budget towards whatever is earning it.",
  },

  brand: {
    eyebrow: "Brand, content & creators",
    title: "The half that makes the ads work",
    lede: "Ads go much further when there is something solid behind them: a clear position, content people want to follow, and other voices saying your name. This is the groundwork that makes a cold audience willing to click in the first place, and it compounds instead of stopping when you pause the spend. We create the content as well as plan it — scripted, shot and edited here.",
    items: [
      {
        icon: "target",
        title: "Brand strategy & positioning",
        body: "Who you are for, what you are against, and the one sentence a customer repeats to someone else.",
      },
      {
        icon: "share",
        title: "Social media",
        body: "Run as a channel with a calendar and a point of view, not a feed that gets fed when someone remembers.",
      },
      {
        icon: "sparkles",
        title: "Reels & short-form video",
        body: "Vertical video built to be watched with the sound off and the thumb moving — hooks first, payoff fast.",
      },
      {
        icon: "message",
        title: "YouTube",
        domain: "youtube.com",
        body: "Long-form that still earns search traffic two years later, plus the Shorts cut from the same shoot.",
      },
      {
        icon: "check",
        title: "UGC",
        body: "Customer-shot content that outperforms studio work on paid social, sourced and briefed properly.",
      },
      {
        icon: "megaphone",
        title: "Influencer & creator marketing",
        body: "Creators chosen on audience overlap and comment quality rather than follower count, with usage rights negotiated up front.",
      },
      {
        icon: "briefcase",
        title: "Founder & personal branding",
        body: "For categories where people buy the person first — a posting rhythm you can actually sustain.",
      },
      {
        icon: "notebook",
        title: "Content strategy",
        body: "What to make, for which stage of the decision, and why — a calendar with a reason behind every slot.",
      },
      {
        icon: "sparkles",
        title: "Content creation",
        body: "We make it, not just plan it: scripts, shoots, editing, thumbnails, graphics, carousels and the copy that carries them.",
      },
      {
        icon: "workflow",
        title: "Content repurposing",
        body: "One shoot or one article becomes the reel, the carousel, the short, the newsletter and the landing copy.",
      },
    ],
  },

  aiSearch: {
    eyebrow: "AI search visibility",
    title: "When someone asks an assistant to recommend a business like yours",
    lede: "More and more buying research now happens inside ChatGPT, Google's AI Overviews, Gemini and Perplexity, often without anyone opening a search result. These systems answer from what they can read about you and how well other sources back it up. That is the part we work on.",
    items: [
      {
        icon: "search",
        title: "ChatGPT visibility",
        domain: "openai.com",
        body: "Making your site and your claims legible to what ChatGPT browses and cites, and checking what it currently says.",
      },
      {
        icon: "globe",
        title: "Google AI Overviews & AI Mode",
        domain: "google.com",
        body: "Structuring pages so the answer to a real question is on one, clearly, in the form these summaries lift.",
      },
      {
        icon: "sparkles",
        title: "Gemini visibility",
        domain: "gemini.google.com",
        body: "The same groundwork against Gemini, which leans harder on your Business Profile and corroborating sources.",
      },
      {
        icon: "bot",
        title: "Perplexity & other AI search",
        domain: "perplexity.ai",
        body: "Citation-led engines reward pages that answer precisely and say where the numbers came from.",
      },
      {
        icon: "notebook",
        title: "AI-answer-focused content",
        body: "Pages written to answer one question completely — definitions, comparisons, prices, limits — instead of circling it.",
      },
      {
        icon: "shield",
        title: "Entity & brand authority",
        body: "Making it unambiguous which company you are: consistent naming, a corroborated profile, and third-party mentions that agree.",
      },
      {
        icon: "code",
        title: "Structured data",
        body: "Organization, Service, FAQ and Product schema, so the facts are stated in a form a machine cannot misread.",
      },
      {
        icon: "gauge",
        title: "Website optimisation for AI discovery",
        body: "Crawlability, clean HTML, real text instead of text baked into images, and pages that load for a bot.",
      },
      {
        icon: "chart",
        title: "Monitoring what AI says about you",
        body: "We ask the assistants the questions your buyers ask, on a schedule, and track how they describe and recommend you over time.",
      },
    ],
  },

  analytics: {
    eyebrow: "Measurement & data science",
    title: "Which activity actually moved revenue",
    lede: "Every ad platform claims the same sale, so the totals never add up. We model the whole mix together, test it against what really happened, and tell you where the next rupee should go.",
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
        title: "Budget allocation",
        body: "The model turned into a spend plan: what to move, where, and the return to expect from the shift.",
      },
      {
        icon: "workflow",
        title: "Forecasting & scenarios",
        body: "What a 30% budget increase is likely to return before you commit it, with the uncertainty stated rather than hidden.",
      },
      {
        icon: "database",
        title: "Cohorts, LTV & payback",
        body: "What a customer is worth over time and how long they take to pay back, so acquisition targets come from margin rather than a guess.",
      },
    ],
  },

  read: {
    eyebrow: "Reporting & CRO",
    title: "The read that decides next month",
    lede: "Modelling is only worth having if the numbers underneath it are right and somebody actually looks at them. This is the tracking, the testing and the monthly call where the plan changes — the step that sends the loop back to the start.",
    items: [
      {
        icon: "gauge",
        title: "GA4 & Tag Manager",
        domain: "analytics.google.com",
        body: "Set up correctly the first time: clean events, consent handled, and no double counting between tags.",
      },
      {
        icon: "plug",
        title: "Server-side tracking",
        body: "Conversions sent server to server, so ad blockers and iOS stop quietly deleting a third of your data.",
      },
      {
        icon: "target",
        title: "CRO & A/B testing",
        body: "Tests on the pages that carry the revenue — checkout, pricing, the main landing page — not on button colours.",
      },
      {
        icon: "database",
        title: "Cohorts, LTV & payback",
        body: "What a customer is worth over time and how long they take to pay back, so targets come from margin rather than a guess.",
      },
      {
        icon: "chart",
        title: "Dashboards you will read",
        body: "One view of spend, pipeline and revenue. If nobody opens it, it is not reporting, it is decoration.",
      },
      {
        icon: "notebook",
        title: "The monthly call",
        body: "What worked, what gets more, what stops — said plainly, and written down so the next month has a plan.",
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
