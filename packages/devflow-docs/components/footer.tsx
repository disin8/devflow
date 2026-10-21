"use client";

import { GithubIcon, Terminal, BookOpen, Blocks, ArrowUpRight, Package } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "./copy-command";
import { GITHUB_URL, NPM_URL, LICENSE } from "@/lib/site";

const links = [
  { label: "Docs", href: "/docs", icon: BookOpen },
  { label: "Modules", href: "/modules", icon: Blocks },
  { label: "Guides", href: "/guides", icon: Terminal },
  { label: "Builder", href: "/builder", icon: Blocks },
];

export function Footer() {
  return (
    <footer className="bg-page">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card">
              <Terminal size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-roboto-mono text-[14px] font-medium text-foreground">
                Ready to get started?
              </p>
              <p className="text-[13px] text-muted">
                One command to generate the whole workflow.
              </p>
            </div>
          </div>
          <CopyCommand command="npx create-devflow" />
        </div>

        <div className="grid gap-10 border-t border-line py-10 md:grid-cols-4">
          <div className="flex flex-col gap-3 md:col-span-2">
            <span className="font-roboto-mono text-[15px] font-bold text-foreground">
              DevFlow CLI
            </span>
            <p className="max-w-sm text-[13px] leading-relaxed text-muted">
              Generate reproducible developer workflows for TypeScript, React,
              Node.js and monorepos: ESLint, Prettier, Husky, Vitest, GitHub
              Actions, Docker and security configuration in one command.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[13px] text-muted">
              <a
                href={NPM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Package size={14} /> npm
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <GithubIcon size={14} /> GitHub
              </a>
              <Link
                href="/changelog"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                Changelog <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-roboto-mono text-[13px] uppercase tracking-wide text-muted">
              Product
            </span>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-roboto-mono text-[13px] uppercase tracking-wide text-muted">
              Learn
            </span>
            <Link
              href="/cli"
              className="text-[14px] text-muted transition-colors hover:text-foreground"
            >
              CLI reference
            </Link>
            <Link
              href="/docs/presets"
              className="text-[14px] text-muted transition-colors hover:text-foreground"
            >
              Presets
            </Link>
            <Link
              href="/compare"
              className="text-[14px] text-muted transition-colors hover:text-foreground"
            >
              Comparisons
            </Link>
            <Link
              href="/docs/dry-run"
              className="text-[14px] text-muted transition-colors hover:text-foreground"
            >
              Dry run mode
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 md:flex-row">
          <p className="text-[13px] text-muted">
            &copy; {new Date().getFullYear()} DevFlow. Open source under the{" "}
            {LICENSE} license.
          </p>
          <p className="font-roboto-mono text-[12px] text-muted">
            create-devflow · MIT · Node.js &gt;= 18
          </p>
        </div>
      </div>
    </footer>
  );
}
