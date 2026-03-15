import type { DevFlowModule, Category } from "../core/types.js";

import husky from "./git/husky.js";
import lintStaged from "./git/lint-staged.js";
import commitlint from "./git/commitlint.js";
import commitizen from "./git/commitizen.js";
import lefthook from "./git/lefthook.js";
import gitCliff from "./git/git-cliff.js";
import standardVersion from "./git/standard-version.js";

import eslint from "./quality/eslint.js";
import prettier from "./quality/prettier.js";
import biome from "./quality/biome.js";
import editorconfig from "./quality/editorconfig.js";
import typescript from "./quality/typescript.js";
import stylelint from "./quality/stylelint.js";
import markdownlint from "./quality/markdownlint.js";
import cspell from "./quality/cspell.js";

import vitest from "./testing/vitest.js";
import jest from "./testing/jest.js";
import testingLibrary from "./testing/testing-library.js";
import playwright from "./testing/playwright.js";
import cypress from "./testing/cypress.js";
import msw from "./testing/msw.js";

import githubActions from "./ci/github-actions.js";
import gitlabCi from "./ci/gitlab-ci.js";
import codecov from "./ci/codecov.js";
import renovate from "./ci/renovate.js";
import dependabot from "./ci/dependabot.js";

import releaseIt from "./release/release-it.js";
import changesets from "./release/changesets.js";
import semanticRelease from "./release/semantic-release.js";
import conventionalChangelog from "./release/conventional-changelog.js";

import audit from "./security/audit.js";
import gitleaks from "./security/gitleaks.js";
import trivy from "./security/trivy.js";
import osvScanner from "./security/osv-scanner.js";

import nvmrc from "./dx/nvmrc.js";
import dotenv from "./dx/dotenv.js";
import vscode from "./dx/vscode.js";
import devcontainer from "./dx/devcontainer.js";
import makefile from "./dx/makefile.js";

import dockerfile from "./docker/dockerfile.js";
import dockerCompose from "./docker/docker-compose.js";
import dockerignore from "./docker/dockerignore.js";

import readme from "./docs/readme.js";
import contributing from "./docs/contributing.js";
import codeOfConduct from "./docs/code-of-conduct.js";
import securityMd from "./docs/security-md.js";
import license from "./docs/license.js";

import nx from "./monorepo/nx.js";
import turborepo from "./monorepo/turborepo.js";
import workspaces from "./monorepo/workspaces.js";

export const ALL_MODULES: DevFlowModule[] = [
  // Git
  husky,
  lintStaged,
  commitlint,
  commitizen,
  lefthook,
  gitCliff,
  standardVersion,
  // Quality
  eslint,
  prettier,
  biome,
  editorconfig,
  typescript,
  stylelint,
  markdownlint,
  cspell,
  // Testing
  vitest,
  jest,
  testingLibrary,
  playwright,
  cypress,
  msw,
  // CI
  githubActions,
  gitlabCi,
  codecov,
  renovate,
  dependabot,
  // Release
  releaseIt,
  changesets,
  semanticRelease,
  conventionalChangelog,
  // Security
  audit,
  gitleaks,
  trivy,
  osvScanner,
  // DX
  nvmrc,
  dotenv,
  vscode,
  devcontainer,
  makefile,
  // Docker
  dockerfile,
  dockerCompose,
  dockerignore,
  // Docs
  readme,
  contributing,
  codeOfConduct,
  securityMd,
  license,
  // Monorepo
  nx,
  turborepo,
  workspaces,
];

export const MODULE_MAP = new Map<string, DevFlowModule>(
  ALL_MODULES.map((m) => [m.id, m]),
);

export function getModulesByCategory(category: Category): DevFlowModule[] {
  return ALL_MODULES.filter((m) => m.category === category);
}

export function resolveModules(ids: string[]): DevFlowModule[] {
  const resolved = new Set<string>();
  const modules: DevFlowModule[] = [];

  function add(id: string) {
    if (resolved.has(id)) return;
    const mod = MODULE_MAP.get(id);
    if (!mod) return;
    if (mod.dependsOn) {
      for (const dep of mod.dependsOn) add(dep);
    }
    resolved.add(id);
    modules.push(mod);
  }

  for (const id of ids) add(id);
  return modules;
}

export function detectConflicts(
  ids: string[],
): Array<{ a: string; b: string; reason: string }> {
  const conflicts: Array<{ a: string; b: string; reason: string }> = [];
  const idSet = new Set(ids);
  for (const id of ids) {
    const mod = MODULE_MAP.get(id);
    if (!mod?.conflicts) continue;
    for (const conflictId of mod.conflicts) {
      if (idSet.has(conflictId)) {
        if (
          !conflicts.some(
            (c) =>
              (c.a === id && c.b === conflictId) ||
              (c.a === conflictId && c.b === id),
          )
        ) {
          conflicts.push({
            a: id,
            b: conflictId,
            reason: `"${mod.name}" conflicts with "${MODULE_MAP.get(conflictId)?.name}"`,
          });
        }
      }
    }
  }
  return conflicts;
}
