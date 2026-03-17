import { join } from "node:path";
import { exec, execSync } from "node:child_process";
import { promisify } from "node:util";
import ora from "ora";

const execAsync = promisify(exec);
import chalk from "chalk";
import type {
  DevFlowModule,
  ExecutionPlan,
  ExecutionSummary,
  ModuleAction,
  ProjectContext,
  ModuleOptions,
} from "./types.js";
import { readFileSafe, writeFileSafe } from "./fs-utils.js";
import { mergePackageJson, addScript } from "./package-json.js";
import { log, isDryRun } from "./logger.js";

export async function buildPlan(
  modules: DevFlowModule[],
  ctx: ProjectContext,
  optionsMap: Record<string, ModuleOptions>,
): Promise<ExecutionPlan> {
  const plan: ExecutionPlan = {
    filesToCreate: [],
    filesToUpdate: [],
    packagesToInstall: [],
    scriptsToAdd: {},
    commandsToRun: [],
    actions: [],
  };

  for (const mod of modules) {
    const actions = await mod.plan(ctx, optionsMap[mod.id] ?? {});
    plan.actions.push({ moduleId: mod.id, actions });
    for (const a of actions) {
      switch (a.type) {
        case "create-file":
          plan.filesToCreate.push(a.path);
          break;
        case "update-file":
          plan.filesToUpdate.push(a.path);
          break;
        case "merge-package-json":
          plan.filesToUpdate.push("package.json");
          break;
        case "install":
          for (const p of a.packages) {
            plan.packagesToInstall.push({ name: p, dev: a.dev });
          }
          break;
        case "add-script":
          plan.scriptsToAdd[a.name] = a.command;
          break;
        case "run-command":
          plan.commandsToRun.push(a.command);
          break;
      }
    }
  }

  // deduplicate
  plan.filesToCreate = [...new Set(plan.filesToCreate)];
  plan.filesToUpdate = [...new Set(plan.filesToUpdate)];
  plan.packagesToInstall = plan.packagesToInstall.filter(
    (p, i, arr) => arr.findIndex((q) => q.name === p.name) === i,
  );

  return plan;
}

export function printPlan(plan: ExecutionPlan) {
  log.header("Execution Plan");

  if (plan.filesToCreate.length) {
    console.log(chalk.green("  Files to create:"));
    plan.filesToCreate.forEach((f) => log.bullet(f));
  }
  if (plan.filesToUpdate.length) {
    console.log(chalk.yellow("  Files to update:"));
    plan.filesToUpdate.forEach((f) => log.bullet(f));
  }
  if (plan.packagesToInstall.length) {
    console.log(chalk.cyan("  Packages to install:"));
    const dev = plan.packagesToInstall.filter((p) => p.dev).map((p) => p.name);
    const prod = plan.packagesToInstall
      .filter((p) => !p.dev)
      .map((p) => p.name);
    if (dev.length) log.bullet(`devDependencies: ${dev.join(", ")}`);
    if (prod.length) log.bullet(`dependencies: ${prod.join(", ")}`);
  }
  if (Object.keys(plan.scriptsToAdd).length) {
    console.log(chalk.blue("  Scripts to add:"));
    for (const [k, v] of Object.entries(plan.scriptsToAdd)) {
      log.bullet(`${k}: ${v}`);
    }
  }
  if (plan.commandsToRun.length) {
    console.log(chalk.magenta("  Commands to run:"));
    plan.commandsToRun.forEach((c) => log.bullet(c));
  }
  log.br();
}

export async function executePlan(
  plan: ExecutionPlan,
  ctx: ProjectContext,
  skipInstall: boolean,
): Promise<ExecutionSummary> {
  const summary: ExecutionSummary = {
    createdFiles: [],
    updatedFiles: [],
    installedPackages: [],
    addedScripts: {},
    warnings: [],
    nextSteps: [],
  };

  const fileSpinner = ora("Creating / updating files…").start();
  for (const { actions } of plan.actions) {
    for (const action of actions) {
      try {
        await applyAction(action, ctx);
        if (action.type === "create-file")
          summary.createdFiles.push(action.path);
        if (action.type === "update-file")
          summary.updatedFiles.push(action.path);
        if (action.type === "merge-package-json")
          summary.updatedFiles.push("package.json");
        if (action.type === "add-script") {
          summary.addedScripts[action.name] = action.command;
          summary.updatedFiles.push("package.json");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        summary.warnings.push(msg);
      }
    }
  }
  fileSpinner.succeed("Files created / updated");

  if (!skipInstall && plan.packagesToInstall.length > 0) {
    const installSpinner = ora("Installing dependencies…").start();
    const devPkgs = plan.packagesToInstall
      .filter((p) => p.dev)
      .map((p) => p.name);
    const prodPkgs = plan.packagesToInstall
      .filter((p) => !p.dev)
      .map((p) => p.name);
    try {
      if (devPkgs.length) {
        await runInstall(ctx, devPkgs, true);
        summary.installedPackages.push(...devPkgs);
      }
      if (prodPkgs.length) {
        await runInstall(ctx, prodPkgs, false);
        summary.installedPackages.push(...prodPkgs);
      }
      installSpinner.succeed("Dependencies installed");
    } catch (err) {
      installSpinner.fail("Failed to install some dependencies");
      const msg = err instanceof Error ? err.message : String(err);
      summary.warnings.push(msg);
    }
  } else if (plan.packagesToInstall.length > 0) {
    summary.nextSteps.push(
      `Install devDependencies: ${plan.packagesToInstall.map((p) => p.name).join(" ")}`,
    );
  }

  for (const { actions } of plan.actions) {
    for (const action of actions) {
      if (action.type === "run-command") {
        const cmdSpinner = ora(action.description).start();
        try {
          if (!isDryRun()) {
            await execAsync(action.command, { cwd: ctx.root });
          }
          cmdSpinner.succeed(action.description);
        } catch {
          cmdSpinner.warn(`Skipped: ${action.description}`);
        }
      }
    }
  }

  // Deduplicate
  summary.createdFiles = [...new Set(summary.createdFiles)];
  summary.updatedFiles = [...new Set(summary.updatedFiles)];

  return summary;
}

async function applyAction(action: ModuleAction, ctx: ProjectContext) {
  switch (action.type) {
    case "create-file": {
      const abs = join(ctx.root, action.path);
      if (action.skipIfExists && ctx.existingFiles.has(action.path)) {
        log.debug(`Skipping existing file: ${action.path}`);
        return;
      }
      writeFileSafe(abs, action.content);
      break;
    }
    case "update-file": {
      const abs = join(ctx.root, action.path);
      const existing = readFileSafe(abs) ?? "";
      const updated = action.updater(existing);
      writeFileSafe(abs, updated);
      break;
    }
    case "merge-package-json":
      mergePackageJson(ctx.root, action.merge);
      break;
    case "add-script":
      addScript(ctx.root, action.name, action.command, action.append);
      break;
    case "install":
    case "run-command":
      // handled separately
      break;
  }
}

async function runInstall(
  ctx: ProjectContext,
  packages: string[],
  dev: boolean,
) {
  if (isDryRun()) {
    log.info(`Would install ${dev ? "(dev)" : ""}: ${packages.join(" ")}`);
    return;
  }
  const flag = dev ? "-D" : "";
  let cmd: string;
  switch (ctx.pm) {
    case "pnpm": {
      const wsFlag = ctx.repoType === "monorepo" ? " -w" : "";
      cmd = `pnpm add ${flag}${wsFlag} ${packages.join(" ")}`;
      break;
    }
    case "yarn":
      cmd = `yarn add ${dev ? "--dev" : ""} ${packages.join(" ")}`;
      break;
    case "bun":
      cmd = `bun add ${dev ? "--dev" : ""} ${packages.join(" ")}`;
      break;
    default:
      cmd = `npm install ${dev ? "--save-dev" : ""} ${packages.join(" ")}`;
  }
  await execAsync(cmd, { cwd: ctx.root });
}

export function printSummary(summary: ExecutionSummary) {
  log.header("✅ Success Summary");

  if (summary.createdFiles.length) {
    console.log(chalk.green("  Created files:"));
    summary.createdFiles.forEach((f) => log.bullet(f));
  }
  if (summary.updatedFiles.length) {
    console.log(chalk.yellow("  Updated files:"));
    summary.updatedFiles.forEach((f) => log.bullet(f));
  }
  if (summary.installedPackages.length) {
    console.log(chalk.cyan("  Installed devDependencies:"));
    summary.installedPackages.forEach((p) => log.bullet(p));
  }
  if (Object.keys(summary.addedScripts).length) {
    console.log(chalk.blue("  Added scripts:"));
    for (const [k, v] of Object.entries(summary.addedScripts)) {
      log.bullet(`${k}: ${v}`);
    }
  }
  if (summary.warnings.length) {
    console.log(chalk.yellow("\n  Warnings:"));
    summary.warnings.forEach((w) => log.bullet(w));
  }
  if (summary.nextSteps.length) {
    console.log(chalk.magenta("\n  Next steps:"));
    summary.nextSteps.forEach((s) => log.bullet(s));
  }
  log.br();
}
