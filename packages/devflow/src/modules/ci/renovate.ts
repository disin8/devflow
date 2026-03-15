import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const renovateModule: DevFlowModule = {
  id: "renovate",
  name: "Renovate",
  description: "Automated dependency update PRs (multi-platform)",
  category: "ci",
  conflicts: ["dependabot"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "renovate.json") ||
      fileExists(ctx.root, "renovate.json5") ||
      fileExists(ctx.root, ".renovaterc.json");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: "renovate.json",
        content:
          JSON.stringify(
            {
              $schema: "https://docs.renovatebot.com/renovate-schema.json",
              extends: ["config:recommended"],
              labels: ["dependencies"],
              rangeStrategy: "bump",
              packageRules: [
                {
                  matchUpdateTypes: ["minor", "patch"],
                  automerge: true,
                },
              ],
            },
            null,
            2,
          ) + "\n",
        skipIfExists: true,
      },
    ];
  },
};

export default renovateModule;
