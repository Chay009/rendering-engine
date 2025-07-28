import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';

export interface SlideTransitionProps {
  backgroundColor: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  children?: React.ReactNode;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({ 
  backgroundColor,
  direction = 'right',
  children
}) => {
  const frame = useCurrentFrame();
  const animationDuration = 60;
  
  let translateX = 0;
  let translateY = 0;
  
  switch (direction) {
    case 'left':
      translateX = interpolate(frame, [0, animationDuration], [-100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'right':
      translateX = interpolate(frame, [0, animationDuration], [100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'up':
      translateY = interpolate(frame, [0, animationDuration], [-100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'down':
      translateY = interpolate(frame, [0, animationDuration], [100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
  }

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor,
        transform: `translateX(${translateX}%) translateY(${translateY}%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};