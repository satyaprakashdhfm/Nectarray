import { OMNI_ARTICLES, omniBySlug } from "@/lib/content/omniproof";
import { readOmni, readingMinutes } from "@/lib/omniproof";

/**
 * One Omniproof article's markdown, for the Android app. The route keeps its
 * old /blog name so installed copies of the app still find it.
 *
 * Built at deploy time for every article, like the pages themselves, so the
 * app reads exactly the text /omniproof/<slug> renders. Pictures inside it are
 * site paths (/omniproof/<slug>/...), which the app resolves against the site.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return OMNI_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const post = omniBySlug((await params).slug);
  if (!post) return Response.json({ error: "Not found." }, { status: 404 });

  const markdown = await readOmni(post.slug);
  return Response.json({
    slug: post.slug,
    minutes: readingMinutes(markdown),
    markdown,
  });
}
