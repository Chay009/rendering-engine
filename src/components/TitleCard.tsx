import { useCurrentFrame, interpolate, Easing } from 'remotion';
import React from 'react';

export interface TitleCardProps {
  text: string;
  color?: string;
  fontSize?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'scale';
}

export const TitleCard: React.FC<TitleCardProps> = ({ 
  text, 
  color = '#FFFFFF', 
  fontSize = 96,
  animationType = 'fadeIn'
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const scale = animationType === 'scale' 
    ? interpolate(frame, [0, 30], [0.8, 1], {
        easing: Easing.out(Easing.ease),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
    
  const translateY = animationType === 'slideUp'
    ? interpolate(frame, [0, 30], [50, 0], {
        easing: Easing.out(Easing.ease),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h1 style={{ 
        color, 
        opacity, 
        transform: `scale(${scale}) translateY(${translateY}px)`,
        textAlign: 'center', 
        fontSize: `${fontSize}px`,
        margin: 0,
        fontWeight: 'bold',
      }}>
        {text}
      </h1>
    </div>
  );
};