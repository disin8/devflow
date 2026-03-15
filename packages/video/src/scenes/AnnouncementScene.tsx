import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TypewriterText } from "../components/TypewriterText";

const DOC_FEATURES = [
  { label: "Git & Commits" },
  { label: "Code Quality" },
  { label: "Testing" },
  { label: "CI/CD" },
  { label: "Docker" },
  { label: "Monorepo" },
];

const SIDEBAR_ITEMS = [
  { label: "Getting Started", active: true },
  { label: "Quick Start", indent: true },
  { label: "Installation", indent: true },
  { label: "CLI Reference" },
  { label: "Modules" },
  { label: "Presets" },
  { label: "Configuration" },
];

const DOC_H1 = "Bootstrap a complete DevFlow ";
const DOC_H2 = "in any repository";

export const AnnouncementScene: React.FC<{ durationInFrames?: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceBlur = interpolate(frame, [0, 12], [6, 0], { extrapolateRight: "clamp" });
  const exitBlur = durationInFrames
    ? interpolate(frame, [Math.max(0, durationInFrames - 12), durationInFrames], [0, 6], {
      extrapolateLeft: "clamp",
    })
    : 0;
  const finalBlur = Math.max(entranceBlur, exitBlur);

  const firstStart = 34;
  const firstChars = Math.min(DOC_H1.length, Math.floor(Math.max(0, frame - firstStart)));
  const firstDone = firstChars >= DOC_H1.length;

  const secondStart = firstStart + DOC_H1.length;
  const secondChars = Math.min(DOC_H2.length, Math.floor(Math.max(0, frame - secondStart)));
  const secondDone = secondChars >= DOC_H2.length;

  const dhCursorOpacity = !(firstDone && secondDone)
    ? interpolate(frame % 15, [0, 7, 15], [1, 0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
    : 0;

  const winSpring = spring({ frame, fps, config: { damping: 22, stiffness: 88 } });
  const winScale = interpolate(winSpring, [0, 1], [0.84, 1]);
  const winOpacity = interpolate(winSpring, [0, 1], [0, 1]);
  const tiltX = interpolate(frame, [0, fps * 1.5], [-3, 0], {
    extrapolateRight: "clamp",
  });

  const heroOpacity = interpolate(frame, [12, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroY = interpolate(frame, [12, 32], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tilesOpacity = interpolate(frame, [38, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tilesY = interpolate(frame, [38, 58], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sidebarOpacity = interpolate(frame, [52, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sidebarX = interpolate(frame, [52, 72], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 110% 90% at 50% 40%, #0c3328 0%, #0b1a1d 65%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${winScale}) perspective(1200px) rotateX(${tiltX}deg)`,
          opacity: winOpacity,
          borderRadius: 12,
          overflow: "hidden",
          width: 960,
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)",
          background: "#0b1a1d",
          filter: `blur(${finalBlur}px)`,
        }}
      >
        <div
          style={{
            background: "#1f2937",
            height: 40,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              flex: 1,
              margin: "0 60px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 6,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11, color: "#22c55e" }}>🔒</span>
            <span
              style={{
                fontSize: 12,
                color: "#9ca3af",
                fontFamily: "-apple-system, sans-serif",
              }}
            >
              dev-flow.xyz
            </span>
          </div>
        </div>

        <div
          style={{
            height: 50,
            background: "rgba(11,26,29,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            gap: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 44 44" fill="none">
                <path d="M5 22 L14 13 L23 22 L14 31 Z" fill="white" fillOpacity={0.95} />
                <path d="M18 22 L27 13 L36 22 L27 31 Z" fill="white" fillOpacity={0.55} />
              </svg>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#f8fafc",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              DevFlow
            </span>
          </div>
          {["Docs", "Modules", "Presets", "CLI Reference"].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 13,
                color: "#6b7280",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              {item}
            </span>
          ))}
          <div style={{ flex: 1 }} />
          <div
            style={{
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.28)",
              borderRadius: 6,
              padding: "5px 12px",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#22c55e",
                fontFamily: "'SF Mono','Roboto Mono',monospace",
              }}
            >
              npx create-devflow
            </span>
          </div>
        </div>

        <div style={{ display: "flex", background: "#0b1a1d" }}>
          <div
            style={{
              width: 200,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: "22px 16px",
              opacity: sidebarOpacity,
              transform: `translateX(${sidebarX}px)`,
            }}
          >
            {SIDEBAR_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{
                  fontSize: 12,
                  color: item.active ? "#22c55e" : "#6b7280",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: item.active ? 600 : 400,
                  padding: item.indent ? "4px 0 4px 14px" : "5px 0",
                  borderLeft: item.active
                    ? "2px solid #22c55e"
                    : "2px solid transparent",
                  paddingLeft: item.indent ? 14 : 8,
                }}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: "32px 40px 24px" }}>
            <div
              style={{
                opacity: heroOpacity,
                transform: `translateY(${heroY}px)`,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  borderRadius: 100,
                  padding: "3px 12px",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "#22c55e",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.06em",
                  }}
                >
                  40+ MODULES
                </span>
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  fontFamily: "'Archivo', 'Inter', sans-serif",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: 10,
                  minHeight: "1.2em",
                }}
              >
                <div style={{ display: "inline-block" }}>
                  <div style={{ display: "block", lineHeight: 1.1 }}>
                    <TypewriterText
                      segments={[{ text: DOC_H1, color: "#ffffff" }]}
                      frame={frame}
                      startFrame={firstStart}
                      framesPerChar={1}
                    />
                    {!firstDone && (
                      <span style={{ opacity: dhCursorOpacity, color: "#22c55e", fontWeight: 300 }}>|</span>
                    )}
                  </div>
                  <div style={{ display: "block", lineHeight: 1.1 }}>
                    <TypewriterText
                      segments={[{ text: DOC_H2, color: "#22c55e" }]}
                      frame={frame}
                      startFrame={secondStart}
                      framesPerChar={1}
                    />
                    {firstDone && !secondDone && (
                      <span style={{ opacity: dhCursorOpacity, color: "#22c55e", fontWeight: 300 }}>|</span>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.44)",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                  maxWidth: 520,
                  marginBottom: 24,
                }}
              >
                One command to set up Git hooks, linting, testing, CI/CD, Docker, and more
                — automatically tailored to your stack.
              </div>
            </div>

            <div
              style={{
                opacity: tilesOpacity,
                transform: `translateY(${tilesY}px)`,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {DOC_FEATURES.map((f) => (
                <div
                  key={f.label}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#9ca3af",
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
