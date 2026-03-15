import { describe, it, expect } from "vitest";
import { getPreset } from "../modules/presets.js";

describe("getPreset – minimal level", () => {
  it("react/minimal includes husky, lint-staged, commitlint, editorconfig", () => {
    const ids = getPreset("react", "minimal", "single");
    expect(ids).toContain("husky");
    expect(ids).toContain("lint-staged");
    expect(ids).toContain("commitlint");
    expect(ids).toContain("editorconfig");
  });

  it("react/minimal does NOT include vitest or github-actions", () => {
    const ids = getPreset("react", "minimal", "single");
    expect(ids).not.toContain("vitest");
    expect(ids).not.toContain("github-actions");
  });

  it("node/minimal does NOT include testing-library", () => {
    const ids = getPreset("node", "minimal", "single");
    expect(ids).not.toContain("testing-library");
  });
});

describe("getPreset – recommended level", () => {
  it("react/recommended includes vitest, github-actions, eslint, prettier, typescript", () => {
    const ids = getPreset("react", "recommended", "single");
    expect(ids).toContain("vitest");
    expect(ids).toContain("github-actions");
    expect(ids).toContain("eslint");
    expect(ids).toContain("prettier");
    expect(ids).toContain("typescript");
  });

  it("react/recommended includes testing-library", () => {
    const ids = getPreset("react", "recommended", "single");
    expect(ids).toContain("testing-library");
  });

  it("vue/recommended includes testing-library", () => {
    const ids = getPreset("vue", "recommended", "single");
    expect(ids).toContain("testing-library");
  });

  it("node/recommended does NOT include testing-library", () => {
    const ids = getPreset("node", "recommended", "single");
    expect(ids).not.toContain("testing-library");
  });

  it("nextjs/recommended mirrors react (includes testing-library)", () => {
    const nextIds = getPreset("nextjs", "recommended", "single");
    const reactIds = getPreset("react", "recommended", "single");
    expect(nextIds).toEqual(reactIds);
  });

  it("nuxt/recommended mirrors vue (includes testing-library)", () => {
    const nuxtIds = getPreset("nuxt", "recommended", "single");
    const vueIds = getPreset("vue", "recommended", "single");
    expect(nuxtIds).toEqual(vueIds);
  });
});

describe("getPreset – full level", () => {
  it("node/full includes release-it, dockerfile, dockerignore, renovate", () => {
    const ids = getPreset("node", "full", "single");
    expect(ids).toContain("release-it");
    expect(ids).toContain("dockerfile");
    expect(ids).toContain("dockerignore");
    expect(ids).toContain("renovate");
  });

  it("node/full includes docs modules: readme, contributing, code-of-conduct", () => {
    const ids = getPreset("node", "full", "single");
    expect(ids).toContain("readme");
    expect(ids).toContain("contributing");
    expect(ids).toContain("code-of-conduct");
  });

  it("node/full includes security modules: audit, gitleaks, security-md", () => {
    const ids = getPreset("node", "full", "single");
    expect(ids).toContain("audit");
    expect(ids).toContain("gitleaks");
    expect(ids).toContain("security-md");
  });

  it("react/full includes playwright and testing-library", () => {
    const ids = getPreset("react", "full", "single");
    expect(ids).toContain("playwright");
    expect(ids).toContain("testing-library");
  });
});

describe("getPreset – monorepo", () => {
  it("monorepo includes changesets and workspaces", () => {
    const ids = getPreset("node", "recommended", "monorepo");
    expect(ids).toContain("changesets");
    expect(ids).toContain("workspaces");
  });

  it("monorepo/full removes release-it in favour of changesets", () => {
    const ids = getPreset("node", "full", "monorepo");
    expect(ids).toContain("changesets");
    expect(ids).not.toContain("release-it");
  });

  it("single repo/full keeps release-it", () => {
    const ids = getPreset("node", "full", "single");
    expect(ids).toContain("release-it");
  });
});

describe("getPreset – deduplication", () => {
  it("produces no duplicate ids for any combination", () => {
    const stacks = [
      "react",
      "vue",
      "node",
      "nestjs",
      "nextjs",
      "nuxt",
      "sveltekit",
    ] as const;
    const levels = ["minimal", "recommended", "full"] as const;
    const repoTypes = ["single", "monorepo"] as const;
    for (const stack of stacks) {
      for (const level of levels) {
        for (const repo of repoTypes) {
          const ids = getPreset(stack, level, repo);
          const unique = new Set(ids);
          expect(unique.size, `${stack}/${level}/${repo} has duplicates`).toBe(
            ids.length,
          );
        }
      }
    }
  });

  it("works with undefined stack (falls back to node)", () => {
    const nodeIds = getPreset("node", "recommended", "single");
    const undefinedIds = getPreset(undefined, "recommended", "single");
    expect(undefinedIds).toEqual(nodeIds);
  });
});
