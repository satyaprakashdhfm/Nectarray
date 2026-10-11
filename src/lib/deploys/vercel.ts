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

/** Just what the board needs of a project: the domains its production serves. */
const Projects = z.object({
  projects: z.array(
    z.object({
      id: z.string(),
      alias: z
        .array(
          z.object({
            domain: z.string(),
            target: z.string().nullish(),
            redirect: z.string().nullish(),
          }),
        )
        .nullish(),
    }),
  ),
});

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
  sites: Map<string, string> = new Map(),
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
          site: sites.get(project) ?? null,
        },
      ],
    };
  });
}

let teams: { token: string; scopes: Scope[]; at: number } | null = null;

/**
 * Each project's public address: a custom production domain if it has one,
 * else its .vercel.app one (never a branch or a redirect). Domains rarely
 * change, so they are kept for ten minutes per team.
 */
const siteCache = new Map<string, { at: number; sites: Map<string, string> }>();

async function productionSites(
  token: string,
  scope: Scope,
): Promise<Map<string, string>> {
  const key = `${token.slice(-8)}:${scope?.teamId ?? "me"}`;
  const kept = siteCache.get(key);
  if (kept && Date.now() - kept.at < TEAMS_TTL_MS) return kept.sites;
  const query = new URLSearchParams({ limit: "100" });
  if (scope) query.set("teamId", scope.teamId);
  const { projects } = Projects.parse(
    await get(token, `/v10/projects?${query}`),
  );
  const sites = new Map<string, string>();
  for (const p of projects) {
    const live = (p.alias ?? []).filter(
      (a) => !a.redirect && (a.target ?? "PRODUCTION") === "PRODUCTION",
    );
    const best = live.find((a) => !a.domain.endsWith(".vercel.app")) ?? live[0];
    if (best) sites.set(p.id, `https://${best.domain}`);
  }
  siteCache.set(key, { at: Date.now(), sites });
  return sites;
}

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
      const [{ deployments }, sites] = await Promise.all([
        get(token, `/v6/deployments?${query}`).then((b) =>
          Deployments.parse(b),
        ),
        // The board still works if the domains cannot be read.
        productionSites(token, scope).catch((error) => {
          console.error("[deploys] Could not read Vercel domains:", error);
          return new Map<string, string>();
        }),
      ]);
      return fromVercel(deployments, scope?.slug ?? null, sites);
    }),
  );
  return all.flat();
}
