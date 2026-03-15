import type { DevFlowModule, ModuleAction } from "../../core/types.js";

const commitizenModule: DevFlowModule = {
  id: "commitizen",
  name: "Commitizen",
  description: "Interactive CLI helper for writing conventional commits",
  category: "git",

  async detect(ctx) {
    const has = !!(ctx.packageJson?.config as Record<string, unknown>)
      ?.commitizen;
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(_ctx, opts) {
    const actions: ModuleAction[] = [];
    const adapter = (opts.adapter as string) ?? "cz-git";

    actions.push({
      type: "install",
      dev: true,
      packages: ["commitizen", adapter],
    });

    actions.push({
      type: "merge-package-json",
      merge: {
        config: {
          commitizen: {
            path: `node_modules/${adapter}`,
          },
        },
      },
    });

    actions.push({
      type: "add-script",
      name: "commit",
      command: "cz",
    });

    return actions;
  },
};

export default commitizenModule;
