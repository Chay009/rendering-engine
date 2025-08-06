import React from 'react';
import { Audio, useVideoConfig, interpolate } from 'remotion';

interface AudioPlayerProps {
  audioUrl?: string;
  volume?: number;
  startTime?: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
}

/**
 * Type 1: Background Audio Player
 * 
 * Plays audio independently of animations, providing ambient soundtracks
 * or narration without affecting component behavior.
 * 
 * Features:
 * - Volume control with fade in/out effects
 * - Precise timing control
 * - Loop support
 * - Production-safe error handling
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  volume = 1,
  startTime = 0,
  fadeIn = 0,
  fadeOut = 0,
  loop = false,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  // Safe fallback if no audio URL provided
  if (!audioUrl) {
    return null;
  }

  // Additional safety check for common CORS/network issues
  const isGitHubRaw = audioUrl.includes('github.com') && audioUrl.includes('/raw/');
  if (isGitHubRaw) {
    console.warn('GitHub raw files may have CORS restrictions. Consider using staticFile() or a CORS-enabled source.');
  }

  // Calculate fade timing
  const fadeInFrames = fadeIn * fps;
  const fadeOutStartFrame = durationInFrames - (fadeOut * fps);

  // Calculate start frame offset
  const startFromFrame = startTime * fps;

  try {
    return (
      <Audio
        src={audioUrl}
        volume={(f) => {
          // Ensure input range is strictly monotonically increasing
          const safeInputRange = [
            0,
            Math.max(1, fadeInFrames), // Ensure at least 1 frame difference
            Math.max(fadeInFrames + 1, fadeOutStartFrame), // Ensure progression
            Math.max(fadeOutStartFrame + 1, durationInFrames), // Ensure end is after start
          ];
          
          const outputRange = [0, volume, volume, 0];
          
          return Math.max(0, Math.min(1, interpolate(
            f,
            safeInputRange,
            outputRange,
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          )));
        }} // Use callback function as required by Remotion
        startFrom={startFromFrame}
        loop={loop}
      />
    );
  } catch (error) {
    // Graceful fallback - log error but don't crash render
    console.error('AudioPlayer error:', error);
    return null;
  }
};