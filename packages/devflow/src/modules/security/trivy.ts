import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const trivyModule: DevFlowModule = {
  id: "trivy",
  name: "Trivy",
  description: "Scan containers and filesystems for vulnerabilities",
  category: "security",

  async detect(ctx) {
    const has = fileExists(ctx.root, ".github/workflows/trivy.yml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: ".github/workflows/trivy.yml",
        content: `name: Trivy Security Scan

on:
  push:
    branches: [main, master]
  pull_request:
  schedule:
    - cron: '0 6 * * 1'  # weekly Monday 06:00

jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner (filesystem)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'
          format: 'table'
`,
        skipIfExists: true,
      },
    ];
  },
};

export default trivyModule;
