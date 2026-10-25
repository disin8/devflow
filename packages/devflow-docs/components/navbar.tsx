"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Star, Github, Sun, Moon, Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { GITHUB_URL, NPM_URL } from "@/lib/site";

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Modules", href: "/modules" },
  { label: "Guides", href: "/guides" },
  { label: "CLI", href: "/cli" },
  { label: "Builder", href: "/builder" },
];

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

interface NavbarProps {
  stars?: number | null;
  version?: string | null;
}

export function Navbar({ stars, version }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isHomePage = pathname === "/";
  const isBuilderPage = pathname?.startsWith("/builder");

  return (
    <nav className="relative top-0 z-50 w-full">
      <div className={`mx-auto flex items-center gap-10 px-10 max-md:px-5 py-4 ${isHomePage ? 'bg-nav' : isBuilderPage ? 'bg-page' : 'bg-[#292929]'}`}>
        <Link href="/" className="flex items-center gap-2 text-foreground font-roboto-mono text-[15px] font-bold">
          DevFlow
          <span className="hidden sm:inline text-[12px] font-medium text-muted">CLI</span>
        </Link>

        <div className="hidden md:flex items-start gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-roboto-mono text-[14px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 font-roboto-mono text-[13px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <Package size={14} />
            {version ? `v${version}` : "npm"}
          </Link>

          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0 rounded-xl border border-line overflow-hidden font-roboto-mono text-[13px] font-medium transition-colors hover:border-accent/40 group"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 border-r border-line text-muted bg-card transition-colors group-hover:text-foreground">
              <Github size={14} />
              GitHub
            </span>
            {stars !== null && stars !== undefined && (
              <span className="flex items-center gap-1 px-3 py-1.5 text-accent bg-accent/8 transition-colors">
                <Star size={12} fill="currentColor" />
                {formatStars(stars)}
              </span>
            )}
          </Link>
        </div>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-line ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden border-t border-line ${isHomePage ? 'bg-nav' : isBuilderPage ? 'bg-page' : 'bg-[#292929]'} px-5 py-6`}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-roboto-mono text-[14px] font-medium text-muted transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={NPM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 border border-line rounded-xl px-5 py-2.5 font-roboto-mono text-[14px] font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Package size={15} />
              {version ? `npm · v${version}` : "npm"}
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-line rounded-xl px-5 py-2.5 font-roboto-mono text-[14px] font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Github size={15} />
              GitHub
              {stars !== null && stars !== undefined && (
                <span className="flex items-center gap-1 ml-auto text-accent">
                  <Star size={12} fill="currentColor" />
                  {formatStars(stars)}
                </span>
              )}
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-2 inline-flex items-center gap-2 border border-line rounded-xl px-5 py-2.5 font-roboto-mono text-[14px] font-medium text-muted hover:text-foreground transition-colors"
              onClickCapture={() => setMobileOpen(false)}
            >
              {theme === "light" ? <Sun size={15} /> : <Moon size={15} />}
              {theme === "light" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
