import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const cspellModule: DevFlowModule = {
  id: "cspell",
  name: "cspell",
  description: "Spell check code, comments, and documentation",
  category: "quality",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "cspell.json") ||
      fileExists(ctx.root, ".cspell.json");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];
    actions.push({ type: "install", dev: true, packages: ["cspell"] });
    actions.push({
      type: "create-file",
      path: "cspell.json",
      content:
        JSON.stringify(
          {
            version: "0.2",
            language: "en",
            words: [],
            ignorePaths: [
              "node_modules",
              "dist",
              "build",
              "coverage",
              "pnpm-lock.yaml",
              "package-lock.json",
              "yarn.lock",
            ],
          },
          null,
          2,
        ) + "\n",
      skipIfExists: true,
    });
    actions.push({ type: "add-script", name: "spell", command: 'cspell "**"' });
    return actions;
  },
};

export default cspellModule;
