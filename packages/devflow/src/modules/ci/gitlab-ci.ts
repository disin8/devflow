import type {
  DevFlowModule,
  ModuleAction,
  ProjectContext,
} from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

function buildPipeline(ctx: ProjectContext): string {
  const pm = ctx.pm;
  const installCmd =
    pm === "pnpm"
      ? "corepack enable && pnpm install --frozen-lockfile"
      : pm === "yarn"
        ? "corepack enable && yarn install --frozen-lockfile"
        : pm === "bun"
          ? "curl -fsSL https://bun.sh/install | bash && bun install"
          : "npm ci";
  const runPrefix = pm === "npm" ? "npm run" : pm;
  const cachePath =
    pm === "pnpm"
      ? ".pnpm-store"
      : pm === "yarn"
        ? ".yarn/cache"
        : "node_modules/";

  return `stages:
  - install
  - quality
  - test
  - build

variables:
  NODE_VERSION: "20"

default:
  image: node:\${NODE_VERSION}-alpine
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths:
      - ${cachePath}
      - node_modules/

install:
  stage: install
  script:
    - ${installCmd}

lint:
  stage: quality
  script:
    - ${runPrefix} lint
  needs: [install]

typecheck:
  stage: quality
  script:
    - ${runPrefix} typecheck
  needs: [install]
  allow_failure: true

test:
  stage: test
  script:
    - ${runPrefix} test
  needs: [install]
  coverage: '/All files[^|]*\\|[^|]*\\s+([\\d.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  script:
    - ${runPrefix} build
  needs: [lint, typecheck, test]
  artifacts:
    paths:
      - dist/
`;
}

const gitlabCiModule: DevFlowModule = {
  id: "gitlab-ci",
  name: "GitLab CI",
  description: "CI/CD pipeline for GitLab (lint → typecheck → test → build)",
  category: "ci",

  async detect(ctx) {
    const has = fileExists(ctx.root, ".gitlab-ci.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    return [
      {
        type: "create-file" as const,
        path: ".gitlab-ci.yml",
        content: buildPipeline(ctx),
        skipIfExists: true,
      },
    ];
  },
};

export default gitlabCiModule;
