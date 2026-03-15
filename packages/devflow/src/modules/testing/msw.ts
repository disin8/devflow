import type { DevFlowModule, ModuleAction } from "../../core/types.js";

const mswModule: DevFlowModule = {
  id: "msw",
  name: "MSW",
  description: "API mocking library using Service Workers",
  category: "testing",

  async detect(ctx) {
    const deps = {
      ...(ctx.packageJson?.dependencies as Record<string, string> | undefined),
      ...(ctx.packageJson?.devDependencies as
        | Record<string, string>
        | undefined),
    };
    return { applicable: true, alreadyConfigured: !!deps["msw"] };
  },

  async plan() {
    const actions: ModuleAction[] = [];
    actions.push({ type: "install", dev: true, packages: ["msw"] });

    actions.push({
      type: "create-file",
      path: "src/mocks/handlers.ts",
      content: `import { http, HttpResponse } from 'msw';
        export const handlers = [
          http.get('/api/example', () => {
            return HttpResponse.json({ message: 'Hello from MSW!' });
          }),
        ];
      `,
      skipIfExists: true,
    });

    actions.push({
      type: "create-file",
      path: "src/mocks/server.ts",
      content: `import { setupServer } from 'msw/node';
        import { handlers } from './handlers.js';

        export const server = setupServer(...handlers);
      `,
      skipIfExists: true,
    });

    return actions;
  },
};

export default mswModule;
