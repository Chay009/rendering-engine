# Remotion Component Library Implementation Guide

## Overview

This guide documents the design and implementation of a dynamic component library system for Remotion that enables AI-driven video generation through JSON configurations. The system allows creating videos by describing components and their properties in JSON format, which are then dynamically rendered into MP4 videos.

## Architecture Design

### Core Components

1. **Component Library** (`src/components/`)
   - Individual React components optimized for Remotion
   - Type-safe props interfaces with TypeScript
   - Support for both basic animations and advanced GSAP animations

2. **Component Registry** (`src/components/registry.ts`)
   - Metadata storage for all components
   - AI training documentation generation
   - Prop validation and examples

3. **Dynamic Video Engine** (`src/DynamicVideo.tsx`)
   - Core rendering engine that interprets JSON timelines
   - Dynamic component lookup and instantiation
   - Automatic duration calculation

4. **Server Infrastructure** (`server/`)
   - Express.js API for handling render requests
   - Zod schema validation for JSON input
   - Job queue system with progress tracking

## Implementation Details

### 1. Component Structure

Each component follows this pattern:

```typescript
// Component Props Interface
export interface ComponentNameProps {
  // Required props
  requiredProp: string;
  // Optional props with defaults
  optionalProp?: number;
}

// Component Implementation
export const ComponentName: React.FC<ComponentNameProps> = ({ 
  requiredProp,
  optionalProp = defaultValue 
}) => {
  const frame = useCurrentFrame();
  
  // Animation logic using interpolate() or GSAP
  const animatedValue = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ /* styling */ }}>
      {/* component content */}
    </div>
  );
};
```

### 2. Frame-Based Animation System

**Critical Learning**: All animations must be frame-based and deterministic for video rendering.

#### Correct Approach:
```typescript
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);
```

#### Avoid:
- Time-based animations (`setTimeout`, `setInterval`)
- CSS transitions or animations
- Non-deterministic Math.random() calls

### 3. GSAP Integration Pattern

For advanced animations, use the `useSyncedGsap` hook:

```typescript
const createTimeline = useCallback((element: HTMLDivElement) => {
  const timeline = gsap.timeline({ paused: true });
  
  const h1 = element.querySelector('h1');
  if (!h1) return timeline;

  timeline.from(h1, {
    opacity: 0,
    y: 100,
    duration: 1,
  });
  
  return timeline;
}, [dependencies]); // Important: include prop dependencies

const ref = useSyncedGsap(createTimeline);
```

**Key Points**:
- Always use `useCallback` with proper dependencies
- Timeline must be paused (`{ paused: true }`)
- Return the timeline even if element not found

### 4. Component Registry System

Each component must be registered in `src/components/registry.ts`:

```typescript
export const COMPONENT_METADATA: Record<string, ComponentMeta> = {
  ComponentName: {
    name: 'ComponentName',
    description: 'Brief description of what the component does',
    category: 'text' | 'image' | 'animation' | 'transition' | 'utility',
    props: [
      { 
        name: 'propName', 
        type: 'string', 
        required: true, 
        description: 'What this prop does' 
      },
      { 
        name: 'optionalProp', 
        type: 'number', 
        required: false, 
        default: 96, 
        description: 'Optional prop description' 
      }
    ],
    examples: [
      {
        description: 'Basic usage example',
        props: { propName: 'example value' }
      }
    ]
  }
};
```

### 5. Dynamic Duration Calculation

**Critical Fix**: The server must calculate video duration dynamically based on the timeline:

```typescript
// In render-queue.ts
const calculateDuration = (timeline: any[]): number => {
  if (!timeline || timeline.length === 0) return 300;
  return Math.max(...timeline.map(item => item.startFrame + item.durationInFrames));
};

// Override composition duration
composition.durationInFrames = calculatedDuration;
```

**Why This Matters**: Components appearing after the hardcoded duration won't render.

### 6. JSON Schema Structure

The video request follows this structure:

```json
{
  "dynamicData": {
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "timeline": [
      {
        "component": "ComponentName",
        "props": {
          "text": "Hello World",
          "color": "#FF0000"
        },
        "startFrame": 0,        // ✅ REQUIRED - When component appears (frame number)
        "durationInFrames": 90  // ✅ REQUIRED - How long component is visible (frame count)
      }
    ]
  }
}
```

**CRITICAL**: Every timeline item MUST include both `startFrame` and `durationInFrames` properties. Missing these will cause validation errors and render failures.

## Key Learnings and Design Decisions

### 1. Frame-Based Timing
- **Learning**: All timing must be in frames, not seconds
- **Implementation**: Use `durationInFrames` for component duration
- **Calculation**: At 30fps, 1 second = 30 frames

### 2. Component Isolation
- **Learning**: Each component runs in its own Sequence context
- **Implementation**: `useCurrentFrame()` returns 0-based frame within the sequence
- **Implication**: Components don't need to know their global position

### 3. Type Safety
- **Learning**: Zod validation prevents runtime errors
- **Implementation**: `VideoRequestSchema` validates all incoming JSON
- **Benefit**: Clear error messages for invalid requests

### 4. Dynamic Component Loading
- **Learning**: Use string-based component lookup for flexibility
- **Implementation**: `Components[item.component as keyof typeof Components]`
- **Fallback**: Error component for missing components

### 5. Deterministic Rendering
- **Learning**: Video rendering requires consistent output
- **Implementation**: No random values, time-based logic, or external dependencies
- **Tools**: Use `random()` from Remotion with static seeds

## File Structure

```
src/
├── components/
│   ├── index.ts              # Component exports
│   ├── registry.ts           # Component metadata
│   ├── TitleCard.tsx         # Basic text component
│   ├── ImageWithZoom.tsx     # Image with animations
│   ├── GsapTitle.tsx         # GSAP-powered component
│   ├── CountdownTimer.tsx    # Utility component
│   └── SlideTransition.tsx   # Transition component
├── hooks/
│   └── useSyncedGsap.ts     # GSAP integration hook
├── DynamicVideo.tsx          # Core rendering engine
└── schema.ts                 # Type definitions and validation

server/
├── index.ts                  # Express server setup
└── render-queue.ts          # Render job management
```

## Integration with Remotion

### 1. Root Configuration
The `RemotionRoot` component must include the DynamicVideo composition:

```typescript
<Composition
  id="DynamicVideo"
  component={DynamicVideo}
  durationInFrames={600}  // Generous default
  fps={30}
  width={1920}
  height={1080}
  schema={VideoRequestSchema}
  defaultProps={defaultVideoRequest}
/>
```

### 2. Server Integration
The server handles the bridge between JSON requests and Remotion rendering:

1. Validates JSON with Zod schema
2. Calculates dynamic duration
3. Calls Remotion renderer
4. Returns job status and video URL

### 3. Component Discovery
The `/components` endpoint provides component documentation for AI training:

```typescript
app.get("/components", (req, res) => {
  res.json({
    components: getAvailableComponents(),
    documentation: generateComponentDocs()
  });
});
```

## Performance Considerations

1. **Component Complexity**: Keep components lightweight for faster rendering
2. **GSAP Usage**: Only use GSAP for complex animations that Remotion can't handle
3. **Asset Loading**: Prefer external URLs over local assets for scalability
4. **Memory Management**: GSAP timelines are properly cleaned up in `useSyncedGsap`

## Testing Strategy

1. **Individual Components**: Test each component in isolation
2. **Timeline Integration**: Test components in sequences
3. **Duration Calculation**: Verify videos render completely
4. **Error Handling**: Test with invalid component names and props

## Deployment Considerations

1. **Server Resources**: Video rendering is CPU/memory intensive
2. **File Storage**: Rendered videos need persistent storage (S3, etc.)
3. **Queue Management**: Use Redis for production job queues
4. **Error Monitoring**: Log component errors and render failures

This architecture provides a robust foundation for AI-driven video generation while maintaining type safety, performance, and extensibility.