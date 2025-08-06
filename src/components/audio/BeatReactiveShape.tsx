import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { useAudioAnalysis } from '../../hooks/useAudioAnalysis';

interface BeatReactiveShapeProps {
  audioUrl?: string;
  baseColor?: string;
  beatColor?: string;
  shape?: 'circle' | 'square' | 'triangle';
  size?: number;
  reactivity?: number;
}

/**
 * Type 2: Beat Reactive Shape Component
 * 
 * A shape that reacts to audio beats and frequency analysis,
 * creating dynamic visual effects synchronized with music.
 * 
 * Features:
 * - Beat-responsive scaling animation
 * - Color changes based on audio intensity
 * - Glow effects synchronized with bass frequencies
 * - Multiple shape options
 * - Configurable reactivity levels
 */
export const BeatReactiveShape: React.FC<BeatReactiveShapeProps> = ({
  audioUrl,
  baseColor = '#333333',
  beatColor = '#FF6347',
  shape = 'circle',
  size = 100,
  reactivity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Get audio analysis data
  const { isBeat, bass, overall, isActive } = useAudioAnalysis(audioUrl);
  
  // Beat-reactive scaling animation
  const targetScale = isBeat ? 1 + (reactivity * 0.3) : 1;
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
    },
    from: 1,
    to: targetScale,
  });
  
  // Color based on audio intensity
  const currentColor = isActive && overall > 0.5 ? beatColor : baseColor;
  
  // Glow effect based on bass frequencies
  const glowIntensity = bass * reactivity * 20;
  const glowColor = isBeat ? beatColor : baseColor;
  
  // Shape-specific styles
  const getShapeStyles = () => {
    const baseStyles = {
      width: size,
      height: size,
      backgroundColor: currentColor,
      transform: `scale(${scale})`,
      boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
      transition: 'background-color 0.1s ease, box-shadow 0.1s ease',
    };
    
    switch (shape) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
        };
      case 'square':
        return {
          ...baseStyles,
          borderRadius: '4px',
        };
      case 'triangle':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${currentColor}`,
          boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
        };
      default:
        return baseStyles;
    }
  };
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div style={getShapeStyles()} />
      
      {/* Optional beat indicator for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'white',
            fontSize: 12,
            fontFamily: 'monospace',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          Beat: {isBeat ? '●' : '○'} | Bass: {bass.toFixed(2)} | Overall: {overall.toFixed(2)}
        </div>
      )}
    </div>
  );
};