"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import Link from "next/link";
import { ChevronRight, Copy } from "lucide-react";
import { LogoBar } from "./logo-bar";

const typewriterWords = ["Node.js projects", "TypeScript repos", "monorepos", "React apps", "NestJS services"];

function TypewriterText() {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = typewriterWords[index];
    const timeout = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === word.length) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % typewriterWords.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, timeout);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index]);

  return (
    <span className="text-accent">
      {typewriterWords[index].substring(0, charIndex)}
      <span className="cursor-blink">|</span>
    </span>
  );
}

const codeLines = [
  { num: 1, text: "$ ", green: false, highlight: "npx create-devflow", after: "" },
  { num: 2, text: "" },
  { num: 3, text: "  ", green: false, highlight: "✓", after: "  Detected: TypeScript · React · pnpm" },
  { num: 4, text: "  ", green: false, highlight: "✓", after: "  Git hooks  (Husky + lint-staged + commitlint)" },
  { num: 5, text: "  ", green: false, highlight: "✓", after: "  Code quality  (ESLint flat config + Prettier)" },
  { num: 6, text: "  ", green: false, highlight: "✓", after: "  Testing  (Vitest + coverage)" },
  { num: 7, text: "  ", green: false, highlight: "✓", after: "  CI/CD  (GitHub Actions)" },
  { num: 8, text: "  ", green: false, highlight: "✓", after: "  Docker  (Dockerfile + compose + .dockerignore)" },
  { num: 9, text: "  ", green: false, highlight: "✓", after: "  Docs  (README · CONTRIBUTING · LICENSE)" },
  { num: 10, text: "" },
  { num: 11, text: "  🎉 ", green: false, highlight: "7 modules applied", after: " — 0 errors" },
];

const codeTabs = [
  {
    label: "Quick Start",
    lines: [
      { num: 1, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow", color: "accent" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  ✓", color: "accent" }, { text: "  Detected: TypeScript · React · pnpm", color: "muted" }] },
      { num: 4, segments: [{ text: "  ✓", color: "accent" }, { text: "  Git hooks configured", color: "muted" }] },
      { num: 5, segments: [{ text: "  ✓", color: "accent" }, { text: "  ESLint + Prettier wired", color: "muted" }] },
      { num: 6, segments: [{ text: "  ✓", color: "accent" }, { text: "  Vitest + coverage ready", color: "muted" }] },
      { num: 7, segments: [{ text: "  ✓", color: "accent" }, { text: "  GitHub Actions pipeline", color: "muted" }] },
      { num: 8, segments: [] },
      { num: 9, segments: [{ text: "  🎉 ", color: "white" }, { text: "5 modules applied", color: "accent" }, { text: " — 0 errors", color: "muted" }] },
    ],
  },
  {
    label: "Preset",
    lines: [
      { num: 1, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --all", color: "accent" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  Preset: ", color: "muted" }, { text: "full", color: "accent" }] },
      { num: 4, segments: [{ text: "  Stack:  ", color: "muted" }, { text: "react", color: "accent" }] },
      { num: 5, segments: [] },
      { num: 6, segments: [{ text: "  ✓", color: "accent" }, { text: "  Husky · lint-staged · commitlint", color: "muted" }] },
      { num: 7, segments: [{ text: "  ✓", color: "accent" }, { text: "  ESLint · Prettier · EditorConfig", color: "muted" }] },
      { num: 8, segments: [{ text: "  ✓", color: "accent" }, { text: "  Vitest · Playwright · Codecov", color: "muted" }] },
      { num: 9, segments: [{ text: "  ✓", color: "accent" }, { text: "  Docker · CI/CD · Security", color: "muted" }] },
      { num: 10, segments: [] },
      { num: 11, segments: [{ text: "  🎉 ", color: "white" }, { text: "22 modules applied", color: "accent" }, { text: " — 0 errors", color: "muted" }] },
    ],
  },
  {
    label: "Flags",
    lines: [
      { num: 1, segments: [{ text: "# Add only git hooks", color: "muted" }] },
      { num: 2, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --husky", color: "accent" }] },
      { num: 3, segments: [] },
      { num: 4, segments: [{ text: "# Add linting + testing", color: "muted" }] },
      { num: 5, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --lint --test", color: "accent" }] },
      { num: 6, segments: [] },
      { num: 7, segments: [{ text: "# Docker + CI in one go", color: "muted" }] },
      { num: 8, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --docker --ci github", color: "accent" }] },
      { num: 9, segments: [] },
      { num: 10, segments: [{ text: "# Preview without writing", color: "muted" }] },
      { num: 11, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --dry-run", color: "accent" }] },
    ],
  },
];

const colorMap: Record<string, string> = {
  accent: "text-accent",
  muted: "text-code",
  white: "text-foreground",
};

function CodeEditor() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="glass-adaptive rounded-3xl overflow-hidden max-w-170 w-full">
      <div className="flex border-b border-line">
        {codeTabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`relative px-5 py-3 font-roboto-mono text-[13px] transition-colors cursor-pointer ${activeTab === i
              ? "text-foreground"
              : "text-code hover:text-foreground/60"
              }`}
          >
            {tab.label}
            {activeTab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent animate-tab-underline" />
            )}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden">
        {codeTabs.map((tab, i) => (
          <div
            key={tab.label}
            className={`p-6 font-roboto-mono text-[13px] leading-[1.6em] transition-all duration-300 ${activeTab === i
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 absolute inset-0 pointer-events-none"
              }`}
          >
            {tab.lines.map((line) => (
              <div key={line.num} className="flex">
                <span className="w-8 text-right mr-4 line-number select-none">
                  {line.num}
                </span>
                <span>
                  {line.segments.map((seg, si) => (
                    <span key={si} className={colorMap[seg.color]}>
                      {seg.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line px-6 py-3">
        <Link
          href="/docs"
          className="font-roboto-mono text-[13px] text-muted hover:text-foreground transition-colors flex items-center gap-1"
        >
          Documentation <ChevronRight size={14} />
        </Link>
        <button className="text-muted hover:text-foreground transition-colors cursor-pointer" aria-label="Copy code">
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-hero"
      />

      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-50 bg-hero-glow"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-10 max-md:px-5 pt-24 pb-20 max-md:pt-16 max-md:pb-12">
        <Link
          href="/docs"
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-line bg-card px-4 py-2 transition-colors hover:border-accent/30"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-roboto-mono text-[14px] text-accent">
            40+ modules · open source
          </span>
          <div className="flex items-center">
            <ChevronRight size={14} className="text-accent -mr-1" />
            <ChevronRight size={14} className="text-accent opacity-60 -mr-1" />
            <ChevronRight size={14} className="text-accent opacity-30" />
          </div>
        </Link>

        <h1 className="mb-6 text-center font-archivo text-[64px] max-lg:text-[48px] max-md:text-[36px] font-medium leading-[1.2em] text-foreground">
          Ship production-ready{" "}<br className="hidden md:block" />
          workflows for <TypewriterText />
          <span className="sr-only">Node.js projects, TypeScript repos, monorepos, React apps, and NestJS services</span>
        </h1>

        <p className="mb-10 max-w-xl text-center text-[18px] leading-[1.4em] text-muted">
          One command. Git hooks, linting, testing, CI/CD, Docker, security and releases —
          all configured and wired together in seconds.
        </p>

        <div className="mb-16 flex flex-wrap items-center gap-4">
          <Button href="/docs/quick-start" variant="primary">
            Quick start
          </Button>
          <Button href="/docs" variant="secondary">
            Read the docs
          </Button>
        </div>

        <CodeEditor />

        <LogoBar />

      </div>
    </section>
  );
}
