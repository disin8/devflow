import { statSync } from "node:fs";
import { join } from "node:path";

const CONTENT_ROOT = join(process.cwd(), "content");


export function lastModifiedFor(baseUrl: string, url: string): Date {
  const relative = url
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(baseUrl, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const candidates = relative
    ? [`${relative}.mdx`, `${relative}.md`]
    : ["index.mdx", "index.md"];

  for (const candidate of candidates) {
    try {
      return statSync(join(CONTENT_ROOT, baseUrl.replace(/^\//, ""), candidate)).mtime;
    } catch {
      // 
    }
  }

  return new Date();
}
