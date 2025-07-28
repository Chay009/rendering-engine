import {
  makeCancelSignal,
  renderMedia,
  selectComposition,
  BrowserInstance,
  TComposition,
} from "@remotion/renderer";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { VideoRequestSchema, VideoRequest } from "../src/schema";

interface JobData {
  titleText: string;
  compositionId?: string;
  subtitleText?: string;
  preset?: string;
  theme?: string;
  companyName?: string;
  tagline?: string;
}

interface DynamicJobData {
  videoRequest: VideoRequest;
}

type JobState =
  | {
      status: "queued";
      data: JobData | DynamicJobData;
      cancel: () => void;
    }
  | {
      status: "in-progress";
      progress: number;
      data: JobData | DynamicJobData;
      cancel: () => void;
    }
  | {
      status: "completed";
      videoUrl: string;
      data: JobData | DynamicJobData;
    }
  | {
      status: "failed";
      error: Error;
      data: JobData | DynamicJobData;
    };

const defaultCompositionId = "HelloWorld";

export const makeRenderQueue = ({
  port,
  serveUrl,
  rendersDir,
  browserInstance,
}: {
  port: number;
  serveUrl: string;
  rendersDir: string;
  // 🚀 PRODUCTION OPTIMIZATION: Pre-warmed resources
  browserInstance?: BrowserInstance;
  compositionCache?: Map<string, TComposition>;
  cachedComposition?: TComposition;
}) => {
  const jobs = new Map<string, JobState>();
  let queue: Promise<unknown> = Promise.resolve();

  const processRender = async (jobId: string) => {
    console.log(`🚀 Starting processRender for job ${jobId}`);
    const startTime = Date.now();
    
    const job = jobs.get(jobId);
    if (!job) {
      throw new Error(`Render job ${jobId} not found`);
    }

    console.log(`⏱️ Job setup took: ${Date.now() - startTime}ms`);
    const { cancel, cancelSignal } = makeCancelSignal();

    jobs.set(jobId, {
      progress: 0,
      status: "in-progress",
      cancel: cancel,
      data: job.data,
    });

    try {
      // Check if this is a dynamic job
      if ('videoRequest' in job.data) {
        const { videoRequest } = job.data;
        
        console.log(`📋 Starting validation for job ${jobId}`);
        const validationStart = Date.now();
        
        // Validate the video request
        const validationResult = VideoRequestSchema.safeParse(videoRequest);
        if (!validationResult.success) {
          throw new Error(`Invalid video request: ${JSON.stringify(validationResult.error.formErrors)}`);
        }

        console.log(`✅ Validation took: ${Date.now() - validationStart}ms`);

        // Calculate the total duration from the timeline
        const calculateDuration = (timeline: VideoRequest['timeline']): number => {
          if (!timeline || timeline.length === 0) return 300;
          return Math.max(...timeline.map(item => item.startFrame + item.durationInFrames));
        };

        const calculatedDuration = calculateDuration(validationResult.data.timeline);
        console.log(`📏 Calculated video duration: ${calculatedDuration} frames`);

        // 🚀 TEMPORARY FIX: Always use selectComposition with actual data to ensure props are used
        console.log(`⚡ Using selectComposition with actual job data for ${jobId}`);
        const compositionStart = Date.now();
        
        const composition = await selectComposition({
          serveUrl,
          id: "DynamicVideo",
          inputProps: validationResult.data, // Use actual job data
          browserInstance: browserInstance, // Use pre-warmed browser if available
        });
        
        // Override the composition duration with the calculated one
        composition.durationInFrames = calculatedDuration;
        console.log(`🎬 selectComposition with actual data took: ${Date.now() - compositionStart}ms`);

        console.log(`🎥 Starting renderMedia for job ${jobId}`);
        console.log(`📋 Timeline data:`, JSON.stringify(validationResult.data.timeline, null, 2));
        console.log(`🎬 Composition duration: ${composition.durationInFrames} frames`);
        const renderStart = Date.now();

        await renderMedia({
          cancelSignal,
          serveUrl,
          composition,
          inputProps: validationResult.data,
          codec: "h264",
          // 🚀 PRODUCTION OPTIMIZATION: Use pre-warmed browser for rendering
          browserInstance: browserInstance,
          onProgress: (progress) => {
            console.info(`${jobId} render progress:`, progress.progress);
            jobs.set(jobId, {
              progress: progress.progress,
              status: "in-progress",
              cancel: cancel,
              data: job.data,
            });
          },
          outputLocation: path.join(rendersDir, `${jobId}.mp4`),
        });

        console.log(`🎥 renderMedia took: ${Date.now() - renderStart}ms`);
        console.log(`🏁 Total job time: ${Date.now() - startTime}ms`);

        jobs.set(jobId, {
          status: "completed",
          videoUrl: `http://localhost:${port}/renders/${jobId}.mp4`,
          data: job.data,
        });
        return;
      }

      // Legacy job handling
      const legacyData = job.data as JobData;
      const compositionId = legacyData.compositionId || defaultCompositionId;
      
      let inputProps;
      if (compositionId === "GSAPStaggerTextDemo") {
        inputProps = {
          titleText: job.data.titleText,
          subtitleText: job.data.subtitleText || "Powered by Remotion"
        };
      } else if (compositionId === "ComponentShowcase") {
        inputProps = {
          preset: job.data.preset || "creative",
          title: job.data.titleText,
          subtitle: job.data.subtitleText || "Remotion + GSAP + Library Components"
        };
      } else if (compositionId === "GSAPWebsiteClone") {
        inputProps = {
          theme: job.data.theme || "dark",
          companyName: job.data.companyName || job.data.titleText,
          tagline: job.data.tagline || job.data.subtitleText || "Professional-grade JavaScript animation"
        };
      } else if (compositionId === "WavyBackgroundDemo") {
        inputProps = {
          title: job.data.titleText,
          subtitle: job.data.subtitleText || "Animated ocean-like waves with GSAP + Remotion"
        };
      } else if (compositionId === "TextSplitDemo") {
        inputProps = {
          title: job.data.titleText,
          subtitle: job.data.subtitleText || "Interactive text splitting with GSAP + Remotion"
        };
      } else if (compositionId === "GeometricBackgroundDemo") {
        inputProps = {
          title: job.data.titleText,
          subtitle: job.data.subtitleText || "Elegant floating shapes with GSAP + Remotion"
        };
      } else if (compositionId === "InteractiveTextSplitDemo") {
        inputProps = {
          title: job.data.titleText,
          subtitle: job.data.subtitleText || "Advanced text transitions with GSAP + Remotion"
        };
      } else if (compositionId === "ShaderWavyBackgroundDemo") {
        inputProps = {
          title: job.data.titleText,
          subtitle: job.data.subtitleText || "WebGL-powered ocean waves with GSAP + Remotion"
        };
      } else {
        inputProps = {
          titleText: job.data.titleText,
        };
      }

      const composition = await selectComposition({
        serveUrl,
        id: compositionId,
        inputProps,
      });

      await renderMedia({
        cancelSignal,
        serveUrl,
        composition,
        inputProps,
        codec: "h264",
        onProgress: (progress) => {
          console.info(`${jobId} render progress:`, progress.progress);
          jobs.set(jobId, {
            progress: progress.progress,
            status: "in-progress",
            cancel: cancel,
            data: job.data,
          });
        },
        outputLocation: path.join(rendersDir, `${jobId}.mp4`),
      });

      jobs.set(jobId, {
        status: "completed",
        videoUrl: `http://localhost:${port}/renders/${jobId}.mp4`,
        data: job.data,
      });
    } catch (error) {
      console.error(error);
      jobs.set(jobId, {
        status: "failed",
        error: error as Error,
        data: job.data,
      });
    }
  };

  const queueRender = async ({
    jobId,
    data,
  }: {
    jobId: string;
    data: JobData | DynamicJobData;
  }) => {
    jobs.set(jobId, {
      status: "queued",
      data,
      cancel: () => {
        jobs.delete(jobId);
      },
    });

    // Process immediately instead of queuing for better responsiveness
    processRender(jobId).catch(error => {
      console.error(`Job ${jobId} failed:`, error);
      jobs.set(jobId, {
        status: "failed",
        error: error as Error,
        data,
      });
    });
  };

  function createJob(data: JobData) {
    const jobId = randomUUID();

    queueRender({ jobId, data });

    return jobId;
  }

  function createDynamicJob(videoRequest: VideoRequest) {
    console.log(`🆕 Creating new dynamic job`);
    const createStart = Date.now();
    
    const jobId = randomUUID();
    const dynamicData: DynamicJobData = { videoRequest };

    console.log(`📝 Job creation took: ${Date.now() - createStart}ms`);
    
    queueRender({ jobId, data: dynamicData });

    return jobId;
  }

  return {
    createJob,
    createDynamicJob,
    jobs,
  };
};
