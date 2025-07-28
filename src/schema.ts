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
 * Schema for the complete video request
 */
export const VideoRequestSchema = z.object({
  width: z.number().min(1).default(1920),
  height: z.number().min(1).default(1080),
  fps: z.number().min(1).max(60).default(30),
  timeline: z.array(TimelineItemSchema).min(1),
});

export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type VideoRequest = z.infer<typeof VideoRequestSchema>;