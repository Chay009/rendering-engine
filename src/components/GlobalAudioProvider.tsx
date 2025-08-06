import React, { createContext, useContext, useMemo } from 'react';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';

export interface GlobalAudioSync {
  enabled: boolean;
  mode: 'all' | 'selective' | 'none' | 'manual';
  syncComponents?: string[];
  excludeComponents?: string[];
  defaultReactivity?: number;
  masterIntensity?: number;
}

export interface GlobalAudioConfig {
  audioUrl?: string;
  globalSync?: GlobalAudioSync;
}

export interface GlobalAudioContextValue {
  audioConfig: GlobalAudioConfig;
  audioAnalysis: ReturnType<typeof useAudioAnalysis>;
  shouldComponentSync: (componentName: string) => boolean;
  getComponentReactivity: (componentName: string, componentOverride?: number) => number;
  getMasterIntensity: () => number;
}

const GlobalAudioContext = createContext<GlobalAudioContextValue | null>(null);

interface GlobalAudioProviderProps {
  children: React.ReactNode;
  audioConfig: GlobalAudioConfig;
}

/**
 * Global Audio Provider
 * 
 * Provides centralized audio analysis and sync configuration
 * for all components in the video composition.
 */
export const GlobalAudioProvider: React.FC<GlobalAudioProviderProps> = ({
  children,
  audioConfig,
}) => {
  // 🐛 DEBUG: Log what audio config we receive
  console.log('🎵 GlobalAudioProvider received config:', JSON.stringify(audioConfig, null, 2));
  
  // Get audio analysis data once for the entire composition
  const audioAnalysis = useAudioAnalysis(audioConfig.audioUrl);
  
  // 🐛 DEBUG: Log audio analysis results
  console.log('🎵 Audio analysis result:', JSON.stringify(audioAnalysis, null, 2));
  
  // Determine if a component should sync with audio
  const shouldComponentSync = useMemo(() => {
    return (componentName: string): boolean => {
      const sync = audioConfig.globalSync;
      
      // If global sync is disabled, no components sync
      if (!sync?.enabled) return false;
      
      // Check exclude list first
      if (sync.excludeComponents?.includes(componentName)) return false;
      
      switch (sync.mode) {
        case 'all':
          return true;
        case 'selective':
          return sync.syncComponents?.includes(componentName) ?? false;
        case 'none':
          return false;
        case 'manual':
          return false; // Components must explicitly opt-in
        default:
          return false;
      }
    };
  }, [audioConfig.globalSync]);
  
  // Get component reactivity level
  const getComponentReactivity = useMemo(() => {
    return (componentName: string, componentOverride?: number): number => {
      if (componentOverride !== undefined) return componentOverride;
      return audioConfig.globalSync?.defaultReactivity ?? 1.0;
    };
  }, [audioConfig.globalSync?.defaultReactivity]);
  
  // Get master intensity
  const getMasterIntensity = useMemo(() => {
    return (): number => {
      return audioConfig.globalSync?.masterIntensity ?? 1.0;
    };
  }, [audioConfig.globalSync?.masterIntensity]);
  
  const contextValue: GlobalAudioContextValue = {
    audioConfig,
    audioAnalysis,
    shouldComponentSync,
    getComponentReactivity,
    getMasterIntensity,
  };
  
  return (
    <GlobalAudioContext.Provider value={contextValue}>
      {children}
    </GlobalAudioContext.Provider>
  );
};

/**
 * Hook to access global audio context
 * 
 * Provides audio analysis data and sync configuration
 * for individual components.
 */
export const useGlobalAudio = (): GlobalAudioContextValue => {
  const context = useContext(GlobalAudioContext);
  
  if (!context) {
    // Return safe defaults when no audio context is provided
    const defaultAudioAnalysis = {
      bass: 0,
      mids: 0,
      highs: 0,
      overall: 0,
      spectrum: [],
      isBeat: false,
      isActive: false,
    };
    
    return {
      audioConfig: {},
      audioAnalysis: defaultAudioAnalysis,
      shouldComponentSync: () => false,
      getComponentReactivity: () => 1.0,
      getMasterIntensity: () => 1.0,
    };
  }
  
  return context;
};