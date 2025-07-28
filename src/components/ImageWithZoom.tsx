import { useCurrentFrame, interpolate, Img } from 'remotion';
import React from 'react';

export interface ImageWithZoomProps {
  imageUrl?: string;
  zoomIntensity?: number;
  direction?: 'in' | 'out';
  fit?: 'cover' | 'contain' | 'fill';
  fallbackText?: string;
  fallbackColor?: string;
}

export const ImageWithZoom: React.FC<ImageWithZoomProps> = ({ 
  imageUrl, 
  zoomIntensity = 0.2,
  direction = 'in',
  fit = 'cover',
  fallbackText = 'Image not available',
  fallbackColor = '#333'
}) => {
  const frame = useCurrentFrame();
  const duration = 120; // Assume component duration for zoom calculation
  
  const startScale = direction === 'in' ? 1 : 1 + zoomIntensity;
  const endScale = direction === 'in' ? 1 + zoomIntensity : 1;
  
  const scale = interpolate(frame, [0, duration], [startScale, endScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
            transform: `scale(${scale})`,
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
            transform: `scale(${scale})`,
          }}
        >
          {fallbackText}
        </div>
      )}
    </div>
  );
};