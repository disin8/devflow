import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound, permanentRedirect } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { buildPageMetadata, breadcrumbSchema, faqSchema, techArticleSchema } from '@/lib/seo';
import { faqsFor } from '@/lib/faqs';
import { keywordsFor } from '@/lib/keywords';
import { JsonLd } from '@/components/json-ld';

const BASE_URL = 'https://dev-flow.xyz';

interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
}

const PAGE_SEO_MAP: Record<string, PageSEO> = {
  '': {
    title: 'DevFlow Docs — Modules, Wizard and CLI Reference',
    description:
      'Reference for DevFlow CLI: install it, run the wizard, choose a preset, preview changes with --dry-run and read the full flag list.',
    keywords: [
      'devflow documentation',
      'create-devflow getting started',
      'how to automate nodejs project setup',
      'nodejs project configuration guide',
      'javascript tooling setup tutorial',
      'developer workflow setup guide',
    ],
  },
  installation: {
    title: 'Install DevFlow CLI — npx, npm, pnpm, yarn, bun',
    description:
      'Install DevFlow CLI with npx, npm, pnpm, yarn or bun. Node.js 18, 20 and 22 are supported. One command to set up your workflow.',
    keywords: [
      'npx create-devflow install',
      'how to install devflow cli',
      'npm install create-devflow globally',
      'pnpm dlx create-devflow',
      'bunx create-devflow',
      'yarn dlx create-devflow',
      'create-devflow node 18 requirements',
      'install developer workflow cli',
    ],
  },
  'quick-start': {
    title: 'DevFlow Quick Start — 2-Minute Workflow Setup',
    description:
      'Run npx create-devflow, follow the wizard and generate ESLint, Prettier, Husky, Vitest, GitHub Actions and Docker config.',
    keywords: [
      'how to set up dev workflow in 2 minutes',
      'bootstrap javascript project workflow',
      'scaffold git hooks linting testing ci cd',
      'npx create-devflow getting started',
      'interactive nodejs project wizard',
      'set up eslint prettier husky one command',
      'automate project configuration nodejs',
    ],
  },
  configuration: {
    title: 'DevFlow Configuration — How Detection Works',
    description:
      'How DevFlow detects your package manager, TypeScript, stack and monorepo layout, and which CLI flags override the result.',
    keywords: [
      'devflow auto detect project stack',
      'detect pnpm yarn npm bun automatically',
      'detect typescript project cli',
      'detect react nextjs vue nestjs stack',
      'detect monorepo nx turborepo',
      'override package manager cli flag',
      'nodejs project context detection',
    ],
  },
  presets: {
    title: 'DevFlow Presets — Minimal, Recommended and Full',
    description:
      'Skip the wizard with a DevFlow preset. Minimal, Recommended or Full — each one adapted to the detected stack, with the exact modules and files it adds.',
    keywords: [
      'devflow preset minimal recommended full',
      'skip setup wizard use preset',
      'devflow --all flag preset',
      'one command full dev setup',
      'recommended nodejs project config',
      'react preset devflow',
      'nextjs preset devflow',
    ],
  },
  'dry-run': {
    title: 'DevFlow Dry Run — Preview Every Change First',
    description:
      'Use --dry-run to see every file DevFlow would create, every package it would install and every script it would add.',
    keywords: [
      'devflow --dry-run preview',
      'preview cli changes before applying',
      'test devflow without modifying project',
      'see what devflow will do',
      'safe cli dry run mode',
      'preview files packages scripts devflow',
    ],
  },
  'cli-reference': {
    title: 'DevFlow CLI Reference — All Commands and Flags',
    description:
      'Complete DevFlow CLI reference: every command, flag and option, with defaults and examples. Use --husky, --lint, --ci, --docker, --all and more to skip the interactive wizard.',
    keywords: [
      'devflow cli flags list',
      'create-devflow command options',
      'devflow --husky flag',
      'devflow --lint flag',
      'devflow --ci github flag',
      'devflow --docker flag',
      'devflow --all flag',
      'devflow --yes non-interactive',
      'devflow --pm package manager flag',
      'devflow command line reference',
    ],
  },
  wizard: {
    title: 'DevFlow Interactive Wizard — Step-by-Step Guide',
    description:
      'How the DevFlow interactive wizard works: auto-detection, module selection, settings, and the execution plan before anything is applied.',
    keywords: [
      'devflow interactive wizard steps',
      'how does devflow wizard work',
      'select modules from cli',
      'devflow project setup steps',
      'auto detect stack wizard',
      'preview execution plan before install',
      'interactive cli dev setup tool',
    ],
  },
  'modules/index': {
    title: 'DevFlow Module Catalogue — 50 Modules',
    description:
      'Browse all 50 DevFlow modules: Git hooks, ESLint, Prettier, Biome, Vitest, Jest, Playwright, GitHub Actions, Docker, Turborepo, Nx, semantic-release and more.',
    keywords: [
      'devflow all modules list',
      'automate husky eslint prettier vitest github-actions docker',
      'nodejs dev tools setup list',
      'what can devflow install',
      'git hooks linting testing ci docker automation',
      'available devflow modules',
    ],
  },
  'modules/git': {
    title: 'Husky, Commitlint and lint-staged — DevFlow',
    description:
      'Set up Husky pre-commit hooks, lint-staged, Commitlint and Commitizen in a Node.js or TypeScript project. Enforce Conventional Commits with npx create-devflow.',
    keywords: [
      'how to add husky',
      'how to add husky to nodejs project',
      'husky pre-commit hook setup tutorial',
      'install husky lint-staged together',
      'how to configure lint-staged',
      'setup commitlint conventional commits',
      'enforce commit message format nodejs',
      'git commit hooks automation javascript',
      'add pre-commit hook to project',
      'husky prepare script package.json',
    ],
  },
  'modules/quality': {
    title: 'ESLint, Prettier and Biome — DevFlow Modules',
    description:
      'Set up ESLint, Prettier or Biome in a JavaScript project. DevFlow generates stack-aware flat configs for React, Vue and NestJS.',
    keywords: [
      'how to add eslint',
      'how to add eslint to nodejs project',
      'eslint flat config setup typescript',
      'setup prettier nodejs project',
      'eslint prettier together typescript',
      'react eslint rules configuration',
      'nextjs eslint setup',
      'nestjs eslint config generator',
      'biome vs eslint prettier replacement',
      'auto generate eslint.config.mjs',
      'eslint plugin react hooks setup',
      'typescript-eslint setup tutorial',
    ],
  },
  'modules/testing': {
    title: 'Vitest, Jest, Playwright, Cypress — DevFlow',
    description:
      'Add Vitest, Jest, Playwright, Cypress, Testing Library or MSW to a JavaScript project, with the configs and npm scripts.',
    keywords: [
      'how to setup vitest typescript',
      'vitest config ts generator',
      'add jest to typescript project',
      'jest vs vitest which to use',
      'playwright setup e2e testing nodejs',
      'cypress vs playwright which to choose',
      'testing library react setup',
      'msw mock service worker setup tutorial',
      'add test coverage to nodejs project',
      'vitest coverage v8 setup',
    ],
  },
  'modules/ci-cd': {
    title: 'GitHub Actions and GitLab CI — DevFlow Modules',
    description:
      'Generate GitHub Actions workflows, GitLab CI pipelines and Dependabot or Renovate configuration for Node.js projects.',
    keywords: [
      'how to add github actions',
      'how to add github actions to nodejs project',
      'github actions workflow yml generator',
      'github actions lint test build nodejs',
      'github actions pnpm setup',
      'github actions bun setup',
      'gitlab ci yml nodejs pipeline',
      'add dependabot to repository',
      'renovate bot vs dependabot comparison',
      'ci cd pipeline generator nodejs',
    ],
  },
  'modules/docker': {
    title: 'Dockerfile and docker-compose — DevFlow Modules',
    description:
      'Generate a multi-stage Dockerfile, docker-compose.yml and .dockerignore for a Node.js application, adapted to your package manager.',
    keywords: [
      'how to containerize nodejs app',
      'nodejs dockerfile multi-stage build',
      'next.js dockerfile best practice',
      'nestjs dockerfile generator',
      'pnpm dockerfile production',
      'docker-compose dev environment nodejs',
      'add .dockerignore to project',
      'generate dockerfile automatically',
    ],
  },
  'modules/releases': {
    title: 'release-it, Changesets, semantic-release — DevFlow',
    description:
      'Automate versioning, changelog generation and npm publishing with release-it, Changesets or semantic-release.',
    keywords: [
      'how to automate npm releases',
      'release-it setup configuration',
      'changesets monorepo versioning',
      'semantic versioning nodejs automatic',
      'auto generate CHANGELOG.md',
      'conventional changelog setup',
      'npm publish automation workflow',
      'release-it vs changesets comparison',
    ],
  },
  'modules/security': {
    title: 'npm audit, Gitleaks and Trivy — DevFlow Modules',
    description:
      'Add npm audit, Gitleaks secret detection, Trivy vulnerability scanning and OSV-Scanner to your project and its GitHub Actions pipeline with one command.',
    keywords: [
      'how to add security scanning to nodejs project',
      'npm audit github actions integration',
      'prevent committing api keys secrets',
      'gitleaks git secret detection setup',
      'trivy vulnerability scanner nodejs',
      'osv-scanner dependency check',
      'detect secrets in code repository',
      'add security step to ci pipeline',
    ],
  },
  'modules/monorepo': {
    title: 'Turborepo, Nx and pnpm Workspaces — DevFlow',
    description:
      'Configure Turborepo, Nx or pnpm and yarn workspaces for a monorepo, with a shared tsconfig.base.json and workspace scripts.',
    keywords: [
      'how to set up turborepo monorepo',
      'turborepo turbo.json configuration',
      'nx monorepo setup from scratch',
      'pnpm workspaces configuration tutorial',
      'yarn workspaces monorepo setup',
      'monorepo shared tsconfig.base.json',
      'turborepo vs nx comparison',
      'incremental build caching monorepo',
    ],
  },
  'modules/dx': {
    title: '.nvmrc, .env.example and VSCode — DevFlow',
    description:
      'Pin the Node.js version with .nvmrc, generate .env.example, configure VSCode settings and add Dev Container support.',
    keywords: [
      'how to pin nodejs version with nvmrc',
      'nvmrc vs volta node version manager',
      'create .env.example file automatically',
      'vscode settings.json project configuration',
      'vscode extensions.json recommended',
      'devcontainer setup tutorial',
      'dotenv example file generator',
    ],
  },
  'modules/docs': {
    title: 'README, CONTRIBUTING and LICENSE — DevFlow',
    description:
      'Generate README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md and LICENSE files for your project, with MIT, Apache-2.0 or a proprietary placeholder.',
    keywords: [
      'auto generate readme.md nodejs project',
      'readme template generator cli',
      'contributing.md template generator',
      'code of conduct template open source',
      'add license to github repository',
      'open source project documentation setup',
      'security.md template nodejs',
    ],
  },
  'architecture/overview': {
    title: 'DevFlow Architecture Overview — How It Works',
    description:
      "A deep dive into DevFlow's architecture: the context detection pipeline, the module system design, the executor and the plugin interface.",
    keywords: [
      'how devflow works internally',
      'devflow cli architecture',
      'nodejs cli tool internals',
      'module system design typescript',
      'cli tool plugin architecture',
      'devflow source code structure',
    ],
  },
  'architecture/context-detection': {
    title: 'DevFlow Context Detection — Stack Detection',
    description:
      'How DevFlow detects your stack, package manager, TypeScript configuration and monorepo layout, and which signal wins when two of them disagree.',
    keywords: [
      'how devflow detects project stack',
      'detect react nextjs vue nestjs from dependencies',
      'detect package manager from lock file',
      'detect typescript from tsconfig.json',
      'detect monorepo nx turborepo automatically',
    ],
  },
  'architecture/executor': {
    title: 'DevFlow Executor — The Plan Execution Engine',
    description:
      "How the DevFlow executor applies the action plan — file writes, package installations and script additions — and how dry-run intercepts them.",
    keywords: [
      'devflow executor engine',
      'cli action plan execution',
      'how cli writes files installs packages',
      'file write package install script add pipeline',
      'devflow plan apply mechanism',
    ],
  },
  'architecture/module-interface': {
    title: 'DevFlow Module Interface — Custom Modules',
    description:
      "A technical reference for the DevFlow module interface: how modules detect existing configuration, build action plans and join the wizard.",
    keywords: [
      'devflow module interface api',
      'devflowmodule typescript interface',
      'how to extend devflow with plugins',
      'write custom devflow module',
      'module detect method devflow',
      'cli plugin interface design',
    ],
  },
  'guides/contributing': {
    title: 'Contributing to DevFlow — Development and PRs',
    description:
      'How to contribute to DevFlow: fork the repository, set up the development environment, write or fix a module, and submit a pull request.',
    keywords: [
      'how to contribute to devflow',
      'devflow open source contribution',
      'fork devflow repository',
      'setup devflow local development',
      'devflow pull request guide',
      'contribute nodejs cli open source',
    ],
  },
  'guides/creating-modules': {
    title: 'Creating Custom DevFlow Modules — Step-by-Step',
    description:
      'Learn how to create your own DevFlow module from scratch: detection logic, file generation, the options schema and the wizard integration.',
    keywords: [
      'how to create devflow module',
      'build custom devflow plugin step by step',
      'write devflow module from scratch',
      'devflow module detection logic',
      'devflow module file generation',
      'extend devflow cli custom tool',
    ],
  },
};

const REDIRECTS: Record<string, string> = {
  'cli-reference': '/cli',
};

function getSlugKey(slug?: string[]): string {
  if (!slug || slug.length === 0) return '';
  return slug.join('/');
}

function buildBreadcrumbs(slug?: string[]) {
  const items: { name: string; url: string }[] = [
    {
      name: 'Home',
      url: BASE_URL,
    },
    {
      name: 'Docs',
      url: `${BASE_URL}/docs`,
    },
  ];

  if (slug && slug.length > 0) {
    let path = `${BASE_URL}/docs`;
    slug.forEach((segment) => {
      path += `/${segment}`;
      items.push({
        name: segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        url: path,
      });
    });
  }

  return breadcrumbSchema(items);
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const slugKey = getSlugKey(params.slug);
  const redirect = REDIRECTS[slugKey];
  if (redirect) permanentRedirect(redirect);

  const MDX = page.data.body;
  const path = params.slug?.length ? `/docs/${params.slug.join('/')}` : '/docs';

  const jsonLd: unknown[] = [
    buildBreadcrumbs(params.slug),
    techArticleSchema({
      headline: page.data.title,
      description: page.data.description ?? '',
      url: `${BASE_URL}${path}`,
      section: 'Documentation',
    }),
  ];

  const faqs = faqsFor(path);
  if (faqs.length > 0) jsonLd.push(faqSchema(faqs));

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const slugKey = getSlugKey(params.slug);
  const redirect = REDIRECTS[slugKey];
  if (redirect) {
    return buildPageMetadata({
      title: 'DevFlow CLI Reference',
      description: 'The DevFlow CLI reference has moved to the dedicated CLI page.',
      path: '/cli',
    });
  }

  const seo = PAGE_SEO_MAP[slugKey];
  const path = params.slug?.length ? `/docs/${params.slug.join('/')}` : '/docs';

  const title = seo?.title ?? page.data.title;
  const description = seo?.description ?? page.data.description ?? '';

  return buildPageMetadata({
    title: `${title} | DevFlow CLI`,
    description,
    path,
    keywords: seo?.keywords ?? keywordsFor(path),
    type: 'article',
  });
}
