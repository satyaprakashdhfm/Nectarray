import { getOmni, readingMinutes } from "@/lib/omniproof";

/**
 * One Omniproof article's markdown, for the Android app. The route keeps its
 * old /blog name so installed copies of the app still find it.
 *
 * Read on each request, like the pages themselves (pieces are edited in the
 * admin), so the app reads exactly the text /omniproof/<slug> renders.
 * Pictures inside it are site paths (/omniproof/<slug>/...), which the app
 * resolves against the site.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const post = await getOmni((await params).slug);
  if (post?.status !== "published")
    return Response.json({ error: "Not found." }, { status: 404 });

  const markdown = post.body;
  return Response.json({
    slug: post.slug,
    minutes: readingMinutes(markdown),
    markdown,
  });
}
