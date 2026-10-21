import defaultMdxComponents from "fumadocs-ui/mdx";
import { Heading } from "fumadocs-ui/components/heading";
import { Link as AnchorIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Fumadocs renders every heading as `<hN id><a href="#id">…</a></hN>`.
 * When the heading itself is a link (a guide title, for example) that produces
 * `<a><a></a></a>`, which is invalid HTML and breaks hydration.
 *
 * When the heading already contains a single link, render the heading without
 * the anchor wrapper and keep only the small anchor icon next to it.
 */
function AutoHeading({
  as,
  children,
  ...props
}: { as: HeadingTag } & ComponentProps<"h3">) {
  const list = Array.isArray(children) ? children : [children];
  const only = list.length === 1 ? list[0] : null;
  const href =
    only && typeof only === "object" && only !== null && "props" in only
      ? (only.props as { href?: string }).href
      : undefined;

  if (!href) {
    return (
      <Heading as={as} {...props}>
        {children}
      </Heading>
    );
  }

  const As = as;
  return (
    <As
      {...props}
      className={`flex scroll-m-28 flex-row items-center gap-2 ${props.className ?? ""}`}
    >
      {children}
      <a
        href={`#${props.id}`}
        aria-hidden="true"
        className="size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity hover:opacity-100"
      >
        <AnchorIcon />
      </a>
    </As>
  );
}

function heading(as: HeadingTag) {
  return function HeadingComponent(props: ComponentProps<"h3">) {
    return <AutoHeading as={as} {...props} />;
  };
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    h1: heading("h1"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),
    ...components,
  };
}
