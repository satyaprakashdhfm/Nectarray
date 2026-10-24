import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { openIncident, resolveIncident } from "@/lib/monitor/incidents";

/**
 * Railway's project webhook (Project → Settings → Webhooks), feeding the
 * incidents on the Workspace.
 *
 * Railway does not sign its payloads, so the request has to carry
 * MONITOR_HOOK_TOKEN, either as `?token=` in the webhook URL or as an
 * `Authorization: Bearer` custom header. Without the variable set, every
 * call is refused.
 *
 * A failed, crashed or out-of-memory deploy opens an incident for that
 * service; the next successful deploy or restart closes it. CPU/RAM monitors and volume
 * alerts open and close the same way. Preview environments are ignored.
 */

const OPEN = new Set([
  "Deployment.failed",
  "Deployment.crashed",
  "Deployment.oom_killed",
  "Monitor.triggered",
  "VolumeAlert.triggered",
]);

const CLOSE = new Set([
  "Deployment.deployed",
  "Deployment.redeployed",
  // Railway's restart policy bringing a crashed container back.
  "Deployment.restarted",
  "Deployment.resumed",
  "Monitor.resolved",
  "Monitor.deleted",
  "VolumeAlert.resolved",
]);

const WHAT: Record<string, string> = {
  "Deployment.failed": "deploy failed",
  "Deployment.crashed": "crashed",
  "Deployment.oom_killed": "ran out of memory",
  "Monitor.triggered": "CPU/RAM alert",
  "VolumeAlert.triggered": "disk nearly full",
};

type Named = { id?: string; name?: string };

type Payload = {
  type?: string;
  details?: { commitMessage?: string; status?: string };
  resource?: {
    project?: Named;
    environment?: Named & { isEphemeral?: boolean };
    service?: Named;
  };
};

const digest = (value: string) => createHash("sha256").update(value).digest();

function authorised(request: Request): boolean {
  const expected = process.env.MONITOR_HOOK_TOKEN?.trim();
  if (!expected) return false;
  const given =
    new URL(request.url).searchParams.get("token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  return timingSafeEqual(digest(given), digest(expected));
}

export async function POST(request: Request) {
  if (!authorised(request))
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const type = payload.type ?? "";
  const { project, environment, service } = payload.resource ?? {};
  if (environment?.isEphemeral || (!OPEN.has(type) && !CLOSE.has(type)))
    return NextResponse.json({ ok: true, ignored: true });

  const projectName = project?.name ?? "Railway";
  const serviceName = service?.name ?? "a service";
  const env =
    environment?.name && environment.name !== "production"
      ? ` (${environment.name})`
      : "";
  const kind = type.split(".")[0];
  // One incident per service and kind: a crash and a disk alert are separate.
  const target = `railway:${project?.id ?? projectName}/${service?.id ?? serviceName}/${environment?.id ?? ""}/${kind}`;

  if (OPEN.has(type)) {
    await openIncident({
      source: "railway",
      target,
      project: projectName,
      title: `${projectName} / ${serviceName}${env}: ${WHAT[type]}`,
      detail: payload.details?.commitMessage?.split("\n")[0] ?? "",
      href:
        project?.id && service?.id
          ? `https://railway.com/project/${project.id}/service/${service.id}${
              environment?.id ? `?environmentId=${environment.id}` : ""
            }`
          : null,
    });
  } else {
    await resolveIncident(target, `${projectName} / ${serviceName}${env} is back.`);
  }

  return NextResponse.json({ ok: true });
}
