import React, { useCallback } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';

interface HyperspaceTextProps {
  texts?: string[];
  backgroundColor?: string;
  speed?: number;
  textColor?: string;
  maxBlur?: number;
  customText?: string;
  fontSize?: number;
  enableGsapEffects?: boolean;
}

// Default text lines for the hyperspace effect
const defaultTextLines = [
  "In a galaxy far, far away...",
  "The future is now",
  "Breaking the speed of light",
  "Journey through space and time",
  "Beyond the infinite cosmos",
  "Where dreams become reality",
  "Exploring new dimensions", 
  "The adventure begins",
  "Faster than the speed of thought",
  "Into the unknown void",
  "Transcending all boundaries",
  "The universe awaits",
  "Beyond imagination",
  "Through the fabric of reality",
  "Into tomorrow",
  "Technology changes everything",
  "Digital transformation",
  "AI-powered future",
  "Innovation never stops",
  "Limitless possibilities"
];

const HyperspaceTextLine: React.FC<{
  text: string;
  frame: number;
  index: number;
  speed: number;
  textColor: string;
  maxBlur: number;
  fontSize: number;
}> = ({ text, frame, index, speed, textColor, maxBlur, fontSize }) => {
  // Calculate linear forward motion without looping
  const baseZ = -5000 - (index * 300); // Start much further back, wider spacing
  const forwardSpeed = speed * 15; // Forward movement speed
  
  // Simple linear forward motion
  const currentZ = baseZ + (frame * forwardSpeed);
  
  // Calculate opacity based on distance
  const opacity = interpolate(
    currentZ,
    [-5000, -2000, -500, 1000],
    [0, 0.6, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  
  // Calculate blur based on distance
  const blurAmount = interpolate(
    currentZ,
    [-5000, -2000, -800, 500],
    [maxBlur, maxBlur * 0.7, 2, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  
  // Calculate scale based on perspective
  const scale = interpolate(
    currentZ,
    [-5000, -2000, -500, 1000],
    [0.02, 0.2, 1.5, 4],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  
  // Calculate deterministic horizontal offset for variety
  const offsetX = Math.sin(index * 2.5) * 200;
  const offsetY = Math.cos(index * 1.8) * 100;

  // Don't render if text is too far behind or about to pass camera
  if (currentZ < -10000 || currentZ > 900) {
    return null;
  }

  // Clamp Z value to prevent perspective issues
  const safeZ = Math.max(Math.min(currentZ, 800), -9000);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translateX(-50%) 
          translateY(-50%) 
          translateX(${offsetX}px) 
          translateY(${offsetY}px) 
          translateZ(${safeZ}px) 
          scale(${scale})
        `,
        color: textColor,
        fontSize: fontSize,
        fontWeight: "bold",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        textAlign: "center",
        whiteSpace: "nowrap",
        opacity,
        filter: `blur(${blurAmount}px)`,
        textShadow: `0 0 20px ${textColor}50`,
        pointerEvents: "none",
        willChange: "transform, opacity, filter",
        letterSpacing: "2px",
      }}
    >
      {text}
    </div>
  );
};

const StarField: React.FC<{ frame: number; speed: number }> = ({ frame, speed }) => {
  const stars = Array.from({ length: 200 }, (_, i) => {
    const x = (random(`star-x-${i}`) - 0.5) * 6000;
    const y = (random(`star-y-${i}`) - 0.5) * 6000;
    const baseZ = -4000 + (random(`star-z-${i}`) * 3000);
    const starSpeed = speed * 6;
    
    // Linear forward motion for stars
    const currentZ = baseZ + (frame * starSpeed);
    
    // Skip stars that are past the camera
    if (currentZ >= 900) {
      return null;
    }
    
    // Calculate screen position based on perspective
    const perspective = 1000;
    const safeZ = Math.max(Math.min(currentZ, 800), -9000);
    const divisor = Math.max(perspective - safeZ, 100);
    const screenX = (x * perspective) / divisor + 1920 / 2;
    const screenY = (y * perspective) / divisor + 1080 / 2;
    
    const opacity = interpolate(
      currentZ,
      [-6000, -2000, -500, 1000],
      [0.1, 0.5, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    
    const size = interpolate(
      currentZ,
      [-6000, -2000, -500],
      [1, 2, 4],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    
    return {
      id: i,
      x: screenX,
      y: screenY,
      opacity,
      size,
    };
  }).filter(star => 
    star !== null &&
    star.x >= -100 && star.x <= 2020 && 
    star.y >= -100 && star.y <= 1180 &&
    star.opacity > 0 &&
    !isNaN(star.x) && !isNaN(star.y)
  );

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: star.x - star.size / 2,
            top: star.y - star.size / 2,
            width: star.size,
            height: star.size,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
          }}
        />
      ))}
    </>
  );
};

export const HyperspaceText: React.FC<HyperspaceTextProps> = ({
  texts = defaultTextLines,
  backgroundColor = "#000000",
  speed = 1,
  textColor = "#ffffff",
  maxBlur = 10,
  customText,
  fontSize = 48,
  enableGsapEffects = true
}) => {
  const frame = useCurrentFrame();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, height } = useVideoConfig();
  
  // If customText is provided, use it as a single line
  const textLines = customText ? [customText] : texts;

  // GSAP timeline for enhanced effects (if enabled)
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    if (!enableGsapEffects) {
      return timeline; // Return empty timeline if GSAP effects are disabled
    }

    // Find all text elements that need GSAP enhancement
    const textElements = element.querySelectorAll('.hyperspace-text');
    
    if (textElements.length > 0) {
      // Add subtle breathing effect to the entire hyperspace
      timeline.to(element, {
        scale: 1.02,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }, 0);

      // Add glow pulsing effect
      timeline.to(textElements, {
        textShadow: `0 0 40px ${textColor}`,
        duration: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.1,
      }, 0);
    }
    
    return timeline;
  }, [enableGsapEffects, textColor]);

  const ref = useSyncedGsap(createTimeline);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        perspective: "1200px",
        perspectiveOrigin: "center center",
        overflow: "hidden",
      }}
    >
      {/* Starfield background */}
      <StarField frame={frame} speed={speed} />
      
      {/* 3D Text Container with GSAP ref */}
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        {textLines.map((text, index) => (
          <div key={index} className="hyperspace-text">
            <HyperspaceTextLine
              text={text}
              frame={frame}
              index={index}
              speed={speed}
              textColor={textColor}
              maxBlur={maxBlur}
              fontSize={fontSize}
            />
          </div>
        ))}
      </div>
      
      {/* Center focal point */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 4,
          height: 4,
          backgroundColor: "white",
          borderRadius: "50%",
          opacity: 0.8,
          boxShadow: "0 0 20px white",
        }}
      />
      
      {/* Vignette effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none",
        }}
      />
      
      {/* Motion blur lines for speed effect */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const length = interpolate(
          Math.sin(frame * 0.1 + i * 0.1),
          [-1, 1],
          [100, 300]
        );
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 2,
              height: length,
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
              transform: `translate(-50%, -50%) rotate(${angle}rad) translateY(-${length / 2}px)`,
              opacity: 0.3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default HyperspaceText;