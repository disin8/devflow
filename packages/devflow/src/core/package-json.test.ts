import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import {
  deepMerge,
  mergePackageJson,
  addScript,
} from "../core/package-json.js";
import {
  makeTempDir,
  removeDir,
  writeFile,
  writePackageJson,
} from "../test/helpers.js";
import { setDryRun } from "../core/logger.js";

describe("deepMerge", () => {
  it("merges top-level scalar fields", () => {
    const result = deepMerge({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("does NOT overwrite existing scalars by default", () => {
    const result = deepMerge({ a: "original" }, { a: "new" });
    expect(result.a).toBe("original");
  });

  it("overwrites existing scalars when overwrite=true", () => {
    const result = deepMerge({ a: "original" }, { a: "new" }, true);
    expect(result.a).toBe("new");
  });

  it("deep-merges nested objects", () => {
    const result = deepMerge(
      { scripts: { build: "tsc" } },
      { scripts: { test: "vitest" } },
    );
    expect(result.scripts).toEqual({ build: "tsc", test: "vitest" });
  });

  it("union-merges arrays (no duplicates)", () => {
    const result = deepMerge(
      { files: ["dist", "bin"] },
      { files: ["bin", "README.md"] },
    );
    expect(result.files).toEqual(["dist", "bin", "README.md"]);
  });

  it("creates nested object from scratch when target key missing", () => {
    const result = deepMerge(
      {},
      { config: { commitizen: { path: "cz-git" } } },
    );
    expect(result).toEqual({ config: { commitizen: { path: "cz-git" } } });
  });

  it("handles source arrays into missing target key", () => {
    const result = deepMerge({}, { keywords: ["cli", "devflow"] });
    expect(result.keywords).toEqual(["cli", "devflow"]);
  });
});

describe("mergePackageJson", () => {
  let dir: string;

  beforeEach(() => {
    dir = makeTempDir();
    setDryRun(false);
  });
  afterEach(() => removeDir(dir));

  it("creates package.json when missing and merges", () => {
    const { after } = mergePackageJson(dir, { name: "hello" });
    expect(after.name).toBe("hello");
  });

  it("merges without losing existing fields", () => {
    writePackageJson(dir, { name: "my-app", version: "2.0.0" });
    const { after } = mergePackageJson(dir, { license: "MIT" });
    expect(after.name).toBe("my-app");
    expect(after.version).toBe("2.0.0");
    expect(after.license).toBe("MIT");
  });

  it("writes result to disk", () => {
    writePackageJson(dir, {});
    mergePackageJson(dir, { description: "test" });
    const written = JSON.parse(
      readFileSync(join(dir, "package.json"), "utf-8"),
    );
    expect(written.description).toBe("test");
  });

  it("in dry-run mode does NOT write to disk", () => {
    setDryRun(true);
    writePackageJson(dir, { name: "original" });
    mergePackageJson(dir, { name: "overwrite-attempt" });
    const written = JSON.parse(
      readFileSync(join(dir, "package.json"), "utf-8"),
    );
    expect(written.name).toBe("original");
    setDryRun(false);
  });
});

describe("addScript", () => {
  let dir: string;

  beforeEach(() => {
    dir = makeTempDir();
    setDryRun(false);
  });
  afterEach(() => removeDir(dir));

  it("adds a new script", () => {
    writePackageJson(dir, { scripts: {} });
    addScript(dir, "build", "tsc");
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.scripts.build).toBe("tsc");
  });

  it("does not overwrite an existing script", () => {
    writePackageJson(dir, { scripts: { build: "tsc" } });
    addScript(dir, "build", "tsup");
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.scripts.build).toBe("tsc");
  });

  it("appends to existing script when append=true", () => {
    writePackageJson(dir, { scripts: { prepare: "husky" } });
    addScript(dir, "prepare", "lefthook install", true);
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.scripts.prepare).toBe("husky && lefthook install");
  });

  it("does not duplicate when appending same command", () => {
    writePackageJson(dir, { scripts: { prepare: "husky" } });
    addScript(dir, "prepare", "husky", true);
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.scripts.prepare).toBe("husky");
  });

  it("creates scripts key when missing", () => {
    writePackageJson(dir, {});
    addScript(dir, "lint", "eslint .");
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.scripts.lint).toBe("eslint .");
  });
});
