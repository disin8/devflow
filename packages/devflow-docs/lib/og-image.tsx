import { ImageResponse } from "next/og";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const TERMINAL_LINES: { text: string; color: string; marker: boolean }[] = [
  { text: "$ npx create-devflow --dry-run", color: "#7dff86", marker: false },
  { text: "", color: "#ffffff", marker: false },
  { text: "Detected  TypeScript · React · pnpm", color: "#b5bdc5", marker: true },
  { text: "Git hooks  Husky · lint-staged · commitlint", color: "#b5bdc5", marker: true },
  { text: "Linting   ESLint flat config · Prettier", color: "#b5bdc5", marker: true },
  { text: "Testing   Vitest · V8 coverage", color: "#b5bdc5", marker: true },
  { text: "CI/CD     GitHub Actions pipeline", color: "#b5bdc5", marker: true },
  { text: "Docker    Dockerfile · compose · .dockerignore", color: "#b5bdc5", marker: true },
  { text: "", color: "#ffffff", marker: false },
  { text: "Execution plan ready — nothing written yet", color: "#7dff86", marker: false },
];

export function renderOgImage(options?: { title?: string }) {
  const title = options?.title?.trim();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(160deg, #060f11 0%, #0b1a1d 60%, #0b1a1d 100%)",
          padding: "48px 60px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "#0d1117",
              border: "2px solid #212d31",
              alignItems: "center",
              justifyContent: "center",
              color: "#7dff86",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            &gt;_
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
              DevFlow CLI
            </div>
            <div style={{ fontSize: 16, color: "#b5bdc5" }}>
              Developer workflow setup for TypeScript and monorepos
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              fontSize: 15,
              color: "#7dff86",
              border: "1px solid #212d31",
              background: "#0d1117",
              borderRadius: "999px",
              padding: "8px 18px",
            }}
          >
            MIT · open source
          </div>
        </div>

        {title ? (
          <div
            style={{
              marginTop: "26px",
              fontSize: 38,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#ffffff",
              display: "flex",
            }}
          >
            {title.length > 78 ? `${title.slice(0, 77)}…` : title}
          </div>
        ) : null}

        <div
          style={{
            marginTop: title ? "24px" : "32px",
            display: "flex",
            flexDirection: "column",
            background: "#0d1117",
            border: "1px solid #212d31",
            borderRadius: "18px",
            padding: "24px 30px",
            fontSize: 18,
              lineHeight: 1.5,
            fontFamily: "monospace",
            flexGrow: 1,
          }}
        >
          {TERMINAL_LINES.map((line, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {line.marker ? (
                <div
                  style={{
                    display: "flex",
                    width: "9px",
                    height: "9px",
                    borderRadius: "3px",
                    background: "#7dff86",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div style={{ width: "9px", flexShrink: 0 }} />
              )}
              <div style={{ display: "flex", color: line.color }}>{line.text || " "}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 17,
            color: "#b5bdc5",
          }}
        >
          <span>npm install create-devflow</span>
          <span style={{ color: "#7dff86" }}>dev-flow.xyz</span>
        </div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT },
  );
}
