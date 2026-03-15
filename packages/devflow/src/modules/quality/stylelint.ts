import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const stylelintModule: DevFlowModule = {
  id: "stylelint",
  name: "Stylelint",
  description: "Lint CSS/SCSS with auto-fix support",
  category: "quality",
  recommendedFor: ["react", "vue", "nextjs", "nuxt"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".stylelintrc") ||
      fileExists(ctx.root, ".stylelintrc.json") ||
      fileExists(ctx.root, "stylelint.config.js") ||
      fileExists(ctx.root, "stylelint.config.mjs");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];
    actions.push({
      type: "install",
      dev: true,
      packages: ["stylelint", "stylelint-config-standard"],
    });
    actions.push({
      type: "create-file",
      path: ".stylelintrc.json",
      content:
        JSON.stringify({ extends: ["stylelint-config-standard"] }, null, 2) +
        "\n",
      skipIfExists: true,
    });
    actions.push({
      type: "add-script",
      name: "lint:css",
      command: 'stylelint "**/*.{css,scss}"',
    });
    return actions;
  },
};

export default stylelintModule;
