import { SectionHeader } from "./section-header";
import { SectionTag } from "./section-tag";
import { CopyCommand } from "./copy-command";

const PRESETS = [
  {
    id: "minimal",
    name: "Minimal",
    summary: "The four things every repository needs on day one.",
    modules: 4,
    files: 4,
    includes: [
      "Husky — Git hooks",
      "lint-staged — linters on staged files",
      "Commitlint — Conventional Commits",
      "EditorConfig — consistent editor settings",
    ],
    command: "npx create-devflow",
    when: "A single repository, a small team, or a repository that already has linting.",
  },
  {
    id: "recommended",
    name: "Recommended",
    summary: "Minimal plus linting, testing, CI/CD and a pinned toolchain.",
    modules: 12,
    files: 14,
    includes: [
      "Everything in Minimal",
      "ESLint — flat config for your stack",
      "Prettier — one shared formatting style",
      "Vitest — test runner with V8 coverage",
      "GitHub Actions — lint, type-check, test, build",
      "TypeScript — typecheck script",
      ".nvmrc — pinned Node.js version",
      ".env.example + VSCode settings",
    ],
    command: "npx create-devflow --all",
    when: "The default for a new repository, and the right choice for most teams.",
  },
  {
    id: "full",
    name: "Full",
    summary: "Recommended plus end-to-end testing, releases, security and containers.",
    modules: 31,
    files: 34,
    includes: [
      "Everything in Recommended",
      "Playwright — end-to-end tests",
      "Stylelint, markdownlint, cspell",
      "Commitizen — interactive commits",
      "Codecov + Renovate — coverage and updates",
      "release-it — automated releases",
      "npm audit + Gitleaks — security scanning",
      "Dockerfile + compose + .dockerignore",
      "README, CONTRIBUTING, LICENSE, SECURITY.md",
    ],
    command: "npx create-devflow --all",
    when: "A service that ships to production and is maintained by more than one person.",
  },
];

export function PresetsTable() {
  return (
    <section className="py-24 max-md:py-12">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <SectionHeader
          tag={<SectionTag>Presets</SectionTag>}
          title="Three starting points, not one"
          description="A preset is a pre-selected module list that adapts to the detected stack. The counts below are for a single Node.js/TypeScript repository: React, Next.js and Vue projects get Testing Library on top, and monorepos swap release-it for Changesets and add the workspaces module."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {PRESETS.map((preset) => (
            <article
              key={preset.id}
              className={`flex flex-col rounded-3xl border p-7 transition-colors ${
                preset.id === "recommended"
                  ? "border-accent/40 bg-card"
                  : "border-line bg-card/40"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-archivo text-[26px] text-foreground">{preset.name}</h3>
                {preset.id === "recommended" && (
                  <span className="font-roboto-mono text-[11px] uppercase tracking-wide text-accent">
                    Start here
                  </span>
                )}
              </div>

              <p className="mt-2 text-[14px] leading-relaxed text-muted">{preset.summary}</p>

              <dl className="mt-5 flex gap-6 border-y border-line py-3 font-roboto-mono text-[13px]">
                <div>
                  <dt className="text-muted">Modules</dt>
                  <dd className="text-foreground">{preset.modules}</dd>
                </div>
                <div>
                  <dt className="text-muted">Files</dt>
                  <dd className="text-foreground">{preset.files}</dd>
                </div>
              </dl>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-[14px] text-muted">
                {preset.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[13px] leading-relaxed text-muted">
                <span className="text-foreground">When:</span> {preset.when}
              </p>

              <div className="mt-6">
                <CopyCommand command={preset.command} className="w-full justify-between" />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-[14px] text-muted">
          The wizard asks for a preset, and{" "}
          <a
            href="/docs/presets"
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            the presets reference
          </a>{" "}
          lists every module in each one.{" "}
          <a
            href="/builder"
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            The visual builder
          </a>{" "}
          produces the exact command for your stack.
        </p>
      </div>
    </section>
  );
}
