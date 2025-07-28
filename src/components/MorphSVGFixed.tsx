import React, { useCallback, useMemo } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register MorphSVGPlugin
gsap.registerPlugin(MorphSVGPlugin);

export interface MorphSVGProps {
  preset?: 'circle-to-star' | 'square-to-circle' | 'triangle-to-diamond' | 'heart-to-arrow' | 'star-to-heart' | 'custom';
  startShape?: string;
  endShape?: string;
  duration?: number;
  animationType?: 'linear' | 'rotational';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

// Built-in shape definitions
const BUILT_IN_SHAPES = {
  circle: "M150,50 A100,100 0 1,1 149.9,50 Z",
  square: "M50,50 L250,50 L250,250 L50,250 Z", 
  triangle: "M150,50 L250,200 L50,200 Z",
  star: "M150,50 L165,120 L235,120 L180,165 L195,235 L150,190 L105,235 L120,165 L65,120 L135,120 Z",
  diamond: "M150,50 L225,150 L150,250 L75,150 Z",
  heart: "M150,225 C150,225 50,175 50,125 C50,100 75,75 100,75 C125,75 150,100 150,125 C150,100 175,75 200,75 C225,75 250,100 250,125 C250,175 150,225 150,225 Z",
  arrow: "M50,150 L200,150 L200,100 L250,150 L200,200 L200,150 Z",
};

const SHAPE_PRESETS = {
  'circle-to-star': { start: BUILT_IN_SHAPES.circle, end: BUILT_IN_SHAPES.star },
  'square-to-circle': { start: BUILT_IN_SHAPES.square, end: BUILT_IN_SHAPES.circle },
  'triangle-to-diamond': { start: BUILT_IN_SHAPES.triangle, end: BUILT_IN_SHAPES.diamond },
  'heart-to-arrow': { start: BUILT_IN_SHAPES.heart, end: BUILT_IN_SHAPES.arrow },
  'star-to-heart': { start: BUILT_IN_SHAPES.star, end: BUILT_IN_SHAPES.heart },
};

export const MorphSVGFixed: React.FC<MorphSVGProps> = ({
  preset = 'circle-to-star',
  startShape,
  endShape,
  duration = 150,
  animationType = 'linear',
  fillColor = 'transparent',
  strokeColor = '#333',
  strokeWidth = 2,
  width = 300,
  height = 300,
}) => {
  
  // Resolve shapes once using useMemo to prevent re-calculation
  const resolvedShapes = useMemo(() => {
    if (preset !== 'custom' && SHAPE_PRESETS[preset]) {
      return {
        startShape: SHAPE_PRESETS[preset].start,
        endShape: SHAPE_PRESETS[preset].end
      };
    }
    
    // Use custom shapes or fallback to circle-to-star
    return {
      startShape: startShape || BUILT_IN_SHAPES.circle,
      endShape: endShape || BUILT_IN_SHAPES.star
    };
  }, [preset, startShape, endShape]);

  // Create GSAP timeline - fixed dependency array
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    const pathElement = element.querySelector('.morph-path') as SVGPathElement;
    if (!pathElement) {
      console.error('MorphSVG: Could not find .morph-path element');
      return timeline;
    }

    // Set initial shape
    pathElement.setAttribute('d', resolvedShapes.startShape);
    
    // Create morph animation
    timeline.to(pathElement, {
      duration: duration / 30, // Convert frames to seconds
      morphSVG: {
        shape: resolvedShapes.endShape,
        type: animationType,
      },
      ease: 'power2.inOut',
    });
    
    return timeline;
  }, [resolvedShapes.startShape, resolvedShapes.endShape, duration, animationType]);

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
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path
          className="morph-path"
          d={resolvedShapes.startShape}
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