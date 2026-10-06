import { readPost, readingMinutes } from "@/lib/blog";
import { BLOG_POSTS, postBySlug } from "@/lib/content/blog";

/**
 * One article's markdown, for the Android app.
 *
 * Built at deploy time for every post, like the article pages themselves, so
 * the app reads exactly the text /blog/<slug> renders. Pictures inside it are
 * site paths (/blog/<slug>/...), which the app resolves against the site.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const post = postBySlug((await params).slug);
  if (!post) return Response.json({ error: "Not found." }, { status: 404 });

  const markdown = await readPost(post.slug);
  return Response.json({
    slug: post.slug,
    minutes: readingMinutes(markdown),
    markdown,
  });
}
