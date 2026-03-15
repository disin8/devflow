import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const makefileModule: DevFlowModule = {
  id: "makefile",
  name: "Makefile",
  description: "Handy make commands (make lint, make test, etc.)",
  category: "dx",

  async detect(ctx) {
    return {
      applicable: true,
      alreadyConfigured: fileExists(ctx.root, "Makefile"),
    };
  },

  async plan(ctx) {
    const run = ctx.pm === "npm" ? "npm run" : ctx.pm;
    return [
      {
        type: "create-file" as const,
        path: "Makefile",
        content: `.PHONY: install lint format test build clean

install:
\t${ctx.pm} install

lint:
\t${run} lint

format:
\t${run} format

test:
\t${run} test

build:
\t${run} build

typecheck:
\t${run} typecheck

clean:
\trm -rf dist node_modules coverage

ci: lint typecheck test build
`,
        skipIfExists: true,
      },
    ];
  },
};

export default makefileModule;
