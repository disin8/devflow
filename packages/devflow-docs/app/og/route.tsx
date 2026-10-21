import { renderOgImage, OG_WIDTH, OG_HEIGHT } from "@/lib/og-image";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? undefined;

  const response = renderOgImage({ title });

  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
  response.headers.set("Content-Type", "image/png");
  response.headers.set("X-Image-Width", String(OG_WIDTH));
  response.headers.set("X-Image-Height", String(OG_HEIGHT));

  return response;
}
