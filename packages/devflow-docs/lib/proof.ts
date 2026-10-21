import {
  GITHUB_API_URL,
  LICENSE,
  MODULE_COUNT,
  NPM_PACKAGE,
  NPM_REGISTRY_URL,
  SITE_URL,
} from "./site";

export interface NpmProof {
  version: string;
  publishedAt: string | null;
  license: string;
  downloadsLastMonth: number;
  dependencies: number;
}

export interface GithubProof {
  stars: number;
  forks: number;
  openIssues: number;
  license: string;
  pushedAt: string | null;
  defaultBranch: string;
}

export interface ProjectProof {
  npm: NpmProof | null;
  github: GithubProof | null;
  moduleCount: number;
  license: string;
  siteUrl: string;
}

const REVALIDATE = 3600;

async function fetchJson<T>(url: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getNpmProof(): Promise<NpmProof | null> {
  const meta = await fetchJson<{
    "dist-tags"?: { latest?: string };
    versions?: Record<string, { dependencies?: Record<string, string> }>;
    time?: Record<string, string>;
    license?: string;
  }>(NPM_REGISTRY_URL, REVALIDATE);

  if (!meta) return null;

  const version = meta["dist-tags"]?.latest;
  if (!version) return null;

  let downloadsLastMonth = 0;
  const downloads = await fetchJson<{ downloads?: number }>(
    `https://api.npmjs.org/downloads/point/last-month/${NPM_PACKAGE}`,
    REVALIDATE,
  );
  if (downloads?.downloads) downloadsLastMonth = downloads.downloads;

  return {
    version,
    publishedAt: meta.time?.[version] ?? null,
    license: meta.license ?? LICENSE,
    downloadsLastMonth,
    dependencies: Object.keys(meta.versions?.[version]?.dependencies ?? {}).length,
  };
}

export async function getGithubProof(): Promise<GithubProof | null> {
  const repo = await fetchJson<{
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    license?: { spdx_id?: string } | null;
    pushed_at?: string;
    default_branch?: string;
  }>(GITHUB_API_URL, REVALIDATE);

  if (!repo) return null;

  return {
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    license: repo.license?.spdx_id ?? LICENSE,
    pushedAt: repo.pushed_at ?? null,
    defaultBranch: repo.default_branch ?? "main",
  };
}

export async function getProjectProof(): Promise<ProjectProof> {
  const [npm, github] = await Promise.all([getNpmProof(), getGithubProof()]);

  return {
    npm,
    github,
    moduleCount: MODULE_COUNT,
    license: npm?.license ?? github?.license ?? LICENSE,
    siteUrl: SITE_URL,
  };
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
