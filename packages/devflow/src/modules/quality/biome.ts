import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const biomeModule: DevFlowModule = {
  id: "biome",
  name: "Biome",
  description: "Ultra-fast linter & formatter (replaces ESLint + Prettier)",
  category: "quality",
  conflicts: ["eslint", "prettier"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "biome.json") || fileExists(ctx.root, "biome.jsonc");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["@biomejs/biome"],
    });

    const config = {
      $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
      organizeImports: { enabled: true },
      linter: {
        enabled: true,
        rules: { recommended: true },
      },
      formatter: {
        enabled: true,
        indentStyle: "space",
        indentWidth: 2,
        lineWidth: 100,
      },
      files: {
        ignore: [
          "dist/",
          "build/",
          "node_modules/",
          "coverage/",
          ".next/",
          ".nuxt/",
        ],
      },
    };

    actions.push({
      type: "create-file",
      path: "biome.json",
      content: JSON.stringify(config, null, 2) + "\n",
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "lint",
      command: "biome check .",
    });
    actions.push({
      type: "add-script",
      name: "lint:fix",
      command: "biome check --apply .",
    });
    actions.push({
      type: "add-script",
      name: "format",
      command: "biome format --write .",
    });

    return actions;
  },
};

export default biomeModule;
