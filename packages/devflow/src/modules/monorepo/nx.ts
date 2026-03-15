import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const nxModule: DevFlowModule = {
  id: "nx",
  name: "Nx",
  description:
    "Smart monorepo build system with caching and task orchestration",
  category: "monorepo",
  conflicts: ["turborepo"],

  async detect(ctx) {
    return {
      applicable: ctx.repoType === "monorepo",
      alreadyConfigured: fileExists(ctx.root, "nx.json"),
    };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({ type: "install", dev: true, packages: ["nx"] });

    actions.push({
      type: "create-file",
      path: "nx.json",
      content:
        JSON.stringify(
          {
            $schema: "./node_modules/nx/schemas/nx-schema.json",
            namedInputs: {
              default: ["{projectRoot}/**/*", "sharedGlobals"],
              sharedGlobals: [],
              production: [
                "default",
                "!{projectRoot}/**/*.spec.ts",
                "!{projectRoot}/test/**/*",
              ],
            },
            targetDefaults: {
              build: {
                dependsOn: ["^build"],
                inputs: ["production", "^production"],
                cache: true,
              },
              lint: { cache: true },
              test: { cache: true },
              typecheck: { cache: true },
            },
          },
          null,
          2,
        ) + "\n",
      skipIfExists: true,
    });

    return actions;
  },
};

export default nxModule;
