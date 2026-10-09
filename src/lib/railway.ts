import "server-only";
import { z } from "zod";

/**
 * What is deploying on Railway, for the board at the top of the Workspace:
 * every project, every service in its non-preview environments, and the
 * state of each one's latest deployment.
 *
 * Read with RAILWAY_API_TOKEN, an account token (railway.com/account/tokens,
 * "No workspace") or a workspace token. Only queries are ever sent; nothing
 * here can deploy, stop or change anything.
 *
 * Railway allows 1,000 requests an hour on Hobby, so answers are shared for
 * a few seconds (every open tab polls) and the workspace list, which rarely
 * changes, is kept for ten minutes.
 */

const API = "https://backboard.railway.com/graphql/v2";
const TIMEOUT_MS = 10_000;
const BOARD_TTL_MS = 10_000;
const WORKSPACES_TTL_MS = 10 * 60_000;

/** active: building or rolling out now. live: running. idle: asleep or removed. */
export type DeployState = "active" | "failed" | "live" | "idle";

export type ServiceDeploy = {
  /** serviceId:environmentId, unique on the board. */
  key: string;
  service: string;
  environment: string;
  /** Railway's own word for it, e.g. BUILDING. */
  status: string;
  state: DeployState;
  /** When the latest deployment last changed state. */
  at: string;
  /** First line of the commit it deploys, when it came from git. */
  commit: string | null;
  /** The service on railway.com. */
  href: string;
};

export type ProjectDeploys = {
  id: string;
  name: string;
  services: ServiceDeploy[];
};

export type RailwayBoard =
  | { ok: true; projects: ProjectDeploys[]; checkedAt: string }
  | {
      ok: false;
      /** unset: no token. token: refused. busy: rate-limited. down: unreachable. */
      error: "unset" | "token" | "busy" | "down";
    };

const STATE: Record<string, DeployState> = {
  QUEUED: "active",
  WAITING: "active",
  NEEDS_APPROVAL: "active",
  INITIALIZING: "active",
  BUILDING: "active",
  DEPLOYING: "active",
  SUCCESS: "live",
  FAILED: "failed",
  CRASHED: "failed",
  SLEEPING: "idle",
  REMOVING: "idle",
  REMOVED: "idle",
  SKIPPED: "idle",
};

const ORDER: Record<DeployState, number> = {
  active: 0,
  failed: 1,
  live: 2,
  idle: 3,
};

/* What Railway sends back, checked once here and trusted after. */

const edges = <T extends z.ZodType>(node: T) =>
  z.object({ edges: z.array(z.object({ node })) });

const Deployment = z.object({
  status: z.string(),
  createdAt: z.string(),
  statusUpdatedAt: z.string().nullish(),
  meta: z.unknown(),
});

const Project = z.object({
  id: z.string(),
  name: z.string(),
  environments: edges(
    z.object({
      id: z.string(),
      name: z.string(),
      serviceInstances: edges(
        z.object({
          serviceId: z.string(),
          serviceName: z.string(),
          latestDeployment: Deployment.nullish(),
        }),
      ),
    }),
  ),
});

type Project = z.infer<typeof Project>;

const Workspaces = z.object({
  apiToken: z.object({
    workspaces: z.array(z.object({ id: z.string(), name: z.string() })),
  }),
});

const PROJECT_FIELDS = `
  edges { node {
    id
    name
    environments(isEphemeral: false) { edges { node {
      id
      name
      serviceInstances { edges { node {
        serviceId
        serviceName
        latestDeployment { status createdAt statusUpdatedAt meta }
      } } }
    } } }
  } }`;

class RailwayError extends Error {
  constructor(readonly kind: "token" | "busy" | "down") {
    super(`Railway: ${kind}`);
  }
}

async function ask(
  token: string,
  query: string,
  variables: Record<string, string> = {},
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[railway] Request failed:", error);
    throw new RailwayError("down");
  }
  if (response.status === 429) throw new RailwayError("busy");
  if (response.status === 401 || response.status === 403)
    throw new RailwayError("token");

  const body = (await response.json().catch(() => null)) as {
    data?: unknown;
    errors?: { message?: string }[];
  } | null;
  // GraphQL reports a refused token as 200 with "Not Authorized".
  if (body?.errors?.some((e) => /not authori[sz]ed/i.test(e.message ?? "")))
    throw new RailwayError("token");
  if (!response.ok || !body?.data || body.errors?.length) {
    console.error(
      "[railway] Unexpected answer:",
      response.status,
      body?.errors?.map((e) => e.message).join("; "),
    );
    throw new RailwayError("down");
  }
  return body.data;
}

/** The commit's first line, from a deployment's free-form meta. */
function commitLine(meta: unknown): string | null {
  if (!meta || typeof meta !== "object" || !("commitMessage" in meta))
    return null;
  const message = (meta as { commitMessage: unknown }).commitMessage;
  if (typeof message !== "string") return null;
  const line = message.split("\n")[0].trim();
  return line ? line.slice(0, 120) : null;
}

/** Railway's projects as the board shows them: busiest services first. */
export function toBoard(projects: Project[]): ProjectDeploys[] {
  return projects
    .map((project) => ({
      id: project.id,
      name: project.name,
      services: project.environments.edges
        .flatMap(({ node: env }) =>
          env.serviceInstances.edges.flatMap(({ node: instance }) => {
            const deploy = instance.latestDeployment;
            // Never deployed: nothing to report.
            if (!deploy) return [];
            return [
              {
                key: `${instance.serviceId}:${env.id}`,
                service: instance.serviceName,
                environment: env.name,
                status: deploy.status,
                state: STATE[deploy.status] ?? "idle",
                at: deploy.statusUpdatedAt ?? deploy.createdAt,
                commit: commitLine(deploy.meta),
                href: `https://railway.com/project/${project.id}/service/${instance.serviceId}?environmentId=${env.id}`,
              } satisfies ServiceDeploy,
            ];
          }),
        )
        .sort(
          (a, b) =>
            ORDER[a.state] - ORDER[b.state] ||
            a.service.localeCompare(b.service),
        ),
    }))
    .filter((p) => p.services.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

let workspaces: { token: string; ids: string[]; at: number } | null = null;
let board: { at: number; value: Promise<RailwayBoard> } | null = null;

async function workspaceIds(token: string): Promise<string[]> {
  if (
    workspaces?.token === token &&
    Date.now() - workspaces.at < WORKSPACES_TTL_MS
  )
    return workspaces.ids;
  const parsed = Workspaces.parse(
    await ask(token, "query { apiToken { workspaces { id name } } }"),
  );
  const ids = parsed.apiToken.workspaces.map((w) => w.id);
  workspaces = { token, ids, at: Date.now() };
  return ids;
}

async function readBoard(token: string): Promise<RailwayBoard> {
  try {
    const ids = await workspaceIds(token);
    // One request for every workspace: aliases w0, w1, … each list theirs.
    const data =
      ids.length === 0
        ? {}
        : ((await ask(
            token,
            `query board(${ids.map((_, i) => `$w${i}: String!`).join(", ")}) {
              ${ids.map((_, i) => `w${i}: projects(workspaceId: $w${i}, first: 50) { ${PROJECT_FIELDS} }`).join("\n")}
            }`,
            Object.fromEntries(ids.map((id, i) => [`w${i}`, id])),
          )) as Record<string, unknown>);
    const projects = Object.values(data).flatMap((list) =>
      edges(Project)
        .parse(list)
        .edges.map((e) => e.node),
    );
    return {
      ok: true,
      projects: toBoard(projects),
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof RailwayError) return { ok: false, error: error.kind };
    console.error("[railway] Could not read the board:", error);
    return { ok: false, error: "down" };
  }
}

/** The board, shared between callers for a few seconds. */
export function railwayBoard(): Promise<RailwayBoard> {
  const token = process.env.RAILWAY_API_TOKEN?.trim();
  if (!token) return Promise.resolve({ ok: false, error: "unset" });
  if (board && Date.now() - board.at < BOARD_TTL_MS) return board.value;
  board = { at: Date.now(), value: readBoard(token) };
  return board.value;
}
