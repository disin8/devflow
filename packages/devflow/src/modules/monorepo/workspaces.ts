import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const workspacesModule: DevFlowModule = {
  id: "workspaces",
  name: "Workspace Config",
  description: "Configure pnpm/yarn workspaces and shared configs",
  category: "monorepo",

  async detect(ctx) {
    return {
      applicable: ctx.repoType === "monorepo",
      alreadyConfigured:
        fileExists(ctx.root, "pnpm-workspace.yaml") ||
        ctx.packageJson?.workspaces !== undefined,
    };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const patterns =
      ctx.workspacePatterns.length > 0
        ? ctx.workspacePatterns
        : ["packages/*", "apps/*"];

    if (ctx.pm === "pnpm" && !fileExists(ctx.root, "pnpm-workspace.yaml")) {
      actions.push({
        type: "create-file",
        path: "pnpm-workspace.yaml",
        content: `packages:\n${patterns.map((p) => `  - '${p}'`).join("\n")}\n`,
        skipIfExists: true,
      });
    } else if (ctx.pm !== "pnpm") {
      actions.push({
        type: "merge-package-json",
        merge: { workspaces: patterns },
      });
    }

    if (ctx.hasTypeScript) {
      actions.push({
        type: "create-file",
        path: "tsconfig.base.json",
        content:
          JSON.stringify(
            {
              compilerOptions: {
                target: "ES2022",
                module: "ESNext",
                moduleResolution: "bundler",
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                resolveJsonModule: true,
                isolatedModules: true,
                declaration: true,
                declarationMap: true,
                composite: true,
              },
            },
            null,
            2,
          ) + "\n",
        skipIfExists: true,
      });
    }

    actions.push({
      type: "add-script",
      name: "lint:all",
      command:
        ctx.pm === "pnpm"
          ? "pnpm -r run lint"
          : ctx.pm === "yarn"
            ? "yarn workspaces foreach -A run lint"
            : "npm run lint --workspaces",
    });

    actions.push({
      type: "add-script",
      name: "test:all",
      command:
        ctx.pm === "pnpm"
          ? "pnpm -r run test"
          : ctx.pm === "yarn"
            ? "yarn workspaces foreach -A run test"
            : "npm run test --workspaces",
    });

    return actions;
  },
};

export default workspacesModule;
