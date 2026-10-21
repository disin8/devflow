import type {
  DevFlowModule,
  ModuleAction,
  ProjectContext,
} from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

function buildWorkflow(ctx: ProjectContext): string {
  const pm = ctx.pm;
  const installCmd =
    pm === "pnpm"
      ? "pnpm install --frozen-lockfile"
      : pm === "yarn"
        ? "yarn install --frozen-lockfile"
        : pm === "bun"
          ? "bun install --frozen-lockfile"
          : "npm ci";

  const runPrefix = pm === "npm" ? "npm run" : `${pm} run`;

  const setupPnpm =
    pm === "pnpm"
      ? `
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
`
      : "";

  const setupBun =
    pm === "bun"
      ? `
      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
`
      : "";

  const cache = pm === "bun" ? undefined : pm;

  return `name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]

    steps:
      - name: Checkout
        uses: actions/checkout@v4
${setupPnpm}${setupBun}
      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          ${
            cache
              ? `cache: '${cache}'`
              : "# bun is installed by oven-sh/setup-bun, so there is no node_modules cache to restore"
          }

      - name: Install dependencies
        run: ${installCmd}

      - name: Lint
        run: ${runPrefix} lint

      - name: Typecheck
        run: ${runPrefix} typecheck
        continue-on-error: true

      - name: Test
        run: ${runPrefix} test

      - name: Build
        run: ${runPrefix} build
`;
}

const githubActionsModule: DevFlowModule = {
  id: "github-actions",
  name: "GitHub Actions",
  description: "CI/CD workflow for GitHub (lint → typecheck → test → build)",
  category: "ci",
  recommendedFor: [
    "react",
    "vue",
    "node",
    "nestjs",
    "nextjs",
    "nuxt",
    "sveltekit",
  ],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".github/workflows/ci.yml") ||
      fileExists(ctx.root, ".github/workflows/ci.yaml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    return [
      {
        type: "create-file" as const,
        path: ".github/workflows/ci.yml",
        content: buildWorkflow(ctx),
        skipIfExists: true,
      },
    ];
  },
};

export default githubActionsModule;
