import chalk from "chalk";

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

let _dryRun = false;
let _verbose = false;

export function setDryRun(v: boolean) {
  _dryRun = v;
}
export function setVerbose(v: boolean) {
  _verbose = v;
}
export function isDryRun() {
  return _dryRun;
}

const PREFIX = {
  debug: chalk.gray("[debug]"),
  info: chalk.blue("ℹ"),
  warn: chalk.yellow("⚠"),
  error: chalk.red("✖"),
  success: chalk.green("✔"),
};

function emit(level: LogLevel, ...args: unknown[]) {
  if (level === "debug" && !_verbose) return;
  const prefix = _dryRun ? chalk.magenta("[dry-run] ") : "";
  const tag = PREFIX[level];
  // eslint-disable-next-line no-console
  console.log(`${prefix}${tag}`, ...args);
}

export const log = {
  debug: (...a: unknown[]) => emit("debug", ...a),
  info: (...a: unknown[]) => emit("info", ...a),
  warn: (...a: unknown[]) => emit("warn", ...a),
  error: (...a: unknown[]) => emit("error", ...a),
  success: (...a: unknown[]) => emit("success", ...a),
  br: () => console.log(),
  header: (text: string) => console.log(`\n${chalk.bold.underline(text)}\n`),
  kv: (key: string, value: string) =>
    console.log(`  ${chalk.dim(key + ":")} ${value}`),
  bullet: (text: string) => console.log(`  ${chalk.dim("•")} ${text}`),
};
