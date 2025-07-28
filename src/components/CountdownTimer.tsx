import { useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

export interface CountdownTimerProps {
  startNumber: number;
  endNumber: number;
  color?: string;
  fontSize?: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // Optional duration in frames
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  startNumber, 
  endNumber,
  color = '#FFFFFF',
  fontSize = 128,
  prefix = '',
  suffix = '',
  duration
}) => {
  const frame = useCurrentFrame();
  
  // Since this component is within a Sequence, frame starts at 0 for this component
  // We need to calculate based on how long the countdown should take
  const countdownDuration = duration || 150; // Default to 150 frames (5 seconds)
  
  // Ensure we have valid numbers
  const safeStartNumber = Number(startNumber) || 5;
  const safeEndNumber = Number(endNumber) || 0;
  
  const currentNumber = Math.round(
    interpolate(frame, [0, countdownDuration], [safeStartNumber, safeEndNumber], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  
  // Pulse effect every second (30 frames at 30fps)
  const pulseFrames = 30;
  const scale = interpolate(frame % pulseFrames, [0, pulseFrames/2, pulseFrames], [1, 1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        transform: `scale(${scale})`,
        textAlign: 'center',
      }}>
        {prefix}{currentNumber}{suffix}
      </div>
    </div>
  );
};