import type { MetadataRoute } from "next";
import { compareSource, guidesSource, modulesSource, source } from "@/lib/source";
import { absoluteUrl } from "@/lib/site";
import { lastModifiedFor } from "@/lib/last-modified";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface Entry {
  url: string;
  baseUrl: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

const STATIC_ROUTES: Entry[] = [
  { url: "/", baseUrl: "/", priority: 1.0, changeFrequency: "weekly" },
  { url: "/cli", baseUrl: "/", priority: 0.9, changeFrequency: "weekly" },
  { url: "/templates", baseUrl: "/", priority: 0.8, changeFrequency: "weekly" },
  { url: "/builder", baseUrl: "/", priority: 0.6, changeFrequency: "monthly" },
  { url: "/changelog", baseUrl: "/", priority: 0.5, changeFrequency: "weekly" },
];

const EXCLUDED_PATHS = new Set(["/docs/cli-reference"]);

const COLLECTIONS: {
  pages: { url: string }[];
  baseUrl: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}[] = [
  { pages: source.getPages(), baseUrl: "/docs", priority: 0.8, changeFrequency: "weekly" },
  { pages: modulesSource.getPages(), baseUrl: "/modules", priority: 0.7, changeFrequency: "weekly" },
  { pages: guidesSource.getPages(), baseUrl: "/guides", priority: 0.7, changeFrequency: "weekly" },
  { pages: compareSource.getPages(), baseUrl: "/compare", priority: 0.7, changeFrequency: "monthly" },
];

function buildEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    entries.push({
      url: absoluteUrl(route.url),
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  for (const collection of COLLECTIONS) {
    for (const page of collection.pages) {
      if (EXCLUDED_PATHS.has(page.url)) continue;
      try {
        entries.push({
          url: absoluteUrl(page.url),
          lastModified: lastModifiedFor(collection.baseUrl, page.url),
          changeFrequency: collection.changeFrequency,
          priority: collection.priority,
        });
      } catch {
        entries.push({
          url: absoluteUrl(page.url),
          lastModified: new Date(),
          changeFrequency: collection.changeFrequency,
          priority: collection.priority,
        });
      }
    }
  }

  const seen = new Set<string>();
  const uniqueEntries: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    uniqueEntries.push(entry);
  }

  return uniqueEntries;
}

export async function GET() {
  const entries = buildEntries();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}