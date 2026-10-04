/**
 * The Animations tab: animated hero sections, grouped by the kind of website
 * they suit.
 *
 * Unlike the Elements tab these are React components, not HTML strings: the
 * motion needs JavaScript, and the Elements previews run in iframes with
 * scripts switched off. Each one lives in its own file under
 * src/components/admin/animations/heroes/, imports nothing but React and
 * Motion (motion.dev, `npm i motion`), and is coloured only through the
 * palette variables (--p, --s, --t and their -light, -dark, -on shades) — so
 * the file a visitor copies is the whole of it.
 *
 * Layout answers to the hero's own width through container queries (`@3xl:`
 * and friends) rather than the screen's, which is what lets the preview show
 * the real phone layout at phone width inside a laptop window.
 *
 * This file is the catalogue only — names, notes, which file — so the server
 * page can read the sources without importing the components.
 */

export type AnimationCategory = {
  id: string;
  label: string;
  blurb: string;
};

export type AnimationEntry = {
  id: string;
  category: string;
  name: string;
  /** What moves, and when it suits, in a sentence or two. */
  note: string;
  /** The component's file name under animations/heroes/. */
  file: string;
};

export const ANIMATION_CATEGORIES: AnimationCategory[] = [
  {
    id: "saas",
    label: "SaaS and software",
    blurb: "Product launches and dashboards: the product rising into view.",
  },
  {
    id: "ai",
    label: "AI and agents",
    blurb: "Show the thing thinking: typing, streaming, tools being called.",
  },
  {
    id: "ecommerce",
    label: "E-commerce and fashion",
    blurb: "The product is the hero: reveals, swatches and rotating picks.",
  },
  {
    id: "agency",
    label: "Agency and portfolio",
    blurb: "Big type that moves, and a cursor that has something to play with.",
  },
  {
    id: "education",
    label: "Education and courses",
    blurb: "Proof that adds up and a path that draws itself.",
  },
  {
    id: "fintech",
    label: "Finance and fintech",
    blurb: "Numbers that tick, charts that draw, cards that fan out.",
  },
  {
    id: "health",
    label: "Health and wellness",
    blurb: "Slow, calm motion: breathing shapes and a steady pulse.",
  },
  {
    id: "travel",
    label: "Real estate and travel",
    blurb: "Let the photo do it: slow zooms, parallax and a gallery that lands.",
  },
];

export const ANIMATIONS: AnimationEntry[] = [
  {
    id: "saas-aurora-dashboard",
    category: "saas",
    name: "Aurora glow with a rising dashboard",
    note: "Blurred colour drifts behind the headline, the words lift in one by one, and a dashboard tilts up into place with its bars growing.",
    file: "SaasAuroraDashboard.tsx",
  },
  {
    id: "saas-spotlight-grid",
    category: "saas",
    name: "Cursor spotlight on a grid",
    note: "A soft light follows the pointer across a dotted grid, and the feature chips settle in on a spring. Developer tools and APIs.",
    file: "SaasSpotlightGrid.tsx",
  },
  {
    id: "ai-typing-prompt",
    category: "ai",
    name: "Prompt typed, answer streamed",
    note: "A question types itself into a chat box, then the answer streams in word by word, on a loop. Assistants and chat products.",
    file: "AiTypingPrompt.tsx",
  },
  {
    id: "ai-orbit-network",
    category: "ai",
    name: "Agent with orbiting tools",
    note: "Tools circle a glowing core on two rings while pulses travel inwards. Agent platforms and integrations.",
    file: "AiOrbitNetwork.tsx",
  },
  {
    id: "ecommerce-mask-reveal",
    category: "ecommerce",
    name: "Masked product reveal",
    note: "The photo wipes open from the bottom, the headline slides up line by line, and a price tag springs on. A single hero product.",
    file: "EcommerceMaskReveal.tsx",
  },
  {
    id: "ecommerce-colour-picker",
    category: "ecommerce",
    name: "Colourway switcher",
    note: "Picking a colour cross-fades the product and slides the selection ring across, and it rotates on its own until touched.",
    file: "EcommerceColourPicker.tsx",
  },
  {
    id: "agency-rolling-words",
    category: "agency",
    name: "Rolling word headline",
    note: "One word in the headline rolls through what you do, with the line beneath it stretching to fit. Studios and freelancers.",
    file: "AgencyRollingWords.tsx",
  },
  {
    id: "agency-marquee-magnetic",
    category: "agency",
    name: "Marquee rows and a magnetic button",
    note: "Two rows of giant words scroll in opposite directions behind a button that leans towards the pointer.",
    file: "AgencyMarqueeMagnetic.tsx",
  },
  {
    id: "education-count-up",
    category: "education",
    name: "Counting stats and floating badges",
    note: "The numbers count up when the hero comes into view, and small badges bob around the photo. Courses and coaching.",
    file: "EducationCountUp.tsx",
  },
  {
    id: "education-learning-path",
    category: "education",
    name: "A learning path that draws itself",
    note: "A winding line draws through each module, and every milestone pops in as the line reaches it.",
    file: "EducationLearningPath.tsx",
  },
  {
    id: "fintech-live-chart",
    category: "fintech",
    name: "Live chart with a ticking balance",
    note: "The line draws, the area fills in beneath it, and the balance counts up to its value. Investing and banking apps.",
    file: "FintechLiveChart.tsx",
  },
  {
    id: "fintech-card-fan",
    category: "fintech",
    name: "Cards fanning out",
    note: "Three cards spring out from a stack into a fan, and each lifts when the pointer is over it. Cards and payments.",
    file: "FintechCardFan.tsx",
  },
  {
    id: "health-breathing",
    category: "health",
    name: "Breathing shape",
    note: "A soft shape swells and settles in a four-second breath, with the cue changing between in and out. Wellness and therapy.",
    file: "HealthBreathing.tsx",
  },
  {
    id: "health-heartbeat",
    category: "health",
    name: "Heartbeat line",
    note: "A pulse travels along a heart-rate trace while the beats per minute tick over. Clinics, diagnostics and fitness.",
    file: "HealthHeartbeat.tsx",
  },
  {
    id: "travel-parallax-zoom",
    category: "travel",
    name: "Slow zoom with scroll parallax",
    note: "The photo creeps in slowly, and on scroll the text and photo move at different speeds. Resorts, tours and listings.",
    file: "TravelParallaxZoom.tsx",
  },
  {
    id: "travel-gallery-landing",
    category: "travel",
    name: "Gallery that lands around a search",
    note: "Photos fly in from different sides and settle in a mosaic, and the search bar opens out beneath the headline.",
    file: "TravelGalleryLanding.tsx",
  },
];
