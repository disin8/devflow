import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setDryRun, isDryRun } from "../core/logger.js";
import { buildPlan } from "../core/executor.js";
import { stubContext } from "../test/helpers.js";
import type { DevFlowModule } from "../core/types.js";

beforeEach(() => setDryRun(false));
afterEach(() => setDryRun(false));

function makeModule(id: string, actions: any[]): DevFlowModule {
  return {
    id,
    name: id,
    description: `Mock ${id}`,
    category: "git",
    async detect() {
      return { applicable: true, alreadyConfigured: false };
    },
    async plan() {
      return actions;
    },
  };
}

describe("buildPlan()", () => {
  it("aggregates filesToCreate from multiple modules", async () => {
    const ctx = stubContext();
    const modA = makeModule("a", [
      { type: "create-file", path: "a.txt", content: "" },
    ]);
    const modB = makeModule("b", [
      { type: "create-file", path: "b.txt", content: "" },
    ]);
    const plan = await buildPlan([modA, modB], ctx, {});
    expect(plan.filesToCreate).toContain("a.txt");
    expect(plan.filesToCreate).toContain("b.txt");
  });

  it("deduplicates filesToCreate across modules", async () => {
    const ctx = stubContext();
    const modA = makeModule("a", [
      { type: "create-file", path: "shared.txt", content: "" },
    ]);
    const modB = makeModule("b", [
      { type: "create-file", path: "shared.txt", content: "" },
    ]);
    const plan = await buildPlan([modA, modB], ctx, {});
    expect(plan.filesToCreate.filter((f) => f === "shared.txt").length).toBe(1);
  });

  it("aggregates packagesToInstall from multiple modules", async () => {
    const ctx = stubContext();
    const modA = makeModule("a", [
      { type: "install", dev: true, packages: ["pkg-a"] },
    ]);
    const modB = makeModule("b", [
      { type: "install", dev: false, packages: ["pkg-b"] },
    ]);
    const plan = await buildPlan([modA, modB], ctx, {});
    expect(plan.packagesToInstall.map((p) => p.name)).toContain("pkg-a");
    expect(plan.packagesToInstall.map((p) => p.name)).toContain("pkg-b");
  });

  it("deduplicates packagesToInstall by name", async () => {
    const ctx = stubContext();
    const modA = makeModule("a", [
      { type: "install", dev: true, packages: ["shared-pkg"] },
    ]);
    const modB = makeModule("b", [
      { type: "install", dev: false, packages: ["shared-pkg"] },
    ]);
    const plan = await buildPlan([modA, modB], ctx, {});
    expect(
      plan.packagesToInstall.filter((p) => p.name === "shared-pkg").length,
    ).toBe(1);
  });

  it("aggregates scriptsToAdd", async () => {
    const ctx = stubContext();
    const modA = makeModule("a", [
      { type: "add-script", name: "prepare", command: "husky" },
    ]);
    const modB = makeModule("b", [
      { type: "add-script", name: "test", command: "vitest run" },
    ]);
    const plan = await buildPlan([modA, modB], ctx, {});
    expect(plan.scriptsToAdd["prepare"]).toBe("husky");
    expect(plan.scriptsToAdd["test"]).toBe("vitest run");
  });

  it("tracks filesToUpdate from update-file and merge-package-json actions", async () => {
    const ctx = stubContext();
    const modA = makeModule("a", [
      { type: "update-file", path: "README.md", transform: () => "" },
    ]);
    const modB = makeModule("b", [{ type: "merge-package-json", merge: {} }]);
    const plan = await buildPlan([modA, modB], ctx, {});
    expect(plan.filesToUpdate).toContain("README.md");
    expect(plan.filesToUpdate).toContain("package.json");
  });

  it("records commandsToRun", async () => {
    const ctx = stubContext();
    const mod = makeModule("a", [
      { type: "run-command", command: "echo hello" },
    ]);
    const plan = await buildPlan([mod], ctx, {});
    expect(plan.commandsToRun).toContain("echo hello");
  });

  it("passes per-module options from optionsMap", async () => {
    const ctx = stubContext();
    let capturedOpts: any;
    const mod: DevFlowModule = {
      id: "opt-mod",
      name: "opt-mod",
      description: "",
      category: "git",
      async detect() {
        return { applicable: true, alreadyConfigured: false };
      },
      async plan(_ctx, opts) {
        capturedOpts = opts;
        return [];
      },
    };
    await buildPlan([mod], ctx, { "opt-mod": { mode: "strict" } });
    expect(capturedOpts).toEqual({ mode: "strict" });
  });

  it("stores per-module actions in plan.actions", async () => {
    const ctx = stubContext();
    const action = { type: "create-file" as const, path: "x.txt", content: "" };
    const mod = makeModule("x", [action]);
    const plan = await buildPlan([mod], ctx, {});
    expect(plan.actions.length).toBe(1);
    expect(plan.actions[0].moduleId).toBe("x");
    expect(plan.actions[0].actions).toContain(action);
  });

  it("returns empty plan for empty module list", async () => {
    const ctx = stubContext();
    const plan = await buildPlan([], ctx, {});
    expect(plan.filesToCreate).toEqual([]);
    expect(plan.packagesToInstall).toEqual([]);
    expect(plan.scriptsToAdd).toEqual({});
    expect(plan.commandsToRun).toEqual([]);
  });
});
