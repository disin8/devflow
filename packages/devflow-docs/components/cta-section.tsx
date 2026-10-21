import { Button } from "./button";
import { CopyCommand } from "./copy-command";
import Link from "next/link";
import { Github } from "lucide-react";
import { GITHUB_URL } from "@/lib/site";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="relative overflow-hidden rounded-4xl border border-line bg-cta px-10 py-20 max-md:px-6 max-md:py-12">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-archivo text-[44px] max-lg:text-[36px] max-md:text-[28px] font-medium leading-[1.2em] text-foreground">
              Stop copy-pasting workflow configs between repositories
            </h2>
            <p className="mb-8 max-w-2xl text-[17px] leading-[1.5em] text-muted">
              One command reads your stack, your package manager and your
              repository type, then writes the configuration that fits — as
              plain files in your repository, so you can review and edit every
              line.
            </p>

            <div className="mb-8">
              <CopyCommand command="npx create-devflow --dry-run" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/docs/quick-start" variant="primary">
                Run the wizard
              </Button>
              <Button href="/cli" variant="white">
                CLI reference
              </Button>
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-roboto-mono text-[14px] text-muted transition-colors hover:text-foreground"
              >
                <Github size={15} />
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
