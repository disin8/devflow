"use client";

import { SectionHeader } from "./section-header";
import { Button } from "./button";
import {
  ShieldCheck,
  Layers,
  Terminal,
  Users,
  Database,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Git & Commits",
    description: "Husky, lint-staged, Commitlint, Commitizen, Lefthook, git-cliff — conventional commits enforced from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Code Quality",
    description: "ESLint flat config, Prettier, Biome, EditorConfig — stack-aware rules auto-detected from your project.",
  },
  {
    icon: Sparkles,
    title: "Testing",
    description: "Vitest or Jest with coverage thresholds, happy-dom, and sensible defaults wired in immediately.",
  },
  {
    icon: Layers,
    title: "CI/CD",
    description: "GitHub Actions, GitLab CI, Dependabot and Renovate configs generated and ready to push.",
  },
  {
    icon: Database,
    title: "Docker",
    description: "Multi-stage Dockerfile, docker-compose.yml, and .dockerignore crafted for your stack.",
  },
  {
    icon: Users,
    title: "Monorepo",
    description: "First-class Nx, Turborepo, and pnpm/yarn workspace support with shared config inheritance.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            tag="What’s inside"
            title="Every tool your repo needs, wired together"
            description="40+ modules across 10 categories. Pick exactly what you need or run a preset — DevFlow configures and connects everything."
          />
          <Button href="/docs/modules" variant="outline">
            Browse modules
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-15 max-md:gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-card">
                <feature.icon size={24} className="text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-(family-name:--font-roboto-mono) text-[18px] font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="text-[16px] leading-[1.4em] text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
