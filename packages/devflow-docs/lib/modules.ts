
export type ModuleCategory =
  | "git"
  | "quality"
  | "testing"
  | "ci"
  | "release"
  | "security"
  | "dx"
  | "docker"
  | "docs"
  | "monorepo";

export interface ModuleArtifact {
  name: string;
  dev: boolean;
}

export interface ModuleScript {
  name: string;
  command: string;
}

export interface ModuleInfo {
  id: string;
  name: string;
  category: ModuleCategory;
  categoryLabel: string;
  summary: string;
  files: string[];
  packages: ModuleArtifact[];
  scripts: ModuleScript[];
  landingPage?: string;
  guidePage?: string;
  notes?: string[];
}

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  git: "Git & Commits",
  quality: "Code Quality",
  testing: "Testing",
  ci: "CI/CD",
  release: "Releases",
  security: "Security",
  dx: "Developer Environment",
  docker: "Docker",
  docs: "Documentation",
  monorepo: "Monorepo",
};

export const MODULES: ModuleInfo[] = [
  {
    id: "eslint",
    name: "ESLint",
    category: "quality",
    categoryLabel: "Code Quality",
    summary:
      "Generates a flat `eslint.config.mjs` with `@eslint/js` recommended rules, `typescript-eslint` for TypeScript projects and the React, React Hooks or Vue plugin set depending on the detected stack.",
    files: ["eslint.config.mjs"],
    packages: [
      { name: "eslint", dev: true },
      { name: "@eslint/js", dev: true },
      { name: "typescript-eslint", dev: true },
      { name: "eslint-plugin-react", dev: true },
      { name: "eslint-plugin-react-hooks", dev: true },
      { name: "eslint-plugin-vue", dev: true },
    ],
    scripts: [
      { name: "lint", command: "eslint ." },
      { name: "lint:fix", command: "eslint . --fix" },
    ],
    landingPage: "/modules/eslint",
    guidePage: "/guides/eslint-prettier-husky",
    notes: [
      "`typescript-eslint`, `eslint-plugin-react` and `eslint-plugin-vue` are only installed when the project matches the stack.",
      "The config ignores `dist/`, `node_modules/`, `build/`, `.next/` and `.nuxt/`.",
    ],
  },
  {
    id: "prettier",
    name: "Prettier",
    category: "quality",
    categoryLabel: "Code Quality",
    summary:
      "Writes a `.prettierrc.json` with a 100-column, single-quote, semicolon-first style and a `.prettierignore` that excludes build output and lock files.",
    files: [".prettierrc.json", ".prettierignore"],
    packages: [{ name: "prettier", dev: true }],
    scripts: [
      { name: "format", command: "prettier --write ." },
      { name: "format:check", command: "prettier --check ." },
    ],
    landingPage: "/modules/prettier",
    guidePage: "/guides/eslint-prettier-husky",
  },
  {
    id: "editorconfig",
    name: "EditorConfig",
    category: "quality",
    categoryLabel: "Code Quality",
    summary:
      "Adds a root `.editorconfig` with 2-space indentation, UTF-8, LF line endings and trimmed trailing whitespace, plus a Markdown exception and a tab-based Makefile section.",
    files: [".editorconfig"],
    packages: [],
    scripts: [],
  },
  {
    id: "typescript",
    name: "TypeScript strict",
    category: "quality",
    categoryLabel: "Code Quality",
    summary:
      "Adds a `typecheck` script running `tsc --noEmit`. A strict `tsconfig.json` is only written when the project does not already have one.",
    files: ["tsconfig.json"],
    packages: [{ name: "typescript", dev: true }],
    scripts: [{ name: "typecheck", command: "tsc --noEmit" }],
    notes: [
      "If `tsconfig.json` already exists, DevFlow leaves it untouched and only adds the `typecheck` script.",
    ],
  },
  {
    id: "biome",
    name: "Biome",
    category: "quality",
    categoryLabel: "Code Quality",
    summary:
      "Generates a `biome.json` with the linter, formatter and import organiser enabled — an alternative to the ESLint + Prettier pair.",
    files: ["biome.json"],
    packages: [{ name: "@biomejs/biome", dev: true }],
    scripts: [
      { name: "lint", command: "biome check ." },
      { name: "lint:fix", command: "biome check --apply ." },
      { name: "format", command: "biome format --write ." },
    ],
    notes: ["Conflicts with the ESLint and Prettier modules."],
  },
  {
    id: "husky",
    name: "Husky",
    category: "git",
    categoryLabel: "Git & Commits",
    summary:
      "Installs Husky, adds the `prepare` script and writes the requested hooks: `pre-commit` (lint-staged or `npm run lint`) and `commit-msg` (Commitlint).",
    files: [".husky/pre-commit", ".husky/commit-msg", ".husky/pre-push"],
    packages: [{ name: "husky", dev: true }],
    scripts: [{ name: "prepare", command: "husky" }],
    landingPage: "/modules/husky",
    notes: [
      "`pre-push` is only created when it is explicitly requested and runs `npm run typecheck && npm run test`.",
    ],
  },
  {
    id: "lint-staged",
    name: "lint-staged",
    category: "git",
    categoryLabel: "Git & Commits",
    summary:
      "Runs ESLint and Prettier on staged JavaScript/TypeScript files only. In a single repo the config is merged into `package.json`; in a monorepo a `lint-staged.config.mjs` is written.",
    files: ["lint-staged.config.mjs"],
    packages: [{ name: "lint-staged", dev: true }],
    scripts: [],
    landingPage: "/modules/lint-staged",
    notes: ["Depends on the Husky module, which is resolved automatically."],
  },
  {
    id: "commitlint",
    name: "Commitlint",
    category: "git",
    categoryLabel: "Git & Commits",
    summary:
      "Writes a `commitlint.config.mjs` extending `@commitlint/config-conventional`. The strict variant restricts the commit type to a fixed list, forbids capitalised subjects and caps the header at 100 characters.",
    files: ["commitlint.config.mjs"],
    packages: [
      { name: "@commitlint/cli", dev: true },
      { name: "@commitlint/config-conventional", dev: true },
    ],
    scripts: [],
    landingPage: "/modules/commitlint",
    guidePage: "/guides/conventional-commits",
  },
  {
    id: "commitizen",
    name: "Commitizen",
    category: "git",
    categoryLabel: "Git & Commits",
    summary:
      "Adds Commitizen with a configurable adapter (`cz-git` or `cz-conventional-changelog`) and a `commit` script that opens the interactive prompt.",
    files: [],
    packages: [
      { name: "commitizen", dev: true },
      { name: "cz-git", dev: true },
    ],
    scripts: [{ name: "commit", command: "cz" }],
  },
  {
    id: "vitest",
    name: "Vitest",
    category: "testing",
    categoryLabel: "Testing",
    summary:
      "Creates a `vitest.config.ts` with globals enabled, a `jsdom` environment for React/Vue projects and V8 coverage reporting, plus the `test`, `test:watch` and `test:coverage` scripts.",
    files: ["vitest.config.ts"],
    packages: [
      { name: "vitest", dev: true },
      { name: "@vitejs/plugin-react", dev: true },
      { name: "@vitejs/plugin-vue", dev: true },
    ],
    scripts: [
      { name: "test", command: "vitest run" },
      { name: "test:watch", command: "vitest" },
      { name: "test:coverage", command: "vitest run --coverage" },
    ],
    landingPage: "/modules/vitest",
    guidePage: "/guides/vitest-react-typescript",
    notes: [
      "Coverage is configured with the V8 provider and the `text` and `lcov` reporters. Coverage thresholds are not set — see the Vitest guide for the snippet to add them.",
    ],
  },
  {
    id: "testing-library",
    name: "Testing Library",
    category: "testing",
    categoryLabel: "Testing",
    summary:
      "Installs `@testing-library/jest-dom` plus the React or Vue bindings and writes `src/test/setup.ts` importing the jest-dom matchers for Vitest.",
    files: ["src/test/setup.ts"],
    packages: [
      { name: "@testing-library/jest-dom", dev: true },
      { name: "@testing-library/react", dev: true },
      { name: "@testing-library/user-event", dev: true },
      { name: "@testing-library/vue", dev: true },
    ],
    scripts: [],
  },
  {
    id: "jest",
    name: "Jest",
    category: "testing",
    categoryLabel: "Testing",
    summary:
      "Writes `jest.config.ts` (or `jest.config.mjs` for JavaScript projects) with `ts-jest` for TypeScript code, plus the standard test scripts.",
    files: ["jest.config.ts", "jest.config.mjs"],
    packages: [
      { name: "jest", dev: true },
      { name: "@types/jest", dev: true },
      { name: "ts-jest", dev: true },
    ],
    scripts: [
      { name: "test", command: "jest" },
      { name: "test:watch", command: "jest --watch" },
      { name: "test:coverage", command: "jest --coverage" },
    ],
    notes: ["Conflicts with the Vitest module."],
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "testing",
    categoryLabel: "Testing",
    summary:
      "Generates `playwright.config.ts` and a sample end-to-end spec, and registers a `test:e2e` script.",
    files: ["playwright.config.ts", "e2e/example.spec.ts"],
    packages: [{ name: "@playwright/test", dev: true }],
    scripts: [{ name: "test:e2e", command: "playwright test" }],
  },
  {
    id: "cypress",
    name: "Cypress",
    category: "testing",
    categoryLabel: "Testing",
    summary:
      "Generates `cypress.config.ts`, the support file and a sample end-to-end spec, and registers `test:e2e` and `cypress:open` scripts.",
    files: [
      "cypress.config.ts",
      "cypress/support/e2e.ts",
      "cypress/e2e/example.cy.ts",
    ],
    packages: [{ name: "cypress", dev: true }],
    scripts: [
      { name: "test:e2e", command: "cypress run" },
      { name: "cypress:open", command: "cypress open" },
    ],
    notes: ["Conflicts with the Playwright module."],
  },
  {
    id: "msw",
    name: "Mock Service Worker",
    category: "testing",
    categoryLabel: "Testing",
    summary:
      "Creates `src/mocks/handlers.ts` and `src/mocks/server.ts` so API calls can be mocked in tests.",
    files: ["src/mocks/handlers.ts", "src/mocks/server.ts"],
    packages: [{ name: "msw", dev: true }],
    scripts: [],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    category: "ci",
    categoryLabel: "CI/CD",
    summary:
      "Writes `.github/workflows/ci.yml` that runs on pushes and pull requests against `main`/`master`, checks out the repo, installs the detected package manager, then runs lint, type-check, test and build.",
    files: [".github/workflows/ci.yml"],
    packages: [],
    scripts: [],
    landingPage: "/modules/github-actions",
    guidePage: "/guides/github-actions-nextjs",
    notes: [
      "Dependency caching comes from `actions/setup-node` and follows the detected package manager.",
      "The type-check step is marked `continue-on-error`, so a type error does not fail the whole pipeline.",
      "The Node.js matrix is pinned to version 20; widen it in the generated file if you support more versions.",
    ],
  },
  {
    id: "gitlab-ci",
    name: "GitLab CI",
    category: "ci",
    categoryLabel: "CI/CD",
    summary:
      "Generates `.gitlab-ci.yml` with the lint, type-check, test and build stages for the detected package manager.",
    files: [".gitlab-ci.yml"],
    packages: [],
    scripts: [],
  },
  {
    id: "codecov",
    name: "Codecov",
    category: "ci",
    categoryLabel: "CI/CD",
    summary:
      "Writes a `codecov.yml` so coverage reports are uploaded with a consistent configuration.",
    files: ["codecov.yml"],
    packages: [],
    scripts: [],
  },
  {
    id: "dependabot",
    name: "Dependabot",
    category: "ci",
    categoryLabel: "CI/CD",
    summary:
      "Generates `.github/dependabot.yml` with weekly npm update pull requests.",
    files: [".github/dependabot.yml"],
    packages: [],
    scripts: [],
  },
  {
    id: "renovate",
    name: "Renovate",
    category: "ci",
    categoryLabel: "CI/CD",
    summary:
      "Generates a `renovate.json` with weekly dependency update scheduling.",
    files: ["renovate.json"],
    packages: [],
    scripts: [],
    notes: ["Conflicts with the Dependabot module."],
  },
  {
    id: "dockerfile",
    name: "Dockerfile",
    category: "docker",
    categoryLabel: "Docker",
    summary:
      "Writes a multi-stage `Dockerfile` on `node:20-alpine`: a builder stage that installs all dependencies and builds, and a slim runtime stage that installs production dependencies only and runs as a non-root user.",
    files: ["Dockerfile"],
    packages: [],
    scripts: [],
    landingPage: "/modules/docker",
    guidePage: "/guides/nestjs-docker",
    notes: [
      "The runtime stage copies `dist/` — the project needs a build step that emits to `dist/`.",
      "No `HEALTHCHECK` instruction is generated; add one if your orchestrator needs it.",
    ],
  },
  {
    id: "docker-compose",
    name: "Docker Compose",
    category: "docker",
    categoryLabel: "Docker",
    summary:
      "Writes a `docker-compose.yml` with an `app` service built from the generated Dockerfile, exposed on port 3000, plus a commented-out PostgreSQL service.",
    files: ["docker-compose.yml"],
    packages: [],
    scripts: [],
  },
  {
    id: "dockerignore",
    name: ".dockerignore",
    category: "docker",
    categoryLabel: "Docker",
    summary:
      "Writes a `.dockerignore` excluding `node_modules`, build output, `.git`, environment files, coverage, editor folders and test folders from the build context.",
    files: [".dockerignore"],
    packages: [],
    scripts: [],
  },
  {
    id: "nvmrc",
    name: ".nvmrc",
    category: "dx",
    categoryLabel: "Developer Environment",
    summary:
      "Pins the Node.js version in `.nvmrc`, or writes a `volta` block into `package.json` when Volta is selected.",
    files: [".nvmrc"],
    packages: [],
    scripts: [],
  },
  {
    id: "dotenv",
    name: ".env.example",
    category: "dx",
    categoryLabel: "Developer Environment",
    summary:
      "Writes `.env.example` and appends `.env`, `.env.local` and `.env.*.local` to `.gitignore` when those entries are not ignored yet.",
    files: [".env.example", ".gitignore"],
    packages: [],
    scripts: [],
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "dx",
    categoryLabel: "Developer Environment",
    summary:
      "Writes `.vscode/extensions.json` and `.vscode/settings.json` with a shared, format-on-save editor configuration.",
    files: [".vscode/extensions.json", ".vscode/settings.json"],
    packages: [],
    scripts: [],
  },
  {
    id: "devcontainer",
    name: "Dev Container",
    category: "dx",
    categoryLabel: "Developer Environment",
    summary:
      "Generates `.devcontainer/devcontainer.json` so the project can be opened in a reproducible container.",
    files: [".devcontainer/devcontainer.json"],
    packages: [],
    scripts: [],
  },
  {
    id: "makefile",
    name: "Makefile",
    category: "dx",
    categoryLabel: "Developer Environment",
    summary:
      "Generates a `Makefile` with shortcuts for the most common development commands.",
    files: ["Makefile"],
    packages: [],
    scripts: [],
  },
  {
    id: "audit",
    name: "npm audit",
    category: "security",
    categoryLabel: "Security",
    summary:
      "Adds an `audit` script that runs the package manager's audit command with a high-severity threshold.",
    files: [],
    packages: [],
    scripts: [
      { name: "audit", command: "npm audit --audit-level=high" },
      { name: "audit", command: "pnpm audit --audit-level=high" },
      { name: "audit", command: "yarn npm audit --severity high" },
    ],
    notes: [
      "The exact command depends on the detected package manager; `bun` falls back to the npm command.",
    ],
  },
  {
    id: "gitleaks",
    name: "Gitleaks",
    category: "security",
    categoryLabel: "Security",
    summary:
      "Writes `.gitleaks.toml` and a `.github/workflows/gitleaks.yml` workflow that scans the full git history for secrets on every push and pull request.",
    files: [".gitleaks.toml", ".github/workflows/gitleaks.yml"],
    packages: [],
    scripts: [],
    landingPage: "/modules/security",
    guidePage: "/guides/security-ci",
  },
  {
    id: "trivy",
    name: "Trivy",
    category: "security",
    categoryLabel: "Security",
    summary:
      "Writes `.github/workflows/trivy.yml` that scans the repository for vulnerabilities and misconfigurations.",
    files: [".github/workflows/trivy.yml"],
    packages: [],
    scripts: [],
    landingPage: "/modules/security",
  },
  {
    id: "osv-scanner",
    name: "OSV-Scanner",
    category: "security",
    categoryLabel: "Security",
    summary:
      "Writes `.github/workflows/osv-scanner.yml` that checks dependencies against the OSV vulnerability database.",
    files: [".github/workflows/osv-scanner.yml"],
    packages: [],
    scripts: [],
    landingPage: "/modules/security",
  },
  {
    id: "release-it",
    name: "release-it",
    category: "release",
    categoryLabel: "Releases",
    summary:
      "Writes `.release-it.json` and installs `release-it` with the conventional changelog plugin, adding a `release` script.",
    files: [".release-it.json"],
    packages: [
      { name: "release-it", dev: true },
      { name: "@release-it/conventional-changelog", dev: true },
    ],
    scripts: [{ name: "release", command: "release-it" }],
  },
  {
    id: "changesets",
    name: "Changesets",
    category: "release",
    categoryLabel: "Releases",
    summary:
      "Creates `.changeset/config.json` and the Changesets README, and adds the `changeset`, `version` and `release` scripts for versioned, monorepo-friendly publishing.",
    files: [".changeset/config.json", ".changeset/README.md"],
    packages: [
      { name: "@changesets/cli", dev: true },
      { name: "@changesets/changelog-github", dev: true },
    ],
    scripts: [
      { name: "changeset", command: "changeset" },
      { name: "version", command: "changeset version" },
      { name: "release", command: "changeset publish" },
    ],
  },
  {
    id: "semantic-release",
    name: "semantic-release",
    category: "release",
    categoryLabel: "Releases",
    summary:
      "Writes `.releaserc.json` and installs the semantic-release plugin chain for commit analysis, notes, changelog and npm publishing.",
    files: [".releaserc.json"],
    packages: [
      { name: "semantic-release", dev: true },
      { name: "@semantic-release/commit-analyzer", dev: true },
      { name: "@semantic-release/release-notes-generator", dev: true },
      { name: "@semantic-release/changelog", dev: true },
      { name: "@semantic-release/npm", dev: true },
      { name: "@semantic-release/github", dev: true },
      { name: "@semantic-release/git", dev: true },
    ],
    scripts: [{ name: "release", command: "semantic-release" }],
    notes: ["Conflicts with the release-it module."],
  },
  {
    id: "conventional-changelog",
    name: "conventional-changelog",
    category: "release",
    categoryLabel: "Releases",
    summary:
      "Installs `conventional-changelog-cli` and adds a `changelog` script that regenerates `CHANGELOG.md` from the git history.",
    files: [],
    packages: [{ name: "conventional-changelog-cli", dev: true }],
    scripts: [
      { name: "changelog", command: "conventional-changelog -p angular -i CHANGELOG.md -s" },
    ],
  },
  {
    id: "readme",
    name: "README",
    category: "docs",
    categoryLabel: "Documentation",
    summary:
      "Generates a `README.md` template using the project name from `package.json`.",
    files: ["README.md"],
    packages: [],
    scripts: [],
  },
  {
    id: "contributing",
    name: "CONTRIBUTING",
    category: "docs",
    categoryLabel: "Documentation",
    summary: "Generates a `CONTRIBUTING.md` template for the project.",
    files: ["CONTRIBUTING.md"],
    packages: [],
    scripts: [],
  },
  {
    id: "code-of-conduct",
    name: "CODE_OF_CONDUCT",
    category: "docs",
    categoryLabel: "Documentation",
    summary: "Generates a `CODE_OF_CONDUCT.md` template based on the Contributor Covenant.",
    files: ["CODE_OF_CONDUCT.md"],
    packages: [],
    scripts: [],
  },
  {
    id: "security-md",
    name: "SECURITY.md",
    category: "docs",
    categoryLabel: "Documentation",
    summary: "Generates a `SECURITY.md` vulnerability reporting policy template.",
    files: ["SECURITY.md"],
    packages: [],
    scripts: [],
  },
  {
    id: "license",
    name: "LICENSE",
    category: "docs",
    categoryLabel: "Documentation",
    summary:
      "Writes a `LICENSE` file. MIT is the default; Apache-2.0 and a proprietary placeholder are also selectable.",
    files: ["LICENSE"],
    packages: [],
    scripts: [],
  },
  {
    id: "nx",
    name: "Nx",
    category: "monorepo",
    categoryLabel: "Monorepo",
    summary: "Generates an `nx.json` configuration for an Nx-powered monorepo.",
    files: ["nx.json"],
    packages: [{ name: "nx", dev: true }],
    scripts: [],
    landingPage: "/modules/monorepo",
    guidePage: "/guides/turborepo-ci",
    notes: ["Conflicts with the Turborepo module."],
  },
  {
    id: "turborepo",
    name: "Turborepo",
    category: "monorepo",
    categoryLabel: "Monorepo",
    summary:
      "Generates a `turbo.json` pipeline and adds the `build`, `lint`, `test` and `dev` scripts that delegate to `turbo`.",
    files: ["turbo.json"],
    packages: [{ name: "turbo", dev: true }],
    scripts: [
      { name: "build", command: "turbo build" },
      { name: "lint", command: "turbo lint" },
      { name: "test", command: "turbo test" },
      { name: "dev", command: "turbo dev" },
    ],
    landingPage: "/modules/monorepo",
    guidePage: "/guides/turborepo-ci",
    notes: ["Conflicts with the Nx module."],
  },
  {
    id: "workspaces",
    name: "Workspaces",
    category: "monorepo",
    categoryLabel: "Monorepo",
    summary:
      "Writes `pnpm-workspace.yaml` (or merges `workspaces` into `package.json` for npm/yarn), a strict `tsconfig.base.json` for TypeScript monorepos, and the `lint:all` / `test:all` scripts.",
    files: ["pnpm-workspace.yaml", "tsconfig.base.json"],
    packages: [],
    scripts: [
      { name: "lint:all", command: "pnpm -r run lint" },
      { name: "test:all", command: "pnpm -r run test" },
    ],
    landingPage: "/modules/monorepo",
    guidePage: "/guides/turborepo-ci",
  },
];

export const MODULE_MAP = new Map(MODULES.map((m) => [m.id, m]));

export function modulesByCategory(category: ModuleCategory): ModuleInfo[] {
  return MODULES.filter((m) => m.category === category);
}

export function moduleCommand(id: string): string {
  return `npx create-devflow --only ${id}`;
}

export const ALL_GENERATED_FILES: string[] = [
  ...new Set(MODULES.flatMap((m) => m.files)),
].sort();
