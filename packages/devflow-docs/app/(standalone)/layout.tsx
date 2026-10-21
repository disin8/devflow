import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { compareSource, guidesSource, modulesSource, source } from "@/lib/source";

type NavNode =
  | { type: "page"; name: string; url: string }
  | { type: "separator"; name: string }
  | { type: "folder"; name: string; children: NavNode[]; defaultOpen?: boolean };

function buildTree() {
  const children: NavNode[] = [
    { type: "page", name: "CLI reference", url: "/cli" },
    { type: "page", name: "Templates", url: "/templates" },
    { type: "page", name: "Changelog", url: "/changelog" },
    { type: "separator", name: "Documentation" },
    ...(source.getPageTree().children as NavNode[]),
    { type: "separator", name: "Modules" },
    ...(modulesSource.getPageTree().children as NavNode[]),
    { type: "separator", name: "Guides" },
    ...(guidesSource.getPageTree().children as NavNode[]),
    { type: "separator", name: "Comparisons" },
    ...(compareSource.getPageTree().children as NavNode[]),
  ];

  return { name: "DevFlow", children };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={buildTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
