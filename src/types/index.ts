/** Shared content shapes. The data lives in src/lib/content. */

export type Cta = {
  label: string;
  href: string;
};

export type Link = {
  label: string;
  href: string;
};

/** A card with a lucide icon key resolved by components/ui/Icon.tsx. */
export type IconCard = {
  icon: string;
  title: string;
  body: string;
};

/** An IconCard carrying a small meta chip (a timeline, a price, a status). */
export type IconCardWithMeta = IconCard & {
  meta: string;
};

/** One of the four top-level practices. */
export type Practice = {
  id: string;
  index: string;
  icon: string;
  title: string;
  summary: string;
  points: string[];
  href: string;
};

export type Step = {
  n: string;
  title: string;
  body: string;
};

export type Fact = {
  label: string;
  value: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type Plan = {
  name: string;
  body: string;
  features: string[];
  cta: string;
  featured: boolean;
};

export type Faq = {
  q: string;
  a: string;
};

export type WorkItem = {
  tag: string;
  title: string;
  body: string;
  status: string;
};

export type TagGroup = {
  label: string;
  items: string[];
};
