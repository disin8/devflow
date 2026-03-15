import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const lefthookModule: DevFlowModule = {
  id: "lefthook",
  name: "Lefthook",
  description: "Fast, cross-platform Git hooks manager (alternative to Husky)",
  category: "git",
  conflicts: ["husky"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "lefthook.yml") ||
      fileExists(ctx.root, "lefthook.yaml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["lefthook"],
    });

    const useBiome = ctx.existingFiles.has("biome.json");
    const lintCmd = useBiome
      ? "npx biome check --apply {staged_files}"
      : "npx eslint --fix {staged_files}";
    const formatCmd = useBiome ? "" : "npx prettier --write {staged_files}";

    let config = `pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: ${lintCmd}
      stage_fixed: true
`;
    if (formatCmd) {
      config += `    format:
      glob: "*.{js,jsx,ts,tsx,json,md,yml,yaml,css,scss}"
      run: ${formatCmd}
      stage_fixed: true
`;
    }

    config += `
commit-msg:
  commands:
    commitlint:
      run: npx --no -- commitlint --edit {1}
`;

    actions.push({
      type: "create-file",
      path: "lefthook.yml",
      content: config,
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "prepare",
      command: "lefthook install",
    });

    return actions;
  },
};

export default lefthookModule;
