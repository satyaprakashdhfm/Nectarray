import { useCallback, useEffect, useState } from 'react';

/**
 * Where the content comes from: the live site by default. Point it at a dev
 * server on your network with EXPO_PUBLIC_SITE_URL in mobile/.env.local,
 * for example http://192.168.1.20:3000 (a phone cannot reach "localhost").
 */
export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL ?? 'https://nectarray.com').replace(
  /\/$/,
  '',
);

/** Site paths such as /services/software.webp, made absolute. */
export const siteUrl = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

export type Fact = { label: string; value: string };
export type Faq = { q: string; a: string };
export type IconCard = { icon: string; title: string; body: string };

export type Practice = {
  id: 'marketing' | 'software' | 'ai' | 'academy';
  index: string;
  icon: string;
  title: string;
  summary: string;
  points: string[];
  image: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  service: string;
  coverAlt: string;
  cover: string;
};

/** The shape of /api/app/content (version 1). */
export type Content = {
  version: number;
  company: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    socials: { label: string; href: string }[];
  };
  hero: { headline: string[]; lede: string; stats: { value: string; label: string }[] };
  practices: Practice[];
  marketing: {
    title: string;
    lede: string;
    channels: (IconCard & { logos: string[] })[];
  };
  software: {
    title: string;
    lede: string;
    services: (IconCard & { domains: string[] })[];
    app: {
      title: string[];
      lede: string;
      ways: { name: string; tools: string; body: string }[];
      included: string[];
    };
  };
  ai: { title: string; lede: string; capabilities: IconCard[] };
  academy: {
    title: string;
    lede: string;
    course: {
      tag: string;
      title: string;
      summary: string;
      facts: Fact[];
      about: { title: string; paragraphs: string[] };
      offerings: IconCard[];
      curriculum: {
        n: string;
        title: string;
        days: string;
        summary: string;
        topics: { title: string; body: string }[];
      }[];
      outcomes: string[];
      forWho: string[];
      faqs: Faq[];
    };
  };
  process: { title: string; lede: string; steps: { n: string; title: string; body: string }[] };
  pricing: {
    title: string;
    lede: string;
    plans: { name: string; body: string; features: string[]; cta: string; featured: boolean }[];
    footnote: string;
  };
  faqs: Faq[];
  contact: { title: string; lede: string; interests: string[] };
  blog: { services: Record<string, string>; posts: BlogPost[] };
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${SITE_URL}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`The server answered ${response.status}.`);
  return (await response.json()) as T;
}

/**
 * One fetch of the content for the whole session, shared by every screen.
 * A failed fetch is forgotten, so "Try again" really tries again.
 */
let contentRequest: Promise<Content> | null = null;

function loadContent(): Promise<Content> {
  contentRequest ??= getJson<Content>('/api/app/content').catch((error) => {
    contentRequest = null;
    throw error;
  });
  return contentRequest;
}

type Remote<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string; retry: () => void }
  | { status: 'ready'; data: T };

function useRemote<T>(load: () => Promise<T>, key: string): Remote<T> {
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  // Each answer is stamped with the request it belongs to, so a new key or a
  // retry reads as loading until its own answer arrives.
  const request = `${key}#${attempt}`;
  const [result, setResult] = useState<{ request: string; value: Remote<T> } | null>(null);

  useEffect(() => {
    let live = true;
    load()
      .then((data) => live && setResult({ request, value: { status: 'ready', data } }))
      .catch(
        (error: unknown) =>
          live &&
          setResult({
            request,
            value: {
              status: 'error',
              message: error instanceof Error ? error.message : 'Something went wrong.',
              retry,
            },
          }),
      );
    return () => {
      live = false;
    };
    // `load` is recreated each render; `request` says when it really changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, retry]);

  return result?.request === request ? result.value : { status: 'loading' };
}

export const useContent = () => useRemote(loadContent, 'content');

export type Article = { slug: string; minutes: number; markdown: string };

export const useArticle = (slug: string) =>
  useRemote(() => getJson<Article>(`/api/app/blog/${encodeURIComponent(slug)}`), slug);

/** Sends the enquiry to the same endpoint the website's contact form uses. */
export async function sendEnquiry(enquiry: {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}): Promise<void> {
  const response = await fetch(`${SITE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiry),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'We could not send that just now.');
  }
}

/** 2026-09-27 as "27 September 2026", the way the site prints it. */
export const postDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
};
