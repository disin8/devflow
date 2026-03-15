import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const playwrightModule: DevFlowModule = {
  id: "playwright",
  name: "Playwright",
  description: "Cross-browser end-to-end testing by Microsoft",
  category: "testing",
  conflicts: ["cypress"],

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "playwright.config.ts") ||
      fileExists(ctx.root, "playwright.config.js");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["@playwright/test"],
    });

    actions.push({
      type: "create-file",
      path: "playwright.config.ts",
      content: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
`,
      skipIfExists: true,
    });

    actions.push({
      type: "create-file",
      path: "e2e/example.spec.ts",
      content: `import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.*/);
});
`,
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "test:e2e",
      command: "playwright test",
    });

    return actions;
  },
};

export default playwrightModule;
