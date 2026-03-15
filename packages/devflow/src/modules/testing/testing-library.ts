import type { DevFlowModule, ModuleAction } from "../../core/types.js";

const testingLibraryModule: DevFlowModule = {
  id: "testing-library",
  name: "Testing Library",
  description: "Simple and complete testing utilities (React/Vue)",
  category: "testing",
  recommendedFor: ["react", "vue", "nextjs", "nuxt"],

  async detect(ctx) {
    const deps = {
      ...(ctx.packageJson?.dependencies as Record<string, string> | undefined),
      ...(ctx.packageJson?.devDependencies as
        | Record<string, string>
        | undefined),
    };
    const has =
      !!deps["@testing-library/react"] || !!deps["@testing-library/vue"];
    return {
      applicable: ["react", "vue", "nextjs", "nuxt"].includes(ctx.stack ?? ""),
      alreadyConfigured: has,
    };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const isReact = ["react", "nextjs"].includes(ctx.stack ?? "");
    const isVue = ["vue", "nuxt"].includes(ctx.stack ?? "");

    const pkgs = ["@testing-library/jest-dom"];
    if (isReact)
      pkgs.push("@testing-library/react", "@testing-library/user-event");
    if (isVue) pkgs.push("@testing-library/vue");

    actions.push({ type: "install", dev: true, packages: pkgs });

    actions.push({
      type: "create-file",
      path: "src/test/setup.ts",
      content: `import '@testing-library/jest-dom/vitest';\n`,
      skipIfExists: true,
    });

    return actions;
  },
};

export default testingLibraryModule;
