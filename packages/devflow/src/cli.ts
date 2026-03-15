import { Command } from "commander";
import chalk from "chalk";
import type { CIProvider, PackageManager } from "./core/types.js";
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

const VERSION = "1.0.0";

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
    .option("--scope <path>", "Monorepo scope")
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
      opts.security;

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
