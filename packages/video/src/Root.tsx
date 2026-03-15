import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

const DURATION = 575;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="devflow"
        component={MyComposition}
        durationInFrames={DURATION}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
