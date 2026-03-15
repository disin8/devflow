import { Button } from "./button";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div
          className="relative overflow-hidden rounded-4xl border border-line bg-cta px-10 py-20 max-md:px-6 max-md:py-12"
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-(family-name:--font-archivo) text-[48px] max-lg:text-[40px] max-md:text-[32px] font-medium leading-[1.2em] text-foreground">
              Your repo deserves a proper workflow
            </h2>
            <p className="mb-8 max-w-xl text-[18px] leading-[1.4em] text-muted">
              One command is all it takes. Open-source, free forever, and ready for any stack.
            </p>


            <div className="flex flex-wrap items-center gap-4">
              <Button href="/docs/quick-start" variant="primary">
                npx create-devflow
              </Button>
              <Button href="/docs" variant="white">
                Read the docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
