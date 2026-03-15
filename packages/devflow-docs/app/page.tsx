import type { Metadata } from 'next';
import { CTASection } from "@/components/cta-section";
import { FeatureBlocks } from "@/components/feature-blocks";
import { FeaturesGrid } from "@/components/features-grid";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { SliderSection } from "@/components/slider-section";
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'DevFlow – Bootstrap Your Dev Workflow in Seconds',
  description:
    'DevFlow is a CLI tool that scaffolds a complete development workflow — Git hooks (Husky), commit conventions, ESLint, Prettier, Vitest, GitHub Actions CI/CD, Docker, and more — in any JavaScript/TypeScript repository with one command.',
  keywords: [
    'npx create-devflow',
    'how to set up developer workflow nodejs',
    'automate project setup javascript',
    'developer workflow cli tool',
    'how to add husky git hooks',
    'setup eslint prettier automatically',
    'add github actions to nodejs project',
    'setup vitest typescript project',
    'generate dockerfile nodejs app',
    'setup commitlint conventional commits',
    'configure lint-staged pre-commit',
    'add ci cd pipeline to project',
    'scaffold dev tools without manual config',
    'stop writing config files manually',
    'zero config developer setup',
    'alternative to create-react-app boilerplate',
    'husky lefthook pre-commit setup',
    'eslint vs biome nodejs 2026',
    'vitest vs jest which to use',
  ],
  alternates: {
    canonical: 'https://dev-flow.xyz',
  },
  openGraph: {
    url: 'https://dev-flow.xyz',
    title: 'DevFlow – Bootstrap Your Dev Workflow in Seconds',
    description:
      'Scaffold Git hooks (Husky), ESLint, Prettier, Vitest, GitHub Actions CI/CD, Docker, and more in any Node.js/TypeScript repo with one command: npx create-devflow.',
  },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DevFlow',
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'CLI Tool',
  operatingSystem: 'Cross-platform (macOS, Linux, Windows)',
  url: 'https://dev-flow.xyz',
  downloadUrl: 'https://www.npmjs.com/package/create-devflow',
  installUrl: 'https://www.npmjs.com/package/create-devflow',
  softwareVersion: 'latest',
  description:
    'DevFlow is a CLI that scaffolds a complete development workflow — Git hooks, commit conventions, ESLint, Prettier, Vitest, CI/CD, Docker, and more — in any JavaScript/TypeScript repository.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'DevFlow',
    url: 'https://dev-flow.xyz',
  },
  featureList: [
    'Interactive setup wizard',
    'Husky Git hooks automation',
    'ESLint and Prettier configuration',
    'Vitest and Jest test setup',
    'GitHub Actions CI/CD pipeline generation',
    'Docker multi-stage build generation',
    'Commitlint conventional commits enforcement',
    'Monorepo support (Turborepo, Nx)',
    'Stack-aware config (React, Next.js, Vue, NestJS)',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I add Husky to my project automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run npx create-devflow in your project root and select the Husky module. DevFlow installs husky, creates .husky/pre-commit and .husky/commit-msg hooks, and adds the prepare script to package.json automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I set up ESLint and Prettier automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run npx create-devflow and select ESLint and Prettier modules. DevFlow generates stack-aware configs for React, Next.js, Vue, TypeScript, and NestJS including eslint.config.js, .prettierrc, and npm scripts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I set up GitHub Actions CI/CD for a Node.js project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run npx create-devflow and select the GitHub Actions module. DevFlow generates .github/workflows/ci.yml with lint, typecheck, test, and build steps optimized for your package manager (npm, pnpm, yarn, or bun).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I add a Dockerfile to my Node.js project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run npx create-devflow and select the Docker module. DevFlow generates a production-optimized multi-stage Dockerfile and docker-compose.yml adapted to your package manager.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I set up Commitlint for conventional commits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run npx create-devflow and select Commitlint. DevFlow installs @commitlint/cli and @commitlint/config-conventional, creates commitlint.config.mjs, and integrates it with Husky commit-msg hook.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I set up Vitest in a project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run npx create-devflow and select the Vitest module. DevFlow installs vitest and @vitest/coverage-v8, creates vitest.config.ts, and adds test, test:watch, and test:coverage scripts.',
      },
    },
  ],
};


export default function HomePage() {
  return (
    <main className="landing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <FeaturesGrid />
      <SliderSection />
      <FeatureBlocks />
      <CTASection />
      <Footer />
    </main>
  );
}
