import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TypewriterText } from "../components/TypewriterText";

const HERO_H1 = "Your repo deserves ";
const HERO_H2 = "a proper workflow";
const HERO_SUB = "One command is all it takes";

export const PartnershipScene: React.FC<{ durationInFrames?: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = durationInFrames ?? 140;
  const endDelay = 30;
  const holdFrame = Math.max(0, total - endDelay);
  const tFrame = Math.min(frame, holdFrame);

  const dotOpacity = interpolate(tFrame, [0, 22], [0, 0.13], {
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(
    tFrame % 60,
    [0, 30, 60],
    [0.22, 0.42, 0.22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const framesPerChar = 1.5;
  const firstStart = 4;
  const firstChars = Math.min(HERO_H1.length, Math.floor(Math.max(0, tFrame - firstStart) / framesPerChar));
  const firstDone = firstChars >= HERO_H1.length;

  const secondStart = firstStart + HERO_H1.length * framesPerChar;
  const secondChars = Math.min(HERO_H2.length, Math.floor(Math.max(0, tFrame - secondStart) / framesPerChar));
  const secondDone = secondChars >= HERO_H2.length;

  const subDelay = 8;
  const subStart = secondStart + HERO_H2.length * framesPerChar + subDelay;
  const sChars = Math.min(HERO_SUB.length, Math.floor(Math.max(0, tFrame - subStart) / framesPerChar));
  const sDone = sChars >= HERO_SUB.length;

  const activeCursor = !firstDone ? "h" : !secondDone ? "s" : !sDone ? "sub" : "none";
  const cursorOpacity =
    activeCursor !== "none"
      ? interpolate(tFrame % 15, [0, 7, 15], [1, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
      : 0;

  const headlineOpacity = interpolate(tFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cmdSpring = spring({
    frame: tFrame - 36,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const cmdScale = interpolate(cmdSpring, [0, 1], [0.6, 1]);
  const cmdOpacity = interpolate(cmdSpring, [0, 1], [0, 1]);

  const pillsOpacity = interpolate(tFrame, [62, 78], [0, 1], {
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
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: dotOpacity,
          backgroundImage:
            "radial-gradient(rgba(34,197,94,0.5) 1px, transparent 1px)",
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
            opacity: headlineOpacity,
            fontSize: 58,
            fontWeight: 900,
            fontFamily: "'Archivo', 'Inter', '-apple-system', sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            textAlign: "center",
            maxWidth: 720,
            minHeight: "1.2em",
          }}
        >
          <div style={{ whiteSpace: "pre-wrap" }}>
            <div style={{ display: "block" }}>
              <TypewriterText
                segments={[{ text: HERO_H1, color: "#ffffff" }]}
                frame={tFrame}
                startFrame={firstStart}
                framesPerChar={1.5}
              />
              {activeCursor === "h" && (
                <span style={{ opacity: cursorOpacity, color: "#ffffff", fontWeight: 300 }}>|</span>
              )}
            </div>
            <div style={{ display: "block" }}>
              <TypewriterText
                segments={[{ text: HERO_H2, color: "#22c55e" }]}
                frame={tFrame}
                startFrame={secondStart}
                framesPerChar={1.5}
              />
              {activeCursor === "s" && (
                <span style={{ opacity: cursorOpacity, color: "#22c55e", fontWeight: 300 }}>|</span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.48)",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.01em",
            textAlign: "center",
            minHeight: "1.4em",
          }}
        >
          <TypewriterText
            segments={[{ text: HERO_SUB, color: "rgba(255,255,255,0.48)" }]}
            frame={tFrame}
            startFrame={subStart}
            framesPerChar={framesPerChar}
          />
          {activeCursor === "sub" && (
            <span style={{ opacity: cursorOpacity, color: "rgba(255,255,255,0.48)", fontWeight: 300 }}>|</span>
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
            padding: "18px 38px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: `0 0 70px rgba(34,197,94,${glowPulse * 0.6})`,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontFamily: "'SF Mono','Fira Code','Roboto Mono',monospace",
              color: "#374151",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            $
          </span>
          <span
            style={{
              fontSize: 28,
              fontFamily: "'SF Mono','Fira Code','Roboto Mono',monospace",
              color: "#4ade80",
              fontWeight: 500,
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            npx create-devflow
          </span>
        </div>

        <div
          style={{
            opacity: pillsOpacity,
            marginTop: 30,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          {["Open-source", "Free forever", "Any stack"].map((text, i, arr) => (
            <>
              <span
                key={text}
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.30)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                {text}
              </span>
              {i < arr.length - 1 && (
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.12)",
                  }}
                >
                  ·
                </span>
              )}
            </>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { PartnershipScene as CTAScene };
