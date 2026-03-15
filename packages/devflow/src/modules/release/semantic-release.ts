import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const semanticReleaseModule: DevFlowModule = {
  id: "semantic-release",
  name: "semantic-release",
  description: "Fully automated versioning and package publishing from CI",
  category: "release",
  conflicts: ["release-it"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".releaserc") ||
      fileExists(ctx.root, ".releaserc.json") ||
      fileExists(ctx.root, "release.config.js") ||
      fileExists(ctx.root, "release.config.mjs");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: [
        "semantic-release",
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        "@semantic-release/npm",
        "@semantic-release/github",
        "@semantic-release/git",
      ],
    });

    actions.push({
      type: "create-file",
      path: ".releaserc.json",
      content:
        JSON.stringify(
          {
            branches: ["main", "master"],
            plugins: [
              "@semantic-release/commit-analyzer",
              "@semantic-release/release-notes-generator",
              [
                "@semantic-release/changelog",
                { changelogFile: "CHANGELOG.md" },
              ],
              "@semantic-release/npm",
              "@semantic-release/github",
              [
                "@semantic-release/git",
                {
                  assets: ["CHANGELOG.md", "package.json"],
                  message: "chore(release): ${nextRelease.version} [skip ci]",
                },
              ],
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
      command: "semantic-release",
    });

    return actions;
  },
};

export default semanticReleaseModule;
