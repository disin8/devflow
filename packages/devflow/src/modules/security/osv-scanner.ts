import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const osvScannerModule: DevFlowModule = {
  id: "osv-scanner",
  name: "OSV-Scanner",
  description: "Scan dependencies against the OSV vulnerability database",
  category: "security",

  async detect(ctx) {
    const has = fileExists(ctx.root, ".github/workflows/osv-scanner.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: ".github/workflows/osv-scanner.yml",
        content: `name: OSV Scanner

on:
  push:
    branches: [main, master]
  pull_request:
  schedule:
    - cron: '0 6 * * 1'

jobs:
  osv-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: OSV Scanner
        uses: google/osv-scanner-action/osv-scanner-action@v1
        with:
          scan-args: |-
            --lockfile=package-lock.json
            --recursive
            .
`,
        skipIfExists: true,
      },
    ];
  },
};

export default osvScannerModule;
