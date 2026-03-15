import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const commitlintModule: DevFlowModule = {
  id: "commitlint",
  name: "Commitlint",
  description: "Lint commit messages against Conventional Commits",
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
      fileExists(ctx.root, "commitlint.config.js") ||
      fileExists(ctx.root, "commitlint.config.ts") ||
      fileExists(ctx.root, "commitlint.config.mjs") ||
      fileExists(ctx.root, ".commitlintrc.json");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx, opts) {
    const actions: ModuleAction[] = [];
    const strict = (opts.mode as string) !== "loose";

    actions.push({
      type: "install",
      dev: true,
      packages: ["@commitlint/cli", "@commitlint/config-conventional"],
    });

    const config = strict
      ? `export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'perf', 'test', 'build', 'ci', 'chore', 'revert',
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'header-max-length': [2, 'always', 100],
  },
};
`
      : `export default {
  extends: ['@commitlint/config-conventional'],
};
`;

    actions.push({
      type: "create-file",
      path: "commitlint.config.mjs",
      content: config,
      skipIfExists: true,
    });

    return actions;
  },
};

export default commitlintModule;
