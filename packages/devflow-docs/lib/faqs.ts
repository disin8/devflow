import type { FaqItem } from "./seo";

export const GLOBAL_FAQS: FaqItem[] = [
  {
    question: "Does DevFlow overwrite my existing ESLint config?",
    answer: "No. Every configuration file is created with skip-if-exists semantics, so an existing eslint.config.mjs, .prettierrc.json, .husky/pre-commit or any other generated file is left untouched. DevFlow does rewrite package.json, but it only merges: existing scripts are never replaced, and new scripts are added alongside them.",
  },
  {
    question: "Does create-devflow support pnpm, yarn and bun?",
    answer: "Yes. The package manager is detected from the lock file (pnpm-lock.yaml, yarn.lock, bun.lockb or package-lock.json) or the packageManager field, and the install command, CI workflow and Dockerfile are all generated for the detected manager. Use --pm pnpm, --pm yarn or --pm bun to override detection.",
  },
  {
    question: "Can I add only GitHub Actions without Docker?",
    answer: "Yes. Run npx create-devflow --ci github to generate only .github/workflows/ci.yml, or use --only <module> to select any single module. Every module can be applied on its own.",
  },
  {
    question: "How do I remove DevFlow from my repository?",
    answer: "DevFlow has no --undo flag, but everything it writes is plain text in your repository. Delete the generated files listed on each module page, remove the scripts it added from package.json, and remove the devDependencies it installed. Running the tool in a clean git checkout and reviewing the diff is the safest way to see exactly what changed.",
  },
  {
    question: "Does DevFlow support Next.js App Router?",
    answer: "Yes. A project with the next dependency is detected as a Next.js stack, which means DevFlow generates the React + TypeScript ESLint flat config and the React Testing Library setup. The same config works for both the App Router and the Pages Router, because DevFlow does not add framework-specific Next.js ESLint plugins that would be tied to a router.",
  },
  {
    question: "Does DevFlow work with Nx and Turborepo?",
    answer: "Yes. The monorepo category contains Nx, Turborepo and workspace modules, and a project with nx.json or turbo.json is detected as a monorepo. DevFlow generates the nx.json or turbo.json configuration and the turbo scripts. The generated CI workflow is a single-repository pipeline, so monorepo caching and affected-only runs are covered in the Turborepo CI guide.",
  },
  {
    question: "How do I run DevFlow in dry-run mode?",
    answer: "Add --dry-run to any command, for example npx create-devflow --dry-run for the wizard or npx create-devflow --all --dry-run for the recommended preset. DevFlow then prints the execution plan — files to create, packages to install and scripts to add — and writes nothing to disk.",
  },
  {
    question: "Is DevFlow free and open source?",
    answer: "Yes. DevFlow is MIT licensed, published on npm as create-devflow, and the full source is available on GitHub. There is no paid tier, no telemetry and no account required.",
  },
  {
    question: "What Node.js versions does DevFlow support?",
    answer: "Node.js 18, 20 and 22. The package declares node >=18.0.0 in its engines field, and the generated CI workflow runs on Node.js 20 by default.",
  },
  {
    question: "Does DevFlow work on Windows?",
    answer: "DevFlow runs on macOS, Linux and Windows through WSL2. It is a Node.js CLI with no native binary dependencies, and the generated files use POSIX-style paths and LF line endings.",
  },
];

export const FAQ_BY_PATH: Record<string, FaqItem[]> = {
  "/": [
    {
      question: "Is DevFlow a scaffolder or a workflow generator?",
      answer: "It is a workflow generator. DevFlow does not create your application — it adds the development workflow to a repository that already exists: Git hooks, linting, formatting, testing, CI/CD, Docker and security configuration. That is why it can be run safely inside an existing project.",
    },
    {
      question: "Will DevFlow change my application code?",
      answer: "No. DevFlow only writes configuration files, adds npm scripts and installs dev dependencies. It never touches files under src/ except for the Testing Library setup file and the Mock Service Worker handlers, both of which are new files.",
    },
    {
      question: "How is DevFlow different from copying config from another repository?",
      answer: "Copying works, but the copied config is usually not adapted to the target stack, the package manager or the CI provider, and it silently drifts as the tools are upgraded. DevFlow regenerates the configuration from the detected project context, so the same command produces a correct result in a pnpm monorepo and in an npm single-package repository.",
    },
  ],
  "/cli": [
    {
      question: "What is the difference between --all and the interactive wizard?",
      answer: "--all applies the recommended preset for the detected stack without asking any questions. The wizard lets you pick modules one by one, tune settings such as commit strictness and CI provider, and review the execution plan before it is applied. Both paths use the same module implementations.",
    },
    {
      question: "Can I combine several flags at once?",
      answer: "Yes. Flags can be combined, for example npx create-devflow --lint --test --ci github. Each flag expands to the modules it owns and the union of all selected modules is applied in one plan.",
    },
    {
      question: "Does --only accept more than one module?",
      answer: "No, --only takes exactly one module id and exits with an error if the id is unknown, printing the list of valid ids. To select several modules, use the dedicated flags or the interactive wizard.",
    },
  ],
  "/modules/eslint": [
    {
      question: "Does DevFlow use the legacy .eslintrc format?",
      answer: "No. DevFlow generates eslint.config.mjs, the flat configuration format that ESLint 9 uses by default. If your project still relies on .eslintrc, DevFlow will not replace it — the existing file is left in place and you can migrate manually.",
    },
    {
      question: "Which ESLint plugins are installed?",
      answer: "eslint and @eslint/js always, typescript-eslint when the project has a tsconfig.json, eslint-plugin-react and eslint-plugin-react-hooks for React and Next.js projects, and eslint-plugin-vue for Vue and Nuxt projects.",
    },
  ],
  "/modules/husky": [
    {
      question: "Why does the pre-commit hook run lint-staged instead of the full lint?",
      answer: "Running the full lint on every commit is slow on larger codebases. When the lint-staged module is applied, the generated .husky/pre-commit runs npx lint-staged so only the staged files are checked. Without lint-staged it falls back to npm run lint.",
    },
    {
      question: "Do I need to run git init first?",
      answer: "Husky needs a Git repository, because it installs hooks into .git/hooks. DevFlow writes the .husky directory and the prepare script regardless, but the hooks only become active once the project is a Git repository.",
    },
  ],
  "/modules/vitest": [
    {
      question: "Does DevFlow set coverage thresholds?",
      answer: "No. It configures the V8 coverage provider with the text and lcov reporters, but it does not invent a threshold for your project. The Vitest guide shows the exact snippet to add thresholds and how to publish the report from a pull request.",
    },
    {
      question: "Which test environment is used?",
      answer: "jsdom for React, Next.js, Vue and Nuxt projects, and node for Node.js, NestJS and SvelteKit projects.",
    },
  ],
  "/modules/github-actions": [
    {
      question: "Does the generated workflow deploy my application?",
      answer: "No. The generated workflow runs lint, type-check, test and build on pushes and pull requests against main and master. It does not contain a deploy job, because the right deploy target depends on your hosting provider.",
    },
    {
      question: "Why is the type-check step allowed to fail?",
      answer: "The generated workflow marks the type-check step with continue-on-error so that a type error is reported without blocking the whole pipeline. Remove that line if you want type errors to fail the build.",
    },
    {
      question: "Which Node.js versions does the workflow test?",
      answer: "The generated matrix contains Node.js 20. Add more entries to the node-version array to test 18 and 22 as well.",
    },
  ],
  "/modules/docker": [
    {
      question: "Does the generated Dockerfile include a health check?",
      answer: "No. DevFlow generates a multi-stage build with a non-root user and a production-only dependency install, but it does not add a HEALTHCHECK instruction because the correct probe depends on your application. The NestJS Docker guide shows how to add one.",
    },
    {
      question: "Why does the runtime stage copy dist/?",
      answer: "The production stage only contains production dependencies and the compiled output. Your project needs a build step that emits to dist/ — adjust the COPY line if your build outputs somewhere else.",
    },
  ],
  "/modules/monorepo": [
    {
      question: "Does DevFlow generate a monorepo-aware CI pipeline?",
      answer: "Not by default. The generated GitHub Actions workflow is a single-repository pipeline. The Turborepo CI guide shows the exact diff to add remote caching, affected-package filtering and parallel task execution.",
    },
    {
      question: "Can DevFlow be used in an existing pnpm workspace?",
      answer: "Yes. If pnpm-workspace.yaml already exists, the workspaces module keeps it and only adds the shared tsconfig.base.json and the lint:all and test:all scripts.",
    },
  ],
  "/modules/security": [
    {
      question: "Does the Gitleaks workflow work without a paid licence?",
      answer: "For public repositories the workflow works out of the box. For private repositories, Gitleaks requires a licence key, which is read from the GITLEAKS_LICENSE repository secret.",
    },
    {
      question: "Does npm audit run automatically?",
      answer: "No. The security module adds an audit script and a Gitleaks workflow. Running the audit on every build is your choice, and the security CI guide shows how to wire it into the pipeline.",
    },
  ],
  "/guides/eslint-prettier-husky": [
    {
      question: "How do I avoid ESLint and Prettier fighting over formatting?",
      answer: "Turn off the ESLint formatting rules and let Prettier own formatting. DevFlow's generated ESLint config only extends the recommended rule sets, which do not include stylistic rules, and the generated lint-staged config runs eslint --fix followed by prettier --write, so Prettier always has the last word.",
    },
    {
      question: "Do I need lint-staged?",
      answer: "No, but it is recommended. Without it the pre-commit hook runs the full npm run lint on every commit, which gets slow as the codebase grows. lint-staged limits the work to the files you actually changed.",
    },
    {
      question: "Why does my commit fail with a commitlint error?",
      answer: "The commit-msg hook runs Commitlint against the Conventional Commits format. The strict configuration DevFlow generates accepts a fixed set of types, requires a lower-case subject and caps the header at 100 characters. An example of a valid message is feat(eslint): add flat config.",
    },
  ],
  "/guides/github-actions-nextjs": [
    {
      question: "How do I add a deploy step for Vercel?",
      answer: "Vercel builds Next.js itself when the repository is connected to a Vercel project, so the GitHub Actions workflow does not need a deploy job. Keep the workflow for lint, type-check, test and build, and let Vercel handle deployment from its own Git integration.",
    },
    {
      question: "Why does the build step need the lint and type-check steps to pass?",
      answer: "They do not have to. The generated workflow runs type-check with continue-on-error so a type error is visible in the logs without blocking the build. Remove the continue-on-error line to make type errors fail the pipeline.",
    },
  ],
  "/guides/vitest-react-typescript": [
    {
      question: "Where do I put the Vitest setup file?",
      answer: "DevFlow writes src/test/setup.ts for the Testing Library matchers. Reference it from vitest.config.ts with setupFiles if you add it to a project that does not have it yet — the Vitest guide shows the exact snippet.",
    },
    {
      question: "How do I publish coverage to a pull request?",
      answer: "Generate the lcov report with npm run test:coverage and upload it with an action such as codecov/codecov-action. The guide contains the workflow step and the threshold configuration to add to vitest.config.ts.",
    },
  ],
  "/guides/nestjs-docker": [
    {
      question: "How do I run the container with a health check?",
      answer: "Add a HEALTHCHECK instruction to the runtime stage of the generated Dockerfile that hits your NestJS health endpoint. The guide contains the exact snippet.",
    },
    {
      question: "Does the generated Dockerfile work with pnpm?",
      answer: "Yes. The builder stage enables corepack and installs with the frozen lock file, and the runtime stage installs production dependencies only, using the same lock file name.",
    },
  ],
  "/guides/turborepo-ci": [
    {
      question: "Does the generated CI pipeline cache Turborepo results?",
      answer: "No. The generated workflow caches package-manager downloads, not Turborepo task outputs. The guide shows the diff that adds Turborepo remote caching with a GitHub Actions cache.",
    },
    {
      question: "How do I run only the packages affected by a pull request?",
      answer: "Use the --filter flag with the affected base branch, for example turbo run lint test --filter=...[origin/main]. The guide includes the full workflow step.",
    },
  ],
  "/guides/conventional-commits": [
    {
      question: "Which commit types does the strict configuration allow?",
      answer: "feat, fix, docs, style, refactor, perf, test, build, ci, chore and revert. A looser configuration, which only extends @commitlint/config-conventional, is available in the wizard.",
    },
    {
      question: "Can I keep commitlint but skip the hook?",
      answer: "Yes. Delete .husky/commit-msg and commitlint still runs in CI if you add a commitlint step to your workflow, so pull requests are validated even when a developer commits locally without hooks.",
    },
  ],
  "/guides/security-ci": [
    {
      question: "Do I need a Gitleaks licence for a private repository?",
      answer: "Yes. The Gitleaks action requires a GITLEAKS_LICENSE secret for private repositories. Public repositories work without one.",
    },
    {
      question: "Will npm audit fail my build on low-severity issues?",
      answer: "No. The generated audit script uses a high-severity threshold, so low and moderate findings are reported without failing the command.",
    },
  ],
  "/compare/create-next-app": [
    {
      question: "Should I use create-next-app or DevFlow?",
      answer: "Use create-next-app to create the application and DevFlow to configure the workflow. create-next-app generates a Next.js application with a development setup; DevFlow adds the Git hooks, linting, tests, CI pipeline and Docker files that a team needs afterwards.",
    },
  ],
  "/compare/nx": [
    {
      question: "Does DevFlow replace Nx?",
      answer: "No. DevFlow writes the nx.json configuration and the linting, testing and CI files that Nx-based repositories need, but it does not implement a build system. Nx remains responsible for task graph, caching and generators.",
    },
  ],
  "/compare/turborepo": [
    {
    question: "Does DevFlow replace Turborepo?",
    answer: "No. DevFlow writes turbo.json and the turbo scripts, while Turborepo remains responsible for task execution, caching and the run pipeline. The comparison lists exactly which part each tool owns.",
    },
  ],
  "/compare/manual-setup": [
    {
      question: "Is manual setup really that bad?",
      answer: "It works — it is just unrepeatable. The cost shows up when you add a new repository, upgrade a tool, or change the package manager. DevFlow regenerates the same verified configuration from the detected context every time, which removes the copy-paste step.",
    },
  ],
  "/docs/dry-run": [
    {
      question: "What exactly does --dry-run show?",
      answer: "The complete execution plan: every file that would be created, every package that would be installed and every npm script that would be added, in the same format the real run prints. Nothing is written to disk and no package is installed.",
    },
    {
      question: "Can I run DevFlow in CI to check a repository is up to date?",
      answer: "Yes. Run DevFlow with --dry-run in a CI job and compare the printed plan with the files in the repository. The plan is deterministic for a given project context, so a mismatch means a configuration file is missing.",
    },
  ],
  "/docs/installation": [
    {
      question: "Which Node.js versions are supported?",
      answer: "Node.js 18, 20 and 22. The package declares node >=18.0.0 in its engines field, and the generated CI workflow runs on Node.js 20 by default.",
    },
    {
      question: "Do I have to install DevFlow globally?",
      answer: "No. npx create-devflow fetches the latest published version and runs it, which is the recommended way. A global install is useful when you run it often, and a project-local dev dependency is useful when you want to pin the version.",
    },
    {
      question: "Does it work with pnpm, yarn and bun?",
      answer: "Yes. The package manager is detected from the lock file or the packageManager field, and the install command, CI workflow and Dockerfile are generated for the detected manager. Use --pm to override the detection.",
    },
  ],
  "/docs/presets": [
    {
      question: "Which preset should I choose?",
      answer: "Recommended for most projects. Minimal if you only want the Git hooks and commit validation. Full if the repository ships to production and is maintained by more than one person.",
    },
    {
      question: "Does a preset overwrite my existing configuration?",
      answer: "No. A preset is a list of modules, and every module creates its files with skip-if-exists semantics. An existing eslint.config.mjs or CI workflow is left untouched.",
    },
    {
      question: "How do presets change in a monorepo?",
      answer: "The release-it module is replaced with Changesets, which is monorepo friendly, and the workspaces module is added for the shared configuration and the workspace scripts.",
    },
  ],
  "/docs/quick-start": [
    {
      question: "Do I need a package.json before running DevFlow?",
      answer: "A package.json is expected — the package manager, the stack and the repository type are detected from it and from the lock files. DevFlow creates the files it needs, but it does not initialise your project for you.",
    },
    {
      question: "How long does it take?",
      answer: "The detection and the plan take a second or two. The time afterwards is the package installation, which is dominated by how many packages the selected modules add.",
    },
  ],
  "/docs/configuration": [
    {
      question: "What happens if the lock file and the packageManager field disagree?",
      answer: "The lock file wins. It is the file that actually determines the installed tree, so it is the more reliable signal.",
    },
    {
      question: "How do I force a different package manager?",
      answer: "Pass --pm with npm, pnpm, yarn or bun. The flag takes priority over both the lock file and the packageManager field.",
    },
    {
      question: "Is DevFlow safe to run twice?",
      answer: "Yes. Every configuration file is created with skip-if-exists semantics and package.json is merged, so a second run only adds what is missing.",
    },
  ],
};

const PATHS_WITH_GLOBAL_FAQS = new Set(["/", "/cli"]);

export function faqsFor(path: string): FaqItem[] {
  const normalised = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  const specific = FAQ_BY_PATH[normalised] ?? [];

  if (PATHS_WITH_GLOBAL_FAQS.has(normalised)) {
    return [...GLOBAL_FAQS, ...specific];
  }

  return specific;
}
