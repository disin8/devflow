import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  code?: string;
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

const CONTEXT = "https://schema.org";

export function organizationSchema() {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/og-image.webp"),
      width: 1200,
      height: 630,
    },
    description:
      "Maintainers of DevFlow CLI, an open-source tool that generates ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configurations for TypeScript and JavaScript projects.",
    sameAs: [
      "https://github.com/disin8/devflow",
      "https://www.npmjs.com/package/create-devflow",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function softwareApplicationSchema(options?: {
  version?: string;
  description?: string;
  featureList?: string[];
}) {
  return {
    "@context": CONTEXT,
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "DevFlow CLI",
    alternateName: "create-devflow",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Command Line Interface",
    operatingSystem: "macOS, Linux, Windows (WSL2)",
    url: SITE_URL,
    downloadUrl: "https://www.npmjs.com/package/create-devflow",
    installUrl: "https://www.npmjs.com/package/create-devflow",
    softwareVersion: options?.version ?? "latest",
    softwareRequirements: "Node.js >= 18.0.0",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    description:
      options?.description ??
      "DevFlow CLI generates reproducible developer workflows for TypeScript, React, Node.js and monorepos: ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configuration in one command.",
    author: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: options?.featureList,
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function howToSchema(options: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}) {
  return {
    "@context": CONTEXT,
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    totalTime: options.totalTime,
    step: options.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.code ? `${SITE_URL}/cli#${slugify(step.name)}` : undefined,
    })),
  };
}

export function breadcrumbSchema(entries: BreadcrumbEntry[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };
}

export function techArticleSchema(options: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    "@context": CONTEXT,
    "@type": "TechArticle",
    headline: options.headline,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    articleSection: options.section,
    keywords: options.keywords?.join(", "),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": options.url },
  };
}

export function itemListSchema(options: {
  name: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: options.name,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ogImageUrl(title?: string) {
  const url = absoluteUrl(
    title ? `/og?title=${encodeURIComponent(title)}` : "/og",
  );

  return {
    url,
    width: 1200,
    height: 630,
    alt: title
      ? `${title} — DevFlow CLI`
      : "DevFlow CLI — a terminal showing npx create-devflow generating ESLint, Prettier, Husky, Vitest and GitHub Actions configuration",
  };
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const url = absoluteUrl(input.path);
  const image = ogImageUrl(input.title);

  return {
    title: { absolute: input.title },
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image.url],
    },
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
