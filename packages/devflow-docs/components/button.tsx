"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  className?: string;
  onClick?: () => void;
}

export function Button({ children, href, variant = "primary", className = "", onClick }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-roboto-mono text-[14px] font-bold transition-all duration-200 cursor-pointer whitespace-nowrap";

  const variants = {
    primary: "bg-accent text-accent-fg px-6 py-3 hover:brightness-110",
    secondary: "bg-transparent text-foreground border border-line px-6 py-3 hover:bg-card",
    outline: "bg-page text-foreground border border-line px-6 py-3 hover:bg-card",
    ghost: "bg-transparent text-accent px-0 py-2 hover:opacity-80",
    white: "bg-white text-gray-900 px-6 py-3 hover:bg-gray-100",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {(variant === "primary" || variant === "ghost") && <ChevronRight size={16} />}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
      {(variant === "primary" || variant === "ghost") && <ChevronRight size={16} />}
    </button>
  );
}
