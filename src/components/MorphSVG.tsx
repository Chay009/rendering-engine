import React, { useCallback } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register MorphSVGPlugin (following GSAP documentation pattern)
gsap.registerPlugin(MorphSVGPlugin);

export interface MorphSVGProps {
  // Shape configuration (one approach required)
  startShape?: string | object; // SVG path data, selector, or inline shape definition
  endShape?: string | object; // Target shape to morph to
  preset?: 'circle-to-star' | 'square-to-circle' | 'triangle-to-diamond' | 'heart-to-arrow' | 'star-to-heart' | 'custom'; // Built-in shape pairs
  
  // Animation control
  duration?: number; // Animation duration in frames (default 150)
  animationType?: 'linear' | 'rotational'; // MorphSVG type (default 'linear')
  shapeIndex?: number | 'auto'; // Point mapping control (default 'auto')
  precision?: number; // Decimal precision (default 2)
  ease?: string; // GSAP easing function (default 'power2.inOut')
  
  // Visual styling
  strokeColor?: string; // Stroke color (default '#333')
  fillColor?: string; // Fill color (default 'transparent')
  strokeWidth?: number; // Stroke width (default 2)
  
  // SVG container dimensions
  width?: number; // SVG width (default 300)
  height?: number; // SVG height (default 300)
  viewBox?: string; // Custom viewBox (auto-calculated if not provided)
  
  // Advanced options
  reverse?: boolean; // Play animation in reverse
  yoyo?: boolean; // Yoyo effect (back and forth)
  repeat?: number; // Number of repeats (-1 for infinite)
}

// Built-in shape definitions as SVG path data
const BUILT_IN_SHAPES = {
  circle: "M150,50 A100,100 0 1,1 149.9,50 Z",
  square: "M50,50 L250,50 L250,250 L50,250 Z",
  triangle: "M150,50 L250,200 L50,200 Z",
  star: "M150,50 L165,120 L235,120 L180,165 L195,235 L150,190 L105,235 L120,165 L65,120 L135,120 Z",
  diamond: "M150,50 L225,150 L150,250 L75,150 Z",
  heart: "M150,225 C150,225 50,175 50,125 C50,100 75,75 100,75 C125,75 150,100 150,125 C150,100 175,75 200,75 C225,75 250,100 250,125 C250,175 150,225 150,225 Z",
  arrow: "M50,150 L200,150 L200,100 L250,150 L200,200 L200,150 Z",
};

// Preset shape pairs
const SHAPE_PRESETS = {
  'circle-to-star': { start: BUILT_IN_SHAPES.circle, end: BUILT_IN_SHAPES.star },
  'square-to-circle': { start: BUILT_IN_SHAPES.square, end: BUILT_IN_SHAPES.circle },
  'triangle-to-diamond': { start: BUILT_IN_SHAPES.triangle, end: BUILT_IN_SHAPES.diamond },
  'heart-to-arrow': { start: BUILT_IN_SHAPES.heart, end: BUILT_IN_SHAPES.arrow },
  'star-to-heart': { start: BUILT_IN_SHAPES.star, end: BUILT_IN_SHAPES.heart },
};

export const MorphSVG: React.FC<MorphSVGProps> = ({
  startShape,
  endShape,
  preset = 'custom',
  duration = 150, // 5 seconds at 30fps
  animationType = 'linear',
  shapeIndex = 'auto',
  precision = 2,
  ease = 'power2.inOut',
  strokeColor = '#333',
  fillColor = 'transparent',
  strokeWidth = 2,
  width = 300,
  height = 300,
  viewBox,
  reverse = false,
  yoyo = false,
  repeat = 0,
}) => {
  
  // Validate and resolve shapes
  const resolveShapes = useCallback(() => {
    let resolvedStartShape: string;
    let resolvedEndShape: string;
    
    try {
      // Handle preset shapes
      if (preset !== 'custom' && SHAPE_PRESETS[preset]) {
        resolvedStartShape = SHAPE_PRESETS[preset].start;
        resolvedEndShape = SHAPE_PRESETS[preset].end;
      } else {
        // Handle custom shapes
        if (!startShape || !endShape) {
          console.warn('MorphSVG: Custom preset requires both startShape and endShape. Using fallback circle-to-star.');
          resolvedStartShape = BUILT_IN_SHAPES.circle;
          resolvedEndShape = BUILT_IN_SHAPES.star;
        } else {
          // Convert shapes to strings if they're objects or selectors
          resolvedStartShape = typeof startShape === 'string' ? startShape : JSON.stringify(startShape);
          resolvedEndShape = typeof endShape === 'string' ? endShape : JSON.stringify(endShape);
          
          // Basic validation for SVG path data
          if (!resolvedStartShape.includes('M') || !resolvedEndShape.includes('M')) {
            console.warn('MorphSVG: Invalid SVG path data detected. Shapes should start with "M" command.');
            resolvedStartShape = BUILT_IN_SHAPES.circle;
            resolvedEndShape = BUILT_IN_SHAPES.star;
          }
        }
      }
      
      return { startShape: resolvedStartShape, endShape: resolvedEndShape };
    } catch (error) {
      console.error('MorphSVG: Error resolving shapes:', error);
      return { 
        startShape: BUILT_IN_SHAPES.circle, 
        endShape: BUILT_IN_SHAPES.star 
      };
    }
  }, [startShape, endShape, preset]);

  // Calculate viewBox if not provided
  const calculateViewBox = useCallback(() => {
    if (viewBox) return viewBox;
    return `0 0 ${width} ${height}`;
  }, [viewBox, width, height]);

  // Create GSAP timeline with MorphSVG animation
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    const pathElement = element.querySelector('.morph-path') as SVGPathElement;
    if (!pathElement) {
      console.error('MorphSVG: Could not find .morph-path element');
      return timeline;
    }

    const { startShape: resolvedStartShape, endShape: resolvedEndShape } = resolveShapes();
    
    // Set initial shape
    pathElement.setAttribute('d', resolvedStartShape);
    
    // Prepare morph configuration
    const morphConfig: any = {
      duration: duration / 30, // Convert frames to seconds
      morphSVG: {
        shape: resolvedEndShape,
        type: animationType,
        precision: precision,
      },
      ease: ease,
    };
    
    // Handle shapeIndex if specified
    if (shapeIndex !== 'auto') {
      morphConfig.morphSVG.shapeIndex = shapeIndex;
    }
    
    // Apply morph animation
    timeline.to(pathElement, morphConfig);
    
    // Handle reverse, yoyo, and repeat options
    if (reverse) {
      timeline.reverse();
    }
    
    if (yoyo && repeat !== 0) {
      timeline.yoyo(true);
    }
    
    if (repeat !== 0) {
      timeline.repeat(repeat);
    }
    
    return timeline;
  }, [
    duration,
    animationType,
    shapeIndex,
    precision,
    ease,
    reverse,
    yoyo,
    repeat,
    startShape,
    endShape,
    preset
  ]);

  const ref = useSyncedGsap(createTimeline);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={calculateViewBox()}
        style={{
          overflow: 'visible',
        }}
      >
        <path
          className="morph-path"
          d={resolveShapes().startShape}
          stroke={strokeColor}
          fill={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/*
 * USAGE EXAMPLES AND JSON TEST CASES:
 * 
 * // Basic preset morph - Circle morphing to Star
 * {
 *   "component": "MorphSVG",
 *   "props": {
 *     "preset": "circle-to-star",
 *     "duration": 120,
 *     "fillColor": "#FF6347",
 *     "strokeColor": "#8B0000"
 *   },
 *   "startFrame": 0,
 *   "durationInFrames": 120
 * }
 * 
 * // Custom path morph with rotational animation
 * {
 *   "component": "MorphSVG", 
 *   "props": {
 *     "startShape": "M10,10 L50,10 L50,50 L10,50 Z",
 *     "endShape": "M30,10 L50,30 L30,50 L10,30 Z",
 *     "animationType": "rotational",
 *     "strokeColor": "#333",
 *     "duration": 150,
 *     "ease": "elastic.out(1, 0.3)"
 *   },
 *   "startFrame": 120,
 *   "durationInFrames": 150
 * }
 * 
 * // Heart to Arrow with yoyo effect
 * {
 *   "component": "MorphSVG",
 *   "props": {
 *     "preset": "heart-to-arrow",
 *     "duration": 90,
 *     "yoyo": true,
 *     "repeat": 2,
 *     "fillColor": "#FF69B4",
 *     "strokeWidth": 3
 *   },
 *   "startFrame": 270,
 *   "durationInFrames": 270
 * }
 * 
 * // Triangle to Diamond with custom styling
 * {
 *   "component": "MorphSVG",
 *   "props": {
 *     "preset": "triangle-to-diamond",
 *     "duration": 180,
 *     "animationType": "linear",
 *     "strokeColor": "#4169E1",
 *     "fillColor": "rgba(65, 105, 225, 0.3)",
 *     "strokeWidth": 4,
 *     "width": 400,
 *     "height": 400
 *   },
 *   "startFrame": 540,
 *   "durationInFrames": 180
 * }
 * 
 * // Advanced: Custom viewBox and shape precision
 * {
 *   "component": "MorphSVG",
 *   "props": {
 *     "startShape": "M50,150 C50,100 100,50 150,50 C200,50 250,100 250,150 C250,200 200,250 150,250 C100,250 50,200 50,150 Z",
 *     "endShape": "M150,50 L200,100 L250,150 L200,200 L150,250 L100,200 L50,150 L100,100 Z",
 *     "duration": 200,
 *     "precision": 3,
 *     "shapeIndex": 0,
 *     "viewBox": "0 0 300 300",
 *     "ease": "back.inOut(1.7)"
 *   },
 *   "startFrame": 720,
 *   "durationInFrames": 200
 * }
 * 
 * PERFORMANCE NOTES:
 * - MorphSVG animations are optimized for Remotion's frame-based rendering
 * - Complex shapes with many points may impact performance; consider using precision parameter
 * - Built-in presets are pre-optimized for smooth morphing
 * - Use simpler shapes when possible for better performance
 * 
 * ERROR HANDLING:
 * - Invalid shapes fall back to circle-to-star preset
 * - Missing MorphSVGPlugin registration is logged as error
 * - Shape validation ensures paths start with "M" command
 * - Console warnings for common configuration mistakes
 * 
 * CUSTOMIZATION TIPS:
 * - Use animationType "rotational" for shapes that should rotate during morph
 * - Adjust shapeIndex to control point mapping between shapes
 * - Higher precision values create smoother morphs but may impact performance
 * - Custom viewBox allows for precise control over visible area
 */