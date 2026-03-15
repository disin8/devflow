import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

const BASE_URL = "https://dev-flow.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.url === "/docs" ? 0.9 : 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docPages,
  ];
}
