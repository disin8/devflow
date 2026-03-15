"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  RotateCcw,
  Terminal,
  GitBranch,
  ShieldCheck,
  Layers,
  TestTube2,
  Container,
  FileText,
  Sparkles,
  Rocket,
  Lock,
  Settings,
  Eye,
  X,
  Monitor,
} from "lucide-react";

type CategoryId =
  | "stack"
  | "repoType"
  | "pm"
  | "git"
  | "quality"
  | "testing"
  | "ci"
  | "release"
  | "security"
  | "dx"
  | "docker"
  | "docs";

interface Option {
  id: string;
  label: string;
  description: string;
  icon?: string;
  exclusive?: boolean;
  defaultSelected?: boolean;
  conflicts?: string[];
}

interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: React.ElementType;
  multiSelect: boolean;
  options: Option[];
}

const categories: CategoryDef[] = [
  {
    id: "stack",
    label: "Stack",
    icon: Monitor,
    multiSelect: false,
    options: [
      { id: "react", label: "React", description: "React SPA or library", icon: "⚛️" },
      { id: "nextjs", label: "Next.js", description: "Full-stack React framework", icon: "▲", defaultSelected: true },
      { id: "vue", label: "Vue", description: "Progressive JavaScript framework", icon: "💚" },
      { id: "nuxt", label: "Nuxt", description: "Vue full-stack framework", icon: "💚" },
      { id: "sveltekit", label: "SvelteKit", description: "Svelte full-stack framework", icon: "🔥" },
      { id: "node", label: "Node.js", description: "Pure Node / Express / Fastify", icon: "🟢" },
      { id: "nestjs", label: "NestJS", description: "Enterprise Node.js framework", icon: "🐱" },
    ],
  },
  {
    id: "repoType",
    label: "Repo Type",
    icon: Layers,
    multiSelect: false,
    options: [
      { id: "single", label: "Single Repo", description: "Standard single-package repository", icon: "📦", defaultSelected: true },
      { id: "monorepo", label: "Monorepo", description: "Multi-package workspace", icon: "🏗️" },
    ],
  },
  {
    id: "pm",
    label: "Package Manager",
    icon: Settings,
    multiSelect: false,
    options: [
      { id: "npm", label: "npm", description: "Default Node.js package manager", icon: "📦" },
      { id: "pnpm", label: "pnpm", description: "Fast, disk-efficient manager", icon: "⚡", defaultSelected: true },
      { id: "yarn", label: "Yarn", description: "Classic Yarn package manager", icon: "🧶" },
      { id: "bun", label: "Bun", description: "All-in-one JS runtime + PM", icon: "🥟" },
    ],
  },
  {
    id: "git",
    label: "Git & Commits",
    icon: GitBranch,
    multiSelect: true,
    options: [
      { id: "husky", label: "Husky", description: "Git hooks made easy", icon: "🐶" },
      { id: "lint-staged", label: "lint-staged", description: "Run linters on staged files", icon: "🚦" },
      { id: "commitlint", label: "Commitlint", description: "Lint commit messages", icon: "📝" },
      { id: "commitizen", label: "Commitizen", description: "Guided commit prompts", icon: "💬" },
      { id: "lefthook", label: "Lefthook", description: "Fast git hooks manager", icon: "🪝", conflicts: ["husky"] },
      { id: "git-cliff", label: "git-cliff", description: "Changelog generator", icon: "📋" },
      { id: "standard-version", label: "standard-version", description: "Automated versioning + CHANGELOG", icon: "🏷️" },
    ],
  },
  {
    id: "quality",
    label: "Code Quality",
    icon: ShieldCheck,
    multiSelect: true,
    options: [
      { id: "eslint", label: "ESLint", description: "Pluggable JS/TS linter", icon: "🔍" },
      { id: "prettier", label: "Prettier", description: "Opinionated code formatter", icon: "✨" },
      { id: "biome", label: "Biome", description: "Fast linter + formatter", icon: "🦕", conflicts: ["eslint", "prettier"] },
      { id: "editorconfig", label: "EditorConfig", description: "Cross-editor coding style", icon: "⚙️" },
      { id: "typescript", label: "TypeScript", description: "tsconfig & strict mode", icon: "🔷" },
      { id: "stylelint", label: "Stylelint", description: "CSS / SCSS linter", icon: "🎨" },
      { id: "markdownlint", label: "markdownlint", description: "Lint Markdown files", icon: "📄" },
      { id: "cspell", label: "cspell", description: "Spell checker for code", icon: "📖" },
    ],
  },
  {
    id: "testing",
    label: "Testing",
    icon: TestTube2,
    multiSelect: true,
    options: [
      { id: "vitest", label: "Vitest", description: "Vite-native test runner", icon: "⚡", conflicts: ["jest"] },
      { id: "jest", label: "Jest", description: "Delightful JS testing", icon: "🃏", conflicts: ["vitest"] },
      { id: "testing-library", label: "Testing Library", description: "DOM testing utilities", icon: "🧪" },
      { id: "playwright", label: "Playwright", description: "Cross-browser E2E tests", icon: "🎭", conflicts: ["cypress"] },
      { id: "cypress", label: "Cypress", description: "E2E testing framework", icon: "🌲", conflicts: ["playwright"] },
      { id: "msw", label: "MSW", description: "Mock Service Worker for API mocking", icon: "🔌" },
    ],
  },
  {
    id: "ci",
    label: "CI/CD",
    icon: Rocket,
    multiSelect: true,
    options: [
      { id: "github-actions", label: "GitHub Actions", description: "CI/CD for GitHub repos", icon: "🐙" },
      { id: "gitlab-ci", label: "GitLab CI", description: "GitLab CI/CD pipeline", icon: "🦊" },
      { id: "codecov", label: "Codecov", description: "Code coverage reporting", icon: "📊" },
      { id: "renovate", label: "Renovate", description: "Automated dependency updates", icon: "🔄", conflicts: ["dependabot"] },
      { id: "dependabot", label: "Dependabot", description: "GitHub-native dep updates", icon: "🤖", conflicts: ["renovate"] },
    ],
  },
  {
    id: "release",
    label: "Release",
    icon: Sparkles,
    multiSelect: true,
    options: [
      { id: "release-it", label: "release-it", description: "Automated releases", icon: "🚀" },
      { id: "changesets", label: "Changesets", description: "Manage versioning & changelogs", icon: "📦" },
      { id: "semantic-release", label: "semantic-release", description: "Fully automated semver", icon: "📐" },
      { id: "conventional-changelog", label: "conv-changelog", description: "Changelog from commits", icon: "📋" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
    multiSelect: true,
    options: [
      { id: "audit", label: "npm audit", description: "Dependency vulnerability check", icon: "🔒" },
      { id: "gitleaks", label: "Gitleaks", description: "Secret scanning for git", icon: "🕵️" },
      { id: "trivy", label: "Trivy", description: "Vulnerability scanner", icon: "🛡️" },
      { id: "osv-scanner", label: "OSV Scanner", description: "Google's vuln scanner", icon: "🔎" },
    ],
  },
  {
    id: "dx",
    label: "Dev Experience",
    icon: Terminal,
    multiSelect: true,
    options: [
      { id: "nvmrc", label: ".nvmrc", description: "Lock Node.js version", icon: "📌" },
      { id: "dotenv", label: ".env", description: "Environment variables template", icon: "🔐" },
      { id: "vscode", label: "VS Code", description: "Workspace settings & extensions", icon: "💻" },
      { id: "devcontainer", label: "Dev Container", description: "Containerized dev environment", icon: "📦" },
      { id: "makefile", label: "Makefile", description: "Task automation shortcuts", icon: "🔧" },
    ],
  },
  {
    id: "docker",
    label: "Docker",
    icon: Container,
    multiSelect: true,
    options: [
      { id: "dockerfile", label: "Dockerfile", description: "Multi-stage container build", icon: "🐳" },
      { id: "docker-compose", label: "docker-compose", description: "Service orchestration", icon: "🐋" },
      { id: "dockerignore", label: ".dockerignore", description: "Exclude files from context", icon: "🚫" },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    icon: FileText,
    multiSelect: true,
    options: [
      { id: "readme", label: "README", description: "Project documentation template", icon: "📖" },
      { id: "contributing", label: "CONTRIBUTING", description: "Contribution guidelines", icon: "🤝" },
      { id: "code-of-conduct", label: "Code of Conduct", description: "Community standards", icon: "⚖️" },
      { id: "security-md", label: "SECURITY.md", description: "Security policy", icon: "🔒" },
      { id: "license", label: "LICENSE", description: "Open-source license file", icon: "📜" },
    ],
  },
];

const PRESETS: Record<string, string[]> = {
  minimal: ["husky", "lint-staged", "commitlint", "editorconfig"],
  recommended: [
    "husky", "lint-staged", "commitlint", "eslint", "prettier",
    "vitest", "github-actions", "typescript", "nvmrc", "dotenv", "vscode",
  ],
  full: [
    "husky", "lint-staged", "commitlint", "commitizen",
    "eslint", "prettier", "editorconfig", "typescript", "stylelint", "markdownlint", "cspell",
    "vitest", "playwright", "testing-library",
    "github-actions", "codecov", "renovate",
    "release-it",
    "audit", "gitleaks",
    "nvmrc", "dotenv", "vscode", "makefile",
    "dockerfile", "docker-compose", "dockerignore",
    "readme", "contributing", "code-of-conduct", "security-md", "license",
  ],
};

function getDefaultSelected(): Set<string> {
  const s = new Set<string>();
  for (const cat of categories) {
    for (const opt of cat.options) {
      if (opt.defaultSelected) s.add(opt.id);
    }
  }
  return s;
}

export function BuilderClient() {
  const [selected, setSelected] = useState<Set<string>>(getDefaultSelected);
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const stack = useMemo(() => {
    const stackCat = categories.find((c) => c.id === "stack")!;
    return stackCat.options.find((o) => selected.has(o.id))?.id ?? "node";
  }, [selected]);

  const repoType = useMemo(() => {
    return selected.has("monorepo") ? "monorepo" : "single";
  }, [selected]);

  const pm = useMemo(() => {
    const pmCat = categories.find((c) => c.id === "pm")!;
    return pmCat.options.find((o) => selected.has(o.id))?.id ?? "pnpm";
  }, [selected]);

  const cliCommand = useMemo(() => {
    const moduleCategories = ["git", "quality", "testing", "ci", "release", "security", "dx", "docker", "docs"];
    const selectedModules = Array.from(selected).filter((id) =>
      moduleCategories.some((cat) =>
        categories.find((c) => c.id === cat)?.options.some((o) => o.id === id)
      )
    );
    const parts = [`npx create-devflow`];
    if (pm !== "npm") parts.push(`--pm ${pm}`);
    if (stack !== "node") parts.push(`--stack ${stack}`);
    if (repoType === "monorepo") parts.push("--monorepo");

    const fullPreset = PRESETS.full;
    const recPreset = PRESETS.recommended;
    const minPreset = PRESETS.minimal;
    const moduleSet = new Set(selectedModules);

    if (fullPreset.every((m) => moduleSet.has(m)) && selectedModules.length >= fullPreset.length - 2) {
      parts.push("--all");
    } else if (recPreset.every((m) => moduleSet.has(m)) && selectedModules.length <= recPreset.length + 3) {
      parts.push("--preset recommended");
    } else if (selectedModules.length > 0) {
      parts.push(`--only ${selectedModules.join(",")}`);
    }
    parts.push("--yes");
    return parts.join(" ");
  }, [selected, pm, stack, repoType]);

  const toggle = useCallback(
    (categoryId: CategoryId, optionId: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        const cat = categories.find((c) => c.id === categoryId)!;

        if (!cat.multiSelect) {
          for (const o of cat.options) next.delete(o.id);
          next.add(optionId);
        } else {
          if (next.has(optionId)) {
            next.delete(optionId);
          } else {
            const opt = cat.options.find((o) => o.id === optionId);
            if (opt?.conflicts) {
              for (const c of opt.conflicts) next.delete(c);
            }
            next.add(optionId);
          }
        }
        return next;
      });
    },
    []
  );

  const applyPreset = useCallback((level: string) => {
    const base = getDefaultSelected();
    const preset = PRESETS[level] ?? [];
    for (const id of preset) base.add(id);
    setSelected(base);
  }, []);

  const reset = useCallback(() => {
    setSelected(getDefaultSelected());
  }, []);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cliCommand]);

  const selectedCount = useMemo(() => {
    const configCats = ["git", "quality", "testing", "ci", "release", "security", "dx", "docker", "docs"];
    return Array.from(selected).filter((id) =>
      configCats.some((cat) =>
        categories.find((c) => c.id === cat)?.options.some((o) => o.id === id)
      )
    ).length;
  }, [selected]);


  return (
    <div className="landing min-h-screen">
      <div className="mx-auto flex max-w-360">
        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-line p-6 sticky top-14.25 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="mb-6">
            <label className="flex items-center justify-between mb-2 font-(family-name:--font-roboto-mono) text-[11px] font-semibold uppercase tracking-wider text-muted">
              CLI Command
              <button
                onClick={copyCommand}
                className="flex items-center gap-1 text-accent hover:opacity-80 transition-opacity cursor-pointer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </label>
            <div className="rounded-xl border border-line bg-card p-3 font-(family-name:--font-roboto-mono) text-[12px] text-accent break-all leading-relaxed">
              {cliCommand}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-(family-name:--font-roboto-mono) text-[11px] font-semibold uppercase tracking-wider text-muted">
              Selected Stack
              <span className="ml-2 text-accent">{selectedCount} picks</span>
            </h3>

            <div className="space-y-2">
              {categories
                .filter((cat) => ["stack", "repoType", "pm"].includes(cat.id))
                .map((cat) => {
                  const sel = cat.options.filter((o) => selected.has(o.id));
                  if (sel.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <span className="font-(family-name:--font-roboto-mono) text-[10px] uppercase text-muted">
                        {cat.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {sel.map((o) => (
                          <span
                            key={o.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-accent/10 border border-accent/20 px-2 py-1 text-[11px] text-accent font-(family-name:--font-roboto-mono)"
                          >
                            {o.icon} {o.label}
                            <button
                              onClick={() => toggle(cat.id, o.id)}
                              className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {categories
                .filter((cat) => !["stack", "repoType", "pm"].includes(cat.id))
                .map((cat) => {
                  const sel = cat.options.filter((o) => selected.has(o.id));
                  if (sel.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <span className="font-(family-name:--font-roboto-mono) text-[10px] uppercase text-muted">
                        {cat.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {sel.map((o) => (
                          <span
                            key={o.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-card border border-line px-2 py-1 text-[11px] text-muted font-(family-name:--font-roboto-mono)"
                          >
                            {o.icon} {o.label}
                            <button
                              onClick={() => toggle(cat.id, o.id)}
                              className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-line">
            <div className="flex flex-col gap-2">
              <span className="font-(family-name:--font-roboto-mono) text-[10px] uppercase text-muted">
                Presets
              </span>
              <div className="flex gap-2">
                {(["minimal", "recommended", "full"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className="rounded-lg border border-line bg-card px-3 py-1.5 font-(family-name:--font-roboto-mono) text-[11px] capitalize text-muted hover:text-foreground hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={reset}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 py-2 font-(family-name:--font-roboto-mono) text-[13px] text-muted hover:text-foreground hover:border-accent/30 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="lg:hidden sticky top-14.25 z-40 border-b border-line bg-page/90 backdrop-blur-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="flex items-center gap-1 rounded-lg border border-line bg-card px-3 py-1.5 text-[12px] text-muted cursor-pointer"
                >
                  <Eye size={12} /> Preview
                </button>
                <button
                  onClick={copyCommand}
                  className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 font-(family-name:--font-roboto-mono) text-[12px] font-bold text-accent-fg cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            {previewOpen && (
              <div className="mt-3 rounded-xl border border-line bg-card p-3 font-(family-name:--font-roboto-mono) text-[11px] text-accent break-all">
                {cliCommand}
              </div>
            )}
          </div>

          <div className="divide-y divide-line">
            {categories.map((cat) => (
              <section key={cat.id} className="px-4 sm:px-8 py-8">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card">
                    <cat.icon size={15} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="font-(family-name:--font-roboto-mono) text-[16px] font-semibold text-foreground leading-none">
                      {cat.label}
                    </h2>
                    <p className="text-[12px] text-muted mt-0.5">
                      {cat.multiSelect ? "Select one or more" : "Choose one"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {cat.options.map((option) => {
                    const isSelected = selected.has(option.id);
                    const isConflict = option.conflicts?.some((c) => selected.has(c)) ?? false;

                    return (
                      <button
                        key={option.id}
                        onClick={() => toggle(cat.id, option.id)}
                        className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${isSelected
                          ? "border-accent/40 bg-accent/5 shadow-[0_0_20px_rgba(133,255,141,0.04)]"
                          : isConflict
                            ? "border-line bg-card/50 opacity-40 cursor-not-allowed"
                            : "border-line bg-card hover:border-accent/20 hover:bg-card/80"
                          }`}
                      >
                        <div
                          className={`absolute top-3.5 right-3.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all ${isSelected
                            ? "border-accent bg-accent"
                            : "border-line group-hover:border-accent/40"
                            }`}
                        >
                          {isSelected && <Check size={10} className="text-accent-fg" />}
                        </div>

                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[18px] leading-none">{option.icon}</span>
                          <h3 className="font-(family-name:--font-roboto-mono) text-[14px] font-medium text-foreground pr-5">
                            {option.label}
                          </h3>
                        </div>
                        <p className="text-[12px] leading-[1.4em] text-muted">
                          {option.description}
                        </p>

                        {isConflict && !isSelected && (
                          <span className="mt-2 inline-block rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400 font-(family-name:--font-roboto-mono)">
                            Conflicts
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
