import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * A custom Remotion hook to synchronize a GSAP timeline with the current video frame.
 * @param createTimeline A function that receives an HTML element and returns a paused GSAP timeline.
 * @returns A React ref to be attached to the element you want to animate.
 */
export const useSyncedGsap = (
  createTimeline: (element: HTMLDivElement) => gsap.core.Timeline
) => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Set up the GSAP timeline once when the component mounts.
  useLayoutEffect(() => {
    if (ref.current) {
      timelineRef.current = createTimeline(ref.current);
    }
    // Cleanup function to prevent memory leaks.
    return () => timelineRef.current?.kill();
  }, [createTimeline]);

  // On every frame, manually seek the GSAP timeline to the correct time in seconds.
  if (timelineRef.current) {
    timelineRef.current.seek(frame / fps);
  }

  return ref;
};