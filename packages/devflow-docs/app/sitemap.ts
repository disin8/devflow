import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

const BASE_URL = "https://dev-flow.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docPages: MetadataRoute.Sitemap = pages
    .filter((page) => page.url !== "/docs")
    .map((page) => ({
      url: `${BASE_URL}${page.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/builder`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...docPages,
  ];
}
