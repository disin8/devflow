import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const nvmrcModule: DevFlowModule = {
  id: "nvmrc",
  name: ".nvmrc / Volta",
  description: "Pin Node.js version for the team (.nvmrc or Volta)",
  category: "dx",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".nvmrc") ||
      fileExists(ctx.root, ".node-version") ||
      !!ctx.packageJson?.volta;
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(_ctx, opts) {
    const useVolta = (opts.tool as string) === "volta";
    const nodeVersion = (opts.nodeVersion as string) ?? "20";
    const actions: ModuleAction[] = [];

    if (useVolta) {
      actions.push({
        type: "merge-package-json",
        merge: { volta: { node: `${nodeVersion}.0.0` } },
      });
    } else {
      actions.push({
        type: "create-file",
        path: ".nvmrc",
        content: `${nodeVersion}\n`,
        skipIfExists: true,
      });
    }

    return actions;
  },
};

export default nvmrcModule;
