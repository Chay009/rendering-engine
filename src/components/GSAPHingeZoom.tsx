import React, { useCallback } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';
import { useAudioEnhancedProps, ComponentAudioSync } from '../hooks/useGlobalAudio';

interface GSAPHingeZoomProps {
  text?: string;
  targetLetterIndex?: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  
  // 3D perspective settings
  perspective?: number;
  transformOrigin?: string;
  
  // Audio sync support
  audioSync?: ComponentAudioSync;
}

export const GSAPHingeZoom: React.FC<GSAPHingeZoomProps> = ({
  text = "EXPLORE",
  targetLetterIndex = 4, // Default to 'O' in "EXPLORE" 
  fontSize = 120,
  fontWeight = 800,
  color = "#f0f0f0",
  backgroundColor = "#1a1a1a",
  fontFamily = "Arial Black, sans-serif",
  
  // 3D settings
  perspective = 800,
  transformOrigin = "center top", // "transformOrigin: 'center top'" from GSAP
  
  audioSync
}) => {
  // Get audio-enhanced properties
  const audioEnhanced = useAudioEnhancedProps('GSAPHingeZoom', audioSync);
  const audioValues = audioEnhanced.audioValues;
  
  // Apply audio enhancements
  const audioOpacityMultiplier = audioValues.opacityMultiplier || 1;
  const audioGlowIntensity = audioValues.glowIntensity || 0;
  
  // Create GSAP Timeline (EXACT MATCH to reference)
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    const word = element.querySelector('.word');
    const letters = element.querySelectorAll('.letter');
    const targetLetter = element.querySelector('.target-letter');
    
    if (!word || !letters.length || !targetLetter) return timeline;

    // GSAP Timeline Recreation (EXACT MATCH):
    // 1. Initial zoom on the whole word
    timeline.to(word, {
      scale: 4,
      duration: 1
    })
    
    // 2. Hinge rotation of the word (starts same time as zoom)
    .to(word, {
      rotateX: 90,
      transformOrigin: "center top",
      duration: 1
    }, "<")
    
    // 3. Fade out non-target letters (starts 0.25 into rotation)
    .to(letters, {
      opacity: (i, el) => (el === targetLetter ? 1 : 0),
      duration: 0.5
    }, "<0.25")

    // 4. Zoom into the target letter (starts with fade)
    .to(targetLetter, {
      scale: 50,
      duration: 2
    }, "<");
    
    return timeline;
  }, []);

  const ref = useSyncedGsap(createTimeline);
  
  // Split text into letters
  const letters = text.split('');
  
  // Smooth rendering optimizations
  const smoothRendering: React.CSSProperties = {
    imageRendering: 'auto',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    willChange: 'transform, opacity'
  };
  
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        perspective: `${perspective}px`,
        position: 'relative',
        ...smoothRendering
      }}
    >
      {/* Word container - GSAP will animate this */}
      <div
        className="word"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          fontFamily,
          display: 'flex',
          transformStyle: 'preserve-3d',
          transformOrigin,
          color,
          opacity: audioOpacityMultiplier,
          filter: audioGlowIntensity > 0 ? `drop-shadow(0 0 ${audioGlowIntensity}px ${color})` : 'none',
          ...smoothRendering
        }}
      >
        {letters.map((letter, index) => {
          const isTargetLetter = index === targetLetterIndex;
          
          return (
            <span
              key={index}
              className={isTargetLetter ? "letter target-letter" : "letter"}
              style={{
                display: 'inline-block',
                transformOrigin: 'center',
                zIndex: isTargetLetter ? 100 : 1,
                ...smoothRendering
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