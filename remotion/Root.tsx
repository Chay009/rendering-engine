import { Composition } from "remotion";
import { HelloWorld, helloWorldCompSchema } from "./HelloWorld";
import { DynamicVideo } from '../src/DynamicVideo';
import { VideoRequestSchema } from '../src/schema';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={800}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={helloWorldCompSchema}
        defaultProps={{
          titleText: "Render Server Template",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
      <Composition
        id="DynamicVideo"
        component={DynamicVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        schema={VideoRequestSchema}
        defaultProps={{
          width: 1920,
          height: 1080,
          fps: 30,
          timeline: [
            { 
              component: 'TitleCard', 
              props: { text: 'Default - should be overridden by UI data', animationType: 'fadeIn' }, 
              startFrame: 0, 
              durationInFrames: 90 
            }
          ]
        }}
      />
    </>
  );
};
