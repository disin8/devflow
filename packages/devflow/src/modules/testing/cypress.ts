import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const cypressModule: DevFlowModule = {
  id: "cypress",
  name: "Cypress",
  description: "End-to-end and component testing framework",
  category: "testing",
  conflicts: ["playwright"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "cypress.config.ts") ||
      fileExists(ctx.root, "cypress.config.js");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];
    actions.push({ type: "install", dev: true, packages: ["cypress"] });

    actions.push({
      type: "create-file",
      path: "cypress.config.ts",
      content: `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
  },
});
`,
      skipIfExists: true,
    });

    actions.push({
      type: "create-file",
      path: "cypress/support/e2e.ts",
      content: `// cypress/support/e2e.ts
// Import commands or global setup here
`,
      skipIfExists: true,
    });

    actions.push({
      type: "create-file",
      path: "cypress/e2e/example.cy.ts",
      content: `describe('Example', () => {
  it('visits the app', () => {
    cy.visit('/');
    cy.contains('body', /.*/);
  });
});
`,
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "test:e2e",
      command: "cypress run",
    });
    actions.push({
      type: "add-script",
      name: "cypress:open",
      command: "cypress open",
    });

    return actions;
  },
};

export default cypressModule;
