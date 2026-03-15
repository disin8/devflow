import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const prettierModule: DevFlowModule = {
  id: "prettier",
  name: "Prettier",
  description: "Opinionated code formatter for JS/TS/CSS/JSON/Markdown",
  category: "quality",
  recommendedFor: [
    "react",
    "vue",
    "node",
    "nestjs",
    "nextjs",
    "nuxt",
    "sveltekit",
  ],
  conflicts: ["biome"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".prettierrc") ||
      fileExists(ctx.root, ".prettierrc.json") ||
      fileExists(ctx.root, "prettier.config.js") ||
      fileExists(ctx.root, "prettier.config.mjs") ||
      fileExists(ctx.root, ".prettierrc.js");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["prettier"],
    });

    const config = {
      semi: true,
      singleQuote: true,
      trailingComma: "all" as const,
      printWidth: 100,
      tabWidth: 2,
      arrowParens: "always" as const,
      endOfLine: "lf" as const,
    };

    actions.push({
      type: "create-file",
      path: ".prettierrc.json",
      content: JSON.stringify(config, null, 2) + "\n",
      skipIfExists: true,
    });

    actions.push({
      type: "create-file",
      path: ".prettierignore",
      content: `dist/
build/
node_modules/
coverage/
.next/
.nuxt/
pnpm-lock.yaml
package-lock.json
yarn.lock
`,
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "format",
      command: "prettier --write .",
    });
    actions.push({
      type: "add-script",
      name: "format:check",
      command: "prettier --check .",
    });

    return actions;
  },
};

export default prettierModule;
