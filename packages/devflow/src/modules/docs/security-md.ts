import type { DevFlowModule } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const securityMdModule: DevFlowModule = {
  id: "security-md",
  name: "SECURITY.md",
  description: "Security policy and vulnerability reporting guide",
  category: "docs",

  async detect(ctx) {
    return {
      applicable: true,
      alreadyConfigured: fileExists(ctx.root, "SECURITY.md"),
    };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: "SECURITY.md",
        content: `# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅         |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email: **security@example.com** (replace with your contact)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

We will acknowledge your report within **48 hours** and aim to provide a fix within **7 days**.

## Security Measures

- Dependencies are regularly audited
- Secrets are scanned with Gitleaks
- CI includes security scanning steps
`,
        skipIfExists: true,
      },
    ];
  },
};

export default securityMdModule;
