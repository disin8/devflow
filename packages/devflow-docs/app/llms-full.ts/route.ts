import { compareSource, guidesSource, modulesSource, source } from "@/lib/source";
import { SITE_URL } from "@/lib/site";

export const revalidate = false;

interface TextPage {
  url: string;
  data: {
    title: string;
    description?: string;
    getText: (type: "raw" | "processed") => Promise<string>;
  };
}

async function render(page: TextPage): Promise<string> {
  let processed = "";
  try {
    processed = await page.data.getText("processed");
  } catch {
    processed = page.data.description ?? "";
  }

  return `# ${page.data.title}\n\nSource: ${SITE_URL}${page.url}\n\n${processed}`;
}

export async function GET() {
  const pages: TextPage[] = [
    ...(source.getPages() as unknown as TextPage[]),
    ...(modulesSource.getPages() as unknown as TextPage[]),
    ...(guidesSource.getPages() as unknown as TextPage[]),
    ...(compareSource.getPages() as unknown as TextPage[]),
  ];

  const rendered = await Promise.all(pages.map(render));

  return new Response(rendered.join("\n\n---\n\n"));
}
