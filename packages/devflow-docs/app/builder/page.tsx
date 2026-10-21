import type { Metadata } from "next";
import { BuilderClient } from "./builder-client";
import { ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "DevFlow Builder — Compose a CLI Command for Your Stack",
  description:
    "Pick the modules and options you need and get the exact npx create-devflow command for your stack, package manager and repository type.",
  keywords: [
    "devflow builder",
    "visual devflow setup",
    "devflow preset builder",
    "create devflow command generator",
    "choose devflow modules",
  ],
  alternates: {
    canonical: "https://dev-flow.xyz/builder",
  },
  openGraph: {
    type: "website",
    url: "https://dev-flow.xyz/builder",
    siteName: "DevFlow CLI",
    title: "DevFlow Builder — Compose a CLI Command for Your Stack",
    description:
      "Pick the modules and options you need and get the exact npx create-devflow command for your stack, package manager and repository type.",
    images: [ogImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFlow Builder — Compose a CLI Command for Your Stack",
    description:
      "Pick the modules and options you need and get the exact npx create-devflow command for your stack, package manager and repository type.",
    images: [ogImageUrl().url],
  },
};

export default function BuilderPage() {
  return <BuilderClient />;
}
