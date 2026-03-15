import { describe, it, expect, beforeEach, afterEach } from "vitest";
import huskyModule from "../modules/git/husky.js";
import commitlintModule from "../modules/git/commitlint.js";
import eslintModule from "../modules/quality/eslint.js";
import biomeModule from "../modules/quality/biome.js";
import githubActionsModule from "../modules/ci/github-actions.js";
import {
  makeTempDir,
  removeDir,
  stubContext,
  stubTsContext,
  writeFile,
} from "../test/helpers.js";

let dir: string;

beforeEach(() => {
  dir = makeTempDir();
});
afterEach(() => {
  removeDir(dir);
});

describe("husky.detect()", () => {
  it("returns alreadyConfigured=false when .husky dir absent", async () => {
    const ctx = stubContext({ root: dir });
    const result = await huskyModule.detect(ctx);
    expect(result.applicable).toBe(true);
    expect(result.alreadyConfigured).toBe(false);
  });

  it("returns alreadyConfigured=true when .husky/pre-commit exists", async () => {
    writeFile(dir, ".husky/pre-commit", "#!/bin/sh\nnpx lint-staged\n");
    const ctx = stubContext({ root: dir });
    const result = await huskyModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(true);
  });
});

describe("husky.plan()", () => {
  it('adds install action for "husky" as devDependency', async () => {
    const ctx = stubContext({ root: dir });
    const actions = await huskyModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install");
    expect(install).toBeDefined();
    expect((install as any).packages).toContain("husky");
    expect((install as any).dev).toBe(true);
  });

  it('adds a "prepare" script', async () => {
    const ctx = stubContext({ root: dir });
    const actions = await huskyModule.plan(ctx, {});
    const script = actions.find(
      (a) => a.type === "add-script" && (a as any).name === "prepare",
    );
    expect(script).toBeDefined();
  });

  it("creates .husky/pre-commit and .husky/commit-msg by default", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await huskyModule.plan(ctx, {});
    const files = actions
      .filter((a) => a.type === "create-file")
      .map((a) => (a as any).path);
    expect(files).toContain(".husky/pre-commit");
    expect(files).toContain(".husky/commit-msg");
  });

  it("respects custom hooks option: only pre-push", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await huskyModule.plan(ctx, { hooks: ["pre-push"] });
    const files = actions
      .filter((a) => a.type === "create-file")
      .map((a) => (a as any).path);
    expect(files).not.toContain(".husky/pre-commit");
    expect(files).not.toContain(".husky/commit-msg");
  });
});

describe("commitlint.detect()", () => {
  it("returns alreadyConfigured=false without config file", async () => {
    const ctx = stubContext({ root: dir });
    const result = await commitlintModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(false);
  });

  it("returns alreadyConfigured=true when commitlint.config.mjs exists", async () => {
    writeFile(dir, "commitlint.config.mjs", "export default {};");
    const ctx = stubContext({ root: dir });
    const result = await commitlintModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(true);
  });
});

describe("commitlint.plan()", () => {
  it("installs @commitlint/cli and @commitlint/config-conventional", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await commitlintModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install") as any;
    expect(install.packages).toContain("@commitlint/cli");
    expect(install.packages).toContain("@commitlint/config-conventional");
  });

  it("strict mode (default) generates config with rules block", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await commitlintModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).toContain("type-enum");
    expect(file.content).toContain("header-max-length");
  });

  it("loose mode generates minimal config without extra rules", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await commitlintModule.plan(ctx, { mode: "loose" });
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).not.toContain("type-enum");
    expect(file.content).toContain(
      "extends: ['@commitlint/config-conventional']",
    );
  });
});

describe("eslint.detect()", () => {
  it("returns alreadyConfigured=false with no config", async () => {
    const ctx = stubContext({ root: dir });
    const result = await eslintModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(false);
  });

  it("returns alreadyConfigured=true when eslint.config.js exists", async () => {
    writeFile(dir, "eslint.config.js", "export default [];");
    const ctx = stubContext({ root: dir });
    const result = await eslintModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(true);
  });
});

describe("eslint.plan()", () => {
  it("installs eslint and @eslint/js", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await eslintModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install") as any;
    expect(install.packages).toContain("eslint");
    expect(install.packages).toContain("@eslint/js");
  });

  it("adds typescript-eslint for TS project", async () => {
    const ctx = stubTsContext({ root: dir });
    const actions = await eslintModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install") as any;
    expect(install.packages).toContain("typescript-eslint");
  });

  it("adds React plugins for react stack", async () => {
    const ctx = { ...stubContext({ root: dir }), stack: "react" as const };
    const actions = await eslintModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install") as any;
    expect(install.packages).toContain("eslint-plugin-react");
    expect(install.packages).toContain("eslint-plugin-react-hooks");
  });

  it("adds Vue plugin for vue stack", async () => {
    const ctx = { ...stubContext({ root: dir }), stack: "vue" as const };
    const actions = await eslintModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install") as any;
    expect(install.packages).toContain("eslint-plugin-vue");
  });

  it("generated config includes tseslint for TS project", async () => {
    const ctx = stubTsContext({ root: dir });
    const actions = await eslintModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).toContain("typescript-eslint");
  });
});

describe("biome.detect()", () => {
  it("returns alreadyConfigured=false without biome.json", async () => {
    const ctx = stubContext({ root: dir });
    const result = await biomeModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(false);
  });

  it("returns alreadyConfigured=true when biome.json exists", async () => {
    writeFile(dir, "biome.json", "{}");
    const ctx = stubContext({ root: dir });
    const result = await biomeModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(true);
  });
});

describe("biome.plan()", () => {
  it("installs @biomejs/biome as devDependency", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await biomeModule.plan(ctx, {});
    const install = actions.find((a) => a.type === "install") as any;
    expect(install.packages).toContain("@biomejs/biome");
    expect(install.dev).toBe(true);
  });

  it("creates biome.json with $schema field", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await biomeModule.plan(ctx, {});
    const file = actions.find(
      (a) => a.type === "create-file" && (a as any).path === "biome.json",
    ) as any;
    expect(file).toBeDefined();
    const parsed = JSON.parse(file.content);
    expect(parsed.$schema).toContain("biomejs.dev");
  });

  it("adds lint and format scripts", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await biomeModule.plan(ctx, {});
    const scriptNames = actions
      .filter((a) => a.type === "add-script")
      .map((a) => (a as any).name);
    expect(scriptNames).toContain("lint");
    expect(scriptNames).toContain("format");
  });
});

describe("github-actions.detect()", () => {
  it("returns alreadyConfigured=false with no workflow file", async () => {
    const ctx = stubContext({ root: dir });
    const result = await githubActionsModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(false);
  });

  it("returns alreadyConfigured=true when ci.yml exists", async () => {
    writeFile(dir, ".github/workflows/ci.yml", "name: CI");
    const ctx = stubContext({ root: dir });
    const result = await githubActionsModule.detect(ctx);
    expect(result.alreadyConfigured).toBe(true);
  });
});

describe("github-actions.plan()", () => {
  it("pnpm context uses pnpm install --frozen-lockfile", async () => {
    const ctx = { ...stubContext({ root: dir }), pm: "pnpm" as const };
    const actions = await githubActionsModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).toContain("pnpm install --frozen-lockfile");
    expect(file.content).toContain("pnpm/action-setup");
  });

  it("yarn context uses yarn install --frozen-lockfile", async () => {
    const ctx = { ...stubContext({ root: dir }), pm: "yarn" as const };
    const actions = await githubActionsModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).toContain("yarn install --frozen-lockfile");
  });

  it("npm context uses npm ci", async () => {
    const ctx = { ...stubContext({ root: dir }), pm: "npm" as const };
    const actions = await githubActionsModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).toContain("npm ci");
  });

  it("bun context uses bun install --frozen-lockfile", async () => {
    const ctx = { ...stubContext({ root: dir }), pm: "bun" as const };
    const actions = await githubActionsModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.content).toContain("bun install --frozen-lockfile");
    expect(file.content).toContain("setup-bun");
  });

  it("creates workflow file at .github/workflows/ci.yml", async () => {
    const ctx = stubContext({ root: dir });
    const actions = await githubActionsModule.plan(ctx, {});
    const file = actions.find((a) => a.type === "create-file") as any;
    expect(file.path).toBe(".github/workflows/ci.yml");
  });
});
