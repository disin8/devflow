const BASE = process.env.BASE_URL ?? "http://localhost:3111";

const START_PATHS = [
  "/",
  "/cli",
  "/templates",
  "/changelog",
  "/builder",
  "/docs",
  "/modules",
  "/guides",
  "/compare",
  "/docs/installation",
  "/docs/quick-start",
  "/docs/configuration",
  "/docs/presets",
  "/docs/dry-run",
  "/docs/cli-reference",
  "/docs/wizard",
  "/docs/modules",
  "/docs/modules/git",
  "/docs/modules/quality",
  "/docs/modules/testing",
  "/docs/modules/ci-cd",
  "/docs/modules/docker",
  "/docs/modules/releases",
  "/docs/modules/security",
  "/docs/modules/monorepo",
  "/docs/modules/dx",
  "/docs/modules/docs",
  "/docs/architecture/overview",
  "/docs/architecture/context-detection",
  "/docs/architecture/executor",
  "/docs/architecture/module-interface",
  "/docs/guides/contributing",
  "/docs/guides/creating-modules",
  "/modules/eslint",
  "/modules/prettier",
  "/modules/husky",
  "/modules/lint-staged",
  "/modules/commitlint",
  "/modules/vitest",
  "/modules/github-actions",
  "/modules/docker",
  "/modules/monorepo",
  "/modules/security",
  "/guides/eslint-prettier-husky",
  "/guides/github-actions-nextjs",
  "/guides/vitest-react-typescript",
  "/guides/nestjs-docker",
  "/guides/turborepo-ci",
  "/guides/conventional-commits",
  "/guides/security-ci",
  "/compare/manual-setup",
  "/compare/create-next-app",
  "/compare/nx",
  "/compare/turborepo",
];

const isInternal = (href) =>
  href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next");

const links = new Set();
const visited = new Set();
const broken = [];
const redirected = [];

async function crawl(path) {
  if (visited.has(path)) return;
  visited.add(path);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  } catch (error) {
    broken.push({ path, href: path, reason: String(error) });
    return;
  }

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    redirected.push({ path, status: res.status, location });
    if (location && isInternal(location)) await crawl(location);
    return;
  }

  if (!res.ok) {
    broken.push({ path, href: path, reason: `HTTP ${res.status}` });
    return;
  }

  const html = await res.text();
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!isInternal(href)) continue;
    const clean = href.split("#")[0].split("?")[0];
    if (!clean) continue;
    links.add(clean);
  }
}

for (const path of START_PATHS) {
  await crawl(path);
}

for (const link of links) {
  await crawl(link);
}

console.log(`Checked ${visited.size} pages, ${links.size} internal links.`);

if (redirected.length > 0) {
  console.log(`\nRedirects (${redirected.length}):`);
  for (const item of redirected) {
    console.log(`  ${item.status} ${item.path} -> ${item.location}`);
  }
}

if (broken.length > 0) {
  console.error(`\nBroken links (${broken.length}):`);
  for (const item of broken) {
    console.error(`  ${item.path} (${item.reason})`);
  }
  process.exit(1);
}

console.log("\nNo broken internal links.");
