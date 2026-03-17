"use client";

import { GithubIcon, Terminal, BookOpen, Blocks, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-page">
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
                One command to set up your entire dev workflow.
              </p>
            </div>
          </div>
          <code className="rounded-xl border border-line bg-card px-5 py-2.5 font-roboto-mono text-[14px] text-accent select-all">
            npx create-devflow
          </code>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 md:flex-row">
          <p className="text-[13px] text-muted">
            &copy; {new Date().getFullYear()} DevFlow. Open-source under MIT License.
          </p>
          <div className="flex items-center gap-4 text-[13px] text-muted">
            <Link
              href="https://github.com/disin8/devflow"
              aria-label="GitHub"
              target="_blank"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <GithubIcon size={16} /> GitHub
            </Link>
            <span className="text-line">·</span>
            <Link href="/docs" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
              <BookOpen size={12} /> Docs
            </Link>
            <span className="text-line">·</span>
            <Link href="/builder" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
              <Blocks size={12} /> Builder
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
