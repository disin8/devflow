import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const codecovModule: DevFlowModule = {
  id: "codecov",
  name: "Codecov",
  description: "Upload test coverage reports to Codecov",
  category: "ci",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "codecov.yml") ||
      fileExists(ctx.root, ".codecov.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "create-file",
      path: "codecov.yml",
      content: `coverage:
  status:
    project:
      default:
        target: auto
        threshold: 1%
    patch:
      default:
        target: auto
        threshold: 1%

comment:
  layout: "reach,diff,flags,files"
  behavior: default
  require_changes: false
`,
      skipIfExists: true,
    });

    return actions;
  },
};

export default codecovModule;
