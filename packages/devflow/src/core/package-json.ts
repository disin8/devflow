import { join } from "node:path";
import { readFileSafe, writeFileSafe } from "./fs-utils.js";
import { isDryRun } from "./logger.js";
import { log } from "./logger.js";

export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  overwrite = false,
): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const tv = target[key];
    const sv = source[key];
    if (Array.isArray(sv)) {
      const existing = Array.isArray(tv) ? (tv as unknown[]) : [];
      result[key] = [...new Set([...existing, ...(sv as unknown[])])];
    } else if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      result[key] = deepMerge(
        (tv && typeof tv === "object" ? tv : {}) as Record<string, unknown>,
        sv as Record<string, unknown>,
        overwrite,
      );
    } else if (overwrite || tv === undefined || tv === null) {
      result[key] = sv;
    }
  }
  return result;
}

export function mergePackageJson(
  root: string,
  patch: Record<string, unknown>,
): { before: Record<string, unknown>; after: Record<string, unknown> } {
  const pkgPath = join(root, "package.json");
  const raw = readFileSafe(pkgPath) ?? "{}";

  const indentMatch = raw.match(/^(\s+)"/m);
  const indent = indentMatch ? indentMatch[1] : "  ";

  const before = JSON.parse(raw) as Record<string, unknown>;
  const after = deepMerge(before, patch) as Record<string, unknown>;

  if (!isDryRun()) {
    writeFileSafe(pkgPath, JSON.stringify(after, null, indent) + "\n");
  } else {
    log.info("Would merge into package.json:", JSON.stringify(patch, null, 2));
  }
  return { before, after };
}

export function addScript(
  root: string,
  name: string,
  command: string,
  append = false,
): void {
  const pkgPath = join(root, "package.json");
  const raw = readFileSafe(pkgPath) ?? "{}";
  const indentMatch = raw.match(/^(\s+)"/m);
  const indent = indentMatch ? indentMatch[1] : "  ";
  const pkg = JSON.parse(raw) as Record<string, unknown>;

  const scripts = (pkg.scripts ?? {}) as Record<string, string>;
  if (scripts[name] && append) {
    if (!scripts[name].includes(command)) {
      scripts[name] = `${scripts[name]} && ${command}`;
    }
  } else if (!scripts[name]) {
    scripts[name] = command;
  }
  pkg.scripts = scripts;

  if (!isDryRun()) {
    writeFileSafe(pkgPath, JSON.stringify(pkg, null, indent) + "\n");
  } else {
    log.info(`Would add script "${name}": "${command}"`);
  }
}
