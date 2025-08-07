// Component Library Registry - PRODUCTION OPTIMIZED
// 🚀 Now with PRE-WARMED BROWSER + CACHED COMPOSITION = ULTRA FAST!
// 🎵 NEW: Audio Integration - Type 1 (Background) + Type 2 (Synced)

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
export { LetterFlickering } from './LetterFlickering';
export { GSAPHingeZoom } from './GSAPHingeZoom';
export { MinimalTest } from './MinimalTest'; // Keep for testing

// Audio Components - Type 1: Background Audio + Type 2: Audio-Synced
export { AudioPlayer, BeatReactiveShape, AudioSyncedText } from './audio';

// Component Registry for dynamic lookup - FULL PRODUCTION SET + AUDIO
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
  LetterFlickering: 'LetterFlickering', // ✅ NEW - Multi-phase letter flickering animation with 3D rotation
  GSAPHingeZoom: 'GSAPHingeZoom',       // ✅ NEW - TRUE GSAP hinge effect: word zoom → hinge → target letter zoom (EXACT reference match)
  MinimalTest: 'MinimalTest',       // ✅ FASTEST - For performance testing
  
  // Audio Components - NEW AUDIO INTEGRATION
  AudioPlayer: 'AudioPlayer',       // 🎵 Type 1 - Background audio with fade effects
  BeatReactiveShape: 'BeatReactiveShape', // 🎵 Type 2 - Shape reacts to audio beats
  AudioSyncedText: 'AudioSyncedText', // 🎵 Type 2 - Text synced to audio frequencies
} as const;

export type ComponentName = keyof typeof COMPONENT_REGISTRY;