import { readFile } from "node:fs/promises";
import path from "node:path";
import { AnimationLibrary } from "@/components/admin/AnimationLibrary";
import { PageHead } from "@/components/admin/Business";
import { ANIMATIONS, ANIMATION_CATEGORIES } from "@/lib/content/animations";

const HEROES_DIR = path.join(
  process.cwd(),
  "src/components/admin/animations/heroes",
);

/**
 * Animated heroes, live in the chosen colours.
 *
 * The code shown under each one is its real file, read here on the server,
 * so what is copied is always exactly what is running in the preview. Only
 * the category on screen is read. next.config traces the folder into the
 * deployed build, where src/ would otherwise not exist.
 */
export default async function AdminWebAnimationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: wanted } = await searchParams;
  const current =
    ANIMATION_CATEGORIES.find((c) => c.id === wanted) ??
    ANIMATION_CATEGORIES[0];

  const animations = await Promise.all(
    ANIMATIONS.filter((a) => a.category === current.id).map(async (a) => ({
      ...a,
      source: await readFile(path.join(HEROES_DIR, a.file), "utf8").catch(
        () => `// ${a.file} could not be read on the server.`,
      ),
    })),
  );

  const categories = ANIMATION_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    count: ANIMATIONS.filter((a) => a.category === c.id).length,
  }));

  return (
    <>
      <PageHead
        title="Animations"
        lede={`${ANIMATIONS.length} animated hero sections in ${ANIMATION_CATEGORIES.length} groups, from SaaS and AI to fashion, finance and travel. Built with Motion, shown live in your colours at laptop, tablet or phone width, and copied as a ready React component.`}
      />
      <AnimationLibrary
        categories={categories}
        category={current.id}
        blurb={current.blurb}
        animations={animations}
      />
    </>
  );
}
