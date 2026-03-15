import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const gitleaksModule: DevFlowModule = {
  id: "gitleaks",
  name: "Gitleaks",
  description: "Scan git history for secrets and credentials",
  category: "security",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, ".gitleaks.toml") ||
      fileExists(ctx.root, ".github/workflows/gitleaks.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "create-file",
      path: ".gitleaks.toml",
      content: `title = "Gitleaks config"

[allowlist]
  description = "Allowlisted patterns"
  paths = [
    '''node_modules''',
    '''pnpm-lock.yaml''',
    '''package-lock.json''',
    '''yarn.lock''',
  ]
`,
      skipIfExists: true,
    });

    actions.push({
      type: "create-file",
      path: ".github/workflows/gitleaks.yml",
      content: `name: Gitleaks

on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: \${{ secrets.GITLEAKS_LICENSE }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
      skipIfExists: true,
    });

    return actions;
  },
};

export default gitleaksModule;
