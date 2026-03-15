import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const devcontainerModule: DevFlowModule = {
  id: "devcontainer",
  name: "Dev Container",
  description:
    "VS Code Dev Container configuration for consistent environments",
  category: "dx",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".devcontainer/devcontainer.json") ||
      fileExists(ctx.root, ".devcontainer.json");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const useBiome = ctx.existingFiles.has("biome.json");

    const extensions = [
      "editorconfig.editorconfig",
      ...(useBiome
        ? ["biomejs.biome"]
        : ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]),
    ];

    const config = {
      name: "DevFlow Project",
      image: "mcr.microsoft.com/devcontainers/typescript-node:20",
      features: {
        "ghcr.io/devcontainers/features/git:1": {},
      },
      customizations: {
        vscode: {
          extensions,
          settings: {
            "editor.formatOnSave": true,
          },
        },
      },
      postCreateCommand: `${ctx.pm} install`,
      forwardPorts: [3000],
    };

    actions.push({
      type: "create-file",
      path: ".devcontainer/devcontainer.json",
      content: JSON.stringify(config, null, 2) + "\n",
      skipIfExists: true,
    });

    return actions;
  },
};

export default devcontainerModule;
