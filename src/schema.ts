import { z } from 'zod';

/**
 * Schema for individual timeline items
 */
export const TimelineItemSchema = z.object({
  component: z.string(), // Component name to render
  props: z.record(z.any()), // Component props
  startFrame: z.number().min(0),
  durationInFrames: z.number().min(1),
});

/**
 * Schema for global audio sync configuration
 */
export const GlobalAudioSyncSchema = z.object({
  enabled: z.boolean().default(false),
  mode: z.enum(['all', 'selective', 'none', 'manual']).default('none'),
  syncComponents: z.array(z.string()).optional(),
  excludeComponents: z.array(z.string()).optional(),
  defaultReactivity: z.number().min(0).max(3).default(1),
  masterIntensity: z.number().min(0).max(1).default(1),
});

/**
 * Schema for component-level audio sync configuration
 */
export const ComponentAudioSyncSchema = z.object({
  override: z.boolean().optional(),
  enabled: z.boolean().optional(),
  type: z.enum(['beat', 'bass', 'mids', 'highs', 'overall']).optional(),
  reactivity: z.number().min(0).max(3).optional(),
  property: z.enum(['scale', 'opacity', 'color', 'all']).optional(),
});

/**
 * Schema for audio configuration (Type 1: Background Audio + Global Sync)
 */
export const AudioConfigSchema = z.object({
  audioUrl: z.string().min(1).optional(), // Support both local files and URLs
  volume: z.number().min(0).max(1).default(1),
  startTime: z.number().min(0).default(0),
  fadeIn: z.number().min(0).default(0),
  fadeOut: z.number().min(0).default(0),
  loop: z.boolean().default(false),
  globalSync: GlobalAudioSyncSchema.optional(),
});

/**
 * Schema for the complete video request
 */
export const VideoRequestSchema = z.object({
  width: z.number().min(1).default(1920),
  height: z.number().min(1).default(1080),
  fps: z.number().min(1).max(60).default(30),
  timeline: z.array(TimelineItemSchema).min(1),
  audioConfig: AudioConfigSchema.optional(), // Type 1: Background audio configuration
});

export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type VideoRequest = z.infer<typeof VideoRequestSchema>;
export type AudioConfig = z.infer<typeof AudioConfigSchema>;
export type GlobalAudioSync = z.infer<typeof GlobalAudioSyncSchema>;
export type ComponentAudioSync = z.infer<typeof ComponentAudioSyncSchema>;