"use client";

import { SectionHeader } from "./section-header";
import { SectionTag } from "./section-tag";
import { Button } from "./button";
import Link from "next/link";
import {
  ShieldCheck,
  Layers,
  Terminal,
  Users,
  Database,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { MODULE_COUNT, CATEGORY_COUNT } from "@/lib/site";

const features = [
  {
    icon: Terminal,
    title: "Git & Commits",
    description:
      "Husky, lint-staged, Commitlint and Commitizen — conventional commits enforced on every commit, with the hook installed on every clone.",
    link: { label: "Husky module", href: "/modules/husky" },
  },
  {
    icon: ShieldCheck,
    title: "Code Quality",
    description:
      "ESLint flat config, Prettier and EditorConfig — rule sets derived from the dependencies in your package.json, not from a copied template.",
    link: { label: "ESLint module", href: "/modules/eslint" },
  },
  {
    icon: Sparkles,
    title: "Testing",
    description:
      "Vitest or Jest with the right environment for your stack, plus Testing Library setup and the npm scripts to run them.",
    link: { label: "Vitest module", href: "/modules/vitest" },
  },
  {
    icon: Layers,
    title: "CI/CD",
    description:
      "GitHub Actions, GitLab CI, Codecov, Dependabot and Renovate — a pipeline that lints, type-checks, tests and builds on every pull request.",
    link: { label: "GitHub Actions module", href: "/modules/github-actions" },
  },
  {
    icon: Database,
    title: "Docker",
    description:
      "Multi-stage Dockerfile with a non-root user, a docker-compose file for local runs and a .dockerignore that keeps the build context small.",
    link: { label: "Docker module", href: "/modules/docker" },
  },
  {
    icon: Users,
    title: "Monorepo",
    description:
      "Nx, Turborepo and pnpm or yarn workspaces, with a shared tsconfig.base.json and the workspace scripts to run them.",
    link: { label: "Monorepo module", href: "/modules/monorepo" },
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 max-md:py-12">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            tag={<SectionTag>What’s inside</SectionTag>}
            title="Every tool your repo needs, wired together"
            description={`${MODULE_COUNT} modules across ${CATEGORY_COUNT} categories. Pick exactly what you need or run a preset — DevFlow detects your stack and generates configs that match it.`}
          />
          <Button href="/modules" variant="outline">
            Browse all modules
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-15 max-md:gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="flex h-full flex-col gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-card">
                <feature.icon size={24} className="text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-roboto-mono text-[18px] font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="text-[16px] leading-[1.4em] text-muted">
                {feature.description}
              </p>
              <Link
                href={feature.link.href}
                className="mt-auto inline-flex items-center gap-1 pt-1 font-roboto-mono text-[14px] text-accent transition-colors hover:opacity-80"
              >
                {feature.link.label} <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
