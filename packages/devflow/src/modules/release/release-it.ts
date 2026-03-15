import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const releaseItModule: DevFlowModule = {
  id: "release-it",
  name: "Release-it",
  description: "Interactive CLI for versioning and publishing releases",
  category: "release",
  recommendedFor: ["node", "nestjs"],
  conflicts: ["semantic-release"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".release-it.json") ||
      fileExists(ctx.root, ".release-it.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["release-it", "@release-it/conventional-changelog"],
    });

    actions.push({
      type: "create-file",
      path: ".release-it.json",
      content:
        JSON.stringify(
          {
            git: {
              commitMessage: "chore: release v${version}",
              tagName: "v${version}",
            },
            npm: { publish: false },
            github: { release: true },
            plugins: {
              "@release-it/conventional-changelog": {
                preset: "angular",
                infile: "CHANGELOG.md",
              },
            },
          },
          null,
          2,
        ) + "\n",
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "release",
      command: "release-it",
    });

    return actions;
  },
};

export default releaseItModule;
