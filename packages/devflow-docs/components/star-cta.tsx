import Link from "next/link";
import { Star, Github, ArrowRight } from "lucide-react";
import { GITHUB_URL } from "@/lib/site";

export function StarCta() {
  return (
    <section className="px-10 max-md:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-line bg-card py-8 text-center md:flex-row md:justify-between md:text-left px-8">
          <div className="flex flex-col gap-2 md:max-w-xl">
            <h2 className="text-balance font-archivo text-[28px] max-md:text-[24px] text-foreground">
              DevFlow is MIT licensed and the source is public
            </h2>
            <p className="text-pretty text-[15px] text-muted">
              Read the code that writes your config, open an issue when a module
              is missing, or star the repository if it saved you an afternoon.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 md:justify-end">
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-page px-5 py-3 font-roboto-mono text-[14px] font-medium text-foreground transition-colors hover:border-accent/40"
            >
              <Github size={16} />
              View on GitHub
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-roboto-mono text-[14px] font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              <Star size={16} />
              Star on GitHub
            </Link>
            <Link
              href="/modules"
              className="inline-flex items-center gap-1.5 font-roboto-mono text-[14px] text-muted transition-colors hover:text-foreground"
            >
              See the modules
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
