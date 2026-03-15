"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "./section-header";
import { Button } from "./button";

type Segment = { text: string; color: "accent" | "muted" | "white" | "green" | "red" };
type Line = { num: number; segments: Segment[] };

const accordionItems = [
  {
    step: "01",
    title: "Auto-detect your project",
    description: "DevFlow reads your repository — package manager, TypeScript usage, existing tools, monorepo layout — and pre-answers every question it can.",
    lines: [
      { num: 1, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow", color: "accent" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  Scanning project...", color: "muted" }] },
      { num: 4, segments: [] },
      { num: 5, segments: [{ text: "  ✓", color: "accent" }, { text: "  Package manager: ", color: "muted" }, { text: "pnpm", color: "accent" }] },
      { num: 6, segments: [{ text: "  ✓", color: "accent" }, { text: "  Language:        ", color: "muted" }, { text: "TypeScript", color: "accent" }] },
      { num: 7, segments: [{ text: "  ✓", color: "accent" }, { text: "  Framework:       ", color: "muted" }, { text: "React (Vite)", color: "accent" }] },
      { num: 8, segments: [{ text: "  ✓", color: "accent" }, { text: "  Monorepo:        ", color: "muted" }, { text: "No", color: "accent" }] },
      { num: 9, segments: [] },
      { num: 10, segments: [{ text: "  Ready to configure ", color: "muted" }, { text: "5 modules", color: "accent" }, { text: ".", color: "muted" }] },
    ] as Line[],
  },
  {
    step: "02",
    title: "Pick your stack & modules",
    description: "Choose repo type (single / monorepo), target stack, and individual modules via a checkbox UI. Fine-tune commit strictness, CI provider, and more.",
    lines: [
      { num: 1, segments: [{ text: "? Select modules to apply:", color: "white" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  ◉  ", color: "accent" }, { text: "Git hooks    ", color: "white" }, { text: "(Husky + lint-staged)", color: "muted" }] },
      { num: 4, segments: [{ text: "  ◉  ", color: "accent" }, { text: "Code quality ", color: "white" }, { text: "(ESLint + Prettier)", color: "muted" }] },
      { num: 5, segments: [{ text: "  ◉  ", color: "accent" }, { text: "Testing      ", color: "white" }, { text: "(Vitest + coverage)", color: "muted" }] },
      { num: 6, segments: [{ text: "  ◉  ", color: "accent" }, { text: "CI/CD        ", color: "white" }, { text: "(GitHub Actions)", color: "muted" }] },
      { num: 7, segments: [{ text: "  ◯  ", color: "muted" }, { text: "Docker       ", color: "muted" }, { text: "(Dockerfile + compose)", color: "muted" }] },
      { num: 8, segments: [{ text: "  ◯  ", color: "muted" }, { text: "Security     ", color: "muted" }, { text: "(audit + snyk)", color: "muted" }] },
      { num: 9, segments: [] },
      { num: 10, segments: [{ text: "  4 modules selected", color: "accent" }] },
    ] as Line[],
  },
  {
    step: "03",
    title: "Review the execution plan",
    description: "See every file that will be created or modified before anything is written. Use --dry-run to get the full diff without side-effects.",
    lines: [
      { num: 1, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --dry-run", color: "accent" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  Dry run — no files will be written", color: "muted" }] },
      { num: 4, segments: [] },
      { num: 5, segments: [{ text: "  + ", color: "green" }, { text: ".husky/pre-commit", color: "white" }] },
      { num: 6, segments: [{ text: "  + ", color: "green" }, { text: ".husky/commit-msg", color: "white" }] },
      { num: 7, segments: [{ text: "  + ", color: "green" }, { text: "eslint.config.js", color: "white" }] },
      { num: 8, segments: [{ text: "  ~ ", color: "accent" }, { text: "package.json  ", color: "white" }, { text: "(scripts updated)", color: "muted" }] },
      { num: 9, segments: [{ text: "  + ", color: "green" }, { text: "vitest.config.ts", color: "white" }] },
      { num: 10, segments: [{ text: "  + ", color: "green" }, { text: ".github/workflows/ci.yml", color: "white" }] },
      { num: 11, segments: [] },
      { num: 12, segments: [{ text: "  6 files", color: "accent" }, { text: " · 0 conflicts", color: "muted" }] },
    ] as Line[],
  },
  {
    step: "04",
    title: "Apply & go",
    description: "Progress spinners, per-module summaries, and a final report. Your repo is production-ready — push and your CI pipeline is already green.",
    lines: [
      { num: 1, segments: [{ text: "  Applying modules...", color: "muted" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  ✓  ", color: "accent" }, { text: "Git hooks   ", color: "white" }, { text: "— .husky/ created", color: "muted" }] },
      { num: 4, segments: [{ text: "  ✓  ", color: "accent" }, { text: "ESLint      ", color: "white" }, { text: "— config written", color: "muted" }] },
      { num: 5, segments: [{ text: "  ✓  ", color: "accent" }, { text: "Prettier    ", color: "white" }, { text: "— .prettierrc ready", color: "muted" }] },
      { num: 6, segments: [{ text: "  ✓  ", color: "accent" }, { text: "Vitest      ", color: "white" }, { text: "— config + scripts", color: "muted" }] },
      { num: 7, segments: [{ text: "  ✓  ", color: "accent" }, { text: "CI/CD       ", color: "white" }, { text: "— workflow added", color: "muted" }] },
      { num: 8, segments: [] },
      { num: 9, segments: [{ text: "  🎉 ", color: "white" }, { text: "4 modules applied", color: "accent" }, { text: " — 0 errors", color: "muted" }] },
      { num: 10, segments: [{ text: "  Push to trigger your first pipeline.", color: "muted" }] },
    ] as Line[],
  },
];

const colorMap: Record<string, string> = {
  accent: "text-accent",
  muted: "text-code",
  white: "text-white",
  green: "text-emerald-400",
  red: "text-red-400",
};

function StepPreview({ lines }: { lines: Line[] }) {
  const localColorMap: Record<string, string> = {
    accent: "text-accent",
    muted: "text-code",
    white: "text-foreground",
    green: "text-emerald-400",
    red: "text-red-400",
  };

  return (
    <div className={`glass-adaptive rounded-3xl overflow-hidden w-full h-fit`}>
      <div className={`flex items-center gap-1.5 px-5 py-4 border-b border-line`}>
        <span className={`w-3 h-3 rounded-full bg-line/10`} />
        <span className={`w-3 h-3 rounded-full bg-line/10`} />
        <span className={`w-3 h-3 rounded-full bg-line/10`} />
      </div>
      <div className="p-6 font-(family-name:--font-roboto-mono) text-[13px] leading-[1.7em]">
        {lines.map((line) => (
          <div key={line.num} className="flex">
            <span className="w-8 shrink-0 text-right mr-4 line-number select-none">
              {line.num}
            </span>
            <span>
              {line.segments.map((seg, si) => (
                <span key={si} className={localColorMap[seg.color]}>
                  {seg.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SliderSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((idx) => (idx + 1) % accordionItems.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeIndex, accordionItems.length]);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="mb-16">
          <SectionHeader
            tag="How it works"
            title="From zero to fully configured in minutes"
            description="Run one command. DevFlow walks you through four simple steps — no manual config, no copy-pasted boilerplate."
            centered
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-2">
            {accordionItems.map((item, i) => (
              <button
                key={item.step}
                onClick={() => {
                  setActiveIndex(i);
                  setProgress(0);
                }}
                className={`text-left w-full rounded-2xl border transition-all cursor-pointer ${activeIndex === i
                  ? "border-line bg-card p-6"
                  : "border-transparent p-6 hover:bg-card/50"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-(family-name:--font-roboto-mono) text-[14px] text-accent">
                    {item.step}
                  </span>
                  <h3 className="font-(family-name:--font-roboto-mono) text-[18px] font-medium text-foreground">
                    {item.title}
                  </h3>
                </div>
                {activeIndex === i && (
                  <>
                    <p className="mt-3 pl-10 text-[14px] leading-[1.4em] text-muted">
                      {item.description}
                    </p>
                    <div className="mt-4 ml-10 h-0.5 w-full max-w-50 rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-code-preview">
            <div className="relative aspect-square p-6 flex items-center h-fit">
              <StepPreview lines={accordionItems[activeIndex].lines} />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-code-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
