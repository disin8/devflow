import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const editorconfigModule: DevFlowModule = {
  id: "editorconfig",
  name: "EditorConfig",
  description: "Consistent editor settings across IDEs (.editorconfig)",
  category: "quality",

  async detect(ctx) {
    return {
      applicable: true,
      alreadyConfigured: fileExists(ctx.root, ".editorconfig"),
    };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: ".editorconfig",
        content: `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
`,
        skipIfExists: true,
      },
    ];
  },
};

export default editorconfigModule;
