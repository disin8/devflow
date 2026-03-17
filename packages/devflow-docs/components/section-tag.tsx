"use client";

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-roboto-mono text-[16px] font-medium text-accent">
      {children}
    </span>
  );
}
