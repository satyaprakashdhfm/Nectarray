import { NextResponse } from "next/server";
import { AccessError, requireAdmin } from "@/lib/auth/access";
import { getRealtime } from "@/lib/analytics-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Who is on the site right now, for the Analytics tab's live panel, which
 * asks once a minute. Admins only.
 */
export async function GET() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }

  return NextResponse.json(await getRealtime(), {
    headers: { "Cache-Control": "no-store" },
  });
}
