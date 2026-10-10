import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Empty, PageHead } from "@/components/admin/Business";
import { NotConnected } from "@/components/admin/DriveBrowser";
import { serviceLabel } from "@/lib/business";
import { loadDrives } from "@/lib/drive";
import { driveReady } from "@/lib/drive-storage";
import { fileSize } from "@/lib/file-size";

export const dynamic = "force-dynamic";

/** Every project's Drive, like the top of Google Drive. */
export default async function AdminDrivesPage() {
  const drives = await loadDrives();
  return (
    <>
      <PageHead
        title="Drive"
        lede="A Drive for every project: make as many folders as you like, inside each other, and upload any file into them. Only admins can open them."
      />
      {!driveReady() && <NotConnected />}

      {drives.length === 0 ? (
        <div className="mt-6">
          <Empty>
            No projects yet. Add one under a service and its Drive appears here.
          </Empty>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {drives.map((d) => (
            <li key={d.id}>
              <Link
                href={`${ADMIN}/drive/${d.id}`}
                className="card card-hover flex h-full items-start gap-3 p-4 active:scale-[0.99]"
              >
                <FolderOpen
                  className="text-brand-deep mt-0.5 size-6 shrink-0"
                  strokeWidth={1.7}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-ink truncate text-[0.9375rem] font-semibold">
                    {d.title}
                  </p>
                  <p className="text-ink-soft truncate text-[0.8125rem]">
                    {d.client} · {serviceLabel(d.service)}
                  </p>
                  <p className="text-ink-faint mt-1.5 text-[0.75rem]">
                    {d.files === 0
                      ? "Empty"
                      : `${d.files} ${d.files === 1 ? "file" : "files"}, ${fileSize(d.bytes)}`}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
