# DevFlow CLI

[![npm version](https://img.shields.io/npm/v/create-devflow.svg)](https://www.npmjs.com/package/create-devflow)
[![npm downloads](https://img.shields.io/npm/dm/create-devflow.svg)](https://www.npmjs.com/package/create-devflow)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![CI](https://github.com/disin8/devflow/actions/workflows/ci.yml/badge.svg)](https://github.com/disin8/devflow/actions/workflows/ci.yml)

> Generate reproducible developer workflows for TypeScript, React, Node.js and monorepos — ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configuration in one command.

```bash
npx create-devflow --dry-run   # preview every change, write nothing
npx create-devflow              # interactive wizard
npx create-devflow --all        # recommended preset for the detected stack
```

- **50 modules** in 10 categories: Git, Code Quality, Testing, CI/CD, Releases, Security, DX, Docker, Documentation, Monorepo.
- **Stack-aware** — the configuration is derived from the dependencies in your `package.json`, not copied from a template.
- **Idempotent** — every generated file is created with skip-if-exists semantics, so an existing config is never overwritten.
- **Dry run** — `--dry-run` prints the full execution plan and writes nothing.
- **MIT licensed**, no telemetry, no account.

## Install

```bash
npx create-devflow            # npm
pnpm dlx create-devflow       # pnpm
yarn dlx create-devflow       # yarn
bunx create-devflow           # bun
npm install -g create-devflow # global
```

Requires Node.js 18, 20 or 22.

## Documentation

| Page | What it covers |
| --- | --- |
| [dev-flow.xyz](https://dev-flow.xyz) | Overview, presets, comparison and FAQ |
| [CLI reference](https://dev-flow.xyz/cli) | Every flag, with examples |
| [Modules](https://dev-flow.xyz/modules) | What each module generates |
| [Guides](https://dev-flow.xyz/guides) | ESLint + Prettier + Husky, GitHub Actions for Next.js, Vitest, Docker for NestJS, Turborepo CI |
| [Comparisons](https://dev-flow.xyz/compare) | Versus manual setup, create-next-app, Nx and Turborepo |
| [Changelog](https://dev-flow.xyz/changelog) | Every published release |

## Repository layout

| Package | Path | Description |
| --- | --- | --- |
| `create-devflow` | `packages/devflow` | The CLI |
| `devflow-docs` | `packages/devflow-docs` | The documentation site |

## Development

```bash
pnpm install
pnpm test        # 138 unit tests
pnpm typecheck
pnpm build
```

## Security

Report vulnerabilities privately through
[GitHub's private vulnerability reporting](https://github.com/disin8/devflow/security/advisories/new).
The full policy is in [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE](./LICENSE).
