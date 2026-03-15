import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const markdownlintModule: DevFlowModule = {
  id: "markdownlint",
  name: "markdownlint",
  description: "Lint Markdown files for consistent style",
  category: "quality",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".markdownlint.json") ||
      fileExists(ctx.root, ".markdownlint.yaml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];
    actions.push({
      type: "install",
      dev: true,
      packages: ["markdownlint-cli2"],
    });
    actions.push({
      type: "create-file",
      path: ".markdownlint.json",
      content:
        JSON.stringify(
          {
            default: true,
            MD013: false,
            MD033: false,
            MD041: false,
          },
          null,
          2,
        ) + "\n",
      skipIfExists: true,
    });
    actions.push({
      type: "add-script",
      name: "lint:md",
      command: 'markdownlint-cli2 "**/*.md" "#node_modules"',
    });
    return actions;
  },
};

export default markdownlintModule;
