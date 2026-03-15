export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export type RepoType = "single" | "monorepo";
export type MonorepoTool = "nx" | "turborepo" | "custom";

export type Stack =
  | "react"
  | "vue"
  | "node"
  | "nestjs"
  | "nextjs"
  | "nuxt"
  | "sveltekit";

export type CIProvider = "github" | "gitlab" | "both";

export type Category =
  | "git"
  | "quality"
  | "testing"
  | "ci"
  | "release"
  | "security"
  | "dx"
  | "docker"
  | "docs"
  | "monorepo";

export const CATEGORY_LABELS: Record<Category, string> = {
  git: "Git & Коммиты",
  quality: "Качество кода (Lint / Format)",
  testing: "Тестирование",
  ci: "CI/CD",
  release: "Релизы и версионирование",
  security: "Безопасность",
  dx: "Dev Environment / DX",
  docker: "Docker / Containers",
  docs: "Документация и стандарты",
  monorepo: "Монорепо",
};

export type PresetLevel = "minimal" | "recommended" | "full";

export interface ProjectContext {
  /** Absolute path to project root */
  root: string;
  /** Detected (or forced) package manager */
  pm: PackageManager;
  /** Does package.json exist? */
  hasPackageJson: boolean;
  /** Does tsconfig.json exist? */
  hasTypeScript: boolean;
  /** Repo type */
  repoType: RepoType;
  /** Monorepo tool (if applicable) */
  monorepoTool?: MonorepoTool;
  /** Workspace glob patterns (e.g. ["packages/*", "apps/*"]) */
  workspacePatterns: string[];
  /** Selected stack */
  stack?: Stack;
  /** Existing files on disk (cached set of relative paths) */
  existingFiles: Set<string>;
  /** Parsed root package.json (if exists) */
  packageJson?: Record<string, unknown>;
}

export interface CreateFileAction {
  type: "create-file";
  path: string;
  content: string;
  skipIfExists?: boolean;
}

export interface UpdateFileAction {
  type: "update-file";
  path: string;
  description: string;
  updater: (existing: string) => string;
}

export interface MergePackageJsonAction {
  type: "merge-package-json";
  merge: Record<string, unknown>;
}

export interface InstallAction {
  type: "install";
  dev: boolean;
  packages: string[];
}

export interface AddScriptAction {
  type: "add-script";
  name: string;
  command: string;
  /** If true, append to existing script with && */
  append?: boolean;
}

export interface RunCommandAction {
  type: "run-command";
  command: string;
  description: string;
}

export type ModuleAction =
  | CreateFileAction
  | UpdateFileAction
  | MergePackageJsonAction
  | InstallAction
  | AddScriptAction
  | RunCommandAction;

export interface ModuleDetection {
  /** Is this module applicable for the current project? */
  applicable: boolean;
  /** Is it already (fully) configured? */
  alreadyConfigured: boolean;
  /** Human-readable reason */
  reason?: string;
}

export type ModuleOptions = Record<string, unknown>;

export interface ModuleResult {
  createdFiles: string[];
  updatedFiles: string[];
  installedPackages: string[];
  addedScripts: Record<string, string>;
  warnings: string[];
  nextSteps: string[];
}

export interface DevFlowModule {
  /** Unique id, e.g. "husky", "eslint" */
  id: string;
  /** Human name */
  name: string;
  /** Short description for checkbox */
  description: string;
  /** Category */
  category: Category;
  /** Stacks for which this module is "recommended" */
  recommendedFor?: Stack[];
  /** Module ids that conflict (mutex) */
  conflicts?: string[];
  /** Module ids this one depends on */
  dependsOn?: string[];

  /** Check applicability & detect existing config */
  detect(ctx: ProjectContext): Promise<ModuleDetection>;
  /** Return planned actions without side-effects */
  plan(ctx: ProjectContext, options: ModuleOptions): Promise<ModuleAction[]>;
  /** Apply actions (executor will call this) */
  apply?(actions: ModuleAction[], ctx: ProjectContext): Promise<void>;
}

export interface WizardState {
  context: ProjectContext;
  repoType: RepoType;
  monorepoTool?: MonorepoTool;
  stack?: Stack;
  selectedModuleIds: string[];
  moduleOptions: Record<string, ModuleOptions>;
  preset?: PresetLevel;
  ciProvider: CIProvider;
  dryRun: boolean;
  skipInstall: boolean;
  yes: boolean;
}

export interface ExecutionPlan {
  filesToCreate: string[];
  filesToUpdate: string[];
  packagesToInstall: { name: string; dev: boolean }[];
  scriptsToAdd: Record<string, string>;
  commandsToRun: string[];
  actions: { moduleId: string; actions: ModuleAction[] }[];
}

export interface ExecutionSummary {
  createdFiles: string[];
  updatedFiles: string[];
  installedPackages: string[];
  addedScripts: Record<string, string>;
  warnings: string[];
  nextSteps: string[];
}

export interface CLIFlags {
  all?: boolean;
  only?: string;
  dryRun?: boolean;
  yes?: boolean;
  skipInstall?: boolean;
  pm?: PackageManager;
  ci?: CIProvider;
  scope?: string;
  workspaces?: string;
  husky?: boolean;
  lint?: boolean;
  test?: boolean;
  release?: string;
  docker?: boolean;
  docs?: boolean;
  security?: boolean;
}
