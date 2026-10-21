"use client";

import { SectionHeader } from "./section-header";
import { SectionTag } from "./section-tag";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const blocks = [
  {
    title: "Direct commands",
    description:
      "Skip the wizard. Use --husky, --lint, --test, --ci, --docker and --only to add exactly the modules you want from a script or a CI pipeline.",
    href: "/cli",
    linkLabel: "CLI flags and examples",
  },
  {
    title: "Preset configs",
    description:
      "Minimal, Recommended or Full, adjusted for the detected stack and repository type. Run npx create-devflow --all for an opinionated setup in one command.",
    href: "/docs/presets",
    linkLabel: "Compare the three presets",
  },
  {
    title: "Safe re-runs",
    description:
      "Every generated file is created with skip-if-exists semantics, so an existing eslint.config.mjs is never replaced. Run it again after a new module lands and only the missing pieces are added.",
    href: "/docs/configuration",
    linkLabel: "How detection and re-runs work",
  },
];

export function FeatureBlocks() {
  return (
    <section className="py-24 max-md:py-12">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="mb-16">
          <SectionHeader
            tag={<SectionTag>Developer experience</SectionTag>}
            title="Designed for real-world repos"
            description="Three different ways to use DevFlow — the wizard, a preset, or direct flags. Whichever fits your workflow."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blocks.map((block) => (
            <div
              key={block.title}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition-all hover:border-accent/20"
            >
              <div className="flex h-full flex-col p-6">
                <h4 className="font-roboto-mono text-[18px] font-semibold text-foreground mb-2">
                  {block.title}
                </h4>
                <p className="text-[14px] leading-[1.4em] text-muted mb-4">
                  {block.description}
                </p>
                <Link
                  href={block.href}
                  className="mt-auto inline-flex items-center gap-1 font-roboto-mono text-[14px] font-medium text-accent transition-colors hover:opacity-80"
                >
                  {block.linkLabel} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
