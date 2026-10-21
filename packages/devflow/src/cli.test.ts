import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createCLI } from "./cli.js";
import { readVersion } from "./version.js";
import {
  CI_PROVIDERS,
  CI_PROVIDER_MODULES,
  isCiProvider,
} from "./core/ci-providers.js";
import githubActions from "./modules/ci/github-actions.js";
import dockerfileModule from "./modules/docker/dockerfile.js";
import type { ModuleAction, ProjectContext } from "./core/types.js";

const here = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(here, "..", "package.json");

function fileContent(actions: ModuleAction[], path: string): string {
  const action = actions.find(
    (candidate) => candidate.type === "create-file" && candidate.path === path,
  );
  if (!action || action.type !== "create-file") {
    throw new Error(`No create-file action for ${path}`);
  }
  return action.content;
}

function makeCtx(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    root: process.cwd(),
    pm: "npm",
    hasPackageJson: true,
    hasTypeScript: true,
    repoType: "single",
    workspacePatterns: [],
    stack: "node",
    existingFiles: new Set<string>(),
    packageJson: { name: "demo" },
    ...overrides,
  };
}

describe("published version", () => {
  it("matches the version in package.json", () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as {
      version: string;
    };
    expect(readVersion()).toBe(pkg.version);
  });

  it("is not a hardcoded placeholder", () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as {
      version: string;
    };
    expect(pkg.version).not.toBe("1.0.0");
  });

  it("is reported by the CLI", () => {
    const program = createCLI();
    expect(program.version()).toBe(readVersion());
  });
});

describe("CLI options", () => {
  it("declares every documented flag", () => {
    const program = createCLI();
    const flags = program.options.map((option) => option.long ?? option.short);

    expect(flags).toEqual(
      expect.arrayContaining([
        "--all",
        "--only",
        "--dry-run",
        "--yes",
        "--skip-install",
        "--pm",
        "--ci",
        "--scope",
        "--verbose",
        "--husky",
        "--lint",
        "--test",
        "--release",
        "--docker",
        "--docs",
        "--security",
      ]),
    );
  });

  it("documents the accepted CI providers", () => {
    const program = createCLI();
    const ci = program.options.find((option) => option.long === "--ci");
    expect(ci?.description).toContain("github|gitlab|both");
  });
});

describe("CI provider resolution", () => {
  it("maps every documented provider to modules", () => {
    expect(CI_PROVIDERS).toEqual(["github", "gitlab", "both"]);
    expect(CI_PROVIDER_MODULES.github).toEqual(["github-actions"]);
    expect(CI_PROVIDER_MODULES.gitlab).toEqual(["gitlab-ci"]);
    expect(CI_PROVIDER_MODULES.both).toEqual([
      "github-actions",
      "gitlab-ci",
    ]);
  });

  it("rejects unknown providers", () => {
    expect(isCiProvider("github")).toBe(true);
    expect(isCiProvider("jenkins")).toBe(false);
  });
});

describe("GitHub Actions workflow", () => {
  it("uses an explicit run for every package manager", async () => {
    for (const pm of ["npm", "pnpm", "yarn", "bun"] as const) {
      const actions = await githubActions.plan(makeCtx({ pm }), {});
      const workflow = fileContent(actions, ".github/workflows/ci.yml");

      expect(workflow).toContain(`run: ${pm} run lint`);
      expect(workflow).toContain(`run: ${pm} run test`);
      expect(workflow).toContain(`run: ${pm} run build`);

      expect(workflow).not.toContain("run: bun build");
      expect(workflow).not.toContain("run: bun lint");
    }
  });

  it("caches dependencies for npm, pnpm and yarn but not bun", async () => {
    const npm = fileContent(
      await githubActions.plan(makeCtx({ pm: "npm" }), {}),
      ".github/workflows/ci.yml",
    );
    expect(npm).toContain("cache: 'npm'");

    const pnpm = fileContent(
      await githubActions.plan(makeCtx({ pm: "pnpm" }), {}),
      ".github/workflows/ci.yml",
    );
    expect(pnpm).toContain("cache: 'pnpm'");

    const bun = fileContent(
      await githubActions.plan(makeCtx({ pm: "bun" }), {}),
      ".github/workflows/ci.yml",
    );
    expect(bun).not.toContain("cache:");
  });

  it("keeps the type-check step non-blocking", async () => {
    const workflow = fileContent(
      await githubActions.plan(makeCtx(), {}),
      ".github/workflows/ci.yml",
    );
    expect(workflow).toContain("continue-on-error: true");
  });
});

describe("Dockerfile", () => {
  it("invokes the build script explicitly for every package manager", async () => {
    for (const pm of ["npm", "pnpm", "yarn", "bun"] as const) {
      const actions = await dockerfileModule.plan(makeCtx({ pm }), {});
      const content = fileContent(actions, "Dockerfile");

      expect(content).toContain(
        pm === "npm" ? "RUN npm run build" : `RUN ${pm} run build`,
      );
      expect(content).not.toContain("RUN bun build");
    }
  });

  it("runs the image as a non-root user", async () => {
    const content = fileContent(
      await dockerfileModule.plan(makeCtx(), {}),
      "Dockerfile",
    );
    expect(content).toContain("USER appuser");
  });
});

describe("module catalogue is published honestly", () => {
  it("the site claims 50 modules and the registry has 50", async () => {
    const { ALL_MODULES } = await import("./modules/registry.js");
    expect(ALL_MODULES.length).toBe(50);
  });

  it("every module id is listed on the /modules page", async () => {
    const { ALL_MODULES } = await import("./modules/registry.js");
    const docs = join(
      here,
      "..",
      "..",
      "..",
      "devflow-docs",
      "content",
      "modules",
      "index.mdx",
    );

    let content = "";
    try {
      content = readFileSync(docs, "utf-8");
    } catch {
      return;
    }

    for (const module of ALL_MODULES) {
      expect(content, `${module.id} is not listed on /modules`).toContain(
        module.id,
      );
    }
  });
});
