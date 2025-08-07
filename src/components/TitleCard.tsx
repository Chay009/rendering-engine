import { useCurrentFrame, interpolate, Easing } from 'remotion';
import React from 'react';
import { useAudioEnhancedProps, ComponentAudioSync } from '../hooks/useGlobalAudio';

export interface TitleCardProps {
  text: string;
  color?: string;
  fontSize?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'scale';
  audioSync?: ComponentAudioSync;
}

export const TitleCard: React.FC<TitleCardProps> = ({ 
  text, 
  color = '#FFFFFF', 
  fontSize = 96,
  animationType = 'fadeIn',
  audioSync
}) => {
  const frame = useCurrentFrame();
  
  // Get audio-enhanced props if audio sync is enabled
  const { audioValues, shouldSync } = useAudioEnhancedProps('TitleCard', audioSync);
  
  // TRUE AUDIO-DRIVEN ANIMATIONS: Sync with beats and audio state
  
  // Audio-driven animation timing and intensity
  const audioSpeedMultiplier = shouldSync ? audioValues.speedMultiplier : 1;
  const audioScaleMultiplier = shouldSync ? audioValues.scaleMultiplier : 1;
  const audioOpacityMultiplier = shouldSync ? audioValues.opacityMultiplier : 1;
  
  // Beat-synchronized entrance: Animation triggers are driven by audio
  const effectiveAnimationDuration = shouldSync ? 30 / audioSpeedMultiplier : 30;
  
  // Core animations driven by audio state
  const baseOpacity = interpolate(frame, [0, effectiveAnimationDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const baseScale = animationType === 'scale' 
    ? interpolate(frame, [0, effectiveAnimationDuration], [0.8, 1], {
        easing: shouldSync && audioValues.beatTrigger ? Easing.bounce : Easing.out(Easing.ease),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  
  // Apply audio-driven multipliers to create audio-reactive animations
  const finalOpacity = baseOpacity * audioOpacityMultiplier;
  const finalScale = baseScale * audioScaleMultiplier;
    
  // Audio-driven slideUp animation with beat synchronization  
  const translateY = animationType === 'slideUp'
    ? interpolate(frame, [0, effectiveAnimationDuration], [50, 0], {
        easing: shouldSync && audioValues.beatTrigger ? Easing.bounce : Easing.out(Easing.ease),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;
    
  // DRAMATIC audio-reactive effects for strong visual impact
  const dramaticGlow = shouldSync ? audioValues.glowIntensity : (audioValues.isBeat ? 20 : 0);
  const dramaticBrightness = shouldSync ? 1 + audioValues.colorShift : 1;
  const dramaticSaturation = shouldSync ? 1 + (audioValues.bassLevel * 0.5) : 1;
  const strongBeatEffect = shouldSync && audioValues.strongBeatTrigger;

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
        opacity: finalOpacity, 
        transform: `scale(${finalScale}) translateY(${translateY}px)`,
        textAlign: 'center', 
        fontSize: `${fontSize}px`,
        margin: 0,
        fontWeight: 'bold',
        textShadow: dramaticGlow > 0 ? `0 0 ${dramaticGlow}px ${color}, 0 0 ${dramaticGlow * 2}px ${color}` : 'none',
        filter: shouldSync ? `brightness(${dramaticBrightness}) saturate(${dramaticSaturation}) ${strongBeatEffect ? 'hue-rotate(30deg)' : ''}` : 'none',
        transition: 'text-shadow 0.1s ease, filter 0.1s ease, transform 0.1s ease',
        transformOrigin: 'center',
      }}>
        {text}
      </h1>
    </div>
  );
};