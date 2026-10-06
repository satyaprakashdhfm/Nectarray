import {
  academy,
  ai,
  company,
  contact,
  faqs,
  hero,
  liveSocials,
  marketing,
  pillars,
  pricing,
  process,
  software,
} from "@/lib/content";
import { BLOG_POSTS, BLOG_SERVICES } from "@/lib/content/blog";

/**
 * Everything the Android app shows, in one response.
 *
 * The app has no copy of its own: it reads the same content modules the
 * website renders, so changing a line in src/lib/content changes it on the
 * site and in the app on the next deploy, without a new Play Store release.
 * It is built once at deploy time, since none of it depends on who asks.
 *
 * `version` lets the app tell its own cached copy from a newer one. Raise it
 * when the shape changes, and teach the app the new shape first.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    version: 1,
    company: {
      name: company.name,
      tagline: company.tagline,
      email: company.email,
      phone: company.phone,
      location: company.location,
      socials: liveSocials.map(({ label, href }) => ({ label, href })),
    },
    hero: {
      headline: hero.headline,
      lede: hero.lede,
      stats: hero.stats,
    },
    practices: pillars.map(({ id, index, icon, title, summary, points, image }) => ({
      id,
      index,
      icon,
      title,
      summary,
      points,
      image,
    })),
    marketing: {
      title: marketing.title,
      lede: marketing.lede,
      channels: marketing.channels.map(({ icon, title, body, logos }) => ({
        icon,
        title,
        body,
        logos: logos.map((logo) => logo.name),
      })),
    },
    software: {
      title: software.title,
      lede: software.lede,
      services: software.services.map(({ icon, title, body, domains }) => ({
        icon,
        title,
        body,
        domains,
      })),
      app: {
        title: software.app.title,
        lede: software.app.lede,
        ways: software.app.ways,
        included: software.app.included,
      },
    },
    ai: {
      title: ai.title,
      lede: ai.lede,
      capabilities: ai.capabilities,
    },
    academy: {
      title: academy.title,
      lede: academy.lede,
      course: {
        tag: academy.course.tag,
        title: academy.course.title,
        summary: academy.course.summary,
        facts: academy.course.facts,
        about: academy.course.about,
        offerings: academy.course.offerings,
        curriculum: academy.course.curriculum,
        outcomes: academy.course.outcomes,
        forWho: academy.course.forWho,
        faqs: academy.course.faqs,
      },
    },
    process: { title: process.title, lede: process.lede, steps: process.steps },
    pricing: {
      title: pricing.title,
      lede: pricing.lede,
      plans: pricing.plans,
      footnote: pricing.footnote,
    },
    faqs,
    contact: {
      title: contact.title,
      lede: contact.lede,
      interests: contact.interests,
    },
    blog: {
      services: Object.fromEntries(
        Object.entries(BLOG_SERVICES).map(([id, s]) => [id, s.label]),
      ),
      posts: BLOG_POSTS.map(({ slug, title, description, date, service, coverAlt }) => ({
        slug,
        title,
        description,
        date,
        service,
        coverAlt,
        cover: `/blog/${slug}/cover.svg`,
      })),
    },
  });
}
