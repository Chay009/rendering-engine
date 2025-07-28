import React, { useCallback } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';
import { useCurrentFrame, interpolate } from 'remotion';

export interface MotionPathProps {
  // Element content (built-in rendering for JSON compatibility)
  elementText?: string; // Text to display in the animated element
  elementColor?: string; // Color of the element
  elementSize?: number; // Size of the element
  elementShape?: 'circle' | 'square' | 'text'; // Shape of the element
  
  // Path configuration (one of these is required)
  pathType?: 'circle' | 'line' | 'curve' | 'spiral'; // Predefined path types
  
  // Animation control
  duration?: number; // Animation duration in frames
  autoRotate?: boolean; // Rotate element to follow path direction
  
  // Path customization (for predefined paths)
  radius?: number; // For circle and spiral paths
  width?: number; // For line and curve paths  
  height?: number; // For line and curve paths
}

export const MotionPath: React.FC<MotionPathProps> = ({ 
  elementText = '🚀',
  elementColor = '#FF6347',
  elementSize = 40,
  elementShape = 'circle',
  pathType = 'circle',
  duration = 180, // 6 seconds at 30fps
  autoRotate = true,
  radius = 200,
  width = 400,
  height = 200,
}) => {
  const frame = useCurrentFrame();
  
  // Calculate position along path using simple math (no GSAP MotionPath)
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Calculate position based on path type
  let x = 0;
  let y = 0;
  let rotation = 0;
  
  switch (pathType) {
    case 'circle':
      const angle = progress * Math.PI * 2; // Full circle
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      if (autoRotate) {
        rotation = (angle * 180 / Math.PI) + 90; // Convert to degrees + offset
      }
      break;
      
    case 'line':
      x = interpolate(progress, [0, 1], [-width/2, width/2]);
      y = 0;
      break;
      
    case 'curve':
      // Simple quadratic curve
      const t = progress;
      x = interpolate(t, [0, 1], [-width/2, width/2]);
      y = -height * 4 * t * (1 - t); // Parabola formula
      break;
      
    case 'spiral':
      const spiralAngle = progress * Math.PI * 8; // 4 full rotations
      const spiralRadius = radius * (0.5 + progress * 0.5); // Expanding radius
      x = Math.cos(spiralAngle) * spiralRadius;
      y = Math.sin(spiralAngle) * spiralRadius;
      if (autoRotate) {
        rotation = (spiralAngle * 180 / Math.PI) + 90;
      }
      break;
  }

  // Render built-in element based on shape and props
  const renderElement = () => {
    const baseStyle: React.CSSProperties = {
      color: elementColor,
      fontSize: `${elementSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      transform: autoRotate ? `rotate(${rotation}deg)` : 'none',
    };

    switch (elementShape) {
      case 'circle':
        return (
          <div
            style={{
              ...baseStyle,
              width: `${elementSize}px`,
              height: `${elementSize}px`,
              backgroundColor: elementColor,
              borderRadius: '50%',
              fontSize: `${elementSize * 0.6}px`,
              color: 'white',
            }}
          >
            {elementText}
          </div>
        );
      case 'square':
        return (
          <div
            style={{
              ...baseStyle,
              width: `${elementSize}px`,
              height: `${elementSize}px`,
              backgroundColor: elementColor,
              fontSize: `${elementSize * 0.6}px`,
              color: 'white',
            }}
          >
            {elementText}
          </div>
        );
      case 'text':
      default:
        return (
          <div style={baseStyle}>
            {elementText}
          </div>
        );
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Debug: Show the path for visualization */}
      {process.env.NODE_ENV === 'development' && (
        <svg
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${Math.max(radius*2, width)}px`,
            height: `${Math.max(radius*2, height)}px`,
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        >
          {pathType === 'circle' && (
            <circle
              cx={radius}
              cy={radius}
              r={radius}
              stroke="#00FF00"
              strokeWidth="2"
              fill="none"
            />
          )}
          {pathType === 'line' && (
            <line
              x1={0}
              y1={height/2}
              x2={width}
              y2={height/2}
              stroke="#00FF00"
              strokeWidth="2"
            />
          )}
        </svg>
      )}
      
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        }}
      >
        {renderElement()}
      </div>
    </div>
  );
};