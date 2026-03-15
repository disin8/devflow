import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const vitestModule: DevFlowModule = {
  id: "vitest",
  name: "Vitest",
  description: "Fast Vite-native test runner with TypeScript support",
  category: "testing",
  recommendedFor: ["react", "vue", "node", "nextjs", "nuxt", "sveltekit"],
  conflicts: ["jest"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "vitest.config.ts") ||
      fileExists(ctx.root, "vitest.config.js") ||
      fileExists(ctx.root, "vitest.config.mts");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const isReact = ["react", "nextjs"].includes(ctx.stack ?? "");
    const isVue = ["vue", "nuxt"].includes(ctx.stack ?? "");

    const pkgs = ["vitest"];
    if (isReact) pkgs.push("@vitejs/plugin-react");
    if (isVue) pkgs.push("@vitejs/plugin-vue");

    actions.push({ type: "install", dev: true, packages: pkgs });

    let plugins = "";
    let imports = `import { defineConfig } from 'vitest/config';\n`;
    if (isReact) {
      imports += `import react from '@vitejs/plugin-react';\n`;
      plugins = `  plugins: [react()],\n`;
    }
    if (isVue) {
      imports += `import vue from '@vitejs/plugin-vue';\n`;
      plugins = `  plugins: [vue()],\n`;
    }

    actions.push({
      type: "create-file",
      path: "vitest.config.ts",
      content: `${imports}
export default defineConfig({
${plugins}  test: {
    globals: true,
    environment: '${isReact || isVue ? "jsdom" : "node"}',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
`,
      skipIfExists: true,
    });

    actions.push({ type: "add-script", name: "test", command: "vitest run" });
    actions.push({ type: "add-script", name: "test:watch", command: "vitest" });
    actions.push({
      type: "add-script",
      name: "test:coverage",
      command: "vitest run --coverage",
    });

    return actions;
  },
};

export default vitestModule;
