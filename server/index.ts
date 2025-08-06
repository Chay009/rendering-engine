import express from "express";
import cors from "cors";
import { makeRenderQueue } from "./render-queue";
import { bundle } from "@remotion/bundler";
import path from "node:path";
import { ensureBrowser, openBrowser, selectComposition, BrowserInstance, TComposition } from "@remotion/renderer";
import { generateComponentDocs, getAvailableComponents } from "../src/components/registry";

const { PORT = 3000, REMOTION_SERVE_URL } = process.env;

// 🚀 PRODUCTION OPTIMIZATION: Global resources to avoid repetitive operations
let globalBrowserInstance: BrowserInstance | null = null;
const compositionCache = new Map<string, TComposition>();

function setupApp({ 
  remotionBundleUrl, 
  browserInstance, 
  cachedComposition 
}: { 
  remotionBundleUrl: string;
  browserInstance: BrowserInstance;
  cachedComposition: TComposition;
}) {
  const app = express();

  const rendersDir = path.resolve("renders");

  const queue = makeRenderQueue({
    port: Number(PORT),
    serveUrl: remotionBundleUrl,
    rendersDir,
    // 🚀 PRODUCTION OPTIMIZATION: Pass pre-warmed resources
    browserInstance,
    compositionCache,
    cachedComposition,
  });

  // Enable CORS for frontend
  app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  }));

  // Host renders on /renders
  app.use("/renders", express.static(rendersDir));
  app.use(express.json());
  
  // Serve static files (including our test interface)
  app.use(express.static(path.resolve("public")));

  // Endpoint to create a new job with dynamic JSON
  app.post("/renders", async (req, res) => {
    // 🐛 DEBUG: Log what we're receiving from UI
    console.log('🔍 Received request body:', JSON.stringify(req.body, null, 2));
    
    const { titleText = "Hello, world!", compositionId, subtitleText, preset, theme, companyName, tagline, dynamicData } = req.body || {};

    // Handle dynamic JSON rendering
    if (dynamicData) {
      console.log('✅ Using dynamicData path');
      const jobId = queue.createDynamicJob(dynamicData);
      res.json({ jobId });
      return;
    }
    
    // 🐛 DEBUG: Check for new request structure with audioConfig
    if (req.body && req.body.request) {
      console.log('✅ Found request structure, extracting data');
      const requestData = req.body.request;
      
      // Debug log the audio config
      if (requestData.audioConfig) {
        console.log('🎵 Audio config found:', JSON.stringify(requestData.audioConfig, null, 2));
      }
      
      const jobId = queue.createDynamicJob(requestData);
      res.json({ jobId });
      return;
    }
    
    // 🐛 DEBUG: Check if request body itself is the dynamic data
    if (req.body && req.body.timeline) {
      console.log('✅ Found timeline in request body, treating as dynamic data');
      const jobId = queue.createDynamicJob(req.body);
      res.json({ jobId });
      return;
    }

    // Legacy handling for existing compositions
    if (typeof titleText !== "string") {
      res.status(400).json({ message: "titleText must be a string" });
      return;
    }

    if (compositionId && typeof compositionId !== "string") {
      res.status(400).json({ message: "compositionId must be a string" });
      return;
    }

    if (preset && typeof preset !== "string") {
      res.status(400).json({ message: "preset must be a string" });
      return;
    }

    const jobId = queue.createJob({ 
      titleText, 
      compositionId,
      subtitleText,
      preset,
      theme,
      companyName,
      tagline
    });

    res.json({ jobId });
  });

  // Endpoint to get a job status
  app.get("/renders/:jobId", (req, res) => {
    const jobId = req.params.jobId;
    const job = queue.jobs.get(jobId);

    res.json(job);
  });

  // Endpoint to cancel a job
  app.delete("/renders/:jobId", (req, res) => {
    const jobId = req.params.jobId;

    const job = queue.jobs.get(jobId);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    if (job.status !== "queued" && job.status !== "in-progress") {
      res.status(400).json({ message: "Job is not cancellable" });
      return;
    }

    job.cancel();

    res.json({ message: "Job cancelled" });
  });

  // Endpoint to get component documentation for LLM
  app.get("/components", (req, res) => {
    res.json({
      components: getAvailableComponents(),
      documentation: generateComponentDocs()
    });
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", port: PORT });
  });

  return app;
}

async function main() {
  console.log("🚀 PRODUCTION OPTIMIZATION: Starting server with pre-warmed resources...");
  
  // Step 1: Ensure browser dependencies
  await ensureBrowser();

  // Step 2: Bundle the Remotion project
  const remotionBundleUrl = REMOTION_SERVE_URL
    ? REMOTION_SERVE_URL
    : await bundle({
        entryPoint: path.resolve("remotion/index.ts"),
        onProgress(progress) {
          console.info(`Bundling Remotion project: ${progress}%`);
        },
      });

  // 🚀 Step 3: PRODUCTION OPTIMIZATION - Pre-warm browser instance
  console.log("🔥 Pre-warming browser instance...");
  const browserStart = Date.now();
  globalBrowserInstance = await openBrowser("chrome");
  console.log(`✅ Browser pre-warmed in: ${Date.now() - browserStart}ms`);

  // 🚀 Step 4: PRODUCTION OPTIMIZATION - Pre-cache composition
  console.log("📋 Pre-caching composition...");
  const compositionStart = Date.now();
  const cachedComposition = await selectComposition({
    serveUrl: remotionBundleUrl,
    id: "DynamicVideo",
    inputProps: {}, // Empty props for fastest loading
    browserInstance: globalBrowserInstance, // Use pre-warmed browser
  });
  
  // 🐛 DEBUG: Log what's in the cached composition
  console.log('🔍 Raw cached composition includes defaultProps:', !!cachedComposition.defaultProps);
  
  // 🚀 CRITICAL FIX: Remove defaultProps to prevent overriding actual job data
  const cleanedComposition = {
    ...cachedComposition,
    props: undefined,        // Remove cached props
    defaultProps: undefined  // Remove defaultProps that override job data
  };
  
  console.log('🧹 Cleaned composition (no defaultProps):', JSON.stringify(cleanedComposition, null, 2));
  
  compositionCache.set("DynamicVideo", cleanedComposition);
  console.log(`✅ Composition cached in: ${Date.now() - compositionStart}ms`);

  // Step 5: Setup app with pre-warmed resources
  const app = setupApp({ 
    remotionBundleUrl, 
    browserInstance: globalBrowserInstance,
    cachedComposition 
  });

  // Step 6: Start server
  app.listen(PORT, () => {
    console.info(`🚀 PRODUCTION SERVER READY on port ${PORT}`);
    console.info(`⚡ Browser instance: PRE-WARMED`);
    console.info(`📋 Composition cache: LOADED`);
    console.info(`🔥 Ready for ultra-fast rendering!`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🛑 Shutting down gracefully...');
    if (globalBrowserInstance) {
      await globalBrowserInstance.close();
      console.log('✅ Browser instance closed');
    }
    process.exit(0);
  });
}

main();
