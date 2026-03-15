"use client";

import { useState } from "react";
import { SectionHeader } from "./section-header";
import { Button } from "./button";

const sliderItems = [
  {
    title: "Direct commands",
    description: "Skip the wizard entirely with flags like --husky, --lint, --test, --ci github, --docker. Scriptable and CI-friendly.",
  },
  {
    title: "Release tooling",
    description: "Changesets, standard-version, or semantic-release — configure versioning, CHANGELOG generation, and npm publish in one step.",
  },
  {
    title: "Security defaults",
    description: "npm audit scripts, Gitleaks pre-commit hooks, and SECURITY.md added automatically. Stay secure without extra setup.",
  },
];

export function SliderLeft() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="mb-16 text-center">
          <SectionHeader
            tag="More features"
            title="Power-user controls included"
            centered
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative overflow-hidden rounded-3xl bg-code-preview">
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-left-glow" />
          </div>

          <div className="flex flex-col gap-2">
            {sliderItems.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setActiveIndex(i)}
                className={`text-left w-full rounded-2xl border transition-all cursor-pointer ${activeIndex === i
                  ? "border-line bg-card p-6"
                  : "border-transparent p-6 hover:bg-card/50"
                  }`}
              >
                <h3 className="font-(family-name:--font-roboto-mono) text-[18px] font-medium text-foreground">
                  {item.title}
                </h3>
                {activeIndex === i && (
                  <p className="mt-3 text-[14px] leading-[1.4em] text-muted">
                    {item.description}
                  </p>
                )}
              </button>
            ))}

            <div className="mt-6 pl-6">
              <Button href="#pricing" variant="primary">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
