import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Audio-reactive timeline configuration
export interface AudioTimelineConfig {
  enabled?: boolean;           // Enable audio-reactive timeline
  maxSpeed?: number;          // Maximum timeline speed multiplier (default: 2.0)
  minSpeed?: number;          // Minimum timeline speed multiplier (default: 0.5)
  beatPause?: boolean;        // Pause timeline momentarily on strong beats
  beatResume?: boolean;       // Resume timeline after beat pause
  smoothing?: number;         // Speed change smoothing factor (0-1, default: 0.8)
}

// Audio values interface (matching the enhanced audio values)
export interface AudioEnhancedValues {
  speedMultiplier?: number;
  isBeat?: boolean;
  intensity?: number;
  beatTrigger?: boolean;
}

/**
 * Enhanced GSAP timeline hook with audio-reactive timing support.
 * @param createTimeline A function that receives an HTML element and returns a paused GSAP timeline.
 * @param audioValues Optional audio-enhanced values for timeline speed control.
 * @param audioConfig Optional configuration for audio-reactive timeline behavior.
 * @returns A React ref to be attached to the element you want to animate.
 */
export const useSyncedGsap = (
  createTimeline: (element: HTMLDivElement) => gsap.core.Timeline,
  audioValues?: AudioEnhancedValues,
  audioConfig?: AudioTimelineConfig
) => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();
  const smoothedSpeedRef = useRef<number>(1);
  const beatPauseRef = useRef<boolean>(false);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Audio configuration with defaults
  const config: AudioTimelineConfig = {
    enabled: false,
    maxSpeed: 2.0,
    minSpeed: 0.5,
    beatPause: false,
    beatResume: true,
    smoothing: 0.8,
    ...audioConfig
  };

  // Set up the GSAP timeline once when the component mounts.
  useLayoutEffect(() => {
    if (ref.current) {
      timelineRef.current = createTimeline(ref.current);
    }
    // Cleanup function to prevent memory leaks.
    return () => timelineRef.current?.kill();
  }, [createTimeline]);

  // Calculate audio-reactive timeline timing
  if (timelineRef.current) {
    let timelineSpeed = 1;
    
    // Apply audio-reactive speed if enabled and audio values available
    if (config.enabled && audioValues) {
      // Get base speed from audio
      const rawSpeed = audioValues.speedMultiplier || 1;
      
      // Apply speed limits
      const clampedSpeed = Math.max(
        config.minSpeed!, 
        Math.min(config.maxSpeed!, rawSpeed)
      );
      
      // Apply smoothing to prevent jarring speed changes
      smoothedSpeedRef.current = 
        smoothedSpeedRef.current * config.smoothing! + 
        clampedSpeed * (1 - config.smoothing!);
      
      timelineSpeed = smoothedSpeedRef.current;
      
      // Beat pause/resume logic
      if (config.beatPause && audioValues.isBeat && !beatPauseRef.current) {
        // Start beat pause
        beatPauseRef.current = true;
        timelineSpeed = 0; // Pause timeline
      } else if (config.beatResume && beatPauseRef.current && !audioValues.isBeat) {
        // Resume after beat
        beatPauseRef.current = false;
      } else if (beatPauseRef.current) {
        // Continue pausing
        timelineSpeed = 0;
      }
    }
    
    // Calculate final timeline time with speed multiplier
    const audioAdjustedTime = (frame / fps) * timelineSpeed;
    
    // Seek to the calculated time
    timelineRef.current.seek(audioAdjustedTime);
  }

  return ref;
};