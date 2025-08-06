import { AbsoluteFill, Sequence, Composition, staticFile } from 'remotion';
import { VideoRequest, TimelineItem } from './schema';
import * as Components from './components';
import { AudioPlayer } from './components/audio';
import { GlobalAudioProvider } from './components/GlobalAudioProvider';
import React from 'react';

/**
 * This component is the core of the dynamic renderer. It takes the timeline array
 * and dynamically renders each item in a Remotion Sequence.
 */
const DynamicVideo: React.FC<VideoRequest> = ({ timeline, audioConfig }) => {
  // 🐛 DEBUG: Log what timeline data we're actually receiving
  console.log('🎬 DynamicVideo received timeline:', JSON.stringify(timeline, null, 2));
  console.log('🎵 DynamicVideo received audioConfig:', JSON.stringify(audioConfig, null, 2));
  console.log('🎬 Timeline length:', timeline?.length || 0);
  
  // Prepare global audio configuration
  const globalAudioConfig = {
    audioUrl: audioConfig?.audioUrl ? staticFile(audioConfig.audioUrl) : undefined,
    globalSync: audioConfig?.globalSync,
  };
  
  // 🐛 DEBUG: Log audio configuration details
  console.log('🎵 Global audio config prepared:', JSON.stringify(globalAudioConfig, null, 2));
  console.log('🎵 Original audioConfig:', JSON.stringify(audioConfig, null, 2));

  // Only wrap with GlobalAudioProvider if there's audio configuration
  const VideoContent = (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
        {/* Type 1: Background Audio Player */}
        {audioConfig?.audioUrl && (
          <AudioPlayer
            audioUrl={staticFile(audioConfig.audioUrl)}
            volume={audioConfig.volume}
            startTime={audioConfig.startTime}
            fadeIn={audioConfig.fadeIn}
            fadeOut={audioConfig.fadeOut}
            loop={audioConfig.loop}
          />
        )}
        
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

        // 🚨 DEBUG: Log component rendering details
        console.log(`🎯 Rendering component "${item.component}" with props:`, item.props);
        
        // 🎵 AUDIO FIX: Convert audioUrl to staticFile for audio components
        const processedProps = { ...item.props };
        if (processedProps.audioUrl && typeof processedProps.audioUrl === 'string') {
          // Only convert if it's a simple filename (not a full URL)
          if (!processedProps.audioUrl.startsWith('http') && !processedProps.audioUrl.startsWith('blob:')) {
            processedProps.audioUrl = staticFile(processedProps.audioUrl);
            console.log(`🎵 Converted audio URL to staticFile: ${processedProps.audioUrl}`);
          }
        }
        
        return (
          <Sequence
            key={index}
            from={item.startFrame}
            durationInFrames={item.durationInFrames}
          >
            {/* @ts-expect-error - Dynamic component props */}
            <ComponentToRender {...processedProps} />
          </Sequence>
        );
        })}
      </AbsoluteFill>
  );

  // Return content wrapped with GlobalAudioProvider only if there's a valid audio URL
  // This prevents useAudioData from being called with empty strings
  const hasValidAudioUrl = Boolean(audioConfig?.audioUrl && audioConfig.audioUrl.trim());
  
  if (hasValidAudioUrl) {
    return (
      <GlobalAudioProvider audioConfig={globalAudioConfig}>
        {VideoContent}
      </GlobalAudioProvider>
    );
  } else {
    return VideoContent;
  }
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
    timeline: defaultTimeline,
    // Optional: Add audio configuration for testing
    // Uncomment when you have audio files in public/ folder
    // audioConfig: {
    //   audioUrl: 'sample-music.mp3',
    //   volume: 0.8,
    //   fadeIn: 1,
    //   fadeOut: 2,
    //   loop: true
    // }
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