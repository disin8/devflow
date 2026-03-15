import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const turborepoModule: DevFlowModule = {
  id: "turborepo",
  name: "Turborepo",
  description: "High-performance monorepo build system by Vercel",
  category: "monorepo",
  conflicts: ["nx"],

  async detect(ctx) {
    return {
      applicable: ctx.repoType === "monorepo",
      alreadyConfigured: fileExists(ctx.root, "turbo.json"),
    };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({ type: "install", dev: true, packages: ["turbo"] });

    actions.push({
      type: "create-file",
      path: "turbo.json",
      content:
        JSON.stringify(
          {
            $schema: "https://turbo.build/schema.json",
            tasks: {
              build: {
                dependsOn: ["^build"],
                outputs: ["dist/**", ".next/**", "!.next/cache/**"],
              },
              lint: { dependsOn: ["^lint"] },
              test: { dependsOn: ["^build"] },
              typecheck: { dependsOn: ["^build"] },
              dev: { cache: false, persistent: true },
            },
          },
          null,
          2,
        ) + "\n",
      skipIfExists: true,
    });

    actions.push({ type: "add-script", name: "build", command: "turbo build" });
    actions.push({ type: "add-script", name: "lint", command: "turbo lint" });
    actions.push({ type: "add-script", name: "test", command: "turbo test" });
    actions.push({ type: "add-script", name: "dev", command: "turbo dev" });

    return actions;
  },
};

export default turborepoModule;
