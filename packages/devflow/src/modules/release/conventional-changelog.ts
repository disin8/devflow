import type { DevFlowModule, ModuleAction } from "../../core/types.js";

const conventionalChangelogModule: DevFlowModule = {
  id: "conventional-changelog",
  name: "Conventional Changelog",
  description: "Generate changelogs from Conventional Commits",
  category: "release",

  async detect(ctx) {
    const deps = ctx.packageJson?.devDependencies as
      | Record<string, string>
      | undefined;
    return {
      applicable: true,
      alreadyConfigured: !!deps?.["conventional-changelog-cli"],
    };
  },

  async plan() {
    const actions: ModuleAction[] = [];
    actions.push({
      type: "install",
      dev: true,
      packages: ["conventional-changelog-cli"],
    });
    actions.push({
      type: "add-script",
      name: "changelog",
      command: "conventional-changelog -p angular -i CHANGELOG.md -s",
    });
    return actions;
  },
};

export default conventionalChangelogModule;
