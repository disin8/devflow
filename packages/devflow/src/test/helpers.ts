import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, sep } from "node:path";
import { tmpdir } from "node:os";
import type {
  ProjectContext,
  PackageManager,
  Stack,
  RepoType,
} from "../core/types.js";

export function makeTempDir(): string {
  return mkdtempSync(join(tmpdir(), "devflow-test-"));
}

export function writeFile(root: string, rel: string, content: string): void {
  const abs = join(root, rel);
  mkdirSync(join(abs, "..").split(sep).join(sep), { recursive: true });
  writeFileSync(abs, content, "utf-8");
}

export function writePackageJson(
  root: string,
  extra: Record<string, unknown> = {},
): void {
  writeFile(
    root,
    "package.json",
    JSON.stringify(
      { name: "test-project", version: "1.0.0", ...extra },
      null,
      2,
    ),
  );
}

export function removeDir(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

export function stubContext(
  overrides: Partial<ProjectContext> = {},
): ProjectContext {
  return {
    root: "/tmp/stub",
    pm: "npm",
    hasPackageJson: true,
    hasTypeScript: false,
    repoType: "single",
    workspacePatterns: [],
    existingFiles: new Set<string>(),
    ...overrides,
  };
}

export function stubTsContext(
  overrides: Partial<ProjectContext> = {},
): ProjectContext {
  return stubContext({ hasTypeScript: true, ...overrides });
}

export function writeLockFile(root: string, pm: PackageManager): void {
  const lockFiles: Record<PackageManager, string> = {
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnpm-lock.yaml",
    bun: "bun.lockb",
  };
  writeFile(root, lockFiles[pm], "");
}
