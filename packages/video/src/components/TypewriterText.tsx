import { interpolate } from "remotion";

export type TextSegment = { text: string; color: string };

const CHAR_FADE = 4;

export const TypewriterText: React.FC<{
  segments: TextSegment[];
  frame: number;
  startFrame?: number;
  framesPerChar?: number;
}> = ({ segments, frame, startFrame = 0, framesPerChar = 1 }) => {
  const spans: React.ReactNode[] = [];
  let globalIdx = 0;

  for (const seg of segments) {
    for (let ci = 0; ci < seg.text.length; ci++) {
      const charFrame = startFrame + globalIdx * framesPerChar;

      if (frame < charFrame) {
        globalIdx++;
        continue;
      }

      const age = frame - charFrame;

      const opacity = interpolate(age, [0, CHAR_FADE], [0.1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      const ch = seg.text[ci];
      spans.push(
        <span
          key={globalIdx}
          style={{
            color: seg.color,
            opacity,
            display: "inline-block",
            whiteSpace: "pre",
          }}
        >
          {ch}
        </span>
      );

      globalIdx++;
    }
  }

  return <>{spans}</>;
};
