import { useMemo } from 'react';
import { useGlobalAudio } from '../components/GlobalAudioProvider';

/**
 * Component Audio Sync Configuration
 */
export interface ComponentAudioSync {
  override?: boolean;
  enabled?: boolean;
  type?: 'beat' | 'bass' | 'mids' | 'highs' | 'overall';
  reactivity?: number;
  property?: 'scale' | 'opacity' | 'color' | 'all';
}

/**
 * Hook for components to get audio-enhanced props
 * 
 * This hook determines if a component should sync with audio
 * and returns the appropriate audio-reactive values.
 */
export const useAudioEnhancedProps = (
  componentName: string,
  audioSync?: ComponentAudioSync
) => {
  const globalAudio = useGlobalAudio();
  
  // Determine if this component should sync
  const shouldSync = useMemo(() => {
    // Component override takes precedence
    if (audioSync?.override) {
      return audioSync.enabled ?? false;
    }
    
    // Check global sync rules
    return globalAudio.shouldComponentSync(componentName);
  }, [componentName, audioSync, globalAudio]);
  
  // Get audio values if syncing is enabled
  const audioValues = useMemo(() => {
    if (!shouldSync) {
      return {
        scale: 1,
        opacity: 1,
        intensity: 0,
        isBeat: false,
        isActive: false,
      };
    }
    
    const { audioAnalysis } = globalAudio;
    const syncType = audioSync?.type ?? 'overall';
    const reactivity = globalAudio.getComponentReactivity(
      componentName,
      audioSync?.reactivity
    );
    const masterIntensity = globalAudio.getMasterIntensity();
    
    // Get the appropriate audio value based on sync type
    let audioValue = 0;
    switch (syncType) {
      case 'beat':
        audioValue = audioAnalysis.isBeat ? 1 : 0;
        break;
      case 'bass':
        audioValue = audioAnalysis.bass;
        break;
      case 'mids':
        audioValue = audioAnalysis.mids;
        break;
      case 'highs':
        audioValue = audioAnalysis.highs;
        break;
      case 'overall':
      default:
        audioValue = audioAnalysis.overall;
        break;
    }
    
    // Apply reactivity and master intensity
    const intensity = Math.min(1, audioValue * reactivity * masterIntensity);
    
    // ENHANCED Audio-driven animation states for DRAMATIC visual effects
    const enhancedIntensity = Math.min(1, intensity * 2); // Amplify intensity
    
    return {
      // Dramatic animation modifiers for strong visual impact
      scaleMultiplier: 0.5 + (enhancedIntensity * 1.0), // 0.5x to 1.5x based on audio
      opacityMultiplier: 0.3 + (enhancedIntensity * 0.7), // 0.3x to 1.0x based on audio
      speedMultiplier: 0.2 + (enhancedIntensity * 2.8), // 0.2x to 3.0x animation speed
      
      // Enhanced beat-driven triggers
      beatTrigger: audioAnalysis.isBeat,
      strongBeatTrigger: false,
      beatStrength: enhancedIntensity,
      
      // Amplified frequency-specific values
      bassLevel: Math.min(1, audioAnalysis.bass * 1.5),
      midsLevel: Math.min(1, audioAnalysis.mids * 1.3), 
      highsLevel: Math.min(1, audioAnalysis.highs * 1.4),
      overallLevel: Math.min(1, audioAnalysis.overall * 1.2),
      
      // Enhanced effects for dramatic visuals
      pulseScale: 1 + (audioAnalysis.bass * 0.8), // Strong bass pulse
      glowIntensity: audioAnalysis.isBeat ? 50 + (intensity * 30) : 0, // 0-80px glow
      colorShift: audioAnalysis.highs * 0.4, // Color brightness shift
      
      // Raw values
      intensity: enhancedIntensity,
      isBeat: audioAnalysis.isBeat,
      isActive: audioAnalysis.isActive,
    };
  }, [shouldSync, audioSync, globalAudio, componentName]);
  
  return {
    shouldSync,
    audioValues,
    audioAnalysis: globalAudio.audioAnalysis,
  };
};