import type { DevFlowModule } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const contributingModule: DevFlowModule = {
  id: "contributing",
  name: "CONTRIBUTING.md",
  description: "Contributing guidelines for collaborators",
  category: "docs",

  async detect(ctx) {
    return {
      applicable: true,
      alreadyConfigured: fileExists(ctx.root, "CONTRIBUTING.md"),
    };
  },

  async plan(ctx) {
    const pm = ctx.pm;
    return [
      {
        type: "create-file" as const,
        path: "CONTRIBUTING.md",
        content: `# Contributing

Thanks for your interest in contributing! 🎉

## Development Setup

1. Fork and clone the repo
2. Install dependencies: \`${pm} install\`
3. Create a branch: \`git checkout -b feat/my-feature\`
4. Make your changes
5. Run tests: \`${pm === "npm" ? "npm run" : pm} test\`
6. Commit using conventional commits: \`git commit -m "feat: add something"\`
7. Push and open a Pull Request

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- \`feat:\` – new feature
- \`fix:\` – bug fix
- \`docs:\` – documentation
- \`style:\` – formatting
- \`refactor:\` – refactoring
- \`test:\` – tests
- \`chore:\` – maintenance

## Code Style

- Run \`${pm === "npm" ? "npm run" : pm} lint\` before committing
- Run \`${pm === "npm" ? "npm run" : pm} format\` to auto-format

## Pull Requests

- Keep PRs focused and small
- Update tests if needed
- Ensure CI passes

## Questions?

Open an issue or start a discussion.
`,
        skipIfExists: true,
      },
    ];
  },
};

export default contributingModule;
