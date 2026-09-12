/**
 * The growth & marketing practice page.
 *
 * Separate from the `marketing` object in practices.ts, which is the eight
 * channel cards shared with the homepage and the Service list in the JSON-LD.
 * This is the long-form page built around them.
 */
import type { Faq, IconCard, Link, Step } from "@/types";
import type { BrandGroup } from "./practices";

/**
 * A service tile. `domain` only where the service is itself a product —
 * the tile then shows that product's mark instead of a lucide glyph, and
 * the ones that are disciplines rather than brands keep the glyph.
 */
type Tile = IconCard & { domain?: string };

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
  families: { eyebrow: string; title: string; lede: string };
  brand: { eyebrow: string; title: string; lede: string; items: Tile[] };
  aiSearch: {
    eyebrow: string;
    title: string;
    lede: string;
    items: Tile[];
    honesty: { title: string; body: string };
  };
  analytics: { eyebrow: string; title: string; lede: string; items: Tile[] };
  platforms: {
    eyebrow: string;
    title: string;
    lede: string;
    groups: BrandGroup[];
  };
  process: { eyebrow: string; title: string; steps: Step[] };
  faqs: Faq[];
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
    secondaryCta: { label: "See the channels", href: "#channels" },
    stats: [
      { value: "8", label: "Channels run in-house" },
      { value: "25+", label: "Platforms and consoles" },
      { value: "4", label: "Practices under one roof" },
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
    honesty: {
      title: "What this is, and what it is not",
      body: "There is no placement to buy inside ChatGPT, Gemini or AI Overviews, so nobody can promise you a spot in one. What we can do is give these systems every reason to find you and describe you correctly: a site they can read cleanly, an identity that is unambiguous, claims backed up by sources elsewhere, and pages that answer your buyers' real questions better than anything else out there. That is what improves your chances of being quoted and recommended. We then ask the assistants those same questions on a schedule, so you can watch what they say about you rather than take our word for it.",
    },
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

  platforms: {
    eyebrow: "Platforms",
    title: "The consoles we are actually in every week",
    lede: "The platforms the work actually happens in. You get real access to each one, and every account stays in your name.",
    groups: [
      {
        label: "Paid & social",
        brands: [
          { name: "Meta Ads", domain: "meta.com" },
          { name: "Instagram", domain: "instagram.com" },
          { name: "Facebook", domain: "facebook.com" },
          { name: "Google Ads", domain: "ads.google.com" },
          { name: "YouTube", domain: "youtube.com" },
          { name: "LinkedIn", domain: "linkedin.com" },
          { name: "X", domain: "x.com" },
        ],
      },
      {
        label: "Measurement",
        brands: [
          { name: "Google Analytics", domain: "analytics.google.com" },
          { name: "Tag Manager", domain: "tagmanager.google.com" },
          { name: "Search Console", domain: "search.google.com" },
          { name: "Meta Pixel", domain: "developers.facebook.com" },
          { name: "Looker Studio", domain: "looker.com" },
          { name: "Hotjar", domain: "hotjar.com" },
        ],
      },
      {
        label: "Commerce & listings",
        brands: [
          { name: "Shopify", domain: "shopify.com" },
          { name: "Amazon Ads", domain: "advertising.amazon.in" },
          { name: "Flipkart", domain: "flipkart.com" },
          { name: "Business Profile", domain: "business.google.com" },
          { name: "Zomato", domain: "zomato.com" },
          { name: "Swiggy", domain: "swiggy.com" },
        ],
      },
      {
        label: "Lifecycle & AI search",
        note: "Where the message goes out, and where the answers now come from.",
        brands: [
          { name: "WhatsApp Business", domain: "business.whatsapp.com" },
          { name: "Mailchimp", domain: "mailchimp.com" },
          { name: "ChatGPT", domain: "openai.com" },
          { name: "Gemini", domain: "gemini.google.com" },
          { name: "Perplexity", domain: "perplexity.ai" },
          { name: "Claude", domain: "anthropic.com" },
        ],
      },
    ],
  },

  process: {
    eyebrow: "How we work",
    title: "No retainer before there is a plan",
    steps: [
      {
        n: "01",
        title: "Audit",
        body: "What is running, what it costs, what it returns, and which channels are being paid for out of habit.",
      },
      {
        n: "02",
        title: "Plan",
        body: "A written plan naming the channels, the spend, the creative needed and what each is accountable for.",
      },
      {
        n: "03",
        title: "Instrument",
        body: "Tracking before spending: GA4, conversions, server-side events. Numbers you can act on, not a dashboard.",
      },
      {
        n: "04",
        title: "Run",
        body: "Campaigns live, creative in rotation, content shipping, and the AI-visibility groundwork underneath it.",
      },
      {
        n: "05",
        title: "Cut and double",
        body: "Reviewed against the plan. What pays gets more; what does not gets stopped and said out loud.",
      },
    ],
  },

  faqs: [
    {
      q: "Do you take a retainer before doing any work?",
      a: "The audit and the written plan come first, so you can see how we think before committing to anything ongoing. If our honest read is that you can handle this in-house, we will tell you that too.",
    },
    {
      q: "What is the minimum ad spend you work with?",
      a: "There is no fixed floor, but below roughly ₹50,000 a month across channels the learning is slow enough that content and organic usually return more per rupee. We will tell you that rather than take the account.",
    },
    {
      q: "Can you guarantee we appear in ChatGPT or AI Overviews?",
      a: "No, and neither can anyone else. There is no placement to buy and the model decides what to cite. What we can do is make your site and brand as findable, readable and corroborated as possible, which is what improves the odds — and then monitor what the assistants actually say about you so the effect is visible rather than claimed.",
    },
    {
      q: "Is AI search visibility just SEO with a new name?",
      a: "It overlaps heavily and the groundwork is shared — clean HTML, structured data, pages that answer a question properly. What differs is the target: a ranked list of links versus a single synthesised answer. That rewards being unambiguous and corroborated rather than just ranking well, and it is measured by asking the assistants, not by checking positions.",
    },
    {
      q: "Do you make the creative, or do we?",
      a: "We can do either. Most clients want the shooting and editing handled, some have an in-house team and want strategy, briefs and the media buying. Both work, as long as it is clear which it is before we start.",
    },
    {
      q: "Do you also build the site the traffic lands on?",
      a: "Yes, and it is the reason this works better than hiring the two separately. The people running the ads and the people building the landing page are the same team, so the page is built to convert and instrumented to prove it rather than reverse-engineered afterwards.",
    },
  ],

  cta: {
    title: "Tell us what you are selling.",
    body: "You will get an audit and a written plan naming the channels, the spend and what each one is accountable for — before any retainer, and with a straight answer if we think a channel is not worth your money.",
    primary: { label: "Get a plan", href: "/contact#enquiry" },
    secondary: { label: "See our other practices", href: "/#services" },
  },
};
