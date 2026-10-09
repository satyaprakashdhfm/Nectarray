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
 * Vercel's side of the deploy board: the latest production deployment of
 * every project in every team the token reaches. Previews are left out; they
 * come and go with every branch push and would bury the sites themselves.
 *
 * Read with VERCEL_API_TOKEN (vercel.com/account/settings/tokens, scoped to
 * the team). Vercel tokens cannot be made read-only, but nothing here sends
 * anything other than GET requests.
 */

const API = "https://api.vercel.com";
const TEAMS_TTL_MS = 10 * 60_000;
/** Newest production deployments read per team; plenty to reach every project. */
const LIMIT = 100;

const STATE: Record<string, DeployState> = {
  QUEUED: "active",
  INITIALIZING: "active",
  BUILDING: "active",
  READY: "live",
  ERROR: "failed",
  BLOCKED: "failed",
  CANCELED: "idle",
  DELETED: "idle",
};

/* What Vercel sends back, checked once here and trusted after. */

const Teams = z.object({
  teams: z.array(z.object({ id: z.string(), slug: z.string() })),
});

const Deployment = z.object({
  uid: z.string(),
  name: z.string(),
  projectId: z.string().nullish(),
  url: z.string().nullish(),
  created: z.number(),
  ready: z.number().nullish(),
  buildingAt: z.number().nullish(),
  state: z.string().nullish(),
  readyState: z.string().nullish(),
  inspectorUrl: z.string().nullish(),
  meta: z.record(z.string(), z.unknown()).nullish(),
});

const Deployments = z.object({ deployments: z.array(Deployment) });

export type VercelDeployment = z.infer<typeof Deployment>;
type Scope = { teamId: string; slug: string } | null;

async function get(token: string, path: string): Promise<unknown> {
  const { status, ok, body } = await call("vercel", `${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!ok) {
    console.error("[deploys] Unexpected answer from Vercel:", status, path);
    throw new HostError("vercel", "down");
  }
  return body;
}

/**
 * The newest production deployment of each project, as the board takes them.
 * The list comes newest first, so the first one seen per project wins.
 */
export function fromVercel(
  deployments: VercelDeployment[],
  slug: string | null,
): HostProject[] {
  const latest = new Map<string, VercelDeployment>();
  for (const d of deployments) {
    const project = d.projectId ?? d.name;
    if (!latest.has(project)) latest.set(project, d);
  }
  return [...latest].map(([project, d]) => {
    const status = (d.readyState ?? d.state ?? "QUEUED").toUpperCase();
    const state = STATE[status] ?? "idle";
    const at =
      state === "active" ? (d.buildingAt ?? d.created) : (d.ready ?? d.created);
    return {
      host: "vercel",
      id: project,
      name: d.name,
      services: [
        {
          key: `vercel:${project}`,
          host: "vercel",
          service: d.name,
          environment: "production",
          status,
          state,
          at: new Date(at).toISOString(),
          commit: firstLine(d.meta?.githubCommitMessage),
          href:
            d.inspectorUrl ??
            (slug
              ? `https://vercel.com/${slug}/${d.name}`
              : `https://vercel.com/dashboard`),
        },
      ],
    };
  });
}

let teams: { token: string; scopes: Scope[]; at: number } | null = null;

/** Every team the token reaches; just the personal account when it has none. */
async function scopes(token: string): Promise<Scope[]> {
  if (teams?.token === token && Date.now() - teams.at < TEAMS_TTL_MS)
    return teams.scopes;
  const list = Teams.parse(await get(token, "/v2/teams?limit=20")).teams;
  const found: Scope[] = list.length
    ? list.map((t) => ({ teamId: t.id, slug: t.slug }))
    : [null];
  teams = { token, scopes: found, at: Date.now() };
  return found;
}

/** Every Vercel project with a production deployment, one request per team. */
export async function readVercel(token: string): Promise<HostProject[]> {
  const all = await Promise.all(
    (await scopes(token)).map(async (scope) => {
      const query = new URLSearchParams({
        target: "production",
        limit: String(LIMIT),
      });
      if (scope) query.set("teamId", scope.teamId);
      const { deployments } = Deployments.parse(
        await get(token, `/v6/deployments?${query}`),
      );
      return fromVercel(deployments, scope?.slug ?? null);
    }),
  );
  return all.flat();
}
