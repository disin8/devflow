import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata, breadcrumbSchema, softwareApplicationSchema } from "@/lib/seo";
import { keywordsFor } from "@/lib/keywords";
import { getNpmProof } from "@/lib/proof";
import { absoluteUrl, GITHUB_RELEASES_URL, NPM_URL } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "DevFlow CLI Changelog — Every Release",
  description:
    "Every published version of create-devflow with the changes in each release, plus the versioning policy and the migration guide.",
  path: "/changelog",
  keywords: keywordsFor("/changelog"),
  type: "article",
});

interface Release {
  version: string;
  date: string | null;
  body: string;
}

const CHANGELOG_PATH = join(process.cwd(), "..", "..", "CHANGELOG.md");

function readChangelog(): { releases: Release[]; unreleased: string | null } {
  let raw = "";
  try {
    raw = readFileSync(CHANGELOG_PATH, "utf-8");
  } catch {
    return { releases: [], unreleased: null };
  }

  const lines = raw.split("\n");
  const releases: Release[] = [];
  let unreleased: string | null = null;
  let current: Release | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) {
      current.body = buffer.join("\n").trim();
      releases.push(current);
    }
    buffer = [];
  };

  for (const line of lines) {
    const versionMatch = /^##\s+v?(\d+\.\d+\.\d+(?:-[\w.]+)?)\s*$/.exec(line);
    const unreleasedMatch = /^##\s+\.\.\.(\w+)\s*$/.exec(line);

    if (versionMatch) {
      flush();
      current = { version: versionMatch[1], date: null, body: "" };
      continue;
    }

    if (unreleasedMatch) {
      flush();
      current = null;
      unreleased = unreleasedMatch[1];
      continue;
    }

    buffer.push(line);
  }

  flush();

  return { releases: releases.filter((release) => release.body.length > 0), unreleased };
}

export default async function ChangelogPage() {
  const npm = await getNpmProof();
  const { releases } = readChangelog();

  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Changelog", url: absoluteUrl("/changelog") },
    ]),
    softwareApplicationSchema({ version: npm?.version }),
  ];

  return (
    <DocsPage>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <DocsTitle>Changelog</DocsTitle>
      <DocsDescription>
        Every published version of <code>create-devflow</code>. The project
        follows{" "}
        <a href="https://semver.org/spec/v2.0.0.html" target="_blank" rel="noopener noreferrer">
          Semantic Versioning
        </a>
        , and the history is generated from the commit log.
      </DocsDescription>
      <DocsBody>
        <div className="not-prose my-6 flex flex-wrap items-center gap-3">
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 font-roboto-mono text-[14px] text-foreground transition-colors hover:border-accent/40"
          >
            All versions on npm
          </a>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 font-roboto-mono text-[14px] text-foreground transition-colors hover:border-accent/40"
          >
            GitHub releases
          </a>
        </div>

        {releases.length === 0 ? (
          <p>The changelog is generated at release time and is not available in this build.</p>
        ) : (
          <div className="not-prose my-6 flex flex-col gap-6">
            {releases.map((release) => (
              <article key={release.version} className="rounded-2xl border border-line p-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-archivo text-[24px] text-foreground">v{release.version}</h2>
                  {npm?.version === release.version && (
                    <span className="font-roboto-mono text-[11px] uppercase tracking-wide text-accent">
                      Latest
                    </span>
                  )}
                </div>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-[14px] leading-relaxed text-muted">
                  <code>{release.body}</code>
                </pre>
              </article>
            ))}
          </div>
        )}

        <h2 id="versioning">Versioning policy</h2>
        <ul>
          <li>
            <strong>Patch</strong> — a fix that does not change any generated
            file. Existing repositories need no action.
          </li>
          <li>
            <strong>Minor</strong> — a new module, a new flag, or a new
            generated file. Existing repositories are unaffected unless you run
            the new module.
          </li>
          <li>
            <strong>Major</strong> — a change to the content of a file that is
            already generated. This has not happened yet: the project is still
            at 0.1.x.
          </li>
        </ul>
        <p>
          Because generated files are never overwritten, a major release would
          never silently change your repository. The{" "}
          <a href="/docs/dry-run">dry run</a> mode shows exactly what a version
          would do before you apply it.
        </p>

        <h2 id="migration">Migration guide</h2>
        <p>
          Upgrading is the same as installing: the CLI is not installed into
          your repository, it is run against it.
        </p>
        <pre>
          <code>{`# 1. preview the change
npx create-devflow --all --dry-run

# 2. apply only what is missing
npx create-devflow --all --yes`}</code>
        </pre>
        <p>
          Files that already exist are left alone, so upgrading the CLI never
          rewrites a configuration you have since edited. If a new version
          changes the content of a file it generates, the migration is listed
          below.
        </p>
        <div className="not-prose my-6 flex flex-col gap-4">
          <article className="rounded-2xl border border-line p-5">
            <h3 className="font-roboto-mono text-[15px] font-medium text-foreground">
              0.1.0 → 0.1.1
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-muted">
              <li>
                <code className="font-roboto-mono text-[13px] text-accent">--ci</code>{" "}
                now accepts a provider and generates the matching workflow. It
                was accepted but ignored before this release.
              </li>
              <li>
                <code className="font-roboto-mono text-[13px] text-accent">--version</code>{" "}
                now reports the published version instead of a hardcoded
                placeholder.
              </li>
              <li>
                The generated GitHub Actions workflow now invokes scripts with
                an explicit <code>run</code> and no longer caches a Bun
                project, because <code>bun build</code> is Bun&rsquo;s bundler
                rather than the build script.
              </li>
            </ul>
            <p className="mt-3 text-[13px] text-muted">
              No action is required: the affected files are only written if
              they do not exist yet.
            </p>
          </article>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
