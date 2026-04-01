import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = 'public';

if (!existsSync(publicDir)) {
  process.exit(0);
}

for (const name of readdirSync(publicDir)) {
  if (name === 'robots.txt' || /^sitemap.*\.xml$/.test(name)) {
    rmSync(join(publicDir, name), { force: true });
  }
}