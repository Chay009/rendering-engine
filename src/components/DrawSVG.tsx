import React, { useCallback, useMemo } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register required GSAP plugins
gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

export interface DrawSVGProps {
  // SVG path data or preset shapes
  pathData?: string;
  pathPreset?: 'signature' | 'logo' | 'house' | 'tree' | 'circuit' | 'handwriting' | 'blueprint' | 'artistic' | 'custom';
  
  // Animation control
  duration?: number;
  delay?: number;
  animationType?: 'sequential' | 'simultaneous' | 'staggered';
  
  // Visual styling
  strokeColor?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'square' | 'butt';
  strokeLinejoin?: 'round' | 'bevel' | 'miter';
  fillColor?: string;
  
  // Advanced options
  splitMultiSegments?: boolean;
  reverseDirection?: boolean;
  showOriginal?: boolean;
  
  // Creative effects
  glowEffect?: boolean;
  trailEffect?: boolean;
  colorGradient?: { start: string; end: string };
  
  // Container sizing
  width?: number;
  height?: number;
  viewBox?: string;
  
  // Animation easing
  ease?: string;
  staggerDelay?: number;
  
  // Background styling
  backgroundColor?: string;
}

// Built-in SVG path presets for common creative use cases
const SVG_PRESETS = {
  signature: {
    name: 'Elegant Signature',
    paths: [
      'M50,200 Q150,100 250,150 Q350,200 450,120 Q550,80 650,140',
      'M200,180 Q280,220 350,180 Q420,140 480,180'
    ],
    viewBox: '0 0 700 300'
  },
  
  logo: {
    name: 'Modern Logo Design',
    paths: [
      'M100,100 L200,100 L200,200 L100,200 Z',
      'M150,50 L250,150 L150,250 L50,150 Z',
      'M75,75 Q150,25 225,75 Q300,125 225,175 Q150,225 75,175 Q0,125 75,75'
    ],
    viewBox: '0 0 300 300'
  },
  
  house: {
    name: 'Architectural Blueprint',
    paths: [
      'M100,250 L100,150 L200,100 L300,150 L300,250 Z', // Main structure
      'M120,180 L120,230 L160,230 L160,180 Z', // Door
      'M180,160 L180,190 L220,190 L220,160 Z', // Window 1
      'M240,160 L240,190 L280,190 L280,160 Z', // Window 2
      'M100,150 L200,100 L300,150' // Roof line
    ],
    viewBox: '0 0 400 300'
  },
  
  tree: {
    name: 'Growing Tree',
    paths: [
      'M200,300 L200,200', // Trunk
      'M200,200 Q150,150 120,120 Q100,100 140,110 Q180,120 200,140', // Left branch
      'M200,200 Q250,150 280,120 Q300,100 260,110 Q220,120 200,140', // Right branch
      'M200,180 Q170,130 150,100 Q130,80 160,85 Q190,90 200,110', // Left sub-branch
      'M200,180 Q230,130 250,100 Q270,80 240,85 Q210,90 200,110', // Right sub-branch
      'M200,160 C180,140 160,120 180,100 Q200,90 220,100 C240,120 220,140 200,160' // Crown
    ],
    viewBox: '0 0 400 350'
  },
  
  circuit: {
    name: 'Circuit Board Pattern',
    paths: [
      'M50,150 L150,150 L150,100 L250,100 L250,200 L350,200', // Main trace
      'M150,150 L150,200 L200,200 L200,250', // Branch 1
      'M250,100 L300,100 L300,50', // Branch 2
      'M250,200 L250,250 L300,250', // Branch 3
      'M100,100 C100,100 100,120 120,120 C140,120 140,100 140,100', // Component 1
      'M220,80 C220,80 220,100 240,100 C260,100 260,80 260,80', // Component 2
      'M280,230 C280,230 280,250 300,250 C320,250 320,230 320,230' // Component 3
    ],
    viewBox: '0 0 400 300'
  },
  
  handwriting: {
    name: 'Handwritten Text Style',
    paths: [
      'M50,150 Q100,120 150,150 Q200,180 250,150 Q300,120 350,150', // Cursive baseline
      'M75,130 Q100,110 125,130', // Letter connector 1
      'M175,130 Q200,110 225,130', // Letter connector 2
      'M275,130 Q300,110 325,130', // Letter connector 3
      'M100,140 L120,160 L140,140', // Accent mark 1
      'M200,140 L220,160 L240,140', // Accent mark 2
      'M300,140 L320,160 L340,140' // Accent mark 3
    ],
    viewBox: '0 0 400 250'
  },
  
  blueprint: {
    name: 'Technical Blueprint',
    paths: [
      'M100,100 L300,100 L300,250 L100,250 Z', // Outer frame
      'M150,100 L150,250', // Vertical divider
      'M250,100 L250,250', // Vertical divider
      'M100,150 L300,150', // Horizontal divider
      'M100,200 L300,200', // Horizontal divider
      'M120,120 L130,120 L130,130 L120,130 Z', // Detail 1
      'M170,170 L180,170 L180,180 L170,180 Z', // Detail 2
      'M270,220 L280,220 L280,230 L270,230 Z', // Detail 3
      'M110,110 L140,110', // Dimension line 1
      'M160,110 L240,110', // Dimension line 2
      'M260,110 L290,110' // Dimension line 3
    ],
    viewBox: '0 0 400 350'
  },
  
  artistic: {
    name: 'Abstract Art Design',
    paths: [
      'M50,200 C100,100 200,300 300,150 C400,100 500,250 550,200', // Flowing curve 1
      'M100,150 C150,200 250,50 350,150 C450,250 500,100 550,150', // Flowing curve 2
      'M150,100 Q200,50 250,100 Q300,150 350,100 Q400,50 450,100', // Wave pattern
      'M75,250 C125,300 175,200 225,250 C275,300 325,200 375,250', // Bottom wave
      'M200,75 L225,125 L175,125 Z', // Triangle accent
      'M350,225 C350,225 370,245 390,225 C410,205 390,185 370,205 C350,185 330,205 350,225' // Spiral accent
    ],
    viewBox: '0 0 600 350'
  }
};

// Helper function to split multi-segment paths for consistent drawing speed
// Currently unused but kept for future enhancements
// function splitPaths(paths: string[]): { path: string; length: number }[] {
//   const splitSegments: { path: string; length: number }[] = [];
//   
//   paths.forEach(pathString => {
//     // For complex paths with multiple M commands, we would split them
//     // For now, treating each path as a single segment
//     const dummyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//     dummyPath.setAttribute('d', pathString);
//     
//     // Use a rough estimation for path length if DrawSVGPlugin.getLength is not available
//     const length = pathString.length * 2; // Rough estimation
//     splitSegments.push({ path: pathString, length });
//   });
//   
//   return splitSegments;
// }

export const DrawSVG: React.FC<DrawSVGProps> = ({
  pathData,
  pathPreset = 'signature',
  duration = 150,
  delay = 0,
  animationType = 'sequential',
  strokeColor = '#00FF88',
  strokeWidth = 3,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  fillColor = 'transparent',
  splitMultiSegments = true,
  reverseDirection = false,
  showOriginal = false,
  glowEffect = false,
  trailEffect = false,
  colorGradient,
  width = 600,
  height = 400,
  viewBox,
  ease = 'power2.out',
  staggerDelay = 0.1,
  backgroundColor = 'transparent'
}) => {
  
  // Resolve paths and viewBox
  const resolvedContent = useMemo(() => {
    let paths: string[];
    let resolvedViewBox: string;
    
    if (pathData) {
      // Custom path data
      paths = [pathData];
      resolvedViewBox = viewBox || `0 0 ${width} ${height}`;
    } else if (pathPreset !== 'custom' && SVG_PRESETS[pathPreset]) {
      // Use preset
      const preset = SVG_PRESETS[pathPreset];
      paths = preset.paths;
      resolvedViewBox = viewBox || preset.viewBox;
    } else {
      // Fallback to signature preset
      const preset = SVG_PRESETS.signature;
      paths = preset.paths;
      resolvedViewBox = viewBox || preset.viewBox;
    }
    
    return { paths, viewBox: resolvedViewBox };
  }, [pathData, pathPreset, width, height, viewBox]);
  
  // Create gradient definition if specified
  const gradientId = useMemo(() => {
    return colorGradient ? `gradient-${Date.now()}` : null;
  }, [colorGradient]);
  
  // Animation timeline creation
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    const pathElements = element.querySelectorAll('.draw-path') as NodeListOf<SVGPathElement>;
    if (pathElements.length === 0) {
      console.error('DrawSVG: No .draw-path elements found');
      return timeline;
    }
    
    // Add delay if specified
    if (delay > 0) {
      timeline.to({}, { duration: delay / 30 });
    }
    
    // Initialize all paths as not drawn
    pathElements.forEach(path => {
      gsap.set(path, { drawSVG: reverseDirection ? '100% 100%' : '0% 0%' });
    });
    
    // Show original paths briefly if requested
    if (showOriginal) {
      timeline.to(pathElements, {
        opacity: 0.3,
        duration: 0.5
      }).to(pathElements, {
        opacity: 1,
        duration: 0.5
      });
    }
    
    const animationDuration = duration / 30; // Convert frames to seconds
    
    if (splitMultiSegments && animationType === 'sequential') {
      // Calculate consistent drawing speed across all paths
      const pathData = Array.from(pathElements).map(path => ({
        element: path,
        length: DrawSVGPlugin.getLength ? DrawSVGPlugin.getLength(path) : 100
      }));
      
      const totalLength = pathData.reduce((sum, p) => sum + p.length, 0);
      
      pathData.forEach(({ element, length }) => {
        const pathDuration = animationDuration * (length / totalLength);
        timeline.to(element, {
          drawSVG: reverseDirection ? '0% 0%' : '100%',
          duration: pathDuration,
          ease: ease
        }, reverseDirection ? '<' : '>');
      });
    } else if (animationType === 'staggered') {
      // Staggered animation
      timeline.to(pathElements, {
        drawSVG: reverseDirection ? '0% 0%' : '100%',
        duration: animationDuration,
        ease: ease,
        stagger: staggerDelay
      });
    } else {
      // Simultaneous animation
      timeline.to(pathElements, {
        drawSVG: reverseDirection ? '0% 0%' : '100%',
        duration: animationDuration,
        ease: ease
      });
    }
    
    // Add glow effect if enabled
    if (glowEffect) {
      timeline.to(pathElements, {
        filter: 'drop-shadow(0 0 10px currentColor)',
        duration: 0.3
      }, 0);
    }
    
    // Add trail effect if enabled
    if (trailEffect) {
      pathElements.forEach((path, index) => {
        timeline.to(path, {
          strokeDasharray: '10 5',
          strokeDashoffset: '-=100',
          duration: animationDuration * 0.5,
          ease: 'none'
        }, index * staggerDelay);
      });
    }
    
    return timeline;
  }, [
    duration,
    delay,
    animationType,
    reverseDirection,
    showOriginal,
    splitMultiSegments,
    glowEffect,
    trailEffect,
    ease,
    staggerDelay
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
        backgroundColor
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={resolvedContent.viewBox}
        style={{ overflow: 'visible' }}
      >
        {/* Gradient definition if needed */}
        {gradientId && colorGradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorGradient.start} />
              <stop offset="100%" stopColor={colorGradient.end} />
            </linearGradient>
          </defs>
        )}
        
        {/* Render all paths */}
        {resolvedContent.paths.map((pathString, index) => (
          <path
            key={index}
            className="draw-path"
            d={pathString}
            stroke={gradientId ? `url(#${gradientId})` : strokeColor}
            fill={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
};