# Component Development Best Practices & Guidelines

## Overview

This document provides systematic guidance for creating new Remotion components, maintaining quality standards, and ensuring seamless integration with the AI-driven video generation system.

## Pre-Development Checklist

Before creating any new component, ensure:

- [ ] Clear understanding of component purpose and use case
- [ ] Defined animation requirements (basic interpolate vs GSAP)
- [ ] Identified required and optional props
- [ ] Planned integration with existing component categories
- [ ] User approval for component concept
- [ ] **CRITICAL**: Plan error handling for external resources (images, audio, video)
- [ ] **CRITICAL**: Design fallback UI for failed resource loading
- [ ] **CRITICAL**: Make all external resources optional props

## Component Development Workflow

### Phase 1: Planning & Design

#### 1.1 Component Analysis
```
User Request: "Create a progress bar component"

Analysis Questions:
- What type of progress? (percentage, countdown, steps)
- Animation style? (smooth fill, stepped, pulsing)
- Visual design? (horizontal bar, circular, custom shape)
- Timing control? (fixed duration, prop-controlled)
- Data source? (static values, calculated from timeline)
```

#### 1.2 Props Interface Design
```typescript
// Design props interface FIRST
export interface ProgressBarProps {
  // Required props - what makes this component unique
  startValue: number;
  endValue: number;
  
  // Visual customization - optional with sensible defaults
  color?: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
  
  // Animation control - optional but powerful
  animationType?: 'smooth' | 'stepped' | 'bounce';
  duration?: number; // frames, not seconds
  
  // Content options
  showPercentage?: boolean;
  label?: string;
}
```

### Phase 2: Implementation

#### 2.1 Component Structure Template
```typescript
import { useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

export interface NewComponentProps {
  // Props definition here
}

export const NewComponent: React.FC<NewComponentProps> = ({ 
  requiredProp,
  optionalProp = defaultValue,
  duration = 150 // Always provide frame-based defaults
}) => {
  const frame = useCurrentFrame();
  
  // 1. VALIDATION - Handle edge cases early
  const safeValue = Number(requiredProp) || 0;
  const safeDuration = duration || 150;
  
  // 2. CALCULATIONS - Frame-based animations
  const progress = interpolate(frame, [0, safeDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // 3. DERIVED VALUES - Calculate display values
  const currentValue = interpolate(frame, [0, safeDuration], [startValue, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // 4. RENDER - Clean, accessible markup
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Component content */}
    </div>
  );
};
```

#### 2.2 External Resource Component Template (CRITICAL)

**⚠️ MANDATORY for components using images, audio, video, or external assets:**

```typescript
import React from 'react';
import { useCurrentFrame, interpolate, Img } from 'remotion';

export interface ExternalResourceProps {
  // ✅ CRITICAL: Make external resources OPTIONAL
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  
  // ✅ CRITICAL: Provide fallback customization
  fallbackText?: string;
  fallbackColor?: string;
  
  // Other props...
  animationType?: 'fade' | 'slide';
}

export const ExternalResourceComponent: React.FC<ExternalResourceProps> = ({
  imageUrl,
  fallbackText = 'Resource not available',
  fallbackColor = '#333',
  // ... other props
}) => {
  const frame = useCurrentFrame();
  
  // ✅ CRITICAL: Smart URL validation
  const isValidUrl = (url?: string): boolean => {
    if (!url) return false;
    
    // Reject placeholder patterns
    const placeholderPatterns = ['example.com', 'placeholder', 'lorem', 'dummy', 'fake'];
    if (placeholderPatterns.some(pattern => url.includes(pattern))) {
      return false;
    }
    
    // Ensure proper protocol
    return url.startsWith('http');
  };
  
  const isValidImageUrl = isValidUrl(imageUrl);
  
  // Animation logic...
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isValidImageUrl ? (
        // ✅ Real content with error handling
        <Img
          src={imageUrl}
          style={{ width: '100%', height: '100%', opacity }}
          onError={() => {
            console.error(`Failed to load image: ${imageUrl}`);
          }}
        />
      ) : (
        // ✅ CRITICAL: Graceful fallback UI
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: fallbackColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '48px',
            textAlign: 'center',
            opacity, // ✅ Maintain animations in fallback
          }}
        >
          {fallbackText}
        </div>
      )}
    </div>
  );
};
```

#### 2.3 GSAP Component Template (Advanced)
```typescript
import React, { useCallback } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';

// ✅ CRITICAL: Import plugins using ES6 imports ONLY
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
// import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ✅ Register plugins at module level (not inside try-catch)
// gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin, ScrollTrigger);

export const GsapComponent: React.FC<GsapComponentProps> = ({ 
  text, 
  animationType = 'slideUp' 
}) => {
  // CRITICAL: useCallback with ALL dependencies
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    // ALWAYS check if element exists
    const target = element.querySelector('.animation-target');
    if (!target) return timeline;

    // Define animations based on type
    switch (animationType) {
      case 'slideUp':
        timeline.from(target, { opacity: 0, y: 100, duration: 1 });
        break;
      case 'fadeIn':
        timeline.from(target, { opacity: 0, duration: 1 });
        break;
      default:
        timeline.from(target, { opacity: 0, duration: 1 });
    }
    
    return timeline;
  }, [text, animationType]); // ✅ Include ALL used props

  const ref = useSyncedGsap(createTimeline);

  return (
    <div ref={ref}>
      <div className="animation-target">
        {text}
      </div>
    </div>
  );
};
```

### Phase 3: Testing & Validation

#### 3.1 Component Testing Checklist

**Individual Component Tests:**
- [ ] Default props work correctly
- [ ] All prop combinations function
- [ ] Edge cases handled (empty strings, zero values, null)
- [ ] Animations complete within expected timeframes
- [ ] Visual output matches expectations

**Integration Tests:**
- [ ] Component works in sequence with others
- [ ] Timing calculations are correct
- [ ] No conflicts with other components
- [ ] Performance is acceptable

**JSON Test Cases:**
```json
// Test 1: Minimal props
{
  "component": "NewComponent",
  "props": { "requiredProp": "test" },
  "startFrame": 0,              // ✅ REQUIRED - When component appears
  "durationInFrames": 90        // ✅ REQUIRED - How long it's visible
}

// Test 2: All props
{
  "component": "NewComponent", 
  "props": {
    "requiredProp": "test",
    "optionalProp": 123,
    "color": "#FF0000",
    "duration": 120
  },
  "startFrame": 90,             // ✅ REQUIRED - Sequence after previous
  "durationInFrames": 120       // ✅ REQUIRED - Component duration
}

// Test 3: Edge cases
{
  "component": "NewComponent",
  "props": {
    "requiredProp": "",
    "optionalProp": 0
  },
  "startFrame": 210,            // ✅ REQUIRED - 90 + 120 = 210
  "durationInFrames": 60        // ✅ REQUIRED - Test duration
}
```

**CRITICAL**: Every timeline item MUST include both `startFrame` and `durationInFrames` properties or Zod validation will fail with "Required" errors.

### Phase 4: Registry Integration

#### 4.1 Component Export
```typescript
// In src/components/index.ts
export { NewComponent } from './NewComponent';

// Update registry constant
export const COMPONENT_REGISTRY = {
  // existing components...
  NewComponent: 'NewComponent',
} as const;
```

#### 4.2 Registry Metadata
```typescript
// In src/components/registry.ts
NewComponent: {
  name: 'NewComponent',
  description: 'Clear, concise description of what this component does and when to use it',
  category: 'text' | 'image' | 'animation' | 'transition' | 'utility',
  props: [
    { 
      name: 'requiredProp', 
      type: 'string', 
      required: true, 
      description: 'Detailed description of this prop and its impact' 
    },
    { 
      name: 'optionalProp', 
      type: 'number', 
      required: false, 
      default: 150, 
      description: 'What this prop controls and when to change it' 
    },
    // Include ALL props, even complex ones
    { 
      name: 'animationType', 
      type: 'string', 
      required: false, 
      default: 'smooth', 
      description: 'Animation style for the component', 
      options: ['smooth', 'stepped', 'bounce'] 
    }
  ],
  examples: [
    {
      description: 'Basic usage with required props only',
      props: { requiredProp: 'example' }
    },
    {
      description: 'Advanced usage with custom styling',
      props: { 
        requiredProp: 'example', 
        optionalProp: 200, 
        color: '#FF6347',
        animationType: 'bounce'
      }
    },
    {
      description: 'Edge case or special scenario',
      props: { requiredProp: 'special case example' }
    }
  ]
}
```

## Development Standards

### Code Quality Standards

#### Naming Conventions
```typescript
// Components: PascalCase
export const VideoProgressBar: React.FC = () => {};

// Props: camelCase with descriptive names
interface VideoProgressBarProps {
  progressValue: number;        // ✅ Clear purpose
  animationDuration: number;   // ✅ Specific type of duration
  backgroundColor: string;     // ✅ Specific visual property
}

// Avoid ambiguous names
interface BadProps {
  value: number;    // ❌ What kind of value?
  time: number;     // ❌ Seconds? Frames? Duration?
  color: string;    // ❌ Which color? Text? Background?
}
```

#### Frame-Based Calculations
```typescript
// ✅ CORRECT - Frame-based timing
const frame = useCurrentFrame();
const progress = interpolate(frame, [0, durationInFrames], [0, 1]);

// ❌ WRONG - Time-based calculations
const now = Date.now();
const elapsed = now - startTime;
```

#### Error Handling Patterns
```typescript
// Input validation
const safeStartValue = Number(startValue) || 0;
const safeEndValue = Number(endValue) || 100;
const safeDuration = duration && duration > 0 ? duration : 150;

// Boundary checking
const clampedProgress = Math.max(0, Math.min(1, progress));

// Graceful degradation
const displayText = text || 'Default Text';
```

### Performance Guidelines

#### Optimization Patterns
```typescript
// ✅ GOOD - Minimal calculations per frame
const frame = useCurrentFrame();
const progress = interpolate(frame, [0, 100], [0, 1]);
const width = `${progress * 100}%`;

// ❌ EXPENSIVE - Complex calculations every frame
const frame = useCurrentFrame();
const complexValue = heavyCalculation(frame); // Runs every frame!
```

#### Memory Management
```typescript
// ✅ GOOD - GSAP cleanup handled by hook
const ref = useSyncedGsap(createTimeline);

// ✅ GOOD - No persistent references
const animatedValue = interpolate(frame, ...);

// ❌ BAD - Manual timers or intervals
useEffect(() => {
  const interval = setInterval(() => {}, 100); // ❌ Will break rendering
  return () => clearInterval(interval);
}, []);
```

## Component Categories & Guidelines

### Text Components
**Purpose**: Display and animate text content
**Guidelines**:
- Support font customization (size, color, weight)
- Provide multiple animation options
- Handle text overflow gracefully
- Support multiline content

**Common Props**:
```typescript
interface TextComponentProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter';
  textAlign?: 'left' | 'center' | 'right';
  animationType?: 'fadeIn' | 'slideUp' | 'typewriter';
}
```

### Image Components
**Purpose**: Display and manipulate visual content
**Guidelines**:
- Support multiple image formats
- Handle loading states gracefully
- Provide scaling and positioning options
- Consider performance with large images

**Common Props**:
```typescript
interface ImageComponentProps {
  imageUrl: string;
  fit?: 'cover' | 'contain' | 'fill';
  position?: 'center' | 'top' | 'bottom';
  animationType?: 'zoomIn' | 'fadeIn' | 'slideIn';
}
```

### Animation Components
**Purpose**: Complex motion graphics and transitions
**Guidelines**:
- Use GSAP for complex animations
- Provide timing controls
- Support easing options
- Consider animation performance

### Utility Components
**Purpose**: Functional elements (timers, progress bars, etc.)
**Guidelines**:
- Focus on clear data visualization
- Support customization without complexity
- Provide sensible defaults
- Handle edge cases (zero values, invalid data)

### Transition Components
**Purpose**: Scene transitions and visual effects
**Guidelines**:
- Work well with other components
- Support directional controls
- Provide duration options
- Consider composition layering

## User Approval Process

### Component Proposal Template
```markdown
## Component Proposal: [ComponentName]

### Purpose
What problem does this component solve?

### Use Cases
- Primary use case
- Secondary use cases
- Example scenarios

### Props Interface
```typescript
interface ComponentProps {
  // Proposed props with types and descriptions
}
```

### Visual Description
How will this component look and behave?

### Implementation Complexity
- Estimated development time
- Required dependencies
- Technical challenges

### Examples
Provide 2-3 JSON examples showing usage
```

### Approval Criteria
Before implementation approval, verify:
- [ ] Clear use case and purpose
- [ ] Well-defined props interface
- [ ] No overlap with existing components
- [ ] Feasible with current architecture
- [ ] Performance considerations addressed

## Registry Update Workflow

### Step 1: Component Development
1. Create component file
2. Export from `index.ts`
3. Test thoroughly

### Step 2: User Review
1. Present component demonstration
2. Gather feedback
3. Make requested adjustments
4. Get final approval

### Step 3: Registry Integration
1. Add component metadata to registry
2. Include comprehensive examples
3. Update component documentation
4. Test LLM prompt generation

### Step 4: Documentation
1. Update main documentation
2. Add component to available list
3. Include usage examples
4. Document any special considerations

## Common Pitfalls to Avoid

### 🚫 Never Do These Things

#### Use Incorrect GSAP Plugin Imports
```typescript
// ❌ WRONG - CommonJS require() pattern
try {
  const { MotionPathPlugin } = require('gsap/MotionPathPlugin');
  gsap.registerPlugin(MotionPathPlugin);
} catch (error) {
  console.warn('Plugin not available');
}

// ❌ WRONG - Try-catch masks real import issues
// ❌ WRONG - Plugin registration inside conditionals

// ✅ CORRECT - ES6 import pattern
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// ✅ CORRECT - Module-level registration
gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin);
```

#### Hardcode Values
```typescript
// ❌ WRONG
const duration = 90; // Hardcoded frames
const size = 120;    // Hardcoded pixels

// ✅ CORRECT  
const duration = durationInFrames || 90;
const size = fontSize || 120;
```

#### Use Time-Based Logic
```typescript
// ❌ WRONG
setTimeout(() => {}, 1000);
const now = Date.now();

// ✅ CORRECT
const frame = useCurrentFrame();
const progress = interpolate(frame, [0, 30], [0, 1]);
```

#### Ignore Error Cases
```typescript
// ❌ WRONG
const value = props.number.toFixed(2); // Crashes if undefined

// ✅ CORRECT
const value = (Number(props.number) || 0).toFixed(2);
```

#### Skip Component Registration
```typescript
// ❌ Missing from registry means:
// - Component not discoverable by AI
// - No documentation generated
// - Inconsistent development experience
```

### ✅ Always Do These Things

#### Provide Fallbacks
```typescript
const text = props.text || 'Default Text';
const color = props.color || '#FFFFFF';
const duration = props.duration || 150;
```

#### Include Required Timeline Properties
```json
// ✅ ALWAYS include these in every timeline item
{
  "component": "ComponentName",
  "props": { /* component props */ },
  "startFrame": 0,              // When component appears (required)
  "durationInFrames": 90        // How long it's visible (required)
}
```

#### Use Semantic Props
```typescript
// ✅ GOOD
interface Props {
  titleText: string;
  animationDuration: number;
  backgroundColor: string;
}

// ❌ UNCLEAR
interface Props {
  text: string;
  time: number;
  color: string;
}
```

#### Test Edge Cases
```typescript
// Test with:
// - Empty strings: ""
// - Zero values: 0
// - Negative numbers: -1
// - Very large numbers: 999999
// - Undefined props: undefined
```

#### Document Behavior
```typescript
/**
 * ProgressBar component that animates from startValue to endValue
 * 
 * @param startValue - Initial progress value (0-100)
 * @param endValue - Final progress value (0-100)  
 * @param duration - Animation duration in frames (default: 150)
 */
```

## Quality Assurance Checklist

Before marking any component as complete:

### Code Quality
- [ ] No hardcoded values
- [ ] Proper error handling
- [ ] Clean, readable code
- [ ] TypeScript types defined
- [ ] No console errors/warnings

### Functionality
- [ ] All props work as expected
- [ ] Animations smooth and timing correct
- [ ] Edge cases handled gracefully
- [ ] Performance acceptable

### Integration
- [ ] Component exported correctly
- [ ] Registry metadata complete
- [ ] Documentation updated
- [ ] Examples tested
- [ ] **NEW**: Test JSON file created for immediate validation

### User Experience
- [ ] Visual output matches expectations
- [ ] Props intuitive and well-named
- [ ] Behavior predictable
- [ ] Error states user-friendly

## AI Agent Instructions for Component Creation

### Remotion-GSAP-Animator Agent Protocol

When requesting component creation from the remotion-gsap-animator agent, **ALWAYS** include these requirements:

#### **MANDATORY: Test JSON Generation**
```
CRITICAL: After creating the component, generate a comprehensive test JSON file that demonstrates:

1. **Multiple Usage Examples**: 3-5 different timeline entries showcasing various prop combinations
2. **Progressive Complexity**: Start simple, build to advanced use cases  
3. **Edge Case Testing**: Include examples that test fallback behavior
4. **Production-Ready**: Use realistic durations, proper frame timing
5. **Complete Timeline**: Include title cards between examples for context

Format the JSON as a complete Remotion timeline with:
- width: 1920, height: 1080, fps: 30
- Proper startFrame and durationInFrames for each entry
- TitleCard components for labeling each demo section
- The new component with varied props to showcase capabilities

Name the file: test-[component-name].json
```

#### **Enhanced Agent Prompt Template**
```
Create a [ComponentName] Remotion component with [specific requirements].

MANDATORY DELIVERABLES:
1. ✅ Component implementation following our safety patterns
2. ✅ Complete TypeScript interface with all props documented  
3. ✅ Registry.ts integration with comprehensive metadata
4. ✅ Export integration in index.ts
5. ✅ **CRITICAL**: Generate test-[component-name].json with 5+ usage examples

Reference these files for implementation patterns:
- /IMAGE_HANDLING_AND_ERROR_PREVENTION.md - For error handling
- /COMPONENT_DEVELOPMENT_BEST_PRACTICES.md - For structure  
- /src/components/[SimilarComponent].tsx - For patterns
- /src/components/registry.ts - For documentation format

The test JSON should immediately allow testing the component with:
- Basic usage example
- Advanced features demonstration  
- Different prop combinations
- Edge cases and fallback scenarios
- Realistic video production timing
```

#### **Example Test JSON Structure**
```json
{
  "width": 1920,
  "height": 1080, 
  "fps": 30,
  "timeline": [
    {
      "component": "TitleCard",
      "props": { "text": "Component Demo: Basic Usage" },
      "startFrame": 0,
      "durationInFrames": 60
    },
    {
      "component": "NewComponent", 
      "props": { /* basic props */ },
      "startFrame": 60,
      "durationInFrames": 240
    },
    {
      "component": "TitleCard",
      "props": { "text": "Advanced Features" },
      "startFrame": 300,
      "durationInFrames": 60
    },
    {
      "component": "NewComponent",
      "props": { /* advanced props */ },
      "startFrame": 360,
      "durationInFrames": 300
    }
    // ... continue pattern
  ]
}
```

### Benefits of This Approach

✅ **Immediate Validation**: Test JSON allows instant component verification  
✅ **Documentation by Example**: Shows real usage patterns  
✅ **Quality Assurance**: Forces agent to think through edge cases  
✅ **User Experience**: Provides ready-to-use examples  
✅ **Production Readiness**: Ensures realistic timing and prop combinations  

Following these guidelines ensures consistent, high-quality components that integrate seamlessly with the AI-driven video generation system.