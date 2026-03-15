import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const dependabotModule: DevFlowModule = {
  id: "dependabot",
  name: "Dependabot",
  description: "GitHub-native automated dependency update PRs",
  category: "ci",
  conflicts: ["renovate"],

  async detect(ctx) {
    const has = fileExists(ctx.root, ".github/dependabot.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const ecosystem = "npm";
    return [
      {
        type: "create-file" as const,
        path: ".github/dependabot.yml",
        content: `version: 2
updates:
  - package-ecosystem: "${ecosystem}"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
    commit-message:
      prefix: "chore(deps):"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "ci"
    commit-message:
      prefix: "chore(ci):"
`,
        skipIfExists: true,
      },
    ];
  },
};

export default dependabotModule;
