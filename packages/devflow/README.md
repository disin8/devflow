# create-devflow

> CLI utility to bootstrap a complete DevFlow in any repository — Git hooks, commit convention, lint/format, tests, typecheck, CI/CD, releases, security, Docker, monorepo support.

## Quick Start

```bash
npx create-devflow
```

This launches an interactive wizard that walks you through setting up your entire development workflow.

## Features

- **Interactive wizard** – step-by-step setup with checkboxes and confirmations
- **Modular architecture** – 40+ modules across 10 categories
- **Idempotent** – safe to re-run; won't overwrite existing configs
- **Dry-run mode** – preview changes before applying
- **Preset shortcuts** – Minimal / Recommended / Full configs per stack
- **Direct commands** – skip the wizard with `--all`, `--husky`, `--lint`, etc.
- **Monorepo support** – Nx, Turborepo, pnpm/yarn workspaces

## Usage

### Wizard Mode (default)

```bash
npx create-devflow
# or
devflow
```

The wizard goes through 6 steps:

| Step  | Description                                                        |
| ----- | ------------------------------------------------------------------ |
| **0** | Auto-detect project (package manager, TypeScript, monorepo, stack) |
| **1** | Choose repo type (Single / Monorepo)                               |
| **2** | Choose stack (React, Vue, Node, NestJS, Next.js, Nuxt, SvelteKit)  |
| **3** | Select modules with checkboxes (grouped by category)               |
| **4** | Fine-tune settings (commit strictness, CI provider, hooks, etc.)   |
| **5** | Review execution plan & confirm                                    |
| **6** | Apply with progress spinners + summary                             |

### Direct Commands

```bash
devflow --all                      # Apply recommended preset
devflow --only husky               # Setup single module
devflow --husky                    # Git hooks (Husky + lint-staged + commitlint)
devflow --lint                     # ESLint + Prettier + EditorConfig
devflow --test                     # Vitest
devflow --ci github                # CI provider
devflow --release changesets       # Release tooling
devflow --docker                   # Dockerfile + compose + .dockerignore
devflow --docs                     # README, CONTRIBUTING, LICENSE, etc.
devflow --security                 # Audit + Gitleaks
devflow --dry-run                  # Preview without writing
devflow --yes                      # No confirmations
devflow --skip-install             # Files only, no npm install
devflow --pm pnpm                  # Force package manager
```

## Module Catalogue

### A) Git & Commits

- **Husky** – Git hooks manager
- **lint-staged** – Run linters on staged files only
- **Commitlint** – Enforce conventional commit messages
- **Commitizen** – Interactive commit CLI
- **Lefthook** – Fast Git hooks alternative (conflicts with Husky)
- **git-cliff** – Changelog generator
- **standard-version** – Versioning + changelog

### B) Code Quality

- **ESLint** – JS/TS linter (flat config, stack-aware)
- **Prettier** – Opinionated formatter
- **Biome** – Ultra-fast linter+formatter (replaces ESLint+Prettier)
- **EditorConfig** – Consistent editor settings
- **TypeScript** – Strict tsconfig + `tsc --noEmit`
- **Stylelint** – CSS/SCSS linter
- **markdownlint** – Markdown style checker
- **cspell** – Spell checker for code & docs

### C) Testing

- **Vitest** – Fast Vite-native test runner
- **Jest** – Full-featured test runner
- **Testing Library** – DOM testing utilities (React/Vue)
- **Playwright** – Cross-browser E2E tests
- **Cypress** – E2E & component testing
- **MSW** – API mocking with Service Workers

### D) CI/CD

- **GitHub Actions** – CI workflow (lint → typecheck → test → build)
- **GitLab CI** – Pipeline generator
- **Codecov** – Coverage upload config
- **Renovate** – Automated dependency PRs
- **Dependabot** – GitHub-native dependency updates

### E) Releases

- **Release-it** – Interactive release CLI
- **Changesets** – Monorepo-friendly versioning
- **semantic-release** – Fully automated CI releases
- **Conventional Changelog** – Standalone changelog generation

### F) Security

- **npm audit** – Dependency vulnerability check
- **Gitleaks** – Secret scanning
- **Trivy** – Container/filesystem vulnerability scanner
- **OSV-Scanner** – OSS vulnerability database

### G) Dev Environment

- **.nvmrc / Volta** – Pin Node.js version
- **.env.example** – Document env vars
- **VSCode Settings** – Shared extensions & workspace config
- **Dev Container** – VS Code devcontainer setup
- **Makefile** – Developer shortcuts

### H) Docker

- **Dockerfile** – Multi-stage Node.js build
- **docker-compose.yml** – Local dev setup
- **.dockerignore** – Exclude files from builds

### I) Documentation

- **README.md** – Professional template with badges
- **CONTRIBUTING.md** – Contributor guidelines
- **CODE_OF_CONDUCT.md** – Contributor Covenant
- **SECURITY.md** – Vulnerability reporting policy
- **LICENSE** – MIT / Apache-2.0 / Proprietary

### J) Monorepo

- **Nx** – Smart build system with caching
- **Turborepo** – High-performance build system
- **Workspaces** – pnpm/yarn workspace config + shared tsconfig

## Presets

| Preset          | Includes                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Minimal**     | Husky + lint-staged + commitlint + EditorConfig                                                                   |
| **Recommended** | + ESLint + Prettier + Vitest + GitHub Actions + TypeScript + .nvmrc + .env + VSCode                               |
| **Full**        | + Commitizen + Stylelint + markdownlint + Playwright + Codecov + Renovate + Release-it + Security + Docker + Docs |

Presets auto-adjust for the selected stack (e.g., Testing Library for React/Vue, workspace tools for monorepos).

## Architecture

Each module implements a standard interface:

```typescript
interface DevFlowModule {
  id: string;
  name: string;
  description: string;
  category: Category;
  recommendedFor?: Stack[];
  conflicts?: string[];
  dependsOn?: string[];

  detect(ctx: ProjectContext): Promise<ModuleDetection>;
  plan(ctx: ProjectContext, options: ModuleOptions): Promise<ModuleAction[]>;
}
```

Actions are pure data (files to create, packages to install, scripts to add), making modules testable and composable.

## Development

```bash
npm install
npm run build
npm run typecheck
node bin/devflow.js --help
```

## License

MIT
