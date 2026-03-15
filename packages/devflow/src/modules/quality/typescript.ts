import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const typescriptModule: DevFlowModule = {
  id: "typescript",
  name: "TypeScript strict",
  description: "Add tsc --noEmit typecheck with strict tsconfig",
  category: "quality",
  recommendedFor: ["react", "nestjs", "nextjs", "node"],

  async detect(ctx) {
    return { applicable: ctx.hasTypeScript, alreadyConfigured: false };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];

    if (!ctx.hasTypeScript) {
      actions.push({ type: "install", dev: true, packages: ["typescript"] });
      actions.push({
        type: "create-file",
        path: "tsconfig.json",
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
                outDir: "dist",
              },
              include: ["src"],
              exclude: ["node_modules", "dist"],
            },
            null,
            2,
          ) + "\n",
        skipIfExists: true,
      });
    }

    actions.push({
      type: "add-script",
      name: "typecheck",
      command: "tsc --noEmit",
    });

    return actions;
  },
};

export default typescriptModule;
