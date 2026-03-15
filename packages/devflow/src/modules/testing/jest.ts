import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const jestModule: DevFlowModule = {
  id: "jest",
  name: "Jest",
  description: "Full-featured test runner (legacy / enterprise)",
  category: "testing",
  conflicts: ["vitest"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "jest.config.js") ||
      fileExists(ctx.root, "jest.config.ts") ||
      fileExists(ctx.root, "jest.config.mjs");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const isTs = ctx.hasTypeScript;

    const pkgs = ["jest", "@types/jest"];
    if (isTs) pkgs.push("ts-jest");

    actions.push({ type: "install", dev: true, packages: pkgs });

    const config = isTs
      ? `/** @type {import('ts-jest').JestConfigWithTsJest} */
        export default {
          preset: 'ts-jest',
          testEnvironment: 'node',
          roots: ['<rootDir>/src'],
          coverageDirectory: 'coverage',
          collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
        };
      `
      : `/** @type {import('jest').Config} */
        export default {
          testEnvironment: 'node',
          roots: ['<rootDir>/src'],
          coverageDirectory: 'coverage',
        };
      `;

    actions.push({
      type: "create-file",
      path: isTs ? "jest.config.ts" : "jest.config.mjs",
      content: config,
      skipIfExists: true,
    });

    actions.push({ type: "add-script", name: "test", command: "jest" });
    actions.push({
      type: "add-script",
      name: "test:watch",
      command: "jest --watch",
    });
    actions.push({
      type: "add-script",
      name: "test:coverage",
      command: "jest --coverage",
    });

    return actions;
  },
};

export default jestModule;
