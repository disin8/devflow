import type { Metadata } from "next";
import { BuilderClient } from "./builder-client";

export const metadata: Metadata = {
  title: "Builder – Visual Wizard Setup",
  description:
    "Visually configure your DevFlow setup — pick modules, presets, and options, then copy a single CLI command.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://dev-flow.xyz/builder',
  },
};

export default function BuilderPage() {
  return <BuilderClient />;
}
