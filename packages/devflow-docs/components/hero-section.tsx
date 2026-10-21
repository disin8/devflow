"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import Link from "next/link";
import { ChevronRight, Copy, Check } from "lucide-react";
import { LogoBar } from "./logo-bar";
import { CopyCommand } from "./copy-command";
import { MODULE_COUNT, LICENSE } from "@/lib/site";

const typewriterWords = [
  "Node.js projects",
  "TypeScript repos",
  "pnpm workspaces",
  "React apps",
  "NestJS services",
];

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
  }, [charIndex, index, isDeleting]);

  return (
    <span className="text-accent">
      {typewriterWords[index].substring(0, charIndex)}
      <span className="cursor-blink">|</span>
    </span>
  );
}

interface Segment {
  text: string;
  color: "accent" | "muted" | "white" | "path";
}

interface CodeTab {
  label: string;
  lines: { num: number; segments: Segment[] }[];
  copy?: string;
}

const colorMap: Record<Segment["color"], string> = {
  accent: "text-accent",
  muted: "text-code-dim",
  white: "text-foreground",
  path: "text-code",
};

const codeTabs: CodeTab[] = [
  {
    label: "Dry run",
    copy: "npx create-devflow --dry-run",
    lines: [
      { num: 1, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --dry-run", color: "accent" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "Execution Plan", color: "white" }] },
      { num: 4, segments: [] },
      { num: 5, segments: [{ text: "  Files to create:", color: "muted" }] },
      { num: 6, segments: [{ text: "  • .husky/pre-commit", color: "path" }] },
      { num: 7, segments: [{ text: "  • eslint.config.mjs", color: "path" }] },
      { num: 8, segments: [{ text: "  • .prettierrc.json", color: "path" }] },
      { num: 9, segments: [{ text: "  • vitest.config.ts", color: "path" }] },
      { num: 10, segments: [{ text: "  • .github/workflows/ci.yml", color: "path" }] },
      { num: 11, segments: [] },
      { num: 12, segments: [{ text: "  Packages to install:", color: "muted" }] },
      { num: 13, segments: [{ text: "  • devDependencies: eslint, prettier, husky, vitest", color: "path" }] },
      { num: 14, segments: [] },
      { num: 15, segments: [{ text: "  Scripts to add:", color: "muted" }] },
      { num: 16, segments: [{ text: "  • lint: eslint .", color: "path" }] },
      { num: 17, segments: [{ text: "  • test: vitest run", color: "path" }] },
    ],
  },
  {
    label: "Preset",
    copy: "npx create-devflow --all --yes",
    lines: [
      { num: 1, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --all --yes", color: "accent" }] },
      { num: 2, segments: [] },
      { num: 3, segments: [{ text: "  Files created / updated", color: "white" }] },
      { num: 4, segments: [] },
      { num: 5, segments: [{ text: "  Created files:", color: "muted" }] },
      { num: 6, segments: [{ text: "  • .husky/pre-commit", color: "path" }] },
      { num: 7, segments: [{ text: "  • .husky/commit-msg", color: "path" }] },
      { num: 8, segments: [{ text: "  • commitlint.config.mjs", color: "path" }] },
      { num: 9, segments: [{ text: "  • eslint.config.mjs", color: "path" }] },
      { num: 10, segments: [{ text: "  • .prettierrc.json", color: "path" }] },
      { num: 11, segments: [{ text: "  • vitest.config.ts", color: "path" }] },
      { num: 12, segments: [{ text: "  • .github/workflows/ci.yml", color: "path" }] },
      { num: 13, segments: [{ text: "  • Dockerfile, docker-compose.yml, .dockerignore", color: "path" }] },
      { num: 14, segments: [] },
      { num: 15, segments: [{ text: "  Added scripts:", color: "muted" }] },
      { num: 16, segments: [{ text: "  • prepare: husky", color: "path" }] },
      { num: 17, segments: [{ text: "  • lint: eslint .", color: "path" }] },
    ],
  },
  {
    label: "Flags",
    copy: "npx create-devflow --only github-actions",
    lines: [
      { num: 1, segments: [{ text: "# Add only GitHub Actions", color: "muted" }] },
      { num: 2, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --only github-actions", color: "accent" }] },
      { num: 3, segments: [] },
      { num: 4, segments: [{ text: "# Git hooks, linting and tests", color: "muted" }] },
      { num: 5, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --husky --lint --test", color: "accent" }] },
      { num: 6, segments: [] },
      { num: 7, segments: [{ text: "# Docker and CI, force pnpm", color: "muted" }] },
      { num: 8, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --docker --ci github --pm pnpm", color: "accent" }] },
      { num: 9, segments: [] },
      { num: 10, segments: [{ text: "# Commitlint only", color: "muted" }] },
      { num: 11, segments: [{ text: "$ ", color: "muted" }, { text: "npx create-devflow --only commitlint", color: "accent" }] },
    ],
  },
];

function CodeEditor() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const tab = codeTabs[activeTab];

  async function copy() {
    if (!tab.copy) return;
    try {
      await navigator.clipboard.writeText(tab.copy);
    } catch {
      // clipboard unavailable — the command is still visible on screen
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-adaptive rounded-3xl overflow-hidden max-w-170 w-full">
      <div className="flex border-b border-line">
        {codeTabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(i)}
            className={`relative px-5 py-3 font-roboto-mono text-[13px] transition-colors cursor-pointer ${
              activeTab === i ? "text-foreground" : "text-code hover:text-foreground/60"
            }`}
          >
            {t.label}
            {activeTab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent animate-tab-underline" />
            )}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden">
        {codeTabs.map((t, i) => (
          <div
            key={t.label}
            className={`p-6 font-roboto-mono text-[13px] leading-[1.6em] transition-all duration-300 ${
              activeTab === i
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 absolute inset-0 pointer-events-none"
            }`}
          >
            {t.lines.map((line) => (
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
          href="/cli"
          className="font-roboto-mono text-[13px] text-muted hover:text-foreground transition-colors flex items-center gap-1"
        >
          CLI reference <ChevronRight size={14} />
        </Link>
        <button
          onClick={copy}
          className="text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-2"
          aria-label="Copy command"
        >
          {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
          {copied && <span className="font-roboto-mono text-[12px] text-accent">Copied</span>}
        </button>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-hero" />
      <div className="absolute inset-0 z-1 pointer-events-none opacity-50 bg-hero-glow" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-10 max-md:px-5 pt-24 pb-12 max-md:pt-16 max-md:pb-8">
        <Link
          href="/modules"
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-line bg-card px-4 py-2 transition-colors hover:border-accent/30"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-roboto-mono text-[14px] text-accent">
            v0.2.0 · {LICENSE} licensed · {MODULE_COUNT} modules
          </span>
          <div className="flex items-center max-sm:hidden">
            <ChevronRight size={14} className="text-accent -mr-1" />
            <ChevronRight size={14} className="text-accent opacity-60 -mr-1" />
            <ChevronRight size={14} className="text-accent opacity-30" />
          </div>
        </Link>

        <h1 className="mb-6 max-w-5xl text-balance text-center font-archivo text-[52px] max-lg:text-[42px] max-md:text-[30px] font-medium leading-[1.12em] text-foreground">
          DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js
          and Monorepos
        </h1>

        <p className="mb-4 max-w-2xl text-center text-[18px] leading-[1.5em] text-muted">
          Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and
          security configs for your existing project — without copy-pasting
          boilerplate.
        </p>

        <p className="mb-10 max-w-2xl text-center font-roboto-mono text-[15px] text-muted">
          Detects <TypewriterText />
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/docs/quick-start" variant="primary">
            Get started
          </Button>
          <Button href="/modules" variant="secondary">
            See generated files
          </Button>
        </div>

        <div className="mb-12 flex flex-col items-center gap-3">
          <CopyCommand command="npx create-devflow --dry-run" />
          <span className="text-[13px] text-muted">
            Safe preview — prints the plan and writes nothing
          </span>
        </div>

        <CodeEditor />

        <LogoBar />
      </div>
    </section>
  );
}
