// Component Registry Documentation
// This file maintains metadata about all components for AI training and validation

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
  options?: string[]; // For enum-like props
}

export interface ComponentMeta {
  name: string;
  description: string;
  category: 'text' | 'image' | 'animation' | 'transition' | 'utility';
  props: ComponentProp[];
  examples: Array<{
    description: string;
    props: Record<string, any>;
  }>;
}

export const COMPONENT_METADATA: Record<string, ComponentMeta> = {
  TitleCard: {
    name: 'TitleCard',
    description: 'A customizable title card with various animation options',
    category: 'text',
    props: [
      { name: 'text', type: 'string', required: true, description: 'The text to display' },
      { name: 'color', type: 'string', required: false, default: '#FFFFFF', description: 'Text color' },
      { name: 'fontSize', type: 'number', required: false, default: 96, description: 'Font size in pixels' },
      { name: 'animationType', type: 'string', required: false, default: 'fadeIn', description: 'Animation style', options: ['fadeIn', 'slideUp', 'scale'] }
    ],
    examples: [
      {
        description: 'Simple title with fade in',
        props: { text: 'Welcome', animationType: 'fadeIn' }
      },
      {
        description: 'Red title with slide up animation',
        props: { text: 'Hello World', color: '#FF0000', animationType: 'slideUp', fontSize: 120 }
      }
    ]
  },

  ImageWithZoom: {
    name: 'ImageWithZoom',
    description: '🛡️ PRODUCTION-SAFE image component with zoom animation and comprehensive error handling for invalid URLs',
    category: 'image',
    props: [
      { name: 'imageUrl', type: 'string', required: false, description: '✅ OPTIONAL: URL of the image to display (supports graceful fallback for invalid/placeholder URLs)' },
      { name: 'zoomIntensity', type: 'number', required: false, default: 0.2, description: 'How much to zoom (0.1 = 10% zoom)' },
      { name: 'direction', type: 'string', required: false, default: 'in', description: 'Zoom direction', options: ['in', 'out'] },
      { name: 'fit', type: 'string', required: false, default: 'cover', description: 'Image fit style', options: ['cover', 'contain', 'fill'] },
      { name: 'fallbackText', type: 'string', required: false, default: 'Image not available', description: '🛡️ SAFETY: Custom text shown when image fails to load' },
      { name: 'fallbackColor', type: 'string', required: false, default: '#333', description: '🛡️ SAFETY: Background color for fallback UI' }
    ],
    examples: [
      {
        description: 'Working image with zoom in',
        props: { imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', direction: 'in' }
      },
      {
        description: 'Image with intense zoom out',
        props: { imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', direction: 'out', zoomIntensity: 0.5 }
      },
      {
        description: '🛡️ SAFE: Graceful fallback for invalid URLs',
        props: { imageUrl: 'https://example.com/invalid-image.jpg', fallbackText: 'Custom fallback message', fallbackColor: '#FF6347' }
      },
      {
        description: '🛡️ SAFE: No imageUrl provided (tests optional nature)',
        props: { direction: 'in', fallbackText: 'No image provided', fallbackColor: '#4169E1' }
      }
    ]
  },

  GsapTitle: {
    name: 'GsapTitle',
    description: 'Advanced title animation using GSAP library',
    category: 'animation',
    props: [
      { name: 'text', type: 'string', required: true, description: 'The text to animate' },
      { name: 'color', type: 'string', required: false, default: 'white', description: 'Text color' },
      { name: 'fontSize', type: 'number', required: false, default: 96, description: 'Font size in pixels' },
      { name: 'animationType', type: 'string', required: false, default: 'slideUp', description: 'GSAP animation style', options: ['slideUp', 'stagger', 'bounce'] }
    ],
    examples: [
      {
        description: 'Staggered character animation',
        props: { text: 'AMAZING', animationType: 'stagger', color: '#00FF00' }
      },
      {
        description: 'Bouncy title entrance',
        props: { text: 'BOUNCE!', animationType: 'bounce', fontSize: 150 }
      }
    ]
  },

  CountdownTimer: {
    name: 'CountdownTimer',
    description: 'Animated countdown timer with customizable range and formatting',
    category: 'utility',
    props: [
      { name: 'startNumber', type: 'number', required: true, description: 'Starting number for countdown' },
      { name: 'endNumber', type: 'number', required: true, description: 'Ending number for countdown' },
      { name: 'color', type: 'string', required: false, default: '#FFFFFF', description: 'Number color' },
      { name: 'fontSize', type: 'number', required: false, default: 128, description: 'Font size in pixels' },
      { name: 'prefix', type: 'string', required: false, default: '', description: 'Text before the number' },
      { name: 'suffix', type: 'string', required: false, default: '', description: 'Text after the number' },
      { name: 'duration', type: 'number', required: false, default: 150, description: 'Duration in frames for the countdown animation' }
    ],
    examples: [
      {
        description: 'Simple countdown from 10 to 0',
        props: { startNumber: 10, endNumber: 0 }
      },
      {
        description: 'Progress counter with percentage',
        props: { startNumber: 0, endNumber: 100, suffix: '%', color: '#00FF00' }
      },
      {
        description: 'Fast countdown with custom duration',
        props: { startNumber: 5, endNumber: 1, suffix: '!', duration: 90 }
      }
    ]
  },

  SlideTransition: {
    name: 'SlideTransition',
    description: 'Sliding transition effect with directional control',
    category: 'transition',
    props: [
      { name: 'backgroundColor', type: 'string', required: true, description: 'Background color of the slide' },
      { name: 'direction', type: 'string', required: false, default: 'right', description: 'Slide direction', options: ['left', 'right', 'up', 'down'] },
      { name: 'children', type: 'ReactNode', required: false, description: 'Content to display inside the slide' }
    ],
    examples: [
      {
        description: 'Blue slide from the right',
        props: { backgroundColor: '#0066FF', direction: 'right' }
      },
      {
        description: 'Red slide from top',
        props: { backgroundColor: '#FF0000', direction: 'down' }
      }
    ]
  },

  MotionPath: {
    name: 'MotionPath',
    description: 'Animates elements along SVG paths using GSAP MotionPath plugin with support for predefined shapes and custom paths',
    category: 'animation',
    props: [
      { name: 'elementText', type: 'string', required: false, default: '●', description: 'Text content displayed in the animated element' },
      { name: 'elementColor', type: 'string', required: false, default: '#FF6347', description: 'Color of the animated element' },
      { name: 'elementSize', type: 'number', required: false, default: 40, description: 'Size of the animated element in pixels' },
      { name: 'elementShape', type: 'string', required: false, default: 'circle', description: 'Shape of the animated element', options: ['circle', 'square', 'text'] },
      { name: 'svgPath', type: 'string', required: false, description: 'Custom SVG path string for complex motion paths' },
      { name: 'pathType', type: 'string', required: false, default: 'circle', description: 'Predefined path type when not using custom SVG', options: ['circle', 'line', 'curve', 'spiral'] },
      { name: 'duration', type: 'number', required: false, default: 180, description: 'Animation duration in frames' },
      { name: 'autoRotate', type: 'boolean', required: false, default: true, description: 'Whether element should rotate to follow path direction' },
      { name: 'ease', type: 'string', required: false, default: 'none', description: 'GSAP easing function (e.g., "power2.inOut", "bounce.out")' },
      { name: 'radius', type: 'number', required: false, default: 200, description: 'Radius for circle and spiral path types' },
      { name: 'width', type: 'number', required: false, default: 400, description: 'Width for line and curve path types' },
      { name: 'height', type: 'number', required: false, default: 200, description: 'Height for curve path type' },
      { name: 'offsetDistance', type: 'number', required: false, default: 0, description: 'Starting position along path (0-1)' },
      { name: 'motionBlur', type: 'boolean', required: false, default: false, description: 'Add motion blur effect during animation' }
    ],
    examples: [
      {
        description: 'Rocket emoji moving in a circle with rotation',
        props: { 
          elementText: '🚀', 
          elementShape: 'text', 
          pathType: 'circle', 
          radius: 300, 
          autoRotate: true, 
          duration: 180 
        }
      },
      {
        description: 'Star in square shape following curved path',
        props: { 
          elementText: '★', 
          elementShape: 'square', 
          elementColor: '#FFD700', 
          pathType: 'curve', 
          width: 800, 
          height: 400, 
          ease: 'power2.inOut' 
        }
      },
      {
        description: 'Custom SVG path with motion blur',
        props: { 
          svgPath: 'M 0,0 Q 200,100 400,0 T 800,0', 
          elementText: 'FAST', 
          elementShape: 'text', 
          motionBlur: true, 
          autoRotate: false 
        }
      },
      {
        description: 'Spiral motion with colored circle element',
        props: { 
          pathType: 'spiral', 
          elementShape: 'circle', 
          elementColor: '#00FF88', 
          elementSize: 50, 
          radius: 150, 
          duration: 240 
        }
      }
    ]
  },

  MorphSVG: {
    name: 'MorphSVG',
    description: 'Advanced SVG shape morphing component using GSAP MorphSVGPlugin with built-in shape presets and custom path support',
    category: 'animation',
    props: [
      { name: 'startShape', type: 'string | object', required: false, description: 'SVG path data, selector, or inline shape definition for starting shape' },
      { name: 'endShape', type: 'string | object', required: false, description: 'Target shape to morph to' },
      { name: 'preset', type: 'string', required: false, default: 'custom', description: 'Built-in shape pairs for easy morphing', options: ['circle-to-star', 'square-to-circle', 'triangle-to-diamond', 'heart-to-arrow', 'star-to-heart', 'custom'] },
      { name: 'duration', type: 'number', required: false, default: 150, description: 'Animation duration in frames' },
      { name: 'animationType', type: 'string', required: false, default: 'linear', description: 'MorphSVG animation type', options: ['linear', 'rotational'] },
      { name: 'shapeIndex', type: 'number | string', required: false, default: 'auto', description: 'Point mapping control between shapes' },
      { name: 'precision', type: 'number', required: false, default: 2, description: 'Decimal precision for smooth morphing' },
      { name: 'ease', type: 'string', required: false, default: 'power2.inOut', description: 'GSAP easing function' },
      { name: 'strokeColor', type: 'string', required: false, default: '#333', description: 'Stroke color of the morphing shape' },
      { name: 'fillColor', type: 'string', required: false, default: 'transparent', description: 'Fill color of the morphing shape' },
      { name: 'strokeWidth', type: 'number', required: false, default: 2, description: 'Stroke width in pixels' },
      { name: 'width', type: 'number', required: false, default: 300, description: 'SVG container width' },
      { name: 'height', type: 'number', required: false, default: 300, description: 'SVG container height' },
      { name: 'viewBox', type: 'string', required: false, description: 'Custom SVG viewBox (auto-calculated if not provided)' },
      { name: 'reverse', type: 'boolean', required: false, default: false, description: 'Play animation in reverse' },
      { name: 'yoyo', type: 'boolean', required: false, default: false, description: 'Yoyo effect (back and forth animation)' },
      { name: 'repeat', type: 'number', required: false, default: 0, description: 'Number of animation repeats (-1 for infinite)' }
    ],
    examples: [
      {
        description: 'Circle morphing to star with red fill',
        props: { 
          preset: 'circle-to-star', 
          duration: 120, 
          fillColor: '#FF6347', 
          strokeColor: '#8B0000' 
        }
      },
      {
        description: 'Custom square to diamond with rotational morph',
        props: { 
          startShape: 'M10,10 L50,10 L50,50 L10,50 Z',
          endShape: 'M30,10 L50,30 L30,50 L10,30 Z',
          animationType: 'rotational',
          strokeColor: '#333',
          duration: 150,
          ease: 'elastic.out(1, 0.3)'
        }
      },
      {
        description: 'Heart to arrow with yoyo effect',
        props: { 
          preset: 'heart-to-arrow', 
          duration: 90, 
          yoyo: true, 
          repeat: 2, 
          fillColor: '#FF69B4', 
          strokeWidth: 3 
        }
      },
      {
        description: 'Triangle to diamond with custom styling',
        props: { 
          preset: 'triangle-to-diamond', 
          duration: 180, 
          animationType: 'linear', 
          strokeColor: '#4169E1', 
          fillColor: 'rgba(65, 105, 225, 0.3)', 
          strokeWidth: 4, 
          width: 400, 
          height: 400 
        }
      },
      {
        description: 'Advanced custom morph with precise control',
        props: { 
          startShape: 'M50,150 C50,100 100,50 150,50 C200,50 250,100 250,150 C250,200 200,250 150,250 C100,250 50,200 50,150 Z',
          endShape: 'M150,50 L200,100 L250,150 L200,200 L150,250 L100,200 L50,150 L100,100 Z',
          duration: 200,
          precision: 3,
          shapeIndex: 0,
          viewBox: '0 0 300 300',
          ease: 'back.inOut(1.7)'
        }
      }
    ]
  },

};

/**
 * Get all available component names
 */
export const getAvailableComponents = (): string[] => {
  return Object.keys(COMPONENT_METADATA);
};

/**
 * Get component metadata by name
 */
export const getComponentMeta = (componentName: string): ComponentMeta | undefined => {
  return COMPONENT_METADATA[componentName];
};

/**
 * Generate documentation for all components (useful for AI training)
 */
export const generateComponentDocs = (): string => {
  return Object.values(COMPONENT_METADATA)
    .map(comp => {
      const propsDoc = comp.props
        .map(prop => `  - ${prop.name} (${prop.type}${prop.required ? ', required' : ', optional'}): ${prop.description}${prop.default !== undefined ? ` [default: ${prop.default}]` : ''}${prop.options ? ` [options: ${prop.options.join(', ')}]` : ''}`)
        .join('\n');
      
      const examplesDoc = comp.examples
        .map((ex, i) => `  Example ${i + 1}: ${ex.description}\n  ${JSON.stringify(ex.props, null, 2)}`)
        .join('\n\n');
      
      return `## ${comp.name}\n${comp.description}\nCategory: ${comp.category}\n\nProps:\n${propsDoc}\n\nExamples:\n${examplesDoc}`;
    })
    .join('\n\n---\n\n');
};

/**
 * 🛡️ PRODUCTION SAFETY GUIDELINES
 * 
 * CRITICAL: All components handling external resources (images, audio, video)
 * MUST follow these safety patterns to prevent rendering crashes:
 * 
 * 1. ✅ Make external resources OPTIONAL: `prop?: string`
 * 2. ✅ Implement URL validation before usage
 * 3. ✅ Provide graceful fallback UI for failures
 * 4. ✅ Add error logging for debugging
 * 5. ✅ Test with invalid/placeholder data
 * 6. ✅ Maintain animations even in fallback states
 * 
 * EXAMPLE SAFE PATTERNS:
 * - ImageWithZoom: ✅ Production-ready with comprehensive error handling
 * - AudioPlayer: ❌ TODO: Apply same safety patterns
 * - VideoPlayer: ❌ TODO: Apply same safety patterns
 * 
 * For detailed implementation guide, see:
 * - IMAGE_HANDLING_AND_ERROR_PREVENTION.md
 * - COMPONENT_DEVELOPMENT_BEST_PRACTICES.md
 * - MISTAKES_AND_FIXES.md (Section #0)
 */

/**
 * Get production safety status of components
 */
export const getComponentSafetyStatus = (): Record<string, 'SAFE' | 'NEEDS_UPDATE' | 'UNKNOWN'> => {
  return {
    TitleCard: 'SAFE',              // No external resources
    ImageWithZoom: 'SAFE',          // ✅ Enhanced with error handling
    GsapTitle: 'SAFE',              // No external resources  
    CountdownTimer: 'SAFE',         // No external resources
    SlideTransition: 'SAFE',        // No external resources
    MotionPath: 'SAFE',             // No external resources
    MorphSVG: 'SAFE',               // No external resources
    MinimalTest: 'SAFE',            // No external resources
    // Add new components here with their safety status
  };
};