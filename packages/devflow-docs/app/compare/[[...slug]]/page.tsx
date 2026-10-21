import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { compareSource } from "@/lib/source";
import { LandingPage } from "@/components/landing-page";
import {
  landingBreadcrumbs,
  landingFaq,
  landingFaqSchema,
  landingMetadata,
  landingTitle,
} from "@/lib/landing";
import { absoluteUrl } from "@/lib/site";
import { softwareApplicationSchema, techArticleSchema } from "@/lib/seo";

export async function generateStaticParams() {
  return compareSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = compareSource.getPage(params.slug);
  if (!page) notFound();

  const path = params.slug?.length
    ? `/compare/${params.slug.join("/")}`
    : "/compare";

  return landingMetadata({
    title: landingTitle(path, page.data.title),
    description: page.data.description ?? "",
    path,
    faq: landingFaq(path),
    section: "Comparisons",
  });
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = compareSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const path = params.slug?.length
    ? `/compare/${params.slug.join("/")}`
    : "/compare";

  const breadcrumbs = landingBreadcrumbs([
    { name: "Comparisons", url: absoluteUrl("/compare") },
    ...(params.slug?.length
      ? [{ name: page.data.title, url: absoluteUrl(path) }]
      : []),
  ]);

  const jsonLd: unknown[] = [
    breadcrumbs,
    techArticleSchema({
      headline: page.data.title,
      description: page.data.description ?? "",
      url: absoluteUrl(path),
      section: "Comparisons",
    }),
    softwareApplicationSchema(),
  ];

  const faqSchema = landingFaqSchema(landingFaq(path));
  if (faqSchema) jsonLd.push(faqSchema);

  return (
    <LandingPage
      title={page.data.title}
      description={page.data.description ?? ""}
      toc={page.data.toc}
      full={page.data.full}
      body={MDX}
      link={createRelativeLink(compareSource, page)}
      jsonLd={jsonLd}
    />
  );
}
