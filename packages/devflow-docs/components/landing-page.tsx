import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { getMDXComponents } from "@/mdx-components";
import { JsonLd } from "./json-ld";
import type { ComponentProps, FC } from "react";

interface LandingPageProps {
  title: string;
  description: string;
  toc?: unknown;
  full?: boolean;
  body: React.ComponentType<{ components: ReturnType<typeof getMDXComponents> }>;
  link?: FC<ComponentProps<"a">>;
  jsonLd?: unknown[];
}

export function LandingPage({
  title,
  description,
  toc,
  full,
  body: MDX,
  link,
  jsonLd = [],
}: LandingPageProps) {
  return (
    <DocsPage toc={toc as never} full={full}>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents(
            link ? { a: link } : undefined,
          )}
        />
      </DocsBody>
    </DocsPage>
  );
}
