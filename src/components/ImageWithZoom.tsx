import { useCurrentFrame, interpolate, Img } from 'remotion';
import React from 'react';
import { useAudioEnhancedProps, ComponentAudioSync } from '../hooks/useGlobalAudio';

export interface ImageWithZoomProps {
  imageUrl?: string;
  zoomIntensity?: number;
  direction?: 'in' | 'out';
  fit?: 'cover' | 'contain' | 'fill';
  fallbackText?: string;
  fallbackColor?: string;
  audioSync?: ComponentAudioSync;
}

export const ImageWithZoom: React.FC<ImageWithZoomProps> = ({ 
  imageUrl, 
  zoomIntensity = 0.2,
  direction = 'in',
  fit = 'cover',
  fallbackText = 'Image not available',
  fallbackColor = '#333',
  audioSync
}) => {
  const frame = useCurrentFrame();
  const duration = 120; // Assume component duration for zoom calculation
  
  // Get audio-enhanced props if audio sync is enabled
  const { audioValues, shouldSync } = useAudioEnhancedProps('ImageWithZoom', audioSync);
  
  // Audio-driven zoom animation: Speed and intensity controlled by audio
  const audioSpeedMultiplier = shouldSync ? audioValues.speedMultiplier : 1;
  const effectiveDuration = duration / audioSpeedMultiplier;
  
  const startScale = direction === 'in' ? 1 : 1 + zoomIntensity;
  const endScale = direction === 'in' ? 1 + zoomIntensity : 1;
  
  // Base zoom animation with audio-driven timing
  const baseZoomScale = interpolate(frame, [0, effectiveDuration], [startScale, endScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Audio-driven scale with frequency-specific effects
  const audioScaleEffect = shouldSync 
    ? (audioValues.overallLevel * 0.3) + (audioValues.beatTrigger ? 0.2 : 0)
    : 0;
    
  const finalScale = baseZoomScale + audioScaleEffect;

  // Check if imageUrl is valid and not a placeholder
  const isValidImageUrl = imageUrl && 
    !imageUrl.includes('example.com') &&
    !imageUrl.includes('placeholder') &&
    imageUrl.startsWith('http');

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {isValidImageUrl ? (
        <Img
          src={imageUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            opacity: shouldSync ? audioValues.opacityMultiplier : 1,
            transform: `scale(${finalScale})`,
            filter: shouldSync && audioValues.beatTrigger ? `brightness(${1 + audioValues.beatStrength * 0.3}) saturate(${1 + audioValues.bassLevel * 0.5})` : 'none',
            transition: 'filter 0.1s ease',
          }}
          onError={() => {
            console.error(`Failed to load image: ${imageUrl}`);
          }}
        />
      ) : (
        // Fallback content when image is not available
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: fallbackColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '48px',
            textAlign: 'center',
            opacity: shouldSync ? audioValues.opacityMultiplier : 1,
            transform: `scale(${finalScale})`,
            boxShadow: shouldSync && audioValues.beatTrigger ? `0 0 ${audioValues.beatStrength * 40}px ${fallbackColor}` : 'none',
            transition: 'box-shadow 0.1s ease',
          }}
        >
          {fallbackText}
        </div>
      )}
    </div>
  );
};