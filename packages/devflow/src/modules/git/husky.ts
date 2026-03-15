import type {
  DevFlowModule,
  ModuleAction,
  ProjectContext,
  ModuleOptions,
} from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const huskyModule: DevFlowModule = {
  id: "husky",
  name: "Husky",
  description: "Git hooks made easy (pre-commit, commit-msg, pre-push)",
  category: "git",
  recommendedFor: [
    "react",
    "vue",
    "node",
    "nestjs",
    "nextjs",
    "nuxt",
    "sveltekit",
  ],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".husky/_/husky.sh") ||
      fileExists(ctx.root, ".husky/pre-commit");
    return {
      applicable: true,
      alreadyConfigured: has,
      reason: has ? "Husky already configured" : undefined,
    };
  },

  async plan(ctx, opts) {
    const actions: ModuleAction[] = [];
    const hooks = (opts.hooks as string[] | undefined) ?? [
      "pre-commit",
      "commit-msg",
    ];

    actions.push({
      type: "install",
      dev: true,
      packages: ["husky"],
    });

    actions.push({
      type: "add-script",
      name: "prepare",
      command: "husky",
    });

    if (hooks.includes("pre-commit")) {
      const cmd =
        ctx.existingFiles.has("node_modules/.bin/lint-staged") ||
        (opts.withLintStaged as boolean)
          ? "npx lint-staged"
          : "npm run lint";

      actions.push({
        type: "create-file",
        path: ".husky/pre-commit",
        content: cmd + "\n",
        skipIfExists: true,
      });
    }

    if (hooks.includes("commit-msg")) {
      actions.push({
        type: "create-file",
        path: ".husky/commit-msg",
        content: 'npx --no -- commitlint --edit "$1"\n',
        skipIfExists: true,
      });
    }

    if (hooks.includes("pre-push")) {
      actions.push({
        type: "create-file",
        path: ".husky/pre-push",
        content: "npm run typecheck && npm run test\n",
        skipIfExists: true,
      });
    }

    return actions;
  },
};

export default huskyModule;
