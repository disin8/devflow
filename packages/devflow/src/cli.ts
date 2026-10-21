import { Command } from "commander";
import type { CIProvider, PackageManager } from "./core/types.js";
import { CI_PROVIDER_MODULES, isCiProvider } from "./core/ci-providers.js";
import { setDryRun, setVerbose, log } from "./core/logger.js";
import { detectProject } from "./core/context.js";
import { resolveModules, MODULE_MAP } from "./modules/registry.js";
import { getPreset } from "./modules/presets.js";
import {
  buildPlan,
  executePlan,
  printPlan,
  printSummary,
} from "./core/executor.js";
import { runWizard } from "./wizard/index.js";
import { readVersion } from "./version.js";

const VERSION = readVersion();

function createCLI() {
  const program = new Command();

  program
    .name("devflow")
    .description("Bootstrap a complete DevFlow in any repository")
    .version(VERSION)
    .option("--all", "Apply recommended preset for detected stack")
    .option("--only <module>", "Run a single module by id")
    .option("--dry-run", "Show what would be done without writing")
    .option("-y, --yes", "Skip confirmations, use defaults")
    .option("--skip-install", "Skip npm install (generate files only)")
    .option("--pm <manager>", "Force package manager (npm|pnpm|yarn|bun)")
    .option("--ci <provider>", "CI provider (github|gitlab|both)")
    .option(
      "--scope <pattern>",
      "Workspace glob pattern for monorepo configs (e.g. \"packages/*\")",
    )
    .option("--verbose", "Verbose output")
    // Direct module shortcuts
    .option("--husky", "Setup Husky hooks")
    .option("--lint", "Setup ESLint + Prettier (or Biome)")
    .option("--test", "Setup Vitest")
    .option(
      "--release <tool>",
      "Setup release tool (release-it|changesets|semantic-release)",
    )
    .option("--docker", "Setup Docker files")
    .option("--docs", "Setup documentation files")
    .option("--security", "Setup security scanning");

  program.action(async (opts) => {
    const root = process.cwd();

    if (opts.dryRun) setDryRun(true);
    if (opts.verbose) setVerbose(true);

    const forcePm = opts.pm as PackageManager | undefined;

    const hasActionFlag =
      opts.all ||
      opts.only ||
      opts.husky ||
      opts.lint ||
      opts.test ||
      opts.release ||
      opts.docker ||
      opts.docs ||
      opts.security ||
      opts.ci ||
      opts.scope;

    if (!hasActionFlag) {
      await runWizard({
        root,
        forcePm,
        dryRun: opts.dryRun,
        skipInstall: opts.skipInstall,
        yes: opts.yes,
      });
      return;
    }

    const ctx = detectProject(root, forcePm);
    if (opts.scope) {
      ctx.workspacePatterns = [opts.scope];
      if (ctx.repoType !== "monorepo") ctx.repoType = "monorepo";
    }
    let moduleIds: string[] = [];

    if (opts.all) {
      moduleIds = getPreset(ctx.stack, "recommended", ctx.repoType);
    } else if (opts.only) {
      if (!MODULE_MAP.has(opts.only)) {
        log.error(
          `Unknown module: "${opts.only}". Available: ${[...MODULE_MAP.keys()].join(", ")}`,
        );
        process.exit(1);
      }
      moduleIds = [opts.only];
    } else {
      if (opts.husky) moduleIds.push("husky", "lint-staged", "commitlint");
      if (opts.lint) moduleIds.push("eslint", "prettier", "editorconfig");
      if (opts.test) moduleIds.push("vitest");
      if (opts.ci) {
        const provider = opts.ci as string;
        if (!isCiProvider(provider)) {
          log.error(
            `Unknown CI provider: "${opts.ci}". Options: github, gitlab, both`,
          );
          process.exit(1);
        }
        moduleIds.push(...CI_PROVIDER_MODULES[provider]);
      }
      if (opts.release) {
        const tool = opts.release as string;
        if (MODULE_MAP.has(tool)) {
          moduleIds.push(tool);
        } else {
          log.error(
            `Unknown release tool: "${tool}". Options: release-it, changesets, semantic-release`,
          );
          process.exit(1);
        }
      }
      if (opts.docker)
        moduleIds.push("dockerfile", "docker-compose", "dockerignore");
      if (opts.docs)
        moduleIds.push(
          "readme",
          "contributing",
          "code-of-conduct",
          "security-md",
          "license",
        );
      if (opts.security) moduleIds.push("audit", "gitleaks");
    }

    if (moduleIds.length === 0) {
      log.warn("No modules selected.");
      return;
    }

    const modules = resolveModules(moduleIds);
    const plan = await buildPlan(modules, ctx, {});

    printPlan(plan);

    if (opts.dryRun) {
      log.info("Dry-run complete.");
      return;
    }

    if (!opts.yes) {
      const { confirm } = await import("@inquirer/prompts");
      const go = await confirm({ message: "Continue?", default: true });
      if (!go) {
        log.info("Aborted.");
        return;
      }
    }

    log.br();
    const summary = await executePlan(plan, ctx, opts.skipInstall ?? false);
    printSummary(summary);
  });

  return program;
}

export { createCLI };
