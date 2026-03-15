import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { log, isDryRun } from "./logger.js";

export function readFileSafe(absPath: string): string | undefined {
  try {
    return readFileSync(absPath, "utf-8");
  } catch {
    return undefined;
  }
}

export function writeFileSafe(absPath: string, content: string): boolean {
  if (isDryRun()) {
    log.info(`Would create ${relative(process.cwd(), absPath)}`);
    return false;
  }
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, "utf-8");
  return true;
}

export function fileExists(root: string, relPath: string): boolean {
  return existsSync(join(root, relPath));
}

export function collectFiles(dir: string, base = dir): Set<string> {
  const SKIP = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".output",
  ]);
  const result = new Set<string>();
  try {
    for (const entry of readdirSync(dir)) {
      if (SKIP.has(entry)) continue;
      const abs = join(dir, entry);
      const rel = relative(base, abs);
      try {
        const stat = statSync(abs);
        if (stat.isDirectory()) {
          for (const f of collectFiles(abs, base)) result.add(f);
        } else {
          result.add(rel);
        }
      } catch {
        // permission error, skip
      }
    }
  } catch {
    // dir doesn't exist
  }
  return result;
}
