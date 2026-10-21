import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { modulesSource } from "@/lib/source";
import { LandingPage } from "@/components/landing-page";
import {
  landingBreadcrumbs,
  landingFaq,
  landingFaqSchema,
  landingMetadata,
  landingTitle,
} from "@/lib/landing";
import { absoluteUrl } from "@/lib/site";
import { techArticleSchema, softwareApplicationSchema } from "@/lib/seo";
import { MODULE_MAP } from "@/lib/modules";

function getSlugKey(slug?: string[]): string {
  if (!slug || slug.length === 0) return "index";
  return slug.join("/");
}

export async function generateStaticParams() {
  return modulesSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = modulesSource.getPage(params.slug);
  if (!page) notFound();

  const path = params.slug?.length ? `/modules/${params.slug.join("/")}` : "/modules";
  const moduleInfo = MODULE_MAP.get(params.slug?.[0] ?? "");

  return landingMetadata({
    title: landingTitle(path, page.data.title),
    description: page.data.description ?? "",
    path,
    faq: landingFaq(path),
    section: moduleInfo ? moduleInfo.categoryLabel : undefined,
  });
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = modulesSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const slug = getSlugKey(params.slug);
  const path = params.slug?.length ? `/modules/${params.slug.join("/")}` : "/modules";
  const moduleInfo = MODULE_MAP.get(params.slug?.[0] ?? "");

  const breadcrumbs = landingBreadcrumbs([
    { name: "Modules", url: absoluteUrl("/modules") },
    ...(params.slug?.length
      ? [
          {
            name: page.data.title,
            url: absoluteUrl(path),
          },
        ]
      : []),
  ]);

  const jsonLd: unknown[] = [
    breadcrumbs,
    techArticleSchema({
      headline: page.data.title,
      description: page.data.description ?? "",
      url: absoluteUrl(path),
      section: moduleInfo?.categoryLabel,
    }),
    softwareApplicationSchema(),
  ];

  const faq = landingFaq(path);
  const faqSchema = landingFaqSchema(faq);
  if (faqSchema) jsonLd.push(faqSchema);

  return (
    <LandingPage
      title={page.data.title}
      description={page.data.description ?? ""}
      toc={page.data.toc}
      full={page.data.full}
      body={MDX}
      link={createRelativeLink(modulesSource, page)}
      jsonLd={jsonLd}
    />
  );
}
