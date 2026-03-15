import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COMMAND = "npx create-devflow";
const CHAR_FRAMES = 2;
const CURSOR_BLINK = 15;

const DETECT_LINES: { text: string; color: string; delay: number }[] = [
  { text: "  ● Scanning project…", color: "#94a3b8", delay: 42 },
  { text: "  ✓ TypeScript detected", color: "#22c55e", delay: 52 },
  { text: "  ✓ pnpm detected (v10.6)", color: "#22c55e", delay: 61 },
  { text: "  ✓ React + Vite · monorepo", color: "#22c55e", delay: 70 },
];

const EXEC_LINES: { text: string; color: string; delay: number }[] = [
  { text: "  ✓ husky configured (pre-commit · commit-msg)", color: "#4ade80", delay: 98 },
  { text: "  ✓ lint-staged configured", color: "#4ade80", delay: 108 },
  { text: "  ✓ commitlint configured", color: "#4ade80", delay: 118 },
  { text: "  ✓ eslint + prettier configured", color: "#4ade80", delay: 128 },
  { text: "  ✓ vitest.config.ts created", color: "#4ade80", delay: 138 },
  { text: "  ✓ .github/workflows/ci.yml created", color: "#4ade80", delay: 148 },
  { text: "  ✓ 13 modules configured in 2.1s", color: "#86efac", delay: 163 },
];

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame % CURSOR_BLINK,
    [0, CURSOR_BLINK / 2, CURSOR_BLINK],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <span style={{ opacity, color: "#22c55e" }}>▋</span>;
};

const TitleBar: React.FC = () => (
  <div
    style={{
      background: "#1f2937",
      height: 40,
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: 8,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
    <span
      style={{
        flex: 1,
        textAlign: "center",
        color: "#6b7280",
        fontSize: 13,
        fontFamily: "-apple-system, sans-serif",
        marginRight: 36,
      }}
    >
      Terminal — zsh
    </span>
  </div>
);

export const TerminalScene: React.FC<{ durationInFrames?: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typingDone = COMMAND.length * CHAR_FRAMES;
  const charCount = Math.min(COMMAND.length, Math.floor(frame / CHAR_FRAMES));
  const typedCmd = COMMAND.slice(0, charCount);
  const isTyping = frame < typingDone;

  const winSpring = spring({ frame, fps, config: { damping: 20, stiffness: 85 } });
  const winScale = interpolate(winSpring, [0, 1], [0.65, 1]);
  const winOpacity = interpolate(winSpring, [0, 1], [0, 1]);
  const tiltX = interpolate(frame, [0, fps * 2], [-4, 0], {
    extrapolateRight: "clamp",
  });

  const entranceBlur = interpolate(frame, [0, 12], [6, 0], { extrapolateRight: "clamp" });
  const exitBlur = durationInFrames
    ? interpolate(frame, [Math.max(0, durationInFrames - 12), durationInFrames], [0, 6], {
      extrapolateLeft: "clamp",
    })
    : 0;
  const finalBlur = Math.max(entranceBlur, exitBlur);

  const presetOpacity = interpolate(
    frame,
    [typingDone + 6, typingDone + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const separatorOpacity = interpolate(frame, [82, 94], [0, 1], {
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
          transform: `scale(${winScale}) perspective(1000px) rotateX(${tiltX}deg)`,
          opacity: winOpacity,
          borderRadius: 12,
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)",
          overflow: "hidden",
          width: 900,
          background: "#111827",
          fontFamily: "'SF Mono', 'Fira Code', 'Roboto Mono', monospace",
          filter: `blur(${finalBlur}px)`,
        }}
      >
        <TitleBar />

        <div style={{ background: "#0d1117", padding: "22px 30px 34px" }}>

          <div style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 6 }}>
            <span style={{ color: "#22c55e" }}>~ </span>
            <span style={{ color: "#4b5563" }}>$ </span>
            <span style={{ color: "#f8fafc" }}>{typedCmd}</span>
            {isTyping && <Cursor frame={frame} />}
          </div>

          <div
            style={{
              opacity: presetOpacity,
              fontSize: 13,
              color: "#4b5563",
              fontFamily: "-apple-system, sans-serif",
              marginBottom: 10,
              letterSpacing: "0.01em",
            }}
          >
            Applying{" "}
            <span style={{ color: "#22c55e", fontWeight: 600 }}>recommended</span>
            {" "}preset · 13 modules
          </div>

          {DETECT_LINES.map((line, i) => {
            const opacity = interpolate(
              frame,
              [line.delay, line.delay + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const y = interpolate(
              frame,
              [line.delay, line.delay + 12],
              [6, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: line.color,
                  opacity,
                  transform: `translateY(${y}px)`,
                }}
              >
                {line.text}
              </div>
            );
          })}

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              margin: "10px 0",
              opacity: separatorOpacity,
            }}
          />

          {EXEC_LINES.map((line, i) => {
            const opacity = interpolate(
              frame,
              [line.delay, line.delay + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const y = interpolate(
              frame,
              [line.delay, line.delay + 12],
              [6, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: line.color,
                  opacity,
                  transform: `translateY(${y}px)`,
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
