"use client";

const logos = [
  { name: "React", width: 120 },
  { name: "Next.js", width: 120 },
  { name: "NestJS", width: 120 },
  { name: "Vue", width: 120 },
  { name: "SvelteKit", width: 120 },
  { name: "Nuxt", width: 120 },
  { name: "Turborepo", width: 120 },
  { name: "Nx", width: 120 },
];

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
      <span className="font-(family-name:--font-roboto-mono) text-[14px] font-medium text-foreground/60 uppercase tracking-wider">
        {name}
      </span>
    </div>
  );
}

export function LogoBar() {
  return (
    <section className="pt-16">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <div className="fade-mask overflow-hidden">
          <div className="flex animate-marquee items-center gap-16 w-max">
            {[...logos, ...logos].map((logo, i) => (
              <LogoPlaceholder key={`${logo.name}-${i}`} name={logo.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
