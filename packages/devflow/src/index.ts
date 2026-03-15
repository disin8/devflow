#!/usr/bin/env node
import { createCLI } from "./cli.js";

const program = createCLI();
program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
