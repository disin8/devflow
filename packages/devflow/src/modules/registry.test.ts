import { describe, it, expect } from "vitest";
import {
  ALL_MODULES,
  MODULE_MAP,
  getModulesByCategory,
  resolveModules,
  detectConflicts,
} from "../modules/registry.js";

describe("ALL_MODULES catalogue", () => {
  it("exports at least 38 modules", () => {
    expect(ALL_MODULES.length).toBeGreaterThanOrEqual(38);
  });

  it("every module has required fields: id, name, description, category", () => {
    for (const m of ALL_MODULES) {
      expect(m.id, `${m.id} missing id`).toBeTruthy();
      expect(m.name, `${m.id} missing name`).toBeTruthy();
      expect(m.description, `${m.id} missing description`).toBeTruthy();
      expect(m.category, `${m.id} missing category`).toBeTruthy();
    }
  });

  it("every module has detect() and plan() functions", () => {
    for (const m of ALL_MODULES) {
      expect(typeof m.detect, `${m.id}.detect not a function`).toBe("function");
      expect(typeof m.plan, `${m.id}.plan not a function`).toBe("function");
    }
  });

  it("no duplicate ids", () => {
    const ids = ALL_MODULES.map((m) => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("MODULE_MAP", () => {
  it("can look up core modules by id", () => {
    expect(MODULE_MAP.has("husky")).toBe(true);
    expect(MODULE_MAP.has("eslint")).toBe(true);
    expect(MODULE_MAP.has("vitest")).toBe(true);
    expect(MODULE_MAP.has("github-actions")).toBe(true);
    expect(MODULE_MAP.has("changesets")).toBe(true);
  });
});

describe("getModulesByCategory", () => {
  it("returns git modules", () => {
    const mods = getModulesByCategory("git");
    expect(mods.length).toBeGreaterThan(0);
    expect(mods.every((m) => m.category === "git")).toBe(true);
    expect(mods.some((m) => m.id === "husky")).toBe(true);
  });

  it("returns quality modules including eslint, prettier, biome", () => {
    const ids = getModulesByCategory("quality").map((m) => m.id);
    expect(ids).toContain("eslint");
    expect(ids).toContain("prettier");
    expect(ids).toContain("biome");
  });

  it("returns testing modules", () => {
    const ids = getModulesByCategory("testing").map((m) => m.id);
    expect(ids).toContain("vitest");
    expect(ids).toContain("jest");
    expect(ids).toContain("playwright");
  });

  it("returns empty array for unknown category (type cast)", () => {
    // @ts-expect-error: testing unknown category
    expect(getModulesByCategory("unknown")).toEqual([]);
  });
});

describe("resolveModules", () => {
  it("returns modules in insertion order", () => {
    const mods = resolveModules(["eslint", "prettier"]);
    expect(mods.map((m) => m.id)).toEqual(["eslint", "prettier"]);
  });

  it("deduplicates repeated ids", () => {
    const mods = resolveModules(["eslint", "eslint", "prettier"]);
    expect(mods.map((m) => m.id)).toEqual(["eslint", "prettier"]);
  });

  it("resolves dependencies before the requesting module", () => {
    // lint-staged dependsOn husky; if you resolve lint-staged, husky should come first
    const mods = resolveModules(["lint-staged"]);
    const ids = mods.map((m) => m.id);
    expect(ids).toContain("husky");
    expect(ids.indexOf("husky")).toBeLessThan(ids.indexOf("lint-staged"));
  });

  it("ignores unknown ids gracefully", () => {
    const mods = resolveModules(["eslint", "nonexistent-module", "prettier"]);
    expect(mods.map((m) => m.id)).toEqual(["eslint", "prettier"]);
  });
});

describe("detectConflicts", () => {
  it("detects eslint ↔ biome conflict", () => {
    const conflicts = detectConflicts(["eslint", "biome"]);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].a).toBe("eslint");
    expect(conflicts[0].b).toBe("biome");
  });

  it("detects prettier ↔ biome conflict", () => {
    const conflicts = detectConflicts(["prettier", "biome"]);
    expect(conflicts.length).toBe(1);
  });

  it("detects husky ↔ lefthook conflict", () => {
    const conflicts = detectConflicts(["husky", "lefthook"]);
    expect(conflicts.length).toBe(1);
  });

  it("detects vitest ↔ jest conflict", () => {
    const conflicts = detectConflicts(["vitest", "jest"]);
    expect(conflicts.length).toBe(1);
  });

  it("detects playwright ↔ cypress conflict", () => {
    const conflicts = detectConflicts(["playwright", "cypress"]);
    expect(conflicts.length).toBe(1);
  });

  it("detects renovate ↔ dependabot conflict", () => {
    const conflicts = detectConflicts(["renovate", "dependabot"]);
    expect(conflicts.length).toBe(1);
  });

  it("reports no conflicts for compatible modules", () => {
    const conflicts = detectConflicts([
      "husky",
      "eslint",
      "vitest",
      "github-actions",
      "changesets",
    ]);
    expect(conflicts).toEqual([]);
  });

  it("does not report a conflict twice for the same pair", () => {
    const conflicts = detectConflicts(["biome", "eslint", "prettier"]);
    const pairs = conflicts.map((c) => [c.a, c.b].sort().join("|"));
    const unique = new Set(pairs);
    expect(unique.size).toBe(conflicts.length);
  });
});
