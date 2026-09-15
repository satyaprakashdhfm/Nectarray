import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { PlacementTools } from "@/components/dashboard/PlacementTools";
import { db } from "@/lib/db";
import { placementProfiles } from "@/lib/db/schema";
import { getAccess } from "@/lib/auth/access";
import {
  asResumeFiles,
  defaultIntro,
  defaultResumeFiles,
  resumePdfName,
} from "@/lib/resume";

export const metadata: Metadata = {
  title: "Placement — NectArray Academy",
  robots: { index: false, follow: false },
};

/**
 * Placement tools: the self-introduction and the resume.
 *
 * Both are the student's own and scoped to them — a read without the user id
 * here would hand one student's resume to another.
 */
export default async function PlacementPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const { user, active, status } = await getAccess();
  if (!active || !user) {
    return (
      <div className="shell py-8 lg:py-10">
        <EnrolmentPanel status={status} />
      </div>
    );
  }

  const [{ tool }, [profile]] = await Promise.all([
    searchParams,
    db
      .select({
        intro: placementProfiles.intro,
        resumeFiles: placementProfiles.resumeFiles,
      })
      .from(placementProfiles)
      .where(eq(placementProfiles.userId, user.id))
      .limit(1),
  ]);

  const files =
    asResumeFiles(profile?.resumeFiles) ?? (await defaultResumeFiles(user));

  return (
    <PlacementTools
      userId={user.id}
      initialTool={tool === "resume" ? "resume" : "intro"}
      intro={profile?.intro ?? defaultIntro(user)}
      files={files}
      pdfName={resumePdfName(user)}
      compilerReady={Boolean(process.env.LATEX_URL && process.env.LATEX_TOKEN)}
    />
  );
}
