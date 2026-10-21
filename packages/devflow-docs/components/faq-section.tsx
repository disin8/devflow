import { SectionHeader } from "./section-header";
import { SectionTag } from "./section-tag";
import { faqsFor } from "@/lib/faqs";

export function FaqSection({ path = "/" }: { path?: string }) {
  const faqs = faqsFor(path);
  if (faqs.length === 0) return null;

  return (
    <section className="py-24 max-md:py-12">
      <div className="mx-auto max-w-4xl px-10 max-md:px-5">
        <SectionHeader
          tag={<SectionTag>FAQ</SectionTag>}
          title="Questions developers actually ask"
          description="The objections that come up before anyone runs the tool — answered with the real behaviour of the CLI, including the parts that are not automatic."
          centered
        />

        <div className="mt-10 flex flex-col divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-7 py-6 max-sm:px-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-archivo text-[19px] text-foreground marker:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 font-roboto-mono text-[22px] leading-none text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
