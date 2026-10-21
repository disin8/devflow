import type { HowToStep } from "./seo";

export const HOW_TO_STEPS: Record<string, HowToStep[]> = {
  "/guides/eslint-prettier-husky": [
    {
      name: "Preview the change",
      text: "Run the ESLint, Prettier and Husky modules in dry-run mode to see the files, packages and scripts that would be added before anything is written.",
      code: "npx create-devflow --dry-run --lint --husky",
    },
    {
      name: "Apply the modules",
      text: "Apply the lint and hook modules. DevFlow writes eslint.config.mjs, .prettierrc.json, .prettierignore, .editorconfig, the lint-staged configuration and the Husky hooks, and installs the matching dev dependencies.",
      code: "npx create-devflow --lint --husky",
    },
    {
      name: "Run the checks",
      text: "Run the linter and the formatter check once so existing violations do not land in your first commit, and fix them with the fix and format scripts.",
      code: "npm run lint && npm run format:check",
    },
    {
      name: "Enforce the checks in CI",
      text: "Add the GitHub Actions module so the same lint and format checks run on every pull request, and add a format check step to the generated workflow.",
      code: "npx create-devflow --ci github",
    },
  ],
  "/guides/github-actions-nextjs": [
    {
      name: "Apply the modules the pipeline depends on",
      text: "The generated workflow calls the lint, typecheck, test and build scripts. Apply the lint and test modules first so those scripts exist.",
      code: "npx create-devflow --lint --test --ci github",
    },
    {
      name: "Review the generated workflow",
      text: "Check .github/workflows/ci.yml: the triggers, the concurrency block that cancels superseded runs, the dependency cache and the order of the four steps.",
    },
    {
      name: "Widen the Node.js matrix",
      text: "The generated matrix contains Node.js 20 only. Add the versions you support to the node-version array.",
    },
    {
      name: "Add the format check",
      text: "The generated workflow does not include a formatting check. Add a step that runs the format:check script after the lint step.",
      code: "run: npm run format:check",
    },
    {
      name: "Decide where deployment happens",
      text: "The workflow does not deploy. Connect the repository to your hosting provider, or add a separate deploy job on the push trigger if you build container images.",
    },
  ],
  "/guides/vitest-react-typescript": [
    {
      name: "Apply the test modules",
      text: "Apply Vitest, and the Testing Library setup in a React or Next.js project.",
      code: "npx create-devflow --only vitest --only testing-library",
    },
    {
      name: "Install the coverage provider",
      text: "The coverage provider is a separate package. Install the V8 provider so the test:coverage script works.",
      code: "npm i -D @vitest/coverage-v8",
    },
    {
      name: "Reference the setup file",
      text: "Point the Vitest config at src/test/setup.ts so the jest-dom matchers are available in every test file.",
      code: "setupFiles: ['./src/test/setup.ts']",
    },
    {
      name: "Scope the coverage report",
      text: "Add an include glob so the report counts your source files instead of your config and test helpers.",
      code: "include: ['src/**/*.{ts,tsx}']",
    },
    {
      name: "Set thresholds and publish the report",
      text: "Add coverage thresholds so the check is meaningful, then upload the lcov report from the pull request workflow.",
      code: "thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 }",
    },
  ],
  "/guides/nestjs-docker": [
    {
      name: "Apply the container modules",
      text: "Apply the Docker, Docker Compose and .dockerignore modules to generate a multi-stage build, a local compose file and a filtered build context.",
      code: "npx create-devflow --docker",
    },
    {
      name: "Adapt the paths to NestJS",
      text: "The runtime stage copies dist/ and starts dist/main.js. Change the copy line and the command if your build output differs.",
      code: "CMD [\"node\", \"dist/main.js\"]",
    },
    {
      name: "Add a health check",
      text: "Expose a health endpoint and add a HEALTHCHECK instruction to the runtime stage so the orchestrator can probe the container.",
    },
    {
      name: "Build and verify the image",
      text: "Build the image with Docker Compose and check the resulting size against the single-stage alternative.",
      code: "docker compose up --build",
    },
    {
      name: "Build and push from CI",
      text: "Add a Docker job to the CI workflow that builds the image, pushes it to the container registry and caches the build layers.",
    },
  ],
  "/guides/turborepo-ci": [
    {
      name: "Apply the monorepo modules",
      text: "Apply the Turborepo and workspaces modules to generate the task graph, the workspace configuration and the shared TypeScript base configuration.",
      code: "npx create-devflow --only turborepo --only workspaces",
    },
    {
      name: "Add remote caching to the workflow",
      text: "Add a cache step for the .turbo/cache directory so task outputs survive between runs, with restore keys so a new commit still starts warm.",
    },
    {
      name: "Filter to the affected packages",
      text: "Run the tasks only for the packages that changed relative to the base branch, including everything that depends on them.",
      code: "pnpm turbo lint --filter=...[origin/main]",
    },
    {
      name: "Share one ESLint config",
      text: "Keep the flat config at the repository root and have each package re-export it, instead of copying the file into every package.",
    },
    {
      name: "Share the TypeScript configuration",
      text: "Each package extends the shared tsconfig.base.json, which carries the strict compiler options and the composite flag.",
    },
  ],
  "/guides/conventional-commits": [
    {
      name: "Apply the hook and configuration modules",
      text: "Apply Husky, lint-staged and Commitlint so the commit message hook and the rules it enforces are written together.",
      code: "npx create-devflow --husky",
    },
    {
      name: "Review the rules",
      text: "The strict configuration extends @commitlint/config-conventional and adds a fixed type list, a subject case rule and a 100 character header limit.",
    },
    {
      name: "Check the commit-msg hook",
      text: "The hook runs npx --no -- commitlint --edit, which resolves the local binary and never hits the npm registry.",
    },
    {
      name: "Validate commits in CI",
      text: "Add a Commitlint step to the workflow so commits made with --no-verify, or from a fork, are still validated.",
      code: "npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.sha }} --verbose",
    },
    {
      name: "Generate the changelog",
      text: "Apply the conventional-changelog module and run the changelog script to turn the history into CHANGELOG.md.",
      code: "npx create-devflow --only conventional-changelog",
    },
  ],
  "/guides/security-ci": [
    {
      name: "Apply the security modules",
      text: "Apply the audit script and Gitleaks, and the Trivy and OSV-Scanner workflows if you want container and OSV scanning as well.",
      code: "npx create-devflow --security",
    },
    {
      name: "Add the audit to the pipeline",
      text: "Add an audit step to the CI workflow. The high severity threshold keeps low-severity advisories from blocking a pull request.",
      code: "run: pnpm audit --audit-level=high",
    },
    {
      name: "Configure the Gitleaks licence",
      text: "Private repositories need a GITLEAKS_LICENSE repository secret. Public repositories work without one.",
    },
    {
      name: "Extend the allowlist",
      text: "Add test fixture and documentation paths to .gitleaks.toml so legitimate secrets do not fail the build.",
    },
    {
      name: "Enable the GitHub-native controls",
      text: "CodeQL analysis and dependency review are repository settings, not workflow files. Enable both under the repository security settings.",
    },
  ],
};
