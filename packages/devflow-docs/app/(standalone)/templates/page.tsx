import type { Metadata } from "next";
import Link from "next/link";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { JsonLd } from "@/components/json-ld";
import { CopyCommand } from "@/components/copy-command";
import { buildPageMetadata, breadcrumbSchema, faqSchema, softwareApplicationSchema } from "@/lib/seo";
import { keywordsFor } from "@/lib/keywords";
import { faqsFor } from "@/lib/faqs";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Project Templates — TypeScript, React, Next.js and NestJS",
  description:
    "Ready-made developer workflow templates for TypeScript, React, Next.js, NestJS and pnpm monorepos — one command to apply.",
  path: "/templates",
  keywords: keywordsFor("/templates"),
  type: "article",
});

interface Template {
  id: string;
  name: string;
  stack: string;
  command: string;
  summary: string;
  includes: string[];
  guide?: { label: string; href: string };
}

const TEMPLATES: Template[] = [
  {
    id: "typescript-node",
    name: "TypeScript / Node.js service",
    stack: "Node.js · TypeScript",
    command: "npx create-devflow --all --pm pnpm",
    summary:
      "The baseline for a backend service or a CLI: strict TypeScript, ESLint, Prettier, Vitest, GitHub Actions and a multi-stage Dockerfile.",
    includes: [
      "ESLint flat config with typescript-eslint",
      "Prettier configuration and ignore file",
      "Husky with lint-staged and Commitlint",
      "Vitest with V8 coverage",
      "GitHub Actions pipeline",
      "Multi-stage Dockerfile and docker-compose",
      "npm audit and Gitleaks",
    ],
    guide: { label: "Docker setup for NestJS", href: "/guides/nestjs-docker" },
  },
  {
    id: "react-typescript",
    name: "React + TypeScript application",
    stack: "React · TypeScript · Vite",
    command: "npx create-devflow --all --pm pnpm",
    summary:
      "A React application with the React ESLint plugin, the React Hooks rules, jsdom-based component tests and Testing Library wired in.",
    includes: [
      "ESLint with eslint-plugin-react and react-hooks",
      "Vitest with a jsdom environment",
      "Testing Library setup file",
      "Prettier and lint-staged",
      "GitHub Actions pipeline",
      "EditorConfig, .nvmrc and .env.example",
    ],
    guide: { label: "ESLint, Prettier and Husky setup", href: "/guides/eslint-prettier-husky" },
  },
  {
    id: "nextjs",
    name: "Next.js application",
    stack: "Next.js · React · TypeScript",
    command: "npx create-devflow --all --ci github",
    summary:
      "A Next.js project with the same React-flavoured lint rules plus a pull request pipeline that lints, type-checks, tests and builds.",
    includes: [
      "ESLint with the React and React Hooks rules",
      "Vitest with a jsdom environment",
      "GitHub Actions pipeline for pull requests",
      "Husky, lint-staged and Commitlint",
      "Dockerfile for a container deployment",
    ],
    guide: { label: "GitHub Actions CI/CD for Next.js", href: "/guides/github-actions-nextjs" },
  },
  {
    id: "nestjs",
    name: "NestJS service",
    stack: "NestJS · TypeScript",
    command: "npx create-devflow --all --docker",
    summary:
      "A NestJS service with a non-root container image, a health check recipe and a CI job that builds and pushes the image.",
    includes: [
      "Strict TypeScript and a typecheck script",
      "Vitest with the node environment",
      "Multi-stage Dockerfile, compose and .dockerignore",
      "GitHub Actions pipeline",
      "Security scanning workflows",
    ],
    guide: { label: "Docker setup for NestJS", href: "/guides/nestjs-docker" },
  },
  {
    id: "monorepo",
    name: "pnpm + Turborepo monorepo",
    stack: "pnpm workspaces · Turborepo",
    command: "npx create-devflow --only turborepo --only workspaces",
    summary:
      "A workspace with a task graph, a shared tsconfig.base.json, workspace scripts and a CI pipeline that caches Turborepo output.",
    includes: [
      "turbo.json pipeline and turbo scripts",
      "pnpm-workspace.yaml",
      "Shared tsconfig.base.json",
      "lint:all and test:all workspace scripts",
      "Remote caching diff for the CI workflow",
    ],
    guide: { label: "Turborepo CI/CD", href: "/guides/turborepo-ci" },
  },
  {
    id: "security-hardened",
    name: "Security-hardened repository",
    stack: "Any stack · CI security",
    command: "npx create-devflow --security",
    summary:
      "Adds secret detection, dependency auditing and container scanning to an existing repository without touching anything else.",
    includes: [
      "Gitleaks config and workflow with full-history scan",
      "npm audit script with a high-severity threshold",
      "Trivy vulnerability and misconfiguration workflow",
      "OSV-Scanner dependency workflow",
    ],
    guide: { label: "Security scanning in CI", href: "/guides/security-ci" },
  },
];

export default function TemplatesPage() {
  const faqs = faqsFor("/templates");
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Templates", url: absoluteUrl("/templates") },
    ]),
    softwareApplicationSchema(),
    faqSchema(faqs),
  ];

  return (
    <DocsPage>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <DocsTitle>Project Templates</DocsTitle>
      <DocsDescription>
        A template is a DevFlow preset plus the modules that a particular stack
        needs. The command below is the whole template — copy it, run it in an
        existing repository, and review the diff.
      </DocsDescription>
      <DocsBody>
        <p>
          DevFlow does not scaffold an application. A template describes the{" "}
          <em>workflow</em> a project of that kind should have, which is why
          every command works on a repository you already have. If you need a
          new application, create it first — with{" "}
          <code>create-next-app</code>, <code>create-vite</code> or{" "}
          <code>nest new</code> — then apply the template. The{" "}
          <Link href="/compare/create-next-app">
            DevFlow vs create-next-app comparison
          </Link>{" "}
          explains the order.
        </p>

        <div className="not-prose my-8 flex flex-col gap-5">
          {TEMPLATES.map((template) => (
            <article key={template.id} className="rounded-2xl border border-line p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-archivo text-[22px] text-foreground">
                  {template.name}
                </h3>
                <span className="font-roboto-mono text-[12px] text-muted">
                  {template.stack}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {template.summary}
              </p>
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {template.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-[14px] text-muted">
                    <span className="text-accent">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CopyCommand command={template.command} />
                {template.guide && (
                  <Link
                    href={template.guide.href}
                    className="font-roboto-mono text-[14px] text-accent underline underline-offset-4 hover:opacity-80"
                  >
                    {template.guide.label}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <h2 id="custom">Build your own template</h2>
        <p>
          Every template above is a list of module ids. The{" "}
          <Link href="/builder">visual builder</Link> turns a set of modules
          into a copy-pasteable command, and the{" "}
          <Link href="/cli">CLI reference</Link> documents every flag you can
          combine.
        </p>
        <pre>
          <code>{`# One module
npx create-devflow --only vitest

# A group
npx create-devflow --lint --husky

# Everything for the detected stack
npx create-devflow --all

# A specific combination, no wizard
npx create-devflow --only github-actions --only vitest --yes`}</code>
        </pre>

        <h2 id="faq">FAQ</h2>
        <div className="not-prose my-6 flex flex-col divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
          {[
            {
              question: "Do templates create a new project?",
              answer:
                "No. DevFlow configures an existing repository. Create the application first, then apply the template to add the workflow around it.",
            },
            {
              question: "Can I use a template on a repository that already has configuration?",
              answer:
                "Yes. Every generated file is created with skip-if-exists semantics, so an existing eslint.config.mjs, .prettierrc.json or CI workflow is left untouched. Only package.json is merged, and existing scripts are never replaced.",
            },
            {
              question: "Which template should I pick?",
              answer:
                "Start with the one that matches your stack. If you already have linting and testing, apply only the missing modules with --only, which is safer than applying a whole template.",
            },
          ].map((faq) => (
            <details key={faq.question} className="group px-6 py-5 max-sm:px-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-roboto-mono text-[15px] text-foreground">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[20px] leading-none text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </DocsBody>
    </DocsPage>
  );
}
