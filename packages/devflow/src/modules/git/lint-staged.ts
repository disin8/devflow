import type {
  DevFlowModule,
  ModuleAction,
  ProjectContext,
} from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const lintStagedModule: DevFlowModule = {
  id: "lint-staged",
  name: "lint-staged",
  description: "Run linters only on git-staged files",
  category: "git",
  recommendedFor: [
    "react",
    "vue",
    "node",
    "nestjs",
    "nextjs",
    "nuxt",
    "sveltekit",
  ],
  dependsOn: ["husky"],

  async detect(ctx) {
    const pkg = ctx.packageJson;
    const hasConfig =
      !!pkg?.["lint-staged"] ||
      fileExists(ctx.root, ".lintstagedrc") ||
      fileExists(ctx.root, ".lintstagedrc.json") ||
      fileExists(ctx.root, "lint-staged.config.js") ||
      fileExists(ctx.root, "lint-staged.config.mjs");
    return { applicable: true, alreadyConfigured: hasConfig };
  },

  async plan(ctx, opts) {
    const actions: ModuleAction[] = [];
    const useBiome = (opts.formatter as string) === "biome";
    const isMonorepo = ctx.repoType === "monorepo";

    actions.push({
      type: "install",
      dev: true,
      packages: ["lint-staged"],
    });

    const config: Record<string, string | string[]> = {};

    if (useBiome) {
      config["*.{js,jsx,ts,tsx,json,css}"] = ["biome check --apply"];
    } else {
      config["*.{js,jsx,ts,tsx}"] = ["eslint --fix", "prettier --write"];
      config["*.{json,md,yml,yaml,css,scss}"] = ["prettier --write"];
    }

    if (isMonorepo) {
      actions.push({
        type: "create-file",
        path: "lint-staged.config.mjs",
        content: `export default ${JSON.stringify(config, null, 2)};\n`,
        skipIfExists: true,
      });
    } else {
      actions.push({
        type: "merge-package-json",
        merge: { "lint-staged": config },
      });
    }

    return actions;
  },
};

export default lintStagedModule;
