import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { useAudioEnhancedProps, ComponentAudioSync } from '../hooks/useGlobalAudio';

interface LetterFlickeringProps {
  text?: string;
  targetLetterIndex?: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  
  // Animation timing (in frames)
  zoomInDuration?: number;
  hingeRotationDuration?: number;
  fadeOutDuration?: number;
  finalZoomDuration?: number;
  
  // Animation controls
  initialScale?: number;
  midZoomScale?: number;
  finalZoomScale?: number;
  hingeRotationAngle?: number;
  
  // 3D perspective
  perspective?: number;
  transformOrigin?: string;
  
  // Audio sync support
  audioSync?: ComponentAudioSync;
}

export const LetterFlickering: React.FC<LetterFlickeringProps> = ({
  text = "EXPLORE",
  targetLetterIndex = 4, // Default to 'O' in "EXPLORE"
  fontSize = 120,
  fontWeight = 800,
  color = "#f0f0f0",
  backgroundColor = "#1a1a1a",
  fontFamily = "Arial Black, sans-serif",
  
  // Animation timing defaults (in frames at 30fps)
  zoomInDuration = 30,        // 1 second
  hingeRotationDuration = 30, // 1 second
  fadeOutDuration = 15,       // 0.5 seconds
  finalZoomDuration = 60,     // 2 seconds
  
  // Animation scale values
  initialScale = 1,
  midZoomScale = 4,
  finalZoomScale = 50,
  hingeRotationAngle = 90,
  
  // 3D settings
  perspective = 800,
  transformOrigin = "center top",
  
  audioSync
}) => {
  const frame = useCurrentFrame();
  
  // Get audio-enhanced properties
  const audioEnhanced = useAudioEnhancedProps('LetterFlickering', audioSync);
  const audioValues = audioEnhanced.audioValues;
  
  // Split text into letters
  const letters = text.split('');
  
  // Calculate animation phases
  const phase1End = zoomInDuration;
  const phase2End = phase1End + hingeRotationDuration;
  const phase3End = phase2End + fadeOutDuration;
  const totalDuration = phase3End + finalZoomDuration;
  
  // Phase 1: Initial zoom in
  const initialZoom = interpolate(
    frame,
    [0, phase1End],
    [initialScale, midZoomScale],
    {
      easing: audioValues.isBeat ? Easing.bounce : Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );
  
  // Phase 2: Hinge rotation (starts at same time as zoom)
  const hingeRotation = interpolate(
    frame,
    [0, phase2End],
    [0, hingeRotationAngle],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );
  
  // Phase 3: Fade out non-target letters
  const fadeOutProgress = interpolate(
    frame,
    [phase1End + fadeOutDuration * 0.25, phase3End],
    [1, 0],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );
  
  // Phase 4: Final zoom into target letter
  const finalZoom = interpolate(
    frame,
    [phase1End, totalDuration],
    [midZoomScale, finalZoomScale],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );
  
  // Apply audio enhancements
  const audioScaleMultiplier = audioValues.scaleMultiplier || 1;
  const audioOpacityMultiplier = audioValues.opacityMultiplier || 1;
  const audioGlowIntensity = audioValues.glowIntensity || 0;
  
  // Calculate final scales with audio enhancement
  const currentScale = frame <= phase1End ? initialZoom : finalZoom;
  const finalScale = currentScale * audioScaleMultiplier;
  
  // Smooth scaling with anti-aliasing
  const smoothScaling: React.CSSProperties = {
    imageRendering: 'auto',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translateZ(0)', // Force hardware acceleration
    willChange: 'transform, opacity'
  };
  
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        perspective: `${perspective}px`,
        ...smoothScaling
      }}
    >
      <div
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          fontFamily,
          display: 'flex',
          transformStyle: 'preserve-3d',
          transform: `
            scale(${finalScale}) 
            rotateX(${hingeRotation}deg)
          `,
          transformOrigin,
          opacity: audioOpacityMultiplier,
          filter: audioGlowIntensity > 0 ? `drop-shadow(0 0 ${audioGlowIntensity}px ${color})` : 'none',
          transition: 'none', // Disable transitions for smooth frame-by-frame animation
          ...smoothScaling
        }}
      >
        {letters.map((letter, index) => {
          const isTargetLetter = index === targetLetterIndex;
          
          // Calculate letter opacity
          const letterOpacity = isTargetLetter 
            ? audioOpacityMultiplier 
            : fadeOutProgress * audioOpacityMultiplier;
          
          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                color,
                opacity: letterOpacity,
                transform: isTargetLetter && frame > phase3End 
                  ? `scale(${interpolate(
                      frame,
                      [phase3End, totalDuration],
                      [1, 1.2],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    )})`
                  : 'scale(1)',
                ...smoothScaling
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
      
      {/* Audio-reactive background pulse */}
      {audioValues.isBeat && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            opacity: audioValues.intensity * 0.3,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};