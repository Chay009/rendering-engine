import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

interface AudioAnalysisResult {
  bass: number;
  mids: number;
  highs: number;
  overall: number;
  spectrum: number[];
  isBeat: boolean;
  isActive: boolean;
}

/**
 * Type 2: Audio Analysis Hook
 * 
 * Provides real-time audio frequency analysis for creating
 * audio-synchronized animations and effects.
 * 
 * Features:
 * - Frequency band separation (bass, mids, highs)
 * - Beat detection
 * - Overall audio activity detection
 * - Full spectrum analysis
 * - Production-safe error handling
 */
export const useAudioAnalysis = (audioUrl?: string): AudioAnalysisResult => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Default fallback result
  const defaultResult: AudioAnalysisResult = {
    bass: 0,
    mids: 0,
    highs: 0,
    overall: 0,
    spectrum: [],
    isBeat: false,
    isActive: false,
  };
  
  // Load audio data (hooks must be called unconditionally)
  const audioData = useAudioData(audioUrl || '');
  
  // Return default immediately if no audio URL is provided
  if (!audioUrl || audioUrl.trim() === '') {
    return defaultResult;
  }
  
  // Return default if audio data is not loaded yet
  if (!audioData) {
    return defaultResult;
  }

  try {
    // Get frequency visualization data
    const visualization = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 32, // More frequency bands for detailed analysis
    });
    
    // If no visualization data, return default
    if (!visualization || visualization.length === 0) {
      return defaultResult;
    }
    
    // Frequency band analysis
    // Bass: 0-4 (lower frequencies)
    const bassValues = visualization.slice(0, 4);
    const bass = bassValues.length > 0 ? bassValues.reduce((a, b) => a + b, 0) / bassValues.length : 0;
    
    // Mids: 4-16 (middle frequencies)
    const midsValues = visualization.slice(4, 16);
    const mids = midsValues.length > 0 ? midsValues.reduce((a, b) => a + b, 0) / midsValues.length : 0;
    
    // Highs: 16-32 (higher frequencies)
    const highsValues = visualization.slice(16, 32);
    const highs = highsValues.length > 0 ? highsValues.reduce((a, b) => a + b, 0) / highsValues.length : 0;
    
    // Overall: average of all frequencies
    const overall = visualization.reduce((a, b) => a + b, 0) / visualization.length;
    
    // Enhanced beat detection with dynamic thresholds
    const beatThreshold = 0.15; // Lowered threshold for better beat detection
    const strongBeatThreshold = 0.3;
    const isBeat = bass > beatThreshold;
    const isStrongBeat = bass > strongBeatThreshold;
    
    // Activity detection
    const activityThreshold = 0.1;
    const isActive = overall > activityThreshold;
    
    return {
      bass,
      mids,
      highs,
      overall,
      spectrum: visualization,
      isBeat,
      isActive,
    };
  } catch (error) {
    // Graceful fallback on error
    console.error('Audio analysis error:', error);
    return defaultResult;
  }
};