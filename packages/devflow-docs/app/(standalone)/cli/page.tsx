import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { CopyCommand } from "@/components/copy-command";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { buildPageMetadata, faqSchema, howToSchema, softwareApplicationSchema } from "@/lib/seo";
import { faqsFor } from "@/lib/faqs";
import { keywordsFor } from "@/lib/keywords";
import { getNpmProof } from "@/lib/proof";
import { MODULES, moduleCommand } from "@/lib/modules";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "DevFlow CLI — Commands, Flags and Examples",
  description:
    "Full DevFlow CLI reference: every flag, its default and an example. Preview with --dry-run, use --all for a preset, --only for one tool.",
  path: "/cli",
  keywords: keywordsFor("/cli"),
  type: "article",
});

const FLAGS: { flag: string; description: string; example?: string }[] = [
  {
    flag: "--dry-run",
    description: "Prints the execution plan and writes nothing to disk.",
    example: "npx create-devflow --dry-run",
  },
  {
    flag: "--all",
    description:
      "Applies the recommended preset for the detected stack, without opening the wizard.",
    example: "npx create-devflow --all",
  },
  {
    flag: "--only <module>",
    description:
      "Applies a single module by id. Unknown ids exit with an error and print the valid list.",
    example: "npx create-devflow --only vitest",
  },
  {
    flag: "-y, --yes",
    description: "Skips the confirmation prompt.",
    example: "npx create-devflow --all --yes",
  },
  {
    flag: "--skip-install",
    description:
      "Generates the files and scripts but does not install the packages.",
    example: "npx create-devflow --only eslint --skip-install",
  },
  {
    flag: "--pm <manager>",
    description:
      "Forces the package manager: npm, pnpm, yarn or bun. Overrides the detected value.",
    example: "npx create-devflow --pm pnpm",
  },
  {
    flag: "--ci <provider>",
    description:
      "Selects the CI provider: github, gitlab or both. Generates the matching workflow.",
    example: "npx create-devflow --ci github",
  },
  {
    flag: "--scope <pattern>",
    description:
      "Workspace glob pattern used when generating monorepo configuration.",
    example: 'npx create-devflow --only workspaces --scope "packages/*"',
  },
  {
    flag: "--verbose",
    description: "Prints debug output, including skipped files.",
    example: "npx create-devflow --dry-run --verbose",
  },
  {
    flag: "-h, --help",
    description: "Prints the help message.",
  },
  {
    flag: "-V, --version",
    description: "Prints the installed version.",
  },
];

const SHORTCUTS: { flag: string; modules: string }[] = [
  { flag: "--husky", modules: "husky, lint-staged, commitlint" },
  { flag: "--lint", modules: "eslint, prettier, editorconfig" },
  { flag: "--test", modules: "vitest" },
  { flag: "--docker", modules: "dockerfile, docker-compose, dockerignore" },
  { flag: "--docs", modules: "readme, contributing, code-of-conduct, security-md, license" },
  { flag: "--security", modules: "audit, gitleaks" },
  { flag: "--release <tool>", modules: "release-it, changesets or semantic-release" },
];

const EXAMPLES: { title: string; command: string; body: string }[] = [
  {
    title: "Preview everything before it happens",
    command: "npx create-devflow --dry-run",
    body: "Prints the files to create, the packages to install and the scripts to add, then exits. Nothing is written and no package is installed.",
  },
  {
    title: "Set up the recommended workflow",
    command: "npx create-devflow --all --yes",
    body: "Applies the recommended preset for the detected stack. The flag combination also skips the confirmation prompt, which is what you want in a bootstrap script.",
  },
  {
    title: "Add only GitHub Actions",
    command: "npx create-devflow --only github-actions",
    body: "Generates .github/workflows/ci.yml and nothing else. The workflow calls the lint, typecheck, test and build scripts, so those modules have to exist in your project.",
  },
  {
    title: "Add linting and Git hooks",
    command: "npx create-devflow --lint --husky",
    body: "ESLint, Prettier and EditorConfig, plus Husky, lint-staged and Commitlint. This is the combination most React and TypeScript projects want.",
  },
  {
    title: "Force pnpm and GitHub Actions",
    command: "npx create-devflow --ci github --pm pnpm",
    body: "Generates a GitHub Actions workflow that installs with pnpm and caches the pnpm store, even if the lock file is missing.",
  },
  {
    title: "Generate files without installing anything",
    command: "npx create-devflow --only eslint --skip-install",
    body: "Writes eslint.config.mjs and adds the lint scripts, but leaves the dependency installation to you. The summary lists the packages you still need.",
  },
];

const COMPATIBILITY = [
  {
    stack: "Next.js",
    eslint: "typescript-eslint, react, react-hooks",
    vitest: "jsdom",
    testingLibrary: "@testing-library/react",
  },
  {
    stack: "React",
    eslint: "typescript-eslint, react, react-hooks",
    vitest: "jsdom",
    testingLibrary: "@testing-library/react",
  },
  {
    stack: "Nuxt",
    eslint: "typescript-eslint, vue",
    vitest: "jsdom",
    testingLibrary: "@testing-library/vue",
  },
  {
    stack: "Vue",
    eslint: "typescript-eslint, vue",
    vitest: "jsdom",
    testingLibrary: "@testing-library/vue",
  },
  {
    stack: "NestJS",
    eslint: "typescript-eslint",
    vitest: "node (not in the recommended preset)",
    testingLibrary: "—",
  },
  {
    stack: "Node.js",
    eslint: "typescript-eslint",
    vitest: "node",
    testingLibrary: "—",
  },
  {
    stack: "SvelteKit",
    eslint: "typescript-eslint",
    vitest: "node",
    testingLibrary: "—",
  },
];

const HOW_TO = [
  {
    name: "Preview the plan",
    text: "Run the CLI with --dry-run to print every file, package and script it would change without writing anything.",
    code: "npx create-devflow --dry-run",
  },
  {
    name: "Apply the modules you need",
    text: "Run the wizard with no flags, use --all for the recommended preset, or use --only and the module shortcuts to pick modules individually.",
    code: "npx create-devflow --only vitest",
  },
  {
    name: "Review the result",
    text: "Every generated file is plain configuration committed to your repository. Read the diff, then edit anything that does not match your house style.",
  },
];

export default async function CliPage() {
  const npm = await getNpmProof();
  const faqs = faqsFor("/cli");

  const jsonLd = [
    softwareApplicationSchema({ version: npm?.version }),
    faqSchema(faqs),
    howToSchema({
      name: "Configure a developer workflow with DevFlow CLI",
      description:
        "Preview, apply and review the developer workflow configuration generated by DevFlow CLI.",
      steps: HOW_TO,
    }),
  ];

  return (
    <DocsPage>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <DocsTitle>DevFlow CLI — Commands, Flags and Examples</DocsTitle>
      <DocsDescription>
        Every flag the CLI accepts, what it does and an example you can paste.
        The list below matches the implementation in the repository — no flag is
        documented here that does not exist.
      </DocsDescription>
      <DocsBody>
        <h2 id="synopsis">Synopsis</h2>
        <pre>
          <code>{`devflow [options]
create-devflow [options]
npx create-devflow [options]`}</code>
        </pre>

        <h2 id="install">Install and run</h2>
        <p>
          No installation is required — <code>npx</code> fetches the latest
          published version. To pin a version in a project, add it as a
          development dependency.
        </p>
        <div className="not-prose my-6 flex flex-col gap-3">
          <CopyCommand command="npx create-devflow" />
          <CopyCommand command="npm install -D create-devflow" />
          <CopyCommand command="pnpm dlx create-devflow" />
          <CopyCommand command="yarn dlx create-devflow" />
          <CopyCommand command="bunx create-devflow" />
        </div>
        <p>
          Requirements: Node.js 18, 20 or 22, and a project with a{" "}
          <code>package.json</code>. The{" "}
          <Link href="/docs/installation">installation guide</Link> has the
          details.
        </p>

        <h2 id="flags">All flags</h2>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-card">
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Flag
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Description
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              {FLAGS.map((flag, index) => (
                <tr
                  key={flag.flag}
                  className={index % 2 === 0 ? "bg-page" : "bg-surface"}
                >
                  <td className="px-4 py-3 align-top font-roboto-mono text-[13px] text-accent whitespace-nowrap">
                    {flag.flag}
                  </td>
                  <td className="px-4 py-3 align-top text-[14px] text-muted">
                    {flag.description}
                  </td>
                  <td className="px-4 py-3 align-top font-roboto-mono text-[12px] text-muted">
                    {flag.example ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="shortcuts">Module shortcuts</h2>
        <p>
          These flags skip the wizard and expand to the modules they own. They
          can be combined with each other and with the flags above.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-card">
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Flag
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Applies
                </th>
              </tr>
            </thead>
            <tbody>
              {SHORTCUTS.map((shortcut, index) => (
                <tr
                  key={shortcut.flag}
                  className={index % 2 === 0 ? "bg-page" : "bg-surface"}
                >
                  <td className="px-4 py-3 align-top font-roboto-mono text-[13px] text-accent whitespace-nowrap">
                    {shortcut.flag}
                  </td>
                  <td className="px-4 py-3 align-top font-roboto-mono text-[12px] text-muted">
                    {shortcut.modules}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="examples">Examples</h2>
        <div className="not-prose my-6 flex flex-col gap-4">
          {EXAMPLES.map((example) => (
            <div key={example.command} className="rounded-2xl border border-line p-5">
              <h3 className="font-roboto-mono text-[15px] font-medium text-foreground">
                {example.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {example.body}
              </p>
              <div className="mt-4">
                <CopyCommand command={example.command} />
              </div>
            </div>
          ))}
        </div>

        <h2 id="modules">Every module id</h2>
        <p>
          The <code>--only</code> flag accepts any of these ids. The{" "}
          <Link href="/modules">module pages</Link> list the exact files,
          packages and scripts each one produces.
        </p>
        <div className="not-prose my-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => (
            <Link
              key={module.id}
              href={module.landingPage ?? "/modules"}
              className="rounded-xl border border-line px-4 py-3 font-roboto-mono text-[13px] text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            >
              {module.id}
            </Link>
          ))}
        </div>
        <p className="not-prose">
          Example:{" "}
          <code className="font-roboto-mono text-[13px] text-accent">
            {moduleCommand("vitest")}
          </code>
        </p>

        <h2 id="compatibility">Compatibility matrix</h2>
        <p>
          What each stack gets, and which package managers and CI providers are
          supported. The matrix reflects the module implementations, not an
          aspiration.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-card">
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Stack
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  ESLint plugins
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Vitest env
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Testing Library
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPATIBILITY.map((row, index) => (
                <tr
                  key={row.stack}
                  className={index % 2 === 0 ? "bg-page" : "bg-surface"}
                >
                  <td className="px-4 py-3 align-top font-roboto-mono text-[13px] text-foreground whitespace-nowrap">
                    {row.stack}
                  </td>
                  <td className="px-4 py-3 align-top font-roboto-mono text-[12px] text-muted">
                    {row.eslint}
                  </td>
                  <td className="px-4 py-3 align-top font-roboto-mono text-[12px] text-muted">
                    {row.vitest}
                  </td>
                  <td className="px-4 py-3 align-top font-roboto-mono text-[12px] text-muted">
                    {row.testingLibrary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line p-5">
            <h3 className="font-roboto-mono text-[15px] font-medium text-foreground">
              Package managers
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-muted">
              <li>
                <strong className="text-foreground">npm</strong> — supported.
                `npm ci`, `npm run`, `npm audit --audit-level=high`.
              </li>
              <li>
                <strong className="text-foreground">pnpm</strong> — supported.
                Corepack, `pnpm install --frozen-lockfile`, `pnpm run`.
              </li>
              <li>
                <strong className="text-foreground">yarn</strong> — supported.
                Corepack, `yarn install --frozen-lockfile`, `yarn run`.
              </li>
              <li>
                <strong className="text-foreground">bun</strong> — supported.
                `bun install --frozen-lockfile`, `bun run`. No dependency cache
                in the generated workflow, because Bun is installed by its own
                action.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <h3 className="font-roboto-mono text-[15px] font-medium text-foreground">
              CI providers
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-muted">
              <li>
                <strong className="text-foreground">GitHub Actions</strong> —
                supported. Generated as `.github/workflows/ci.yml`.
              </li>
              <li>
                <strong className="text-foreground">GitLab CI</strong> —
                supported. Generated as `.gitlab-ci.yml`.
              </li>
              <li>
                <strong className="text-foreground">Both</strong> — supported.
                `--ci both` writes the two workflow files.
              </li>
              <li>
                <strong className="text-foreground">Other providers</strong> —
                not generated. The workflow is a plain YAML file, so it can be
                translated by hand.
              </li>
            </ul>
          </div>
        </div>

        <h2 id="exit-codes">Exit codes</h2>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[420px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-card">
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Code
                </th>
                <th className="px-4 py-3 font-roboto-mono text-[13px] font-medium text-muted">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-page">
                <td className="px-4 py-3 font-roboto-mono text-[13px] text-accent">0</td>
                <td className="px-4 py-3 text-[14px] text-muted">
                  The plan was applied successfully.
                </td>
              </tr>
              <tr className="bg-surface">
                <td className="px-4 py-3 font-roboto-mono text-[13px] text-accent">1</td>
                <td className="px-4 py-3 text-[14px] text-muted">
                  An unknown module id, an unknown release tool or an unknown CI
                  provider was passed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="faq">FAQ</h2>
        <div className="not-prose my-6 flex flex-col divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-6 py-5 max-sm:px-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-roboto-mono text-[15px] text-foreground">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[20px] leading-none text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <h2 id="see-also">See also</h2>
        <ul>
          <li>
            <Link href="/docs/dry-run">Dry run mode</Link> — what the preview
            output means
          </li>
          <li>
            <Link href="/docs/presets">Presets</Link> — what{" "}
            <code>--all</code> applies
          </li>
          <li>
            <Link href="/docs/configuration">Configuration</Link> — how the
            stack and package manager are detected
          </li>
          <li>
            <Link href="/modules">Module catalogue</Link> — what every module
            generates
          </li>
        </ul>
      </DocsBody>
    </DocsPage>
  );
}
