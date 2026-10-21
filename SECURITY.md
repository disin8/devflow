# Security Policy

## Supported Versions

DevFlow follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Security fixes are released for the
latest minor version of each major line.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security problems.**

Report vulnerabilities privately through GitHub's
[private vulnerability reporting](https://github.com/disin8/devflow/security/advisories/new) page, or by email to
`dmitry.sin8@gmail.com`.

Please include:

- the affected version of `create-devflow`
- your Node.js version and operating system
- a minimal reproduction (repository, config, or command sequence)
- the impact you observed

You can expect an acknowledgement within **72 hours** and a status update within **7 days**. Once the report is
confirmed, a patched release is published and the advisory is disclosed with credit to the reporter unless anonymity is
requested.

## Scope

DevFlow is a **scaffolding CLI**. It runs in your repository and writes configuration files. The following are in scope:

- commands executed by the CLI, including the package-manager invocations used to install dependencies
- content of generated configuration files (workflows, Dockerfiles, hook scripts)
- handling of repository metadata read during project detection

The following are **out of scope**:

- vulnerabilities in the third-party packages that DevFlow installs (ESLint, Prettier, Husky, Vitest, Docker, …) —
  report those to their own maintainers
- misconfiguration of tools after generation, for example a permissive ESLint rule that you added yourself
- issues that require an already-compromised developer machine or a malicious dependency in your own project

## Supply Chain Policy

- Runtime dependencies are kept minimal (`@inquirer/prompts`, `chalk`, `commander`, `ora`).
- Every release is published to npm from the repository with a pinned `pnpm-lock.yaml`.
- Dependency updates are reviewed through automated pull requests from Dependabot.
- The CI pipeline runs type checking, the unit test suite and a production build on every pull request.
- Generated workflows are committed to your repository, so you can review them before they run.

## Security Hardening in Generated Projects

The `security` module (`npx create-devflow --security`) adds:

- an `npm audit`/`pnpm audit` script with a high-severity threshold
- [Gitleaks](https://github.com/gitleaks/gitleaks) for secret detection, including a GitHub Actions workflow
- optional [Trivy](https://trivy.dev/) and [OSV-Scanner](https://google.github.io/osv-scanner/) workflows for
  container and dependency vulnerability scanning

See the [Security module reference](https://dev-flow.xyz/modules/security) for the exact files and workflows that are
generated.
