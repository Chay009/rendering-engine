import { useCurrentFrame, interpolate } from 'remotion';
import React from 'react';
import { useAudioEnhancedProps, ComponentAudioSync } from '../hooks/useGlobalAudio';

export interface CountdownTimerProps {
  startNumber: number;
  endNumber: number;
  color?: string;
  fontSize?: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // Optional duration in frames
  audioSync?: ComponentAudioSync;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  startNumber, 
  endNumber,
  color = '#FFFFFF',
  fontSize = 128,
  prefix = '',
  suffix = '',
  duration,
  audioSync
}) => {
  const frame = useCurrentFrame();
  
  // Get audio-enhanced props if audio sync is enabled
  const { audioValues, shouldSync } = useAudioEnhancedProps('CountdownTimer', audioSync);
  
  // Audio-driven timing and intensity
  const countdownDuration = duration || 150;
  const safeStartNumber = Number(startNumber) || 5;
  const safeEndNumber = Number(endNumber) || 0;
  
  // AUDIO-DRIVEN COUNTDOWN: Numbers change based on beats instead of time
  const currentNumber = shouldSync && audioValues.beatTrigger
    ? Math.max(safeEndNumber, safeStartNumber - Math.floor(frame / 15)) // Faster countdown on beats
    : Math.round(
        interpolate(frame, [0, countdownDuration], [safeStartNumber, safeEndNumber], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      );
  
  // Audio-driven pulse: Sync with beats and bass instead of fixed timing
  const audioBasedPulse = shouldSync 
    ? 1 + (audioValues.bassLevel * 0.4) + (audioValues.beatTrigger ? 0.3 : 0) // Bass-driven pulse
    : interpolate(frame % 30, [0, 15, 30], [1, 1.1, 1], { // Original time-based pulse
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  
  // Apply audio-driven scale multipliers for true audio synchronization
  const finalScale = audioBasedPulse * (shouldSync ? audioValues.scaleMultiplier : 1);

  // Debug: Log current values
  console.log(`CountdownTimer - frame: ${frame}, currentNumber: ${currentNumber}, startNumber: ${safeStartNumber}, endNumber: ${safeEndNumber}, duration: ${countdownDuration}`);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        color,
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
        opacity: shouldSync ? audioValues.opacityMultiplier : 1,
        transform: `scale(${finalScale})`,
        textAlign: 'center',
        textShadow: shouldSync && audioValues.beatTrigger ? `0 0 ${audioValues.beatStrength * 40}px ${color}` : 'none',
        filter: shouldSync && audioValues.bassLevel > 0.5 ? `brightness(${1 + audioValues.bassLevel * 0.5})` : 'none',
        transition: 'text-shadow 0.1s ease, filter 0.1s ease',
      }}>
        {prefix}{currentNumber}{suffix}
      </div>
    </div>
  );
};