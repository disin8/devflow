import { Star, GitBranch, Shield, Terminal, Package, Clock } from "lucide-react";
import Link from "next/link";
import { getProjectProof, formatDate, formatNumber } from "@/lib/proof";
import { GITHUB_URL, NPM_URL, LICENSE, SUPPORTED_NODE_VERSIONS } from "@/lib/site";

export async function ProofBar() {
  const proof = await getProjectProof();
  const npm = proof.npm;
  const github = proof.github;

  const items = [
    {
      icon: Package,
      label: "Latest release",
      value: npm?.version ? `v${npm.version}` : "—",
      href: NPM_URL,
      sub: npm?.publishedAt ? `published ${formatDate(npm.publishedAt)}` : "on npm",
    },
    {
      icon: Terminal,
      label: "Downloads",
      value: npm ? formatNumber(npm.downloadsLastMonth) : "—",
      href: `${NPM_URL}`,
      sub: "last 30 days",
    },
    {
      icon: Shield,
      label: "License",
      value: LICENSE,
      href: `${GITHUB_URL}/blob/main/LICENSE`,
      sub: "security policy published",
    },
    {
      icon: GitBranch,
      label: "Source",
      value: "GitHub",
      href: GITHUB_URL,
      sub: github?.pushedAt ? `updated ${formatDate(github.pushedAt)}` : "open source",
    },
    {
      icon: Clock,
      label: "Node.js",
      value: SUPPORTED_NODE_VERSIONS.join(" · "),
      href: "/docs/installation",
      sub: "npm, pnpm, yarn, bun",
    },
  ];

  return (
    <section className="px-10 max-md:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-line bg-card px-8 py-7 max-md:px-5 max-md:py-6 mt-8">
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {items.map((item) => (
              <li key={item.label} className="flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-2 font-roboto-mono text-[12px] uppercase tracking-wide text-muted">
                  <item.icon size={13} className="text-accent" />
                  {item.label}
                </span>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-roboto-mono text-[17px] font-medium text-foreground hover:text-accent transition-colors"
                >
                  {item.value}
                </a>
                <span className="text-[12px] text-muted">{item.sub}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Star size={11} className="text-accent" />
              {github
                ? `${formatNumber(github.stars)} stars · ${formatNumber(github.forks)} forks · ${formatNumber(github.openIssues)} open issues on GitHub.`
                : "Source, issues and releases are public on GitHub."}
            </span>
            <a
              href={`${GITHUB_URL}/actions/workflows/ci.yml/badge.svg`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <span className="inline-block h-4 w-4 rounded-full border border-line bg-page" />
              CI runs on every pull request
            </a>
            <a
              href={`${GITHUB_URL}/blob/main/SECURITY.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Security policy
            </a>
            <Link
              href="/changelog"
              className="transition-colors hover:text-foreground"
            >
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
