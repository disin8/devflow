"use client";

import { SectionTag } from "./section-tag";

interface SectionHeaderProps {
  tag?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ tag, title, description, centered = false, className }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 ${centered ? "items-center text-center" : ""} ${className ?? ''}`}>
      {tag && <SectionTag>{tag}</SectionTag>}
      <h2
        className={`font-(family-name:--font-archivo) text-[48px] max-lg:text-[40px] max-md:text-[32px] font-medium leading-[1.2em] text-foreground ${centered ? "max-w-2xl" : ""}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-[18px] leading-[1.4em] text-muted ${centered ? "max-w-xl" : "max-w-lg"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
