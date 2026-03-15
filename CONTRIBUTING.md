# Contributing to devflow

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Releasing](#releasing)

## Code of Conduct

Please be respectful and constructive in all interactions. We follow the standard open source code of conduct principles.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```sh
   git clone https://github.com/your-username/devflow.git
   cd devflow
   ```
3. Install dependencies:
   ```sh
   pnpm install
   ```

## Development Setup

This is a **pnpm monorepo** with the following packages:

| Package          | Path            | Description        |
| ---------------- | --------------- | ------------------ |
| `create-devflow` | `devflow/`      | CLI tool           |
| `devflow-docs`   | `devflow-docs/` | Documentation site |

### Commands

```sh
# Install all workspace dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run typecheck
pnpm typecheck

# Work on a specific package
pnpm --filter create-devflow dev
pnpm --filter devflow-docs dev
```

## Commit Convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via **commitlint**.

Format: `<type>(<scope>): <subject>`

### Types

| Type       | Description                                  |
| ---------- | -------------------------------------------- |
| `feat`     | A new feature                                |
| `fix`      | A bug fix                                    |
| `docs`     | Documentation changes                        |
| `style`    | Code style changes (formatting, etc.)        |
| `refactor` | Code refactoring                             |
| `perf`     | Performance improvements                     |
| `test`     | Adding or updating tests                     |
| `build`    | Build system or dependency changes           |
| `ci`       | CI/CD configuration changes                  |
| `chore`    | Other changes that don't modify src or tests |
| `revert`   | Reverting a previous commit                  |

### Examples

```sh
git commit -m "feat(cli): add --dry-run flag"
git commit -m "fix(modules): resolve husky install path on Windows"
git commit -m "docs: update quick-start guide"
```

## Pull Request Process

1. Create a feature branch from `main`:
   ```sh
   git checkout -b feat/your-feature
   ```
2. Make your changes and write/update tests as needed.
3. Ensure all checks pass:
   ```sh
   pnpm test
   pnpm typecheck
   pnpm lint
   ```
4. Push your branch and open a pull request against `main`.
5. Fill out the PR template, describing what changed and why.
6. A maintainer will review and merge once approved.

## Releasing

Releases are managed with [changelogen](https://github.com/unjs/changelogen).

```sh
# Generate/update CHANGELOG.md
pnpm changelog

# Create a release (bumps version, updates changelog, tags, and pushes)
pnpm release
```

All releases follow [Semantic Versioning](https://semver.org/).
