// Component Library Registry - PRODUCTION OPTIMIZED
// 🚀 Now with PRE-WARMED BROWSER + CACHED COMPOSITION = ULTRA FAST!

export { TitleCard } from './TitleCard';
export { ImageWithZoom } from './ImageWithZoom';
export { GsapTitle } from './GsapTitle';
export { CountdownTimer } from './CountdownTimer';
export { SlideTransition } from './SlideTransition';
export { MotionPath } from './MotionPath';
export { MorphSVGFixed as MorphSVG } from './MorphSVGFixed';
export { DrawSVG } from './DrawSVG';
export { HyperspaceText } from './HyperspaceText';
export { GenerativeCanvas } from './GenerativeCanvas';
export { MinimalTest } from './MinimalTest'; // Keep for testing

// Component Registry for dynamic lookup - FULL PRODUCTION SET
export const COMPONENT_REGISTRY = {
  TitleCard: 'TitleCard',           // ✅ FAST - Basic text rendering
  ImageWithZoom: 'ImageWithZoom',   // ✅ FAST - Basic CSS animations  
  GsapTitle: 'GsapTitle',           // ✅ NOW FAST - GSAP with pre-warmed browser
  CountdownTimer: 'CountdownTimer', // ✅ NOW FAST - Complex animations optimized
  SlideTransition: 'SlideTransition', // ✅ FAST - Basic CSS transitions
  MotionPath: 'MotionPath',         // ✅ NOW FAST - GSAP MotionPathPlugin optimized
  MorphSVG: 'MorphSVG',             // ✅ NOW FAST - GSAP MorphSVGPlugin optimized
  DrawSVG: 'DrawSVG',               // ✅ NOW FAST - GSAP DrawSVGPlugin optimized
  HyperspaceText: 'HyperspaceText', // ✅ NEW - 3D hyperspace text effect with GSAP
  GenerativeCanvas: 'GenerativeCanvas', // ✅ NEW - Mathematical generative art with GSAP
  MinimalTest: 'MinimalTest',       // ✅ FASTEST - For performance testing
} as const;

export type ComponentName = keyof typeof COMPONENT_REGISTRY;