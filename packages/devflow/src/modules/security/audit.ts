import type { DevFlowModule, ModuleAction } from "../../core/types.js";

const auditModule: DevFlowModule = {
  id: "audit",
  name: "npm audit",
  description: "Run dependency vulnerability audit in CI",
  category: "security",

  async detect() {
    return { applicable: true, alreadyConfigured: false };
  },

  async plan(ctx) {
    const cmd =
      ctx.pm === "pnpm"
        ? "pnpm audit --audit-level=high"
        : ctx.pm === "yarn"
          ? "yarn npm audit --severity high"
          : "npm audit --audit-level=high";

    return [{ type: "add-script" as const, name: "audit", command: cmd }];
  },
};

export default auditModule;
