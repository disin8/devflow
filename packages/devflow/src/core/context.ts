import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  MonorepoTool,
  PackageManager,
  ProjectContext,
  RepoType,
  Stack,
} from "./types.js";
import { collectFiles } from "./fs-utils.js";

function detectPM(
  root: string,
  pkg: Record<string, unknown> | undefined,
): PackageManager {
  if (existsSync(join(root, "bun.lockb")) || existsSync(join(root, "bun.lock")))
    return "bun";
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  if (pkg?.packageManager && typeof pkg.packageManager === "string") {
    const pm = pkg.packageManager as string;
    if (pm.startsWith("pnpm")) return "pnpm";
    if (pm.startsWith("yarn")) return "yarn";
    if (pm.startsWith("bun")) return "bun";
  }
  return "npm";
}

function detectMonorepoTool(root: string): {
  tool?: MonorepoTool;
  patterns: string[];
} {
  if (existsSync(join(root, "nx.json"))) {
    return { tool: "nx", patterns: detectWorkspacePatterns(root) };
  }
  if (existsSync(join(root, "turbo.json"))) {
    return { tool: "turborepo", patterns: detectWorkspacePatterns(root) };
  }
  const patterns = detectWorkspacePatterns(root);
  if (patterns.length > 0) {
    return { tool: "custom", patterns };
  }
  return { patterns: [] };
}

function detectWorkspacePatterns(root: string): string[] {
  const pnpmWs = join(root, "pnpm-workspace.yaml");
  if (existsSync(pnpmWs)) {
    try {
      const content = readFileSync(pnpmWs, "utf-8");
      const matches = [...content.matchAll(/-\s*['"]?([^'"#\n]+)['"]?/g)];
      return matches.map((m) => m[1].trim()).filter(Boolean);
    } catch {
      // ignore
    }
  }

  try {
    const pkgRaw = readFileSync(join(root, "package.json"), "utf-8");
    const pkg = JSON.parse(pkgRaw);
    if (Array.isArray(pkg.workspaces)) return pkg.workspaces;
    if (pkg.workspaces?.packages) return pkg.workspaces.packages;
  } catch {
    // ignore
  }
  return [];
}

function detectStack(
  root: string,
  pkg: Record<string, unknown> | undefined,
): Stack | undefined {
  if (!pkg) return undefined;
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };
  if (deps["next"]) return "nextjs";
  if (deps["nuxt"]) return "nuxt";
  if (deps["@sveltejs/kit"]) return "sveltekit";
  if (deps["@nestjs/core"]) return "nestjs";
  if (deps["react"]) return "react";
  if (deps["vue"]) return "vue";
  return "node";
}

export function detectProject(
  root: string,
  forcePm?: PackageManager,
): ProjectContext {
  const hasPackageJson = existsSync(join(root, "package.json"));
  let pkg: Record<string, unknown> | undefined;
  if (hasPackageJson) {
    try {
      pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
    } catch {
      // corrupt package.json
    }
  }
  const pm = forcePm ?? detectPM(root, pkg);
  const hasTypeScript = existsSync(join(root, "tsconfig.json"));
  const mono = detectMonorepoTool(root);
  const repoType: RepoType = mono.tool ? "monorepo" : "single";
  const stack = detectStack(root, pkg);
  const existingFiles = collectFiles(root);

  return {
    root,
    pm,
    hasPackageJson,
    hasTypeScript,
    repoType,
    monorepoTool: mono.tool,
    workspacePatterns: mono.patterns,
    stack,
    existingFiles,
    packageJson: pkg,
  };
}
