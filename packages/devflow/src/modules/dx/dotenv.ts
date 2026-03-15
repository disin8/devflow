import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const dotenvModule: DevFlowModule = {
  id: "dotenv",
  name: ".env.example",
  description: "Create .env.example template and ensure .env is gitignored",
  category: "dx",

  async detect(ctx) {
    const has = fileExists(ctx.root, ".env.example");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "create-file",
      path: ".env.example",
      content: `# ──────────────────────────────────────
# Environment variables
# Copy this file to .env and fill in values
# ──────────────────────────────────────

NODE_ENV=development
PORT=3000
# DATABASE_URL=
# API_KEY=
`,
      skipIfExists: true,
    });

    actions.push({
      type: "update-file",
      path: ".gitignore",
      description: "Add .env to .gitignore",
      updater: (content) => {
        if (content.includes(".env")) return content;
        return (
          content.trimEnd() +
          "\n\n# Environment\n.env\n.env.local\n.env.*.local\n"
        );
      },
    });

    return actions;
  },
};

export default dotenvModule;
