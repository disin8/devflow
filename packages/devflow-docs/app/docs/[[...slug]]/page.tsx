import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

const BASE_URL = 'https://dev-flow.xyz';

interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
}

const PAGE_SEO_MAP: Record<string, PageSEO> = {
  '': {
    title: 'DevFlow Documentation – Automate Your Dev Workflow Setup',
    description:
      'Complete guide to DevFlow CLI. Learn how to automatically add Husky, ESLint, Prettier, Vitest, GitHub Actions, Docker, Commitlint, and more to any JavaScript/TypeScript project.',
    keywords: [
      'devflow documentation',
      'how to automate nodejs project setup',
      'developer workflow setup guide',
      'create-devflow getting started',
      'scaffold dev tools automatically',
      'nodejs project configuration guide',
      'javascript tooling setup tutorial',
    ],
  },
  installation: {
    title: 'Install DevFlow – npx create-devflow Setup Guide',
    description:
      'How to install DevFlow with npx, npm, pnpm, yarn, or bun. One-command CLI tool to scaffold your entire development workflow. Works with any Node.js project.',
    keywords: [
      'npx create-devflow install',
      'how to install devflow',
      'npm install create-devflow globally',
      'pnpm dlx create-devflow',
      'bunx create-devflow',
      'yarn dlx create-devflow',
      'devflow node 18 requirements',
      'install developer workflow cli',
      'run devflow without installing',
    ],
  },
  'quick-start': {
    title: 'DevFlow Quick Start – Bootstrap Dev Workflow in 2 Minutes',
    description:
      'Get your development workflow up and running in under 2 minutes. Run npx create-devflow, follow the interactive wizard, and automatically configure Git hooks, linting, testing, and CI/CD.',
    keywords: [
      'how to set up dev workflow in 2 minutes',
      'bootstrap javascript project workflow',
      'scaffold git hooks linting testing ci cd',
      'npx create-devflow getting started',
      'interactive nodejs project wizard',
      'set up eslint prettier husky one command',
      'automate project configuration nodejs',
      'devflow quick setup guide',
    ],
  },
  configuration: {
    title: 'DevFlow Configuration – Package Manager & Stack Auto-Detection',
    description:
      'How DevFlow detects your package manager, TypeScript, React/Next.js/Vue/NestJS stack, and monorepo setup automatically. Override defaults with CLI flags.',
    keywords: [
      'devflow auto detect project stack',
      'detect pnpm yarn npm bun automatically',
      'detect typescript project cli',
      'detect react nextjs vue nestjs stack',
      'detect monorepo nx turborepo',
      'override package manager cli flag',
      'devflow --pm flag',
      'nodejs project context detection',
    ],
  },
  presets: {
    title: 'DevFlow Presets – Minimal, Recommended & Full Workflow Config',
    description:
      'Skip the wizard with DevFlow presets. Choose Minimal, Recommended, or Full preset — each tailored to your detected stack (React, Next.js, Vue, NestJS, Node.js).',
    keywords: [
      'devflow preset minimal recommended full',
      'skip setup wizard use preset',
      'devflow --all flag preset',
      'one command full dev setup',
      'recommended nodejs project config',
      'react preset devflow',
      'nextjs preset devflow',
      'best nodejs project setup 2026',
    ],
  },
  'dry-run': {
    title: 'DevFlow Dry Run – Preview All Changes Before Applying',
    description:
      'Use --dry-run mode to safely preview every file, package installation, and script change before DevFlow touches your project.',
    keywords: [
      'devflow --dry-run preview',
      'preview cli changes before applying',
      'test devflow without modifying project',
      'see what devflow will do',
      'safe cli dry run mode',
      'preview files packages scripts devflow',
      'check devflow output before running',
    ],
  },
  'cli-reference': {
    title: 'DevFlow CLI Reference – All Commands, Flags & Options',
    description:
      'Complete CLI reference for DevFlow: all commands, flags, and options. Use --husky, --lint, --ci, --docker, --all and more to skip the interactive wizard.',
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
      'skip interactive wizard devflow',
      'devflow command line reference',
    ],
  },
  wizard: {
    title: 'DevFlow Interactive Wizard – Step-by-Step Setup Guide',
    description:
      'How the DevFlow interactive wizard works: auto-detects your stack, lets you pick modules with checkboxes, fine-tunes settings, and shows a full execution plan before applying.',
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
    title: 'DevFlow Module Catalogue – 40+ Dev Tools Automated',
    description:
      'Browse all 40+ DevFlow modules: Git hooks (Husky, lint-staged), ESLint, Prettier, Biome, Vitest, Jest, Playwright, GitHub Actions, Docker, semantic-release, and more.',
    keywords: [
      'devflow all modules list',
      'automate husky eslint prettier vitest github-actions docker',
      'nodejs dev tools setup list',
      'what can devflow install',
      'git hooks linting testing ci docker automation',
      'available devflow modules',
      'scaffold 40 dev tools one command',
    ],
  },
  'modules/git': {
    title: 'Add Husky, Commitlint & lint-staged to Any Project – DevFlow',
    description:
      'Automatically set up Husky pre-commit hooks, lint-staged, Commitlint, and Commitizen in any Node.js/TypeScript project. Enforce conventional commits with one command: npx create-devflow.',
    keywords: [
      'how to add husky',
      'how to add husky to nodejs project',
      'husky pre-commit hook setup tutorial',
      'install husky lint-staged together',
      'how to configure lint-staged',
      'setup commitlint conventional commits',
      'enforce commit message format nodejs',
      'commitizen interactive commit cli',
      'husky vs lefthook which to use',
      'git commit hooks automation javascript',
      'add pre-commit hook to project',
      'husky prepare script package.json',
      '.husky directory setup',
    ],
  },
  'modules/quality': {
    title: 'Add ESLint, Prettier & Biome Automatically – DevFlow',
    description:
      'Set up ESLint, Prettier, or Biome in any JavaScript/TypeScript project automatically. DevFlow generates stack-specific configs for React, Next.js, Vue, NestJS, and TypeScript with one command.',
    keywords: [
      'how to add eslint',
      'how to add eslint to nodejs project',
      'eslint flat config setup typescript',
      'setup prettier nodejs project',
      'eslint prettier together typescript',
      'react eslint rules configuration',
      'nextjs eslint setup 2026',
      'nestjs eslint config generator',
      'biome vs eslint prettier replacement',
      'install biome linter formatter',
      'auto generate eslint.config.js',
      'eslint plugin react hooks setup',
      'typescript-eslint setup tutorial',
      'prettier .prettierrc generator',
    ],
  },
  'modules/testing': {
    title: 'Set Up Vitest, Jest, Playwright & Cypress Automatically – DevFlow',
    description:
      'Add Vitest, Jest, Playwright, Cypress, Testing Library, or MSW to your JavaScript project with zero manual configuration. DevFlow creates all config files, installs packages, and adds npm scripts.',
    keywords: [
      'how to setup vitest typescript',
      'vitest config ts generator',
      'add jest to typescript project',
      'jest vs vitest which to use 2026',
      'playwright setup e2e testing nodejs',
      'cypress vs playwright which to choose',
      'testing library react setup',
      '@testing-library/react installation',
      'msw mock service worker setup tutorial',
      'add test coverage to nodejs project',
      'vitest coverage v8 setup',
      'e2e testing configuration automation',
    ],
  },
  'modules/ci-cd': {
    title: 'Set Up GitHub Actions & GitLab CI Pipeline Automatically – DevFlow',
    description:
      'Generate GitHub Actions CI/CD workflows, GitLab CI pipelines, and Renovate/Dependabot configs for Node.js projects. Complete lint → typecheck → test → build pipeline in one command.',
    keywords: [
      'how to add github actions',
      'how to add github actions to nodejs project',
      'github actions workflow yml generator',
      'github actions lint test build nodejs',
      'github actions pnpm setup 2026',
      'github actions bun setup',
      'gitlab ci yml nodejs pipeline',
      'add dependabot to repository',
      'renovate bot vs dependabot comparison',
      'ci cd pipeline generator nodejs',
      'github actions cancel in progress runs',
      'github actions matrix node version',
      'automate ci cd javascript project',
    ],
  },
  'modules/docker': {
    title: 'Add Dockerfile & docker-compose to Node.js Project – DevFlow',
    description:
      'Generate a production-ready multi-stage Dockerfile and docker-compose.yml for any Node.js/TypeScript application. Adapts to your package manager (npm, pnpm, yarn, bun) automatically.',
    keywords: [
      'how to containerize nodejs app',
      'nodejs dockerfile multi-stage build',
      'production dockerfile nodejs 2026',
      'next.js dockerfile best practice',
      'nestjs dockerfile generator',
      'pnpm dockerfile production',
      'docker-compose dev environment nodejs',
      'add .dockerignore to project',
      'docker nodejs app small image',
      'multi-stage docker build node alpine',
      'generate dockerfile automatically',
    ],
  },
  'modules/releases': {
    title: 'Automate Releases with release-it & Changesets – DevFlow',
    description:
      'Automate versioning, changelog generation, and npm publishing with release-it or Changesets. DevFlow configures everything for single packages and monorepos.',
    keywords: [
      'how to automate npm releases',
      'release-it setup configuration',
      'changesets monorepo versioning',
      'semantic versioning nodejs automatic',
      'auto generate CHANGELOG.md',
      'conventional changelog setup',
      'npm publish automation workflow',
      'release-it vs changesets comparison',
      'automated git tagging nodejs',
      'version bump script nodejs',
    ],
  },
  'modules/security': {
    title: 'Add Security Scanning to Node.js – npm audit, Gitleaks, Trivy',
    description:
      'Automatically add npm audit, Gitleaks secret detection, Trivy vulnerability scanning, and OSV-Scanner to your project and GitHub Actions CI pipeline with one command.',
    keywords: [
      'how to add security scanning to nodejs project',
      'npm audit github actions integration',
      'prevent committing api keys secrets',
      'gitleaks git secret detection setup',
      'trivy vulnerability scanner nodejs',
      'osv-scanner google dependency check',
      'detect secrets in code repository',
      'nodejs dependency vulnerability scan',
      'add security step to ci pipeline',
      'protect against leaked credentials git',
    ],
  },
  'modules/monorepo': {
    title: 'Set Up Turborepo, Nx & pnpm Workspaces Automatically – DevFlow',
    description:
      'Configure Turborepo, Nx, or pnpm/yarn workspaces for your monorepo with one command. Includes shared TypeScript config, build caching, and task pipeline configuration.',
    keywords: [
      'how to set up turborepo monorepo',
      'turborepo turbo.json configuration',
      'nx monorepo setup from scratch',
      'pnpm workspaces configuration tutorial',
      'yarn workspaces monorepo setup',
      'monorepo shared tsconfig.base.json',
      'turborepo vs nx comparison',
      'incremental build caching monorepo',
      'monorepo affected commands ci',
      'scaffold nodejs monorepo project',
    ],
  },
  'modules/dx': {
    title: 'Dev Environment Setup – .nvmrc, .env.example, VSCode Config – DevFlow',
    description:
      'Automate dev environment configuration: pin Node.js version with .nvmrc, generate .env.example, configure VSCode settings and extensions, and add Dev Container support.',
    keywords: [
      'how to pin nodejs version with nvmrc',
      'nvmrc vs volta node version manager',
      'create .env.example file automatically',
      'vscode settings.json project configuration',
      'vscode extensions.json recommended',
      'devcontainer setup tutorial',
      'dev container vs docker compose',
      'shared editor config team project',
      'fnm nvm node version pinning',
      'dotenv example file generator',
    ],
  },
  'modules/docs': {
    title: 'Auto-Generate README, Contributing Guide & License – DevFlow',
    description:
      'Automatically generate README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, and LICENSE files tailored to your project structure.',
    keywords: [
      'auto generate readme.md nodejs project',
      'readme template generator cli',
      'contributing.md template generator',
      'code of conduct template open source',
      'add license to github repository',
      'professional project readme badges',
      'open source project documentation setup',
      'security.md template nodejs',
    ],
  },
  'architecture/overview': {
    title: 'DevFlow Architecture Overview – How It Works Internally',
    description:
      "Deep dive into DevFlow's architecture: context detection pipeline, module system design, executor, and the plugin interface.",
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
    title: 'DevFlow Context Detection – Stack & Package Manager Auto-Detection',
    description:
      'How DevFlow automatically detects your stack (React, Next.js, Vue, NestJS), package manager, TypeScript configuration, and monorepo setup.',
    keywords: [
      'how devflow detects project stack',
      'detect react nextjs vue nestjs from dependencies',
      'detect package manager from lock file',
      'projectcontext detection cli',
      'detect typescript from tsconfig.json',
      'detect monorepo nx turborepo automatically',
    ],
  },
  'architecture/executor': {
    title: 'DevFlow Executor – Plan Execution Engine',
    description:
      "How DevFlow's executor processes the collected action plan and applies file writes, package installations, and script additions.",
    keywords: [
      'devflow executor engine',
      'cli action plan execution',
      'how cli writes files installs packages',
      'file write package install script add pipeline',
      'devflow plan apply mechanism',
    ],
  },
  'architecture/module-interface': {
    title: 'DevFlow Module Interface – Create Custom Modules',
    description:
      "Technical reference for DevFlow's module interface. How modules detect existing config, build action plans, and integrate with the interactive wizard.",
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
    title: 'Contributing to DevFlow – Development & PR Guide',
    description:
      'How to contribute to DevFlow: fork the repo, set up the dev environment, write or fix modules, and submit a pull request.',
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
    title: 'Creating Custom DevFlow Modules – Step-by-Step Guide',
    description:
      'Learning how to create your own DevFlow modules from scratch: detection logic, file generation, options schema, and wizard integration.',
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

function getSlugKey(slug?: string[]): string {
  if (!slug || slug.length === 0) return '';
  return slug.join('/');
}

function buildBreadcrumbs(slug?: string[]) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Docs',
      item: `${BASE_URL}/docs`,
    },
  ];

  if (slug && slug.length > 0) {
    let path = `${BASE_URL}/docs`;
    slug.forEach((segment, i) => {
      path += `/${segment}`;
      items.push({
        '@type': 'ListItem',
        position: i + 3,
        name: segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        item: path,
      });
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const breadcrumbJsonLd = buildBreadcrumbs(params.slug);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
  const seo = PAGE_SEO_MAP[slugKey];

  const title = seo?.title ?? page.data.title;
  const description = seo?.description ?? page.data.description ?? '';
  const keywords = seo?.keywords ?? [];
  const canonicalUrl = `${BASE_URL}/docs${params.slug ? `/${params.slug.join('/')}` : ''}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      siteName: 'DevFlow',
      images: [
        {
          url: `${BASE_URL}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.webp`],
    },
  };
}
