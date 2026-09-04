import "server-only";

/**
 * Reads a public GitHub repository well enough to review it.
 *
 * Not a clone: the tree tells the reviewer how the work is organised, and a
 * bounded selection of source files tells it what the work does. Notebooks,
 * lockfiles and anything binary are skipped — they are large, they are mostly
 * output, and they would crowd out the files being marked.
 *
 * Unauthenticated by default (60 requests an hour, plenty at this scale).
 * Set GITHUB_TOKEN to raise that to 5,000 if reviews start being rate-limited.
 */

export type Repo = { owner: string; repo: string };
export type RepoContents = {
  tree: string[];
  files: { path: string; text: string }[];
};

/** Files worth reading, in the order they matter to a reviewer. */
const READ_EXTENSIONS = [
  ".md",
  ".py",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".sql",
  ".toml",
  ".yaml",
  ".yml",
  ".json",
  ".txt",
  ".cfg",
];

const SKIP_PATHS =
  /(^|\/)(node_modules|\.git|\.venv|venv|__pycache__|dist|build|\.next|site-packages|data)\//i;

const SKIP_FILES = /(package-lock\.json|poetry\.lock|yarn\.lock|\.ipynb)$/i;

const MAX_FILES = 25;
const MAX_FILE_BYTES = 24_000;
const MAX_TOTAL_BYTES = 220_000;

/** The owner and repo in a GitHub URL, or null if it is not one. */
export function parseRepoUrl(url: string): Repo | null {
  try {
    const parsed = new URL(url.trim());
    if (!/^(www\.)?github\.com$/i.test(parsed.hostname)) return null;

    const [owner, repo] = parsed.pathname.replace(/^\//, "").split("/");
    if (!owner || !repo) return null;

    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function headers() {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "nectarray-academy",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
}

export async function fetchRepo(repo: Repo): Promise<RepoContents> {
  const meta = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}`,
    { headers: headers(), signal: AbortSignal.timeout(15_000) },
  );

  if (meta.status === 404) {
    throw new Error(
      "That repository is private or does not exist. Make it public and try again.",
    );
  }
  if (meta.status === 403) {
    throw new Error("GitHub is rate-limiting us. Try again in a few minutes.");
  }
  if (!meta.ok) throw new Error(`GitHub returned ${meta.status}.`);

  const { default_branch: branch } = (await meta.json()) as {
    default_branch: string;
  };

  const treeResponse = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}/git/trees/${branch}?recursive=1`,
    { headers: headers(), signal: AbortSignal.timeout(20_000) },
  );
  if (!treeResponse.ok) {
    throw new Error(
      `Could not read the repository tree (${treeResponse.status}).`,
    );
  }

  const { tree: entries, truncated } = (await treeResponse.json()) as {
    tree: { path: string; type: string; size?: number }[];
    truncated: boolean;
  };

  const blobs = entries.filter((entry) => entry.type === "blob");
  const tree = blobs.map((entry) => entry.path).sort();
  if (truncated) tree.push("… (tree truncated by GitHub)");

  if (blobs.length === 0) throw new Error("That repository is empty.");

  /*
   * A README first — it is where the marked reasoning lives in every one of
   * these briefs — then source files smallest-first, so a 3,000-line notebook
   * export cannot eat the whole budget before anything else is seen.
   */
  const candidates = blobs
    .filter(
      (entry) =>
        !SKIP_PATHS.test(entry.path) &&
        !SKIP_FILES.test(entry.path) &&
        READ_EXTENSIONS.some((extension) =>
          entry.path.toLowerCase().endsWith(extension),
        ),
    )
    .sort((a, b) => {
      const readme = (path: string) => (/readme\.md$/i.test(path) ? 0 : 1);
      return readme(a.path) - readme(b.path) || (a.size ?? 0) - (b.size ?? 0);
    });

  const files: RepoContents["files"] = [];
  let total = 0;

  for (const entry of candidates) {
    if (files.length >= MAX_FILES || total >= MAX_TOTAL_BYTES) break;

    const response = await fetch(
      `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${entry.path}`,
      { signal: AbortSignal.timeout(15_000) },
    );
    if (!response.ok) continue;

    let text = await response.text();
    // A raw NUL means the file is binary despite its extension. Written as
    // an escape rather than a literal control character, which is
    // invisible in a diff and easy to mistake for a space.
    if (text.includes("\u0000")) continue;

    if (text.length > MAX_FILE_BYTES) {
      text = `${text.slice(0, MAX_FILE_BYTES)}\n\n… (truncated)`;
    }

    files.push({ path: entry.path, text });
    total += text.length;
  }

  if (files.length === 0) {
    throw new Error(
      "No readable source files were found — check that the code is committed.",
    );
  }

  return { tree, files };
}
