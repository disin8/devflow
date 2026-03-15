import { docs } from "fumadocs-mdx:collections/server";
import { InferPageType, loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
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
