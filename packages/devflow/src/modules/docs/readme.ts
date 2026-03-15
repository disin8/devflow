import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const readmeModule: DevFlowModule = {
  id: "readme",
  name: "README.md",
  description: "Professional README template with badges and sections",
  category: "docs",

  async detect(ctx) {
    return {
      applicable: true,
      alreadyConfigured: fileExists(ctx.root, "README.md"),
    };
  },

  async plan(ctx) {
    const name = (ctx.packageJson?.name as string) ?? "my-project";
    const pm = ctx.pm;
    const run = pm === "npm" ? "npm run" : pm;

    return [
      {
        type: "create-file" as const,
        path: "README.md",
        content: `# ${name}

> Short project description here.

<!-- Badges -->
![CI](https://github.com/<owner>/${name}/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/<owner>/${name})

## Getting Started

### Prerequisites

- Node.js ≥ 18
- ${pm}

### Installation

\`\`\`bash
${pm} install
\`\`\`

### Development

\`\`\`bash
${run} dev
\`\`\`

### Scripts

| Command | Description |
|---------|-------------|
| \`${run} dev\` | Start development server |
| \`${run} build\` | Build for production |
| \`${run} test\` | Run tests |
| \`${run} lint\` | Lint code |
| \`${run} format\` | Format code |
| \`${run} typecheck\` | TypeScript type checking |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
`,
        skipIfExists: true,
      },
    ];
  },
};

export default readmeModule;
