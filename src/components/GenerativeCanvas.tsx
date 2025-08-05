import React, { useRef, useEffect, useCallback } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';

export interface GenerativeCanvasProps {
  backgroundColor?: string;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  animationSpeed?: number;
  iterations?: number;
  enableGsapEffects?: boolean;
  glowEffect?: boolean;
  pulseEffect?: boolean;
  colorCycle?: boolean;
}

export const GenerativeCanvas: React.FC<GenerativeCanvasProps> = ({
  backgroundColor = 'black',
  strokeColor = '#ffffff',
  strokeOpacity = 0.39,
  strokeWidth = 1,
  animationSpeed = 1,
  iterations = 20000,
  enableGsapEffects = true,
  glowEffect = false,
  pulseEffect = false,
  colorCycle = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // GSAP timeline for enhanced effects
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    if (!enableGsapEffects) {
      return timeline;
    }

    const canvas = element.querySelector('canvas');
    if (!canvas) return timeline;

    // Subtle rotation effect
    timeline.to(canvas, {
      rotation: 360,
      duration: 20,
      ease: "none",
      repeat: -1,
    }, 0);

    // Breathing scale effect
    if (pulseEffect) {
      timeline.to(canvas, {
        scale: 1.05,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }, 0);
    }

    // Glow effect
    if (glowEffect) {
      timeline.to(canvas, {
        filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }, 0);
    }

    return timeline;
  }, [enableGsapEffects, pulseEffect, glowEffect]);

  const ref = useSyncedGsap(createTimeline);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video dimensions
    canvas.width = width;
    canvas.height = height;

    // Calculate the scale factor to maintain aspect ratio
    const scale = Math.min(width, height) / 400;
    const offsetX = (width - 400 * scale) / 2;
    const offsetY = (height - 400 * scale) / 2;

    // Clear canvas with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Apply scaling transformation
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Time calculation with animation speed multiplier
    const t = (Math.PI / 30) * frame * animationSpeed;

    // Color cycling effect
    let currentStrokeColor = strokeColor;
    if (colorCycle) {
      const hue = (frame * 2) % 360;
      currentStrokeColor = `hsl(${hue}, 70%, 60%)`;
    }

    // Set stroke properties
    ctx.strokeStyle = `${currentStrokeColor}${Math.floor(strokeOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = strokeWidth / scale;

    // Glow effect using canvas shadow
    if (glowEffect && !enableGsapEffects) {
      ctx.shadowColor = currentStrokeColor;
      ctx.shadowBlur = 10;
    }

    // Generate the mathematical art pattern
    for (let i = iterations; i < iterations + 20000; i++) {
      const x = i % 100;
      const y = i / 150;

      const k = x / 4 - 12.5;
      if (k === 0) continue;
      
      const e = y / 9;
      const o = Math.hypot(k, e) / 9;
      const c = o * e / 30 - t / 8;

      const q = (x + 99 + Math.cos(9 / k) + o * k * (Math.cos(e * 9) / 3 + Math.cos(y / 9) / 0.7) * Math.sin(o * 4 - t)) * 0.7 * Math.sin(c) + 200;
      const px = q;
      const py = 200 + y / 9 * Math.cos(c * 4 - t / 2) - q / 2 * Math.cos(c);
      
      // Only draw if coordinates are valid
      if (!isNaN(px) && !isNaN(py) && isFinite(px) && isFinite(py)) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + strokeWidth, py + strokeWidth);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [
    frame, 
    width, 
    height, 
    backgroundColor, 
    strokeColor, 
    strokeOpacity, 
    strokeWidth, 
    animationSpeed, 
    iterations,
    glowEffect,
    enableGsapEffects,
    colorCycle
  ]);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div 
        ref={ref}
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            imageRendering: 'pixelated' // Maintain crisp lines
          }} 
        />
      </div>
    </AbsoluteFill>
  );
};

export default GenerativeCanvas;