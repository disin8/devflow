"use client";

import { SectionHeader } from "./section-header";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const blocks = [
  {
    title: "Direct Commands",
    description: "Skip the wizard entirely. Use --husky, --lint, --test, --ci, --docker and more to add exactly one module from a script or CI pipeline.",
    href: "/docs/cli-reference",
  },
  {
    title: "Preset Configs",
    description: "Minimal, Recommended, or Full presets per stack. Run npx create-devflow --all for an opinionated, batteries-included setup in seconds.",
    href: "/docs/presets",
  },
  {
    title: "Safe Re-runs",
    description: "Already have a .eslintrc? DevFlow detects it and skips. Run it again after adding a new feature — only missing pieces are added.",
    href: "/docs/configuration",
  },
];

export function FeatureBlocks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="mb-16">
          <SectionHeader
            tag="Developer experience"
            title="Designed for real-world repos"
            description="Three different ways to use DevFlow — wizard, presets, or direct flags. Whichever fits your workflow."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blocks.map((block) => (
            <div
              key={block.title}
              className="group overflow-hidden rounded-3xl border border-line bg-card transition-all hover:border-accent/20"
            >
              <div className="p-6">
                <h4 className="font-roboto-mono text-[18px] font-semibold text-foreground mb-2">
                  {block.title}
                </h4>
                <p className="text-[14px] leading-[1.4em] text-muted mb-4">
                  {block.description}
                </p>
                <Link
                  href={block.href}
                  className="inline-flex items-center gap-1 font-roboto-mono text-[14px] font-bold uppercase text-accent transition-colors hover:opacity-80"
                >
                  LEARN MORE <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
