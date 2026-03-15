import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TypewriterText } from "../components/TypewriterText";

const DevFlowIcon: React.FC<{ glowIntensity: number }> = ({ glowIntensity }) => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: 20,
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 80px rgba(34,197,94,${glowIntensity}), 0 8px 32px rgba(22,163,74,0.45)`,
    }}
  >
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M5 22 L14 13 L23 22 L14 31 Z" fill="white" fillOpacity={0.95} />
      <path d="M18 22 L27 13 L36 22 L27 31 Z" fill="white" fillOpacity={0.55} />
    </svg>
  </div>
);

const TITLE = "DevFlow";
const TAGLINE = "Bootstrap a complete workflow in any repository";

export const HeroScene: React.FC<{ durationInFrames?: number }> = ({ durationInFrames = 90 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotOpacity = interpolate(frame, [8, 40], [0, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.32, 0.55, 0.32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const logoSpring = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const logoY = interpolate(logoSpring, [0, 1], [55, 0]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const titleChars = Math.min(
    TITLE.length,
    Math.floor(Math.max(0, frame - 5) / 2)
  );
  const titleDone = titleChars >= TITLE.length;

  const tagChars = Math.min(
    TAGLINE.length,
    Math.floor(Math.max(0, frame - 23))
  );
  const tagDone = tagChars >= TAGLINE.length;

  const activeCursor = !titleDone ? "title" : !tagDone ? "tag" : "none";
  const cursorOpacity =
    activeCursor !== "none"
      ? interpolate(frame % 15, [0, 7, 15], [1, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
      : 0;

  const cmdDelay = 42;
  const cmdSpring = spring({
    frame: frame - cmdDelay,
    fps,
    config: { damping: 14, stiffness: 170 },
  });
  const cmdScale = interpolate(cmdSpring, [0, 1], [0.65, 1]);
  const cmdOpacity = interpolate(cmdSpring, [0, 1], [0, 1]);

  const exitDuration = 20;
  const exitStart = Math.max(0, durationInFrames - exitDuration);
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitBlur = interpolate(frame, [exitStart, durationInFrames], [0, 18], {
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
        overflow: "hidden",
        opacity: exitOpacity,
        filter: `blur(${exitBlur}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: dotOpacity,
          backgroundImage:
            "radial-gradient(rgba(34,197,94,0.55) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            transform: `translateY(${logoY}px)`,
            opacity: logoOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <DevFlowIcon glowIntensity={glowPulse} />

          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "'Archivo', 'Inter', '-apple-system', 'Segoe UI', sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textAlign: "center",
              minWidth: "7ch",
            }}
          >
            {TITLE.length > 0 && (
              <TypewriterText
                segments={[{ text: TITLE, color: "#ffffff" }]}
                frame={frame}
                startFrame={5}
                framesPerChar={2}
              />
            )}
            {activeCursor === "title" && (
              <span style={{ opacity: cursorOpacity, color: "#22c55e", fontWeight: 300 }}>|</span>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.52)",
            fontFamily: "'Inter', '-apple-system', sans-serif",
            letterSpacing: "-0.01em",
            textAlign: "center",
            minHeight: "1.4em",
          }}
        >
          <TypewriterText
            segments={[{ text: TAGLINE, color: "rgba(255,255,255,0.52)" }]}
            frame={frame}
            startFrame={23}
            framesPerChar={1}
          />
          {activeCursor === "tag" && (
            <span style={{ opacity: cursorOpacity, color: "rgba(255,255,255,0.52)", fontWeight: 300 }}>|</span>
          )}
        </div>

        <div
          style={{
            transform: `scale(${cmdScale})`,
            opacity: cmdOpacity,
            marginTop: 44,
            background: "rgba(34,197,94,0.10)",
            border: "1px solid rgba(34,197,94,0.28)",
            borderRadius: 14,
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontFamily: "'SF Mono', 'Fira Code', 'Roboto Mono', monospace",
              color: "#4b5563",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            $
          </span>
          <span
            style={{
              fontSize: 24,
              fontFamily: "'SF Mono', 'Fira Code', 'Roboto Mono', monospace",
              color: "#4ade80",
              fontWeight: 500,
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            npx create-devflow
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
