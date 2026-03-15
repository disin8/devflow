import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const vscodeModule: DevFlowModule = {
  id: "vscode",
  name: "VSCode Settings",
  description: "Shared VSCode extensions and workspace settings",
  category: "dx",

  async detect(ctx) {
    const has = fileExists(ctx.root, ".vscode/extensions.json");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];
    const useBiome = ctx.existingFiles.has("biome.json");

    const extensions: string[] = [];
    if (useBiome) {
      extensions.push("biomejs.biome");
    } else {
      extensions.push("dbaeumer.vscode-eslint", "esbenp.prettier-vscode");
    }
    extensions.push("editorconfig.editorconfig");
    if (ctx.hasTypeScript) extensions.push("ms-vscode.vscode-typescript-next");

    actions.push({
      type: "create-file",
      path: ".vscode/extensions.json",
      content: JSON.stringify({ recommendations: extensions }, null, 2) + "\n",
      skipIfExists: true,
    });

    const settings: Record<string, unknown> = {
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll": "explicit",
      },
    };

    if (useBiome) {
      settings["editor.defaultFormatter"] = "biomejs.biome";
      settings["[javascript]"] = { "editor.defaultFormatter": "biomejs.biome" };
      settings["[typescript]"] = { "editor.defaultFormatter": "biomejs.biome" };
    } else {
      settings["editor.defaultFormatter"] = "esbenp.prettier-vscode";
    }

    actions.push({
      type: "create-file",
      path: ".vscode/settings.json",
      content: JSON.stringify(settings, null, 2) + "\n",
      skipIfExists: true,
    });

    return actions;
  },
};

export default vscodeModule;
