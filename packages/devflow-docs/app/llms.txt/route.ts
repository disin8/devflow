import { compareSource, guidesSource, modulesSource, source } from "@/lib/source";
import { SITE_URL } from "@/lib/site";

export const revalidate = false;

const STATIC_PAGES = [
  {
    title: "DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js and Monorepos",
    url: "/",
    description:
      "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing project.",
  },
  {
    title: "DevFlow CLI — Commands, Flags and Examples",
    url: "/cli",
    description: "Every flag the CLI accepts, with a working example for each one.",
  },
  {
    title: "Project Templates",
    url: "/templates",
    description:
      "Ready-made developer workflow templates for TypeScript, React, Next.js, NestJS and pnpm monorepos.",
  },
  {
    title: "Changelog",
    url: "/changelog",
    description: "Every published version of create-devflow.",
  },
];

export async function GET() {
  const lines: string[] = [];
  lines.push("# DevFlow CLI");
  lines.push("");
  lines.push(
    "DevFlow CLI generates reproducible developer workflows for TypeScript, React, Node.js and monorepos: ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configuration in one command.",
  );
  lines.push("");
  lines.push(`Install: \`npm install create-devflow\` — docs: ${SITE_URL}`);
  lines.push("");

  lines.push("## Start here");
  lines.push("");
  for (const page of STATIC_PAGES) {
    lines.push(`- [${page.title}](${SITE_URL}${page.url}): ${page.description}`);
  }

  const sections = [
    { name: "Modules", pages: modulesSource.getPages() },
    { name: "Guides", pages: guidesSource.getPages() },
    { name: "Comparisons", pages: compareSource.getPages() },
    { name: "Documentation", pages: source.getPages() },
  ];

  for (const section of sections) {
    lines.push("");
    lines.push(`## ${section.name}`);
    lines.push("");
    for (const page of section.pages) {
      lines.push(
        `- [${page.data.title}](${SITE_URL}${page.url}): ${page.data.description ?? ""}`,
      );
    }
  }

  return new Response(lines.join("\n"));
}
