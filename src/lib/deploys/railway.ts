import "server-only";
import { z } from "zod";
import {
  call,
  firstLine,
  HostError,
  type DeployState,
  type HostProject,
} from "./shared";

/**
 * Railway's side of the deploy board: every project, every service in its
 * non-preview environments, and the state of each one's latest deployment.
 *
 * Read with RAILWAY_API_TOKEN, an account token (railway.com/account/tokens,
 * "No workspace") or a workspace token. Only queries are ever sent; nothing
 * here can deploy, stop or change anything. Railway allows 1,000 requests an
 * hour on Hobby, so the workspace list, which rarely changes, is kept for ten
 * minutes and each board check is a single request.
 */

const API = "https://backboard.railway.com/graphql/v2";
const WORKSPACES_TTL_MS = 10 * 60_000;

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

/* What Railway sends back, checked once here and trusted after. */

const edges = <T extends z.ZodType>(node: T) =>
  z.object({ edges: z.array(z.object({ node })) });

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
          latestDeployment: z
            .object({
              status: z.string(),
              createdAt: z.string(),
              statusUpdatedAt: z.string().nullish(),
              meta: z.unknown(),
            })
            .nullish(),
        }),
      ),
    }),
  ),
});

export type RailwayProject = z.infer<typeof Project>;

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

async function ask(
  token: string,
  query: string,
  variables: Record<string, string> = {},
): Promise<unknown> {
  const { status, ok, body } = await call("railway", API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const answer = body as {
    data?: unknown;
    errors?: { message?: string }[];
  } | null;
  // GraphQL reports a refused token as 200 with "Not Authorized".
  if (answer?.errors?.some((e) => /not authori[sz]ed/i.test(e.message ?? "")))
    throw new HostError("railway", "token");
  if (!ok || !answer?.data || answer.errors?.length) {
    console.error(
      "[deploys] Unexpected answer from Railway:",
      status,
      answer?.errors?.map((e) => e.message).join("; "),
    );
    throw new HostError("railway", "down");
  }
  return answer.data;
}

/** Railway's projects as the board takes them. Never-deployed services are left out. */
export function fromRailway(projects: RailwayProject[]): HostProject[] {
  return projects.map((project) => ({
    host: "railway",
    id: project.id,
    name: project.name,
    services: project.environments.edges.flatMap(({ node: env }) =>
      env.serviceInstances.edges.flatMap(({ node: instance }) => {
        const deploy = instance.latestDeployment;
        if (!deploy) return [];
        const meta = deploy.meta as { commitMessage?: unknown } | null;
        return [
          {
            key: `railway:${instance.serviceId}:${env.id}`,
            host: "railway" as const,
            service: instance.serviceName,
            environment: env.name,
            status: deploy.status,
            state: STATE[deploy.status] ?? "idle",
            at: deploy.statusUpdatedAt ?? deploy.createdAt,
            commit:
              meta && typeof meta === "object"
                ? firstLine(meta.commitMessage)
                : null,
            href: `https://railway.com/project/${project.id}/service/${instance.serviceId}?environmentId=${env.id}`,
          },
        ];
      }),
    ),
  }));
}

let workspaces: { token: string; ids: string[]; at: number } | null = null;

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

/** Every Railway project the token reaches, in one request per check. */
export async function readRailway(token: string): Promise<HostProject[]> {
  const ids = await workspaceIds(token);
  if (ids.length === 0) return [];
  // Aliases w0, w1, … each list one workspace's projects.
  const data = (await ask(
    token,
    `query board(${ids.map((_, i) => `$w${i}: String!`).join(", ")}) {
      ${ids.map((_, i) => `w${i}: projects(workspaceId: $w${i}, first: 50) { ${PROJECT_FIELDS} }`).join("\n")}
    }`,
    Object.fromEntries(ids.map((id, i) => [`w${i}`, id])),
  )) as Record<string, unknown>;
  return fromRailway(
    Object.values(data).flatMap((list) =>
      edges(Project)
        .parse(list)
        .edges.map((e) => e.node),
    ),
  );
}
