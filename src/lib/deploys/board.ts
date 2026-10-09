import "server-only";
import { readRailway } from "./railway";
import {
  HostError,
  type DeployState,
  type Host,
  type HostProblem,
  type HostProject,
  type ServiceDeploy,
} from "./shared";
import { readVercel } from "./vercel";

export type { DeployState, Host, HostProblem, ServiceDeploy } from "./shared";

/**
 * The deploy board at the top of the Workspace: Railway and Vercel, read
 * side by side and merged into one list grouped by app, so a site whose API
 * is on Railway and whose front end is on Vercel reads as one group.
 *
 * Each host is optional (its token unset just leaves it out) and fails on
 * its own: Vercel being down still shows Railway. Answers are shared for a
 * few seconds, since every open tab polls.
 */

export type DeployGroup = {
  id: string;
  name: string;
  services: ServiceDeploy[];
};

export type DeployBoard = {
  groups: DeployGroup[];
  /** null: read fine. Otherwise why that host is missing from the groups. */
  hosts: { host: Host; problem: HostProblem | null }[];
  checkedAt: string;
};

const BOARD_TTL_MS = 10_000;

const ORDER: Record<DeployState, number> = {
  active: 0,
  failed: 1,
  live: 2,
  idle: 3,
};

const SOURCES: {
  host: Host;
  token: () => string | undefined;
  read: (token: string) => Promise<HostProject[]>;
}[] = [
  {
    host: "railway",
    token: () => process.env.RAILWAY_API_TOKEN,
    read: readRailway,
  },
  {
    host: "vercel",
    token: () => process.env.VERCEL_API_TOKEN,
    read: readVercel,
  },
];

/** Names compared loosely: "AdooraLegalServices" is "adoora-legal-services". */
const loose = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * One group per app. A Railway project is a group; a Vercel project joins
 * the Railway project it belongs to, found by name: the same name as the
 * project ("adoora-legal-services" and "AdooraLegalServices"), or as one of
 * its services ("adc-frontend" in the project "adoughcookie"). One that
 * matches nothing is a group of its own. Busiest services first; groups in
 * name order, so the board does not reshuffle while deploys come and go.
 */
export function groupProjects(projects: HostProject[]): DeployGroup[] {
  const railway = projects.filter((p) => p.host === "railway");
  const groups = new Map<string, DeployGroup>(
    railway.map((p) => [
      p.id,
      { id: p.id, name: p.name, services: [...p.services] },
    ]),
  );
  for (const p of projects) {
    if (p.host === "railway") continue;
    const name = loose(p.name);
    const home = railway.find(
      (r) =>
        loose(r.name) === name ||
        r.services.some((s) => loose(s.service) === name),
    );
    if (home) groups.get(home.id)?.services.push(...p.services);
    else
      groups.set(`${p.host}:${p.id}`, {
        id: `${p.host}:${p.id}`,
        name: p.name,
        services: [...p.services],
      });
  }
  return [...groups.values()]
    .filter((g) => g.services.length > 0)
    .map((g) => ({
      ...g,
      services: g.services.sort(
        (a, b) =>
          ORDER[a.state] - ORDER[b.state] ||
          a.service.localeCompare(b.service) ||
          a.host.localeCompare(b.host),
      ),
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
}

async function readBoard(): Promise<DeployBoard> {
  const results = await Promise.all(
    SOURCES.map(async ({ host, token, read }) => {
      const value = token()?.trim();
      if (!value)
        return { host, problem: "unset" as HostProblem, projects: [] };
      try {
        return { host, problem: null, projects: await read(value) };
      } catch (error) {
        if (!(error instanceof HostError))
          console.error(`[deploys] Could not read ${host}:`, error);
        const problem: HostProblem =
          error instanceof HostError ? error.kind : "down";
        return { host, problem, projects: [] };
      }
    }),
  );
  return {
    groups: groupProjects(results.flatMap((r) => r.projects)),
    hosts: results.map(({ host, problem }) => ({ host, problem })),
    checkedAt: new Date().toISOString(),
  };
}

let cached: { at: number; value: Promise<DeployBoard> } | null = null;

/** The board, shared between callers for a few seconds. */
export function deployBoard(): Promise<DeployBoard> {
  if (cached && Date.now() - cached.at < BOARD_TTL_MS) return cached.value;
  cached = { at: Date.now(), value: readBoard() };
  return cached.value;
}
