import React, { useCallback } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register MotionPathPlugin (following GSAP documentation pattern)
gsap.registerPlugin(MotionPathPlugin);

export interface MotionPathProps {
  // Element content (built-in rendering for JSON compatibility)
  elementText?: string; // Text to display in the animated element
  elementColor?: string; // Color of the element
  elementSize?: number; // Size of the element
  elementShape?: 'circle' | 'square' | 'text'; // Shape of the element
  
  // Path configuration (one of these is required)
  svgPath?: string; // Custom SVG path string
  pathType?: 'circle' | 'line' | 'curve' | 'spiral'; // Predefined path types
  
  // Animation control
  duration?: number; // Animation duration in frames
  autoRotate?: boolean; // Rotate element to follow path direction
  ease?: string; // GSAP easing function
  
  // Path customization (for predefined paths)
  radius?: number; // For circle and spiral paths
  width?: number; // For line and curve paths  
  height?: number; // For line and curve paths
  
  // Advanced options
  alignOrigin?: [number, number]; // Transform origin for rotation
  offsetDistance?: number; // Start position along path (0-1)
  motionBlur?: boolean; // Add motion blur effect
  
  // React children (for advanced usage)
  children?: React.ReactNode; // Custom element to animate along path
}

export const MotionPath: React.FC<MotionPathProps> = ({ 
  children,
  elementText = '●',
  elementColor = '#FF6347',
  elementSize = 40,
  elementShape = 'circle',
  svgPath,
  pathType = 'circle',
  duration = 180, // 6 seconds at 30fps
  autoRotate = true,
  ease = 'none',
  radius = 200,
  width = 400,
  height = 200,
  alignOrigin = [0.5, 0.5],
  offsetDistance = 0,
  motionBlur = false
}) => {
  // Render built-in element based on shape and props
  const renderElement = useCallback(() => {
    if (children) {
      return children;
    }

    const baseStyle: React.CSSProperties = {
      color: elementColor,
      fontSize: `${elementSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
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
  }, [children, elementText, elementColor, elementSize, elementShape]);

  // Generate predefined paths
  const generatePath = useCallback((type: string): string => {
    switch (type) {
      case 'circle':
        return `M ${radius},0 A ${radius},${radius} 0 1,1 ${radius-0.1},0 Z`;
      case 'line':
        return `M 0,0 L ${width},0`;
      case 'curve':
        return `M 0,${height/2} Q ${width/2},0 ${width},${height/2}`;
      case 'spiral': {
        // Simple spiral approximation using quadratic curves
        const steps = 8;
        let path = `M ${radius},0`;
        for (let i = 1; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 4; // 2 full rotations
          const currentRadius = radius * (1 + i / steps);
          const x = Math.cos(angle) * currentRadius;
          const y = Math.sin(angle) * currentRadius;
          const controlX = Math.cos(angle - Math.PI / 4) * (currentRadius * 0.8);
          const controlY = Math.sin(angle - Math.PI / 4) * (currentRadius * 0.8);
          path += ` Q ${controlX},${controlY} ${x},${y}`;
        }
        return path;
      }
      default:
        return `M 0,0 L ${width},0`; // Default to line
    }
  }, [pathType, radius, width, height]);

  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    const target = element.querySelector('.motion-target');
    if (!target) return timeline;

    // Determine the path to use
    const finalPath = svgPath || generatePath(pathType);
    
    // Validation: Check if path is valid
    if (!finalPath || finalPath.trim() === '') {
      console.warn('MotionPath: Invalid or empty path provided, using fallback');
      const fallbackPath = generatePath('circle');
      
      timeline.to(target, {
        duration: duration / 30, // Convert frames to seconds
        motionPath: {
          path: fallbackPath,
          autoRotate: autoRotate,
          alignOrigin: alignOrigin,
        },
        ease: ease,
      });
      return timeline;
    }

    // Create the motion path animation
    const motionConfig: any = {
      duration: duration / 30, // Convert frames to seconds
      motionPath: {
        path: finalPath,
        autoRotate: autoRotate,
        alignOrigin: alignOrigin,
      },
      ease: ease,
    };

    // Add motion blur if requested
    if (motionBlur) {
      motionConfig.filter = 'blur(2px)';
    }

    // Apply offset distance if specified
    if (offsetDistance > 0) {
      timeline.set(target, {
        motionPath: {
          path: finalPath,
          autoRotate: autoRotate,
          alignOrigin: alignOrigin,
          start: offsetDistance,
          end: offsetDistance,
        }
      });
      
      timeline.to(target, {
        duration: duration / 30,
        motionPath: {
          path: finalPath,
          autoRotate: autoRotate,
          alignOrigin: alignOrigin,
          start: offsetDistance,
          end: 1,
        },
        ease: ease,
      });
    } else {
      timeline.to(target, motionConfig);
    }
    
    return timeline;
  }, [
    svgPath, 
    pathType, 
    duration, 
    autoRotate, 
    ease, 
    radius, 
    width, 
    height, 
    alignOrigin, 
    offsetDistance, 
    motionBlur,
    generatePath
  ]);

  const ref = useSyncedGsap(createTimeline);

  return (
    <div 
      ref={ref}
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Debug: Show the SVG path for visualization (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
          viewBox={`-${Math.max(radius, width/2)} -${Math.max(radius, height/2)} ${Math.max(radius*2, width)} ${Math.max(radius*2, height)}`}
        >
          <path
            d={svgPath || generatePath(pathType)}
            stroke="#00FF00"
            strokeWidth="2"
            fill="none"
            transform="translate(0,0)"
          />
        </svg>
      )}
      
      <div 
        className="motion-target"
        style={{
          position: 'absolute',
          transformOrigin: `${alignOrigin[0] * 100}% ${alignOrigin[1] * 100}%`,
        }}
      >
        {renderElement()}
      </div>
    </div>
  );
};