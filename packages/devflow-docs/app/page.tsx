import type { Metadata } from "next";
import { CTASection } from "@/components/cta-section";
import { ComparisonTable } from "@/components/comparison-table";
import { FaqSection } from "@/components/faq-section";
import { FeatureBlocks } from "@/components/feature-blocks";
import { FeaturesGrid } from "@/components/features-grid";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { PresetsTable } from "@/components/presets-table";
import { ProofBar } from "@/components/proof-bar";
import { SliderSection } from "@/components/slider-section";
import { StarCta } from "@/components/star-cta";
import { JsonLd } from "@/components/json-ld";
import { faqsFor } from "@/lib/faqs";
import { keywordsFor } from "@/lib/keywords";
import { getNpmProof } from "@/lib/proof";
import { faqSchema, ogImageUrl, softwareApplicationSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "DevFlow CLI — ESLint, Husky, Vitest, CI/CD & Docker for TypeScript",
  description:
    "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing TypeScript project — without copy-pasting boilerplate.",
  keywords: keywordsFor("/"),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "DevFlow CLI",
    title: "DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js and Monorepos",
    description:
      "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing TypeScript project — without copy-pasting boilerplate.",
    images: [ogImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js and Monorepos",
    description:
      "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing TypeScript project — without copy-pasting boilerplate.",
    images: [ogImageUrl().url],
  },
};

export default async function HomePage() {
  const npm = await getNpmProof();
  const faqs = faqsFor("/");

  const softwareJsonLd = softwareApplicationSchema({
    version: npm?.version,
    description:
      "DevFlow CLI generates reproducible developer workflows for TypeScript, React, Node.js and monorepos: ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configuration in one command.",
    featureList: [
      "Detects the package manager, stack and repository type",
      "ESLint flat config for TypeScript, React, Next.js and Vue",
      "Prettier configuration and ignore file",
      "Husky hooks with lint-staged and Commitlint",
      "Vitest configuration with V8 coverage",
      "GitHub Actions and GitLab CI pipelines",
      "Multi-stage Dockerfile, docker-compose and .dockerignore",
      "Turborepo, Nx and pnpm workspace configuration",
      "Secret detection and dependency auditing workflows",
    ],
  });

  return (
    <main className="landing">
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={faqSchema(faqs)} />
      <HeroSection />
      <ProofBar />
      <FeaturesGrid />
      <ComparisonTable />
      <PresetsTable />
      <SliderSection />
      <FeatureBlocks />
      <FaqSection path="/" />
      <StarCta />
      <CTASection />
      <Footer />
    </main>
  );
}
