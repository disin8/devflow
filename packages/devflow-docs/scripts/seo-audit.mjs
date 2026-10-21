const BASE = process.env.BASE_URL ?? "http://localhost:3111";

const ROUTES = [
  "/",
  "/cli",
  "/templates",
  "/changelog",
  "/builder",
  "/docs",
  "/docs/installation",
  "/docs/quick-start",
  "/docs/configuration",
  "/docs/presets",
  "/docs/dry-run",
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
  "/modules",
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
  "/guides",
  "/guides/eslint-prettier-husky",
  "/guides/github-actions-nextjs",
  "/guides/vitest-react-typescript",
  "/guides/nestjs-docker",
  "/guides/turborepo-ci",
  "/guides/conventional-commits",
  "/guides/security-ci",
  "/compare",
  "/compare/manual-setup",
  "/compare/create-next-app",
  "/compare/nx",
  "/compare/turborepo",
];

const MIN_WORDS = 250;
const MAX_TITLE = 70;
const MAX_DESCRIPTION = 160;

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag, name) => {
  const match = new RegExp(`${name}="([^"]*)"`).exec(tag);
  return match ? match[1] : null;
};

const problems = [];
const titles = new Map();
const descriptions = new Map();
const rows = [];

for (const route of ROUTES) {
  const res = await fetch(`${BASE}${route}`);
  if (!res.ok) {
    problems.push(`${route}: HTTP ${res.status}`);
    continue;
  }

  const html = await res.text();
  const issues = [];

  const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(html);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title) issues.push("missing <title>");
  if (title && title.length > MAX_TITLE) issues.push(`title too long (${title.length})`);
  if (title && title.length < 20) issues.push(`title too short (${title.length})`);

  const descTag = html.match(/<meta name="description" content="[^"]*"\s*\/?>/);
  const description = descTag ? attr(descTag[0], "content") : null;
  if (!description) issues.push("missing meta description");
  if (description && description.length > MAX_DESCRIPTION)
    issues.push(`description too long (${description.length})`);
  if (description && description.length < 70)
    issues.push(`description too short (${description.length})`);

  const canonicalTag = html.match(/<link rel="canonical" href="[^"]*"\s*\/?>/);
  if (!canonicalTag) issues.push("missing canonical");
  else {
    const canonical = attr(canonicalTag[0], "href");
    const expected = `https://dev-flow.xyz${route === "/" ? "" : route}`;
    if (canonical !== expected)
      issues.push(`canonical is ${canonical}, expected ${expected}`);
  }

  for (const property of [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:type",
  ]) {
    if (!html.includes(`property="${property}"`)) {
      issues.push(`missing ${property}`);
    }
  }

  if (!html.includes('name="twitter:card"')) issues.push("missing twitter:card");
  if (!html.includes('name="twitter:title"')) issues.push("missing twitter:title");

  const h1s = html.match(/<h1[\s>]/gi) ?? [];
  if (h1s.length !== 1) issues.push(`expected 1 h1, found ${h1s.length}`);

  const jsonLdBlocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
  if (jsonLdBlocks.length === 0) issues.push("missing JSON-LD");
  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block[1]);
    } catch {
      issues.push("invalid JSON-LD");
    }
  }

  const words = strip(html).split(" ").filter(Boolean).length;
  if (words < MIN_WORDS) issues.push(`thin content (${words} words)`);

  if (title) {
    const seen = titles.get(title);
    if (seen) issues.push(`duplicate title, also on ${seen}`);
    else titles.set(title, route);
  }
  if (description) {
    const seen = descriptions.get(description);
    if (seen) issues.push(`duplicate description, also on ${seen}`);
    else descriptions.set(description, route);
  }

  for (const issue of issues) problems.push(`${route}: ${issue}`);
  rows.push({ route, title, words, issues });
}

console.log("Route                                 Words  Title length");
console.log("------------------------------------ -----  -------------");
for (const row of rows) {
  console.log(
    `${row.route.padEnd(36)} ${String(row.words).padStart(5)}  ${String(
      row.title?.length ?? 0,
    ).padStart(13)}`,
  );
}

if (problems.length > 0) {
  console.error(`\n${problems.length} issue(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`\nAll ${rows.length} routes pass.`);
