import React from 'react';
import { interpolate } from 'remotion';
import { useAudioAnalysis } from '../../hooks/useAudioAnalysis';

interface AudioSyncedTextProps {
  text: string;
  audioUrl?: string;
  baseSize?: number;
  color?: string;
  syncType?: 'bass' | 'mids' | 'highs' | 'overall';
  reactivity?: number;
  glowEffect?: boolean;
}

/**
 * Type 2: Audio-Synced Text Component
 * 
 * Text that scales, pulses, and reacts to audio frequency analysis,
 * creating dynamic typography synchronized with music.
 * 
 * Features:
 * - Reactive font size based on audio frequencies
 * - Color intensity changes
 * - Optional glow effects
 * - Multiple frequency sync options
 * - Configurable reactivity levels
 */
export const AudioSyncedText: React.FC<AudioSyncedTextProps> = ({
  text,
  audioUrl,
  baseSize = 48,
  color = '#FFFFFF',
  syncType = 'overall',
  reactivity = 1,
  glowEffect = false,
}) => {
  // Get audio analysis data
  const audioAnalysis = useAudioAnalysis(audioUrl);
  
  // Get the audio value based on sync type
  const audioValue = audioAnalysis[syncType] || 0;
  
  // Reactive font size based on audio
  const fontSize = interpolate(
    audioValue * reactivity,
    [0, 1],
    [baseSize, baseSize * 1.5],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // Reactive opacity based on audio activity
  const opacity = interpolate(
    audioValue,
    [0, 1],
    [0.7, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // Text shadow/glow effect
  const textShadow = glowEffect
    ? [
        `0 0 ${audioValue * reactivity * 10}px ${color}`,
        `0 0 ${audioValue * reactivity * 20}px ${color}`,
        `0 0 ${audioValue * reactivity * 30}px ${color}`,
      ].join(', ')
    : 'none';
  
  // Letter spacing effect
  const letterSpacing = interpolate(
    audioValue * reactivity,
    [0, 1],
    [0, 4],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontSize,
          color,
          opacity,
          fontWeight: 'bold',
          textShadow,
          letterSpacing: `${letterSpacing}px`,
          transition: 'all 0.1s ease',
          userSelect: 'none',
        }}
      >
        {text}
      </span>
      
      {/* Optional audio data display for debugging */}
      {process.env.NODE_ENV === 'development' && audioUrl && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'white',
            fontSize: 10,
            fontFamily: 'monospace',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
            lineHeight: 1.2,
          }}
        >
          <div>Sync: {syncType}</div>
          <div>Value: {audioValue.toFixed(2)}</div>
          <div>Size: {fontSize.toFixed(0)}px</div>
          <div>Active: {audioAnalysis.isActive ? '●' : '○'}</div>
        </div>
      )}
    </div>
  );
};