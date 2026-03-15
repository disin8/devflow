import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const dockerignoreModule: DevFlowModule = {
  id: "dockerignore",
  name: ".dockerignore",
  description: "Exclude unnecessary files from Docker builds",
  category: "docker",

  async detect(ctx) {
    return {
      applicable: true,
      alreadyConfigured: fileExists(ctx.root, ".dockerignore"),
    };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: ".dockerignore",
        content: `node_modules
dist
build
.git
.gitignore
.env
.env.*
*.md
*.log
coverage
.vscode
.idea
.husky
.changeset
e2e
cypress
tests
__tests__
Dockerfile
docker-compose*.yml
.dockerignore
`,
        skipIfExists: true,
      },
    ];
  },
};

export default dockerignoreModule;
