import type { PresetLevel, Stack, RepoType } from "../core/types.js";

export interface Preset {
  moduleIds: string[];
}

const BASE_MINIMAL = ["husky", "lint-staged", "commitlint", "editorconfig"];
const BASE_HOOKS_QUALITY = [...BASE_MINIMAL, "eslint", "prettier"];
const BASE_RECOMMENDED = [
  ...BASE_HOOKS_QUALITY,
  "vitest",
  "github-actions",
  "typescript",
  "nvmrc",
  "dotenv",
  "vscode",
];
const BASE_FULL = [
  ...BASE_RECOMMENDED,
  "commitizen",
  "stylelint",
  "markdownlint",
  "cspell",
  "playwright",
  "codecov",
  "renovate",
  "release-it",
  "audit",
  "gitleaks",
  "makefile",
  "dockerfile",
  "dockerignore",
  "docker-compose",
  "readme",
  "contributing",
  "code-of-conduct",
  "security-md",
  "license",
];

function reactModules(level: PresetLevel): string[] {
  const ids =
    level === "minimal"
      ? BASE_MINIMAL
      : level === "recommended"
        ? BASE_RECOMMENDED
        : BASE_FULL;
  const extra: string[] = ["testing-library"];
  if (level === "full") extra.push("playwright");
  return [...ids, ...extra];
}

function vueModules(level: PresetLevel): string[] {
  const ids =
    level === "minimal"
      ? BASE_MINIMAL
      : level === "recommended"
        ? BASE_RECOMMENDED
        : BASE_FULL;
  return [...ids, "testing-library"];
}

function nodeModules(level: PresetLevel): string[] {
  const ids =
    level === "minimal"
      ? BASE_MINIMAL
      : level === "recommended"
        ? BASE_RECOMMENDED
        : BASE_FULL;
  return ids;
}

function nestModules(level: PresetLevel): string[] {
  return nodeModules(level);
}

function nextModules(level: PresetLevel): string[] {
  return reactModules(level);
}

function nuxtModules(level: PresetLevel): string[] {
  return vueModules(level);
}

function sveltekitModules(level: PresetLevel): string[] {
  const ids =
    level === "minimal"
      ? BASE_MINIMAL
      : level === "recommended"
        ? BASE_RECOMMENDED
        : BASE_FULL;
  return ids;
}

const STACK_FN: Record<Stack, (level: PresetLevel) => string[]> = {
  react: reactModules,
  vue: vueModules,
  node: nodeModules,
  nestjs: nestModules,
  nextjs: nextModules,
  nuxt: nuxtModules,
  sveltekit: sveltekitModules,
};

export function getPreset(
  stack: Stack | undefined,
  level: PresetLevel,
  repoType: RepoType,
): string[] {
  const fn = STACK_FN[stack ?? "node"];
  let ids = fn(level);

  if (repoType === "monorepo") {
    ids = ids.filter((id) => id !== "release-it");
    ids.push("changesets", "workspaces");
  }

  return [...new Set(ids)];
}
