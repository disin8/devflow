import type {
  DevFlowModule,
  ModuleAction,
  ProjectContext,
} from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

function buildConfig(ctx: ProjectContext): string {
  const isReact = ["react", "nextjs"].includes(ctx.stack ?? "");
  const isVue = ["vue", "nuxt"].includes(ctx.stack ?? "");
  const isTs = ctx.hasTypeScript;

  const imports = [`import js from '@eslint/js';`];
  const configs = ["js.configs.recommended"];

  if (isTs) {
    imports.push(`import tseslint from 'typescript-eslint';`);
    configs.push("...tseslint.configs.recommended");
  }
  if (isReact) {
    imports.push(`import react from 'eslint-plugin-react';`);
    imports.push(`import reactHooks from 'eslint-plugin-react-hooks';`);
  }
  if (isVue) {
    imports.push(`import vue from 'eslint-plugin-vue';`);
  }

  let out = imports.join("\n") + "\n\nexport default [\n";
  for (const c of configs) {
    out += `  ${c},\n`;
  }

  if (isReact) {
    out += `  {\n    plugins: { react, 'react-hooks': reactHooks },\n    rules: {\n      'react/react-in-jsx-scope': 'off',\n      'react-hooks/rules-of-hooks': 'error',\n      'react-hooks/exhaustive-deps': 'warn',\n    },\n  },\n`;
  }
  if (isVue) {
    out += `  ...vue.configs['flat/recommended'],\n`;
  }

  out += `  {\n    ignores: ['dist/', 'node_modules/', 'build/', '.next/', '.nuxt/'],\n  },\n`;
  out += "];\n";
  return out;
}

const eslintModule: DevFlowModule = {
  id: "eslint",
  name: "ESLint",
  description: "Pluggable JavaScript/TypeScript linter (flat config)",
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
      fileExists(ctx.root, "eslint.config.js") ||
      fileExists(ctx.root, "eslint.config.mjs") ||
      fileExists(ctx.root, ".eslintrc.json") ||
      fileExists(ctx.root, ".eslintrc.js") ||
      fileExists(ctx.root, ".eslintrc.cjs");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const isReact = ["react", "nextjs"].includes(ctx.stack ?? "");
    const isVue = ["vue", "nuxt"].includes(ctx.stack ?? "");

    const pkgs = ["eslint", "@eslint/js"];
    if (ctx.hasTypeScript) pkgs.push("typescript-eslint");
    if (isReact) pkgs.push("eslint-plugin-react", "eslint-plugin-react-hooks");
    if (isVue) pkgs.push("eslint-plugin-vue");

    actions.push({ type: "install", dev: true, packages: pkgs });

    actions.push({
      type: "create-file",
      path: "eslint.config.mjs",
      content: buildConfig(ctx),
      skipIfExists: true,
    });

    actions.push({ type: "add-script", name: "lint", command: "eslint ." });
    actions.push({
      type: "add-script",
      name: "lint:fix",
      command: "eslint . --fix",
    });

    return actions;
  },
};

export default eslintModule;
