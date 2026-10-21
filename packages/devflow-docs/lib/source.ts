import {
  compare as compareCollection,
  docs as docsCollection,
  guides as guidesCollection,
  modules as modulesCollection,
} from "fumadocs-mdx:collections/server";
import { InferPageType, loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docsCollection.toFumadocsSource(),
});

export const modulesSource = loader({
  baseUrl: "/modules",
  source: modulesCollection.toFumadocsSource(),
});

export const guidesSource = loader({
  baseUrl: "/guides",
  source: guidesCollection.toFumadocsSource(),
});

export const compareSource = loader({
  baseUrl: "/compare",
  source: compareCollection.toFumadocsSource(),
});

export async function getLLMText(page: InferPageType<typeof source>) {
  let processed: string;
  try {
    processed = await page.data.getText("processed");
  } catch {
    processed = page.data.description ?? "";
  }

  return `# ${page.data.title}

${processed}`;
}
