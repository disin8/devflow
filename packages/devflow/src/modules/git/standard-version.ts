import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const standardVersionModule: DevFlowModule = {
  id: "standard-version",
  name: "standard-version",
  description: "Automate versioning and CHANGELOG generation",
  category: "git",
  conflicts: ["git-cliff"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".versionrc") ||
      fileExists(ctx.root, ".versionrc.json");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["standard-version"],
    });

    actions.push({
      type: "create-file",
      path: ".versionrc.json",
      content:
        JSON.stringify(
          {
            types: [
              { type: "feat", section: "Features" },
              { type: "fix", section: "Bug Fixes" },
              { type: "chore", hidden: true },
              { type: "docs", section: "Documentation" },
              { type: "style", hidden: true },
              { type: "refactor", section: "Refactoring" },
              { type: "perf", section: "Performance" },
              { type: "test", hidden: true },
            ],
          },
          null,
          2,
        ) + "\n",
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "release",
      command: "standard-version",
    });

    return actions;
  },
};

export default standardVersionModule;
