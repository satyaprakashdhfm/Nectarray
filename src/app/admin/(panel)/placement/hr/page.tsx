import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { count } from "drizzle-orm";
import { HrQuestionsEditor } from "@/components/admin/HrQuestionsEditor";
import { db } from "@/lib/db";
import { hrQuestions } from "@/lib/db/schema";
import { getHrQuestions } from "@/lib/hr-questions";

export const dynamic = "force-dynamic";

/** The HR questions and answers on every student's placement page. */
export default async function AdminHrQuestionsPage() {
  const [questions, [{ saved }]] = await Promise.all([
    getHrQuestions(),
    db.select({ saved: count() }).from(hrQuestions),
  ]);

  return (
    <div className="max-w-4xl">
      <Link
        href={`${ADMIN}/placement`}
        className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        Placement
      </Link>

      <h1 className="display text-ink mt-4 text-[1.875rem] sm:text-[2.25rem]">
        HR questions
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        What students see under Placement → HR questions. Change any question or
        answer, add new ones, delete or reorder them, then save.
      </p>

      <HrQuestionsEditor initial={questions} customised={saved > 0} />
    </div>
  );
}
