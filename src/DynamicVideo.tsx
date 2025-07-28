import { AbsoluteFill, Sequence, Composition } from 'remotion';
import { VideoRequest, TimelineItem } from './schema';
import * as Components from './components';
import React from 'react';

/**
 * This component is the core of the dynamic renderer. It takes the timeline array
 * and dynamically renders each item in a Remotion Sequence.
 */
const DynamicVideo: React.FC<VideoRequest> = ({ timeline }) => {
  // 🐛 DEBUG: Log what timeline data we're actually receiving
  console.log('🎬 DynamicVideo received timeline:', JSON.stringify(timeline, null, 2));
  console.log('🎬 Timeline length:', timeline?.length || 0);
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {timeline.map((item, index) => {
        // Look up the component by its name (e.g., "TitleCard").
        const ComponentToRender = Components[item.component as keyof typeof Components];
        
        // A crucial safety check.
        if (!ComponentToRender) {
          console.error(`Component "${item.component}" not found in component library!`);
          return (
            <Sequence
              key={index}
              from={item.startFrame}
              durationInFrames={item.durationInFrames}
            >
              <AbsoluteFill style={{ 
                backgroundColor: 'red', 
                color: 'white', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                fontSize: '48px'
              }}>
                Component "{item.component}" not found!
              </AbsoluteFill>
            </Sequence>
          );
        }

        return (
          <Sequence
            key={index}
            from={item.startFrame}
            durationInFrames={item.durationInFrames}
          >
            {/* @ts-expect-error - Dynamic component props */}
            <ComponentToRender {...item.props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Calculate total video duration from the timeline.
 */
const calculateDuration = (timeline: TimelineItem[]): number => {
  if (!timeline || timeline.length === 0) return 300; // Default to 10 seconds
  return Math.max(...timeline.map(item => item.startFrame + item.durationInFrames));
};

/**
 * This is the Remotion entry point for dynamic compositions.
 */
export const DynamicComposition: React.FC = () => {
  // Example props for local development and previewing.
  const defaultTimeline: TimelineItem[] = [
    { 
      component: 'TitleCard', 
      props: { text: 'Dynamic Video Demo', animationType: 'fadeIn' }, 
      startFrame: 0, 
      durationInFrames: 90 
    },
    { 
      component: 'GsapTitle', 
      props: { text: 'GSAP Animation', animationType: 'stagger' }, 
      startFrame: 90, 
      durationInFrames: 120 
    },
    { 
      component: 'CountdownTimer', 
      props: { startNumber: 10, endNumber: 0, suffix: '!' }, 
      startFrame: 210, 
      durationInFrames: 90 
    }
  ];

  const defaultProps: VideoRequest = {
    width: 1920,
    height: 1080,
    fps: 30,
    timeline: defaultTimeline
  };

  return (
    <Composition
      id="DynamicVideo"
      component={DynamicVideo}
      durationInFrames={calculateDuration(defaultProps.timeline)}
      fps={defaultProps.fps}
      width={defaultProps.width}
      height={defaultProps.height}
      defaultProps={defaultProps}
    />
  );
};

export { DynamicVideo };