import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HeroScene } from "./scenes/HeroScene";
import { TerminalScene } from "./scenes/TerminalScene";
import { AsciiOutputScene } from "./scenes/AsciiOutputScene";
import { AnnouncementScene } from "./scenes/AnnouncementScene";
import { PartnershipScene } from "./scenes/PartnershipScene";


export const MyComposition = () => {
  return (
    <AbsoluteFill style={{ background: "#0b1a1d" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HeroScene durationInFrames={90} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ durationInFrames: 15, config: { damping: 200 } })}
        />

        <TransitionSeries.Sequence durationInFrames={180}>
          <TerminalScene durationInFrames={180} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ durationInFrames: 20, config: { damping: 200 } })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <AsciiOutputScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ durationInFrames: 20, config: { damping: 200 } })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <AnnouncementScene durationInFrames={120} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={140}>
          <PartnershipScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
