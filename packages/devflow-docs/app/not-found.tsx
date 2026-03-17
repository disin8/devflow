"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";

const errorLines = [
  {
    num: 1,
    segments: [
      { text: "import", color: "purple" },
      { text: " router ", color: "white" },
      { text: "from", color: "purple" },
      { text: ' "next/navigation";', color: "green" },
    ],
  },
  { num: 2, segments: [] },
  {
    num: 3,
    segments: [
      { text: "async function", color: "purple" },
      { text: " ", color: "white" },
      { text: "getPage", color: "blue" },
      { text: "(", color: "white" },
      { text: "slug", color: "orange" },
      { text: ": ", color: "white" },
      { text: "string", color: "blue" },
      { text: ") {", color: "white" },
    ],
  },
  {
    num: 4,
    segments: [
      { text: "  const", color: "purple" },
      { text: " page ", color: "white" },
      { text: "=", color: "white" },
      { text: " await ", color: "purple" },
      { text: "db", color: "white" },
      { text: ".pages.", color: "muted" },
      { text: "findOne", color: "blue" },
      { text: "({ slug });", color: "white" },
    ],
  },
  {
    num: 5,
    segments: [
      { text: "  ", color: "white" },
      { text: "if", color: "purple" },
      { text: " (!page) ", color: "white" },
      { text: "throw new", color: "purple" },
      { text: " ", color: "white" },
      { text: "NotFoundError", color: "red" },
      { text: "(slug);", color: "white" },
    ],
  },
  {
    num: 6,
    segments: [
      { text: "  return", color: "purple" },
      { text: " page;", color: "white" },
    ],
  },
  { num: 7, segments: [{ text: "}", color: "white" }] },
  { num: 8, segments: [] },
  {
    num: 9,
    segments: [
      {
        text: "// ─────── Error trace ───────────────────────────────",
        color: "muted",
      },
    ],
  },
  {
    num: 10,
    segments: [
      { text: "//", color: "muted" },
      { text: " NotFoundError", color: "red" },
      { text: ": page not found", color: "muted" },
    ],
  },
  {
    num: 11,
    segments: [
      { text: "//   at ", color: "muted" },
      { text: "getPage", color: "blue" },
      { text: " (app/[slug]/page.tsx:", color: "muted" },
      { text: "5", color: "orange" },
      { text: ":11)", color: "muted" },
    ],
  },
  {
    num: 12,
    segments: [
      { text: "//   at ", color: "muted" },
      { text: "Page.render", color: "blue" },
      { text: " (app/[slug]/page.tsx:", color: "muted" },
      { text: "18", color: "orange" },
      { text: ":3)", color: "muted" },
    ],
  },
  {
    num: 13,
    segments: [
      { text: "//   at ", color: "muted" },
      { text: "router.resolve", color: "blue" },
      { text: " (router.ts:", color: "muted" },
      { text: "404", color: "red" },
      { text: ":1)", color: "muted" },
    ],
  },
];

const colorMap: Record<string, string> = {
  purple: "text-[#c792ea]",
  white: "text-[#eeffff]",
  green: "text-[#7dff86]",
  blue: "text-[#82aaff]",
  orange: "text-[#f78c6c]",
  red: "text-[#ff5572]",
  muted: "text-[#4a5568]",
};

function CodeEditor() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= errorLines.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 38);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-line bg-editor">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-editor-bar">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-roboto-mono text-[12px] text-muted">
          app/[slug]/page.tsx
        </span>
        <span className="ml-auto font-roboto-mono text-[11px] px-2 py-0.5 rounded bg-[#ff5572]/12 text-[#ff5572]">
          ● ERROR
        </span>
      </div>

      <div className="p-5 font-roboto-mono text-[13px] leading-[1.75em] overflow-x-auto">
        {errorLines.slice(0, visible).map((line, idx) => (
          <div
            key={line.num}
            className={`flex gap-4 ${line.num === 5 ? "bg-[#ff5572]/8" : ""}`}
          >
            <span className="shrink-0 w-6 text-right select-none text-[#2d3748]">
              {line.num}
            </span>
            <span>
              {line.segments.length === 0 ? (
                <span>&nbsp;</span>
              ) : (
                line.segments.map((seg, i) => (
                  <span
                    key={i}
                    className={colorMap[seg.color] ?? "text-[#eeffff]"}
                  >
                    {seg.text}
                  </span>
                ))
              )}
              {idx === Math.min(visible, errorLines.length) - 1 &&
                visible < errorLines.length && (
                  <span className="cursor-blink text-accent">
                    ▌
                  </span>
                )}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-line bg-editor-bar">
        <div className="flex items-center gap-3">
          <span className="font-roboto-mono text-[11px] px-1.5 py-0.5 rounded bg-[#ff5572]/12 text-[#ff5572]">
            ✕ 1 error
          </span>
          <span className="font-roboto-mono text-[11px] text-muted">
            TypeScript · Next.js
          </span>
        </div>
        <span className="font-roboto-mono text-[11px] text-muted">
          Ln 5, Col 11
        </span>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 gap-12">
        <div className="text-center">
          <div className="font-roboto-mono text-[120px] max-md:text-[72px] font-bold leading-none select-none bg-linear-to-br from-accent from-0% via-[#0d9944] via-60% to-line to-100% bg-clip-text text-transparent">
            404
          </div>
          <p className="font-archivo text-[22px] max-md:text-[18px] font-medium text-white mt-2">
            Page not found
          </p>
          <p
            className="text-[15px] leading-[1.6em] mt-2 max-w-sm mx-auto text-muted"
          >
            Looks like this route threw a{" "}
            <code
              className="font-roboto-mono text-[13px] px-1.5 py-0.5 rounded bg-[#ff5572]/10 text-[#ff5572]"
            >
              NotFoundError
            </code>
            . The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        <CodeEditor />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl font-roboto-mono text-[14px] font-bold px-6 py-3 transition-all hover:brightness-110 bg-accent text-accent-fg"
          >
            Go home
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-xl font-roboto-mono text-[14px] font-bold px-6 py-3 border border-line text-muted transition-colors hover:bg-white/5"
          >
            Read the docs
          </Link>
        </div>
      </main>
    </div>
  );
}
