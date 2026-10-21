"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCommandProps {
  command: string;
  className?: string;
  label?: string;
}

export function CopyCommand({ command, className, label }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ?? `Copy ${command}`}
      className={`group inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 font-roboto-mono text-[14px] text-accent transition-colors hover:border-accent/40 ${className ?? ""}`}
    >
      <code className="select-all">{command}</code>
      {copied ? (
        <Check size={15} className="text-accent" />
      ) : (
        <Copy size={15} className="text-muted transition-colors group-hover:text-accent" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
