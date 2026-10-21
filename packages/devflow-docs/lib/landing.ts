import type { Metadata } from "next";
import {
  buildPageMetadata,
  faqSchema,
  breadcrumbSchema,
  type FaqItem,
  type BreadcrumbEntry,
} from "./seo";
import { keywordsFor } from "./keywords";
import { faqsFor } from "./faqs";
import { absoluteUrl, SITE_NAME } from "./site";

export interface LandingMetaInput {
  title: string;
  description: string;
  path: string;
  faq?: FaqItem[];
  section?: string;
  type?: "website" | "article";
}

export function landingMetadata(input: LandingMetaInput): Metadata {
  return buildPageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    keywords: keywordsFor(input.path),
    type: input.type ?? "article",
  });
}

export function landingFaq(path: string, faq?: FaqItem[]): FaqItem[] {
  return faq && faq.length > 0 ? faq : faqsFor(path);
}

export function landingBreadcrumbs(trail: BreadcrumbEntry[]) {
  return breadcrumbSchema([
    { name: "Home", url: absoluteUrl("/") },
    ...trail,
  ]);
}

export function landingFaqSchema(faq: FaqItem[]) {
  return faq.length > 0 ? faqSchema(faq) : null;
}

export const LANDING_SEO_TITLES: Record<string, string> = {
  "/modules": "DevFlow Module Catalogue — 50 Modules for Git, CI and Docker",
  "/modules/eslint": "ESLint Module — Flat Config for TypeScript and React",
  "/modules/prettier": "Prettier Module — Config and Ignore File Generated",
  "/modules/husky": "Husky Module — Git Hooks, lint-staged and Commitlint",
  "/modules/lint-staged": "lint-staged Module — Linters on Staged Files Only",
  "/modules/commitlint": "Commitlint Module — Conventional Commits Enforced",
  "/modules/vitest": "Vitest Module — Config, Coverage and Test Scripts",
  "/modules/github-actions": "GitHub Actions Module — Lint, Test and Build CI",
  "/modules/docker": "Docker Module — Multi-Stage Dockerfile and Compose",
  "/modules/monorepo": "Monorepo Module — Turborepo, Nx and pnpm Workspaces",
  "/modules/security": "Security Module — npm audit, Gitleaks and Trivy",
  "/guides": "DevFlow Setup Guides — ESLint, CI, Vitest, Docker",
  "/guides/eslint-prettier-husky":
    "ESLint, Prettier and Husky Setup for React and TypeScript",
  "/guides/github-actions-nextjs":
    "GitHub Actions CI/CD for Next.js — Lint, Test, Build",
  "/guides/vitest-react-typescript":
    "Vitest Setup for React and TypeScript — Tests, Coverage",
  "/guides/nestjs-docker": "Docker Setup for NestJS — Dev, Production and CI",
  "/guides/turborepo-ci": "Turborepo CI/CD with GitHub Actions and pnpm Workspaces",
  "/guides/conventional-commits": "Conventional Commits with Commitlint and Husky",
  "/guides/security-ci": "Security Scanning in CI — npm audit, Gitleaks, Trivy",
  "/compare": "DevFlow vs Manual Setup, Nx, Turborepo and create-next-app",
  "/compare/manual-setup": "DevFlow vs Manual Setup — The Honest Comparison",
  "/compare/create-next-app": "DevFlow vs create-next-app — Which One to Use",
  "/compare/nx": "DevFlow vs Nx — Workflow Config vs Build System",
  "/compare/turborepo": "DevFlow vs Turborepo — Config vs Task Runner",
};

export function landingTitle(path: string, fallback: string): string {
  return LANDING_SEO_TITLES[path] ?? fallback;
}

export const LANDING_SITE_NAME = SITE_NAME;
