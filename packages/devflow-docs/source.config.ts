import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export const modules = defineDocs({
  dir: "content/modules",
});

export const guides = defineDocs({
  dir: "content/guides",
});

export const compare = defineDocs({
  dir: "content/compare",
});

export default defineConfig();
