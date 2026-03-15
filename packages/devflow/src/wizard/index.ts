import chalk from "chalk";
import { confirm, select, checkbox, input } from "@inquirer/prompts";
import type {
  Category,
  CIProvider,
  MonorepoTool,
  PackageManager,
  PresetLevel,
  ProjectContext,
  RepoType,
  Stack,
  WizardState,
  ModuleOptions,
} from "../core/types.js";
import { CATEGORY_LABELS } from "../core/types.js";
import { detectProject } from "../core/context.js";
import { log } from "../core/logger.js";
import {
  ALL_MODULES,
  detectConflicts,
  getModulesByCategory,
  resolveModules,
} from "../modules/registry.js";
import { getPreset } from "../modules/presets.js";
import {
  buildPlan,
  executePlan,
  printPlan,
  printSummary,
} from "../core/executor.js";

async function stepDetect(
  root: string,
  forcePm?: PackageManager,
): Promise<ProjectContext> {
  log.header("Step 0 · Project Detection");
  const ctx = detectProject(root, forcePm);

  log.kv("Root", ctx.root);
  log.kv(
    "package.json",
    ctx.hasPackageJson ? chalk.green("found") : chalk.yellow("missing"),
  );
  log.kv("Package manager", ctx.pm);
  log.kv(
    "TypeScript",
    ctx.hasTypeScript ? chalk.green("yes") : chalk.dim("no"),
  );
  log.kv("Repo type", ctx.repoType);
  if (ctx.monorepoTool) log.kv("Monorepo tool", ctx.monorepoTool);
  if (ctx.workspacePatterns.length)
    log.kv("Workspaces", ctx.workspacePatterns.join(", "));
  if (ctx.stack) log.kv("Detected stack", ctx.stack);
  log.br();

  const ok = await confirm({
    message: "Does this look correct?",
    default: true,
  });
  if (!ok) {
    log.info(
      "You can override with --pm, or manually adjust package.json and re-run.",
    );
    process.exit(0);
  }
  return ctx;
}

async function stepRepoType(
  ctx: ProjectContext,
): Promise<{ repoType: RepoType; monorepoTool?: MonorepoTool }> {
  log.header("Step 1 · Repository Type");

  const repoType = await select<RepoType>({
    message: "Repository type:",
    choices: [
      { value: "single", name: "Single Repo" },
      { value: "monorepo", name: "Monorepo" },
    ],
    default: ctx.repoType,
  });

  let monorepoTool: MonorepoTool | undefined;
  if (repoType === "monorepo") {
    monorepoTool = await select<MonorepoTool>({
      message: "Monorepo tool:",
      choices: [
        { value: "nx", name: "Nx" },
        { value: "turborepo", name: "Turborepo" },
        { value: "custom", name: "Custom (specify workspace paths)" },
      ],
      default: ctx.monorepoTool ?? "turborepo",
    });
  }

  return { repoType, monorepoTool };
}

async function stepStack(detected?: Stack): Promise<Stack> {
  log.header("Step 2 · Stack / Profile");

  return select<Stack>({
    message: "Primary stack:",
    choices: [
      { value: "react", name: "React" },
      { value: "vue", name: "Vue" },
      { value: "node", name: "Node.js" },
      { value: "nestjs", name: "NestJS" },
      { value: "nextjs", name: "Next.js" },
      { value: "nuxt", name: "Nuxt" },
      { value: "sveltekit", name: "SvelteKit" },
    ],
    default: detected ?? "node",
  });
}

async function stepModules(
  stack: Stack,
  repoType: RepoType,
): Promise<string[]> {
  log.header("Step 3 · Module Selection");

  const usePreset = await select<PresetLevel | "custom">({
    message: "Start from a preset?",
    choices: [
      { value: "minimal", name: "Minimal – hooks + lint/format" },
      { value: "recommended", name: "Recommended – + tests + CI + typecheck" },
      { value: "full", name: "Full – + release + security + docs + docker" },
      { value: "custom", name: "Custom – pick manually" },
    ],
    default: "recommended",
  });

  let preSelected: Set<string>;
  if (usePreset !== "custom") {
    preSelected = new Set(getPreset(stack, usePreset, repoType));
  } else {
    preSelected = new Set<string>();
  }

  const categories: Category[] = [
    "git",
    "quality",
    "testing",
    "ci",
    "release",
    "security",
    "dx",
    "docker",
    "docs",
  ];
  if (repoType === "monorepo") categories.push("monorepo");

  const selected: string[] = [];

  for (const cat of categories) {
    const mods = getModulesByCategory(cat);
    if (mods.length === 0) continue;

    const choices = mods.map((m) => {
      const rec = m.recommendedFor?.includes(stack)
        ? chalk.green(" (recommended)")
        : "";
      const conflict = m.conflicts?.length
        ? chalk.yellow(` ⚠ conflicts: ${m.conflicts.join(", ")}`)
        : "";
      return {
        value: m.id,
        name: `${m.name} – ${m.description}${rec}${conflict}`,
        checked: preSelected.has(m.id),
      };
    });

    const picks = await checkbox({
      message: `${CATEGORY_LABELS[cat]}:`,
      choices,
    });

    selected.push(...picks);
  }

  const conflicts = detectConflicts(selected);
  if (conflicts.length > 0) {
    log.warn("Detected conflicts:");
    for (const c of conflicts) {
      log.bullet(c.reason);
    }
    const proceed = await confirm({
      message: "Remove conflicting modules and continue?",
      default: true,
    });
    if (proceed) {
      const toRemove = new Set(conflicts.map((c) => c.b));
      return selected.filter((id) => !toRemove.has(id));
    }
  }

  return selected;
}

async function stepSettings(
  selectedIds: string[],
  ctx: ProjectContext,
): Promise<{
  moduleOptions: Record<string, ModuleOptions>;
  ciProvider: CIProvider;
}> {
  log.header("Step 4 · Settings");
  const ids = new Set(selectedIds);
  const moduleOptions: Record<string, ModuleOptions> = {};
  let ciProvider: CIProvider = "github";

  if (ids.has("commitlint")) {
    const mode = await select<string>({
      message: "Commitlint strictness:",
      choices: [
        {
          value: "strict",
          name: "Strict (enforce type, max length, case rules)",
        },
        { value: "loose", name: "Loose (only conventional base)" },
      ],
      default: "strict",
    });
    moduleOptions["commitlint"] = { mode };
  }

  if (ids.has("github-actions") || ids.has("gitlab-ci")) {
    ciProvider = await select<CIProvider>({
      message: "CI provider:",
      choices: [
        { value: "github", name: "GitHub Actions" },
        { value: "gitlab", name: "GitLab CI" },
        { value: "both", name: "Both" },
      ],
      default:
        ids.has("github-actions") && ids.has("gitlab-ci")
          ? "both"
          : ids.has("gitlab-ci")
            ? "gitlab"
            : "github",
    });
    if (ciProvider === "github" && ids.has("gitlab-ci")) {
      selectedIds.splice(selectedIds.indexOf("gitlab-ci"), 1);
    }
    if (ciProvider === "gitlab" && ids.has("github-actions")) {
      selectedIds.splice(selectedIds.indexOf("github-actions"), 1);
    }
  }

  if (ids.has("husky")) {
    const hooks = await checkbox({
      message: "Husky hooks to set up:",
      choices: [
        {
          value: "pre-commit",
          name: "pre-commit (lint/format)",
          checked: true,
        },
        {
          value: "commit-msg",
          name: "commit-msg (commitlint)",
          checked: ids.has("commitlint"),
        },
        {
          value: "pre-push",
          name: "pre-push (typecheck + test)",
          checked: false,
        },
      ],
    });
    moduleOptions["husky"] = { hooks, withLintStaged: ids.has("lint-staged") };
  }

  if (ids.has("lint-staged")) {
    const formatter = ids.has("biome") ? "biome" : "eslint-prettier";
    moduleOptions["lint-staged"] = { formatter };
  }

  if (ids.has("commitizen")) {
    const adapter = await select<string>({
      message: "Commitizen adapter:",
      choices: [
        { value: "cz-git", name: "cz-git (modern, customisable)" },
        {
          value: "cz-conventional-changelog",
          name: "cz-conventional-changelog (classic)",
        },
      ],
      default: "cz-git",
    });
    moduleOptions["commitizen"] = { adapter };
  }

  if (ids.has("license")) {
    const license = await select<string>({
      message: "License:",
      choices: [
        { value: "MIT", name: "MIT" },
        { value: "Apache-2.0", name: "Apache 2.0" },
        { value: "Proprietary", name: "Proprietary" },
      ],
      default: "MIT",
    });
    moduleOptions["license"] = { license };
  }

  return { moduleOptions, ciProvider };
}

async function stepPlanAndConfirm(state: WizardState): Promise<boolean> {
  const modules = resolveModules(state.selectedModuleIds);
  const plan = await buildPlan(modules, state.context, state.moduleOptions);

  printPlan(plan);

  if (state.dryRun) {
    log.info("Dry-run mode — no changes applied.");
    return false;
  }

  if (state.yes) return true;

  return confirm({ message: "Continue?", default: true });
}

async function stepExecute(state: WizardState): Promise<void> {
  log.header("Step 6 · Executing");
  const modules = resolveModules(state.selectedModuleIds);
  const plan = await buildPlan(modules, state.context, state.moduleOptions);
  const summary = await executePlan(plan, state.context, state.skipInstall);

  if (!state.context.existingFiles.has(".git")) {
    summary.nextSteps.unshift("git init");
  }
  if (state.selectedModuleIds.includes("husky")) {
    summary.nextSteps.push("npx husky (if hooks not running)");
  }
  if (state.selectedModuleIds.includes("playwright")) {
    summary.nextSteps.push("npx playwright install");
  }

  printSummary(summary);
}

export interface WizardOptions {
  root: string;
  forcePm?: PackageManager;
  dryRun?: boolean;
  skipInstall?: boolean;
  yes?: boolean;
}

export async function runWizard(opts: WizardOptions): Promise<void> {
  console.log(
    chalk.bold.cyan("\n  ⚙  DevFlow Initializer\n") +
      chalk.dim("  Bootstrap your complete development workflow\n"),
  );

  const ctx = await stepDetect(opts.root, opts.forcePm);

  const { repoType, monorepoTool } = await stepRepoType(ctx);
  ctx.repoType = repoType;
  ctx.monorepoTool = monorepoTool;

  const stack = await stepStack(ctx.stack);
  ctx.stack = stack;

  const selectedModuleIds = await stepModules(stack, repoType);

  if (selectedModuleIds.length === 0) {
    log.warn("No modules selected. Exiting.");
    return;
  }

  const { moduleOptions, ciProvider } = await stepSettings(
    selectedModuleIds,
    ctx,
  );

  const state: WizardState = {
    context: ctx,
    repoType,
    monorepoTool,
    stack,
    selectedModuleIds,
    moduleOptions,
    ciProvider,
    dryRun: opts.dryRun ?? false,
    skipInstall: opts.skipInstall ?? false,
    yes: opts.yes ?? false,
  };

  const go = await stepPlanAndConfirm(state);
  if (!go) {
    log.info("Aborted.");
    return;
  }

  await stepExecute(state);
}
