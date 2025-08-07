// Component Registry Documentation
// This file maintains metadata about all components for AI training and validation

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: unknown;
  description: string;
  options?: string[]; // For enum-like props
}

export interface ComponentMeta {
  name: string;
  description: string;
  category: 'text' | 'image' | 'animation' | 'transition' | 'utility' | 'audio';
  props: ComponentProp[];
  examples: Array<{
    description: string;
    props: Record<string, unknown>;
  }>;
}

export const COMPONENT_METADATA: Record<string, ComponentMeta> = {
  TitleCard: {
    name: 'TitleCard',
    description: '🎵 Audio-enhanced customizable title card with various animation options and audio sync capabilities',
    category: 'text',
    props: [
      { name: 'text', type: 'string', required: true, description: 'The text to display' },
      { name: 'color', type: 'string', required: false, default: '#FFFFFF', description: 'Text color' },
      { name: 'fontSize', type: 'number', required: false, default: 96, description: 'Font size in pixels' },
      { name: 'animationType', type: 'string', required: false, default: 'fadeIn', description: 'Animation style', options: ['fadeIn', 'slideUp', 'scale'] },
      { name: 'audioSync', type: 'ComponentAudioSync', required: false, description: '🎵 Audio sync configuration: { override?: boolean, enabled?: boolean, type?: "beat"|"bass"|"mids"|"highs"|"overall", reactivity?: 0-2, property?: "scale"|"opacity"|"color"|"all" }. Overrides global audio settings when override: true.' }
    ],
    examples: [
      {
        description: 'Simple title with fade in',
        props: { text: 'Welcome', animationType: 'fadeIn' }
      },
      {
        description: 'Red title with slide up animation',
        props: { text: 'Hello World', color: '#FF0000', animationType: 'slideUp', fontSize: 120 }
      },
      {
        description: '🎵 Audio-reactive title with beat sync',
        props: { 
          text: 'FEEL THE BEAT', 
          color: '#00FFFF', 
          animationType: 'scale',
          audioSync: { override: true, enabled: true, type: 'beat', reactivity: 1.5 }
        }
      }
    ]
  },

  ImageWithZoom: {
    name: 'ImageWithZoom',
    description: '🎵🛡️ PRODUCTION-SAFE audio-enhanced image component with zoom animation, comprehensive error handling, and audio sync capabilities',
    category: 'image',
    props: [
      { name: 'imageUrl', type: 'string', required: false, description: '✅ OPTIONAL: URL of the image to display (supports graceful fallback for invalid/placeholder URLs)' },
      { name: 'zoomIntensity', type: 'number', required: false, default: 0.2, description: 'How much to zoom (0.1 = 10% zoom)' },
      { name: 'direction', type: 'string', required: false, default: 'in', description: 'Zoom direction', options: ['in', 'out'] },
      { name: 'fit', type: 'string', required: false, default: 'cover', description: 'Image fit style', options: ['cover', 'contain', 'fill'] },
      { name: 'fallbackText', type: 'string', required: false, default: 'Image not available', description: '🛡️ SAFETY: Custom text shown when image fails to load' },
      { name: 'fallbackColor', type: 'string', required: false, default: '#333', description: '🛡️ SAFETY: Background color for fallback UI' },
      { name: 'audioSync', type: 'ComponentAudioSync', required: false, description: '🎵 Audio sync configuration: { override?: boolean, enabled?: boolean, type?: "beat"|"bass"|"mids"|"highs"|"overall", reactivity?: 0-2, property?: "scale"|"opacity"|"color"|"all" }. Adds audio-reactive zoom scaling, brightness, and saturation effects.' }
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
      },
      {
        description: '🎵 Audio-reactive image with bass sync',
        props: { 
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
          direction: 'in',
          zoomIntensity: 0.3,
          audioSync: { override: true, enabled: true, type: 'bass', reactivity: 2.0 }
        }
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
    description: '🎵 Audio-enhanced animated countdown timer with customizable range, formatting, and beat-reactive pulse effects',
    category: 'utility',
    props: [
      { name: 'startNumber', type: 'number', required: true, description: 'Starting number for countdown' },
      { name: 'endNumber', type: 'number', required: true, description: 'Ending number for countdown' },
      { name: 'color', type: 'string', required: false, default: '#FFFFFF', description: 'Number color' },
      { name: 'fontSize', type: 'number', required: false, default: 128, description: 'Font size in pixels' },
      { name: 'prefix', type: 'string', required: false, default: '', description: 'Text before the number' },
      { name: 'suffix', type: 'string', required: false, default: '', description: 'Text after the number' },
      { name: 'duration', type: 'number', required: false, default: 150, description: 'Duration in frames for the countdown animation' },
      { name: 'audioSync', type: 'ComponentAudioSync', required: false, description: '🎵 Audio sync configuration: { override?: boolean, enabled?: boolean, type?: "beat"|"bass"|"mids"|"highs"|"overall", reactivity?: 0-2, property?: "scale"|"opacity"|"color"|"all" }. Adds audio-reactive pulse scaling and glow effects on top of existing countdown pulse.' }
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
      },
      {
        description: '🎵 Audio-reactive countdown with beat pulse',
        props: { 
          startNumber: 10, 
          endNumber: 0, 
          suffix: '!', 
          color: '#FF6347',
          audioSync: { override: true, enabled: true, type: 'beat', reactivity: 1.8 }
        }
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

  DrawSVG: {
    name: 'DrawSVG',
    description: '🛡️ PRODUCTION-SAFE progressive SVG drawing component using GSAP DrawSVGPlugin with multiple built-in presets and creative effects',
    category: 'animation',
    props: [
      { name: 'pathData', type: 'string', required: false, description: '✅ OPTIONAL: Custom SVG path data string for complex drawings' },
      { name: 'pathPreset', type: 'string', required: false, default: 'signature', description: 'Built-in path preset for common use cases', options: ['signature', 'logo', 'house', 'tree', 'circuit', 'handwriting', 'blueprint', 'artistic', 'custom'] },
      { name: 'duration', type: 'number', required: false, default: 150, description: 'Animation duration in frames' },
      { name: 'delay', type: 'number', required: false, default: 0, description: 'Delay before animation starts in frames' },
      { name: 'animationType', type: 'string', required: false, default: 'sequential', description: 'How multiple paths are animated', options: ['sequential', 'staggered', 'simultaneous'] },
      { name: 'strokeColor', type: 'string', required: false, default: '#00FF88', description: 'Color of the drawn lines' },
      { name: 'strokeWidth', type: 'number', required: false, default: 3, description: 'Width of the drawn lines' },
      { name: 'strokeLinecap', type: 'string', required: false, default: 'round', description: 'Line cap style', options: ['round', 'square', 'butt'] },
      { name: 'strokeLinejoin', type: 'string', required: false, default: 'round', description: 'Line join style', options: ['round', 'bevel', 'miter'] },
      { name: 'fillColor', type: 'string', required: false, default: 'transparent', description: 'Fill color for closed paths' },
      { name: 'splitMultiSegments', type: 'boolean', required: false, default: true, description: 'Split complex paths for consistent drawing speed' },
      { name: 'reverseDirection', type: 'boolean', required: false, default: false, description: 'Draw paths in reverse (erase effect)' },
      { name: 'showOriginal', type: 'boolean', required: false, default: false, description: 'Briefly show complete path before drawing' },
      { name: 'glowEffect', type: 'boolean', required: false, default: false, description: 'Add glowing effect to drawn lines' },
      { name: 'trailEffect', type: 'boolean', required: false, default: false, description: 'Add animated dash trail effect' },
      { name: 'colorGradient', type: 'object', required: false, description: 'Gradient colors for lines { start: string, end: string }' },
      { name: 'width', type: 'number', required: false, default: 600, description: 'SVG container width in pixels' },
      { name: 'height', type: 'number', required: false, default: 400, description: 'SVG container height in pixels' },
      { name: 'viewBox', type: 'string', required: false, description: 'Custom SVG viewBox (auto-calculated if not provided)' },
      { name: 'ease', type: 'string', required: false, default: 'power2.out', description: 'GSAP easing function for drawing animation' },
      { name: 'staggerDelay', type: 'number', required: false, default: 0.1, description: 'Delay between staggered path animations in seconds' },
      { name: 'backgroundColor', type: 'string', required: false, default: 'transparent', description: 'Background color of the container' }
    ],
    examples: [
      {
        description: 'Elegant signature with glow effect',
        props: { 
          pathPreset: 'signature', 
          duration: 180, 
          glowEffect: true, 
          strokeColor: '#00FF88',
          backgroundColor: '#000011'
        }
      },
      {
        description: 'Architectural house blueprint with staggered animation',
        props: { 
          pathPreset: 'house', 
          duration: 240, 
          animationType: 'staggered', 
          strokeColor: '#00AAFF',
          staggerDelay: 0.3,
          backgroundColor: '#001122'
        }
      },
      {
        description: 'Growing tree with sequential branch drawing',
        props: { 
          pathPreset: 'tree', 
          duration: 200, 
          animationType: 'sequential',
          strokeColor: '#44AA44',
          fillColor: 'rgba(68, 170, 68, 0.1)',
          glowEffect: true
        }
      },
      {
        description: 'Circuit board pattern with trail effects',
        props: { 
          pathPreset: 'circuit', 
          duration: 220, 
          animationType: 'staggered',
          strokeColor: '#00FFFF',
          trailEffect: true,
          staggerDelay: 0.2
        }
      },
      {
        description: 'Custom path with gradient colors and reverse animation',
        props: { 
          pathData: 'M100,200 Q200,50 300,200 Q400,350 500,200',
          duration: 150,
          reverseDirection: true,
          colorGradient: { start: '#FF6347', end: '#FFD700' },
          strokeWidth: 6
        }
      },
      {
        description: '🛡️ SAFE: Error handling with invalid preset (falls back to signature)',
        props: { 
          pathPreset: 'nonexistent-preset',
          duration: 120,
          strokeColor: '#FFA500'
        }
      }
    ]
  },

  HyperspaceText: {
    name: 'HyperspaceText',
    description: '🚀 EPIC hyperspace text effect with 3D movement, starfield, and optional GSAP enhancements',
    category: 'animation',
    props: [
      { name: 'texts', type: 'string[]', required: false, description: 'Array of text lines to display in hyperspace (uses defaults if not provided)' },
      { name: 'customText', type: 'string', required: false, description: 'Single custom text to display instead of multiple lines' },
      { name: 'backgroundColor', type: 'string', required: false, default: '#000000', description: 'Background color of the hyperspace' },
      { name: 'speed', type: 'number', required: false, default: 1, description: 'Speed of the hyperspace movement (higher = faster)' },
      { name: 'textColor', type: 'string', required: false, default: '#ffffff', description: 'Color of the text in hyperspace' },
      { name: 'maxBlur', type: 'number', required: false, default: 10, description: 'Maximum blur amount for distant text' },
      { name: 'fontSize', type: 'number', required: false, default: 48, description: 'Base font size for the text' },
      { name: 'enableGsapEffects', type: 'boolean', required: false, default: true, description: 'Enable GSAP-powered character animations' }
    ],
    examples: [
      {
        description: 'Epic sci-fi intro with custom text',
        props: {
          customText: 'WELCOME TO THE FUTURE',
          speed: 1.5,
          textColor: '#00FFFF',
          backgroundColor: '#000011',
          fontSize: 64
        }
      },
      {
        description: 'Fast-moving hyperspace with multiple texts',
        props: {
          texts: ['LOADING...', 'ACCESSING DATABASE', 'DECRYPTING FILES', 'COMPLETE'],
          speed: 2,
          textColor: '#00FF00',
          maxBlur: 15
        }
      },
      {
        description: 'Slower cinematic effect with GSAP disabled',
        props: {
          customText: 'A long time ago...',
          speed: 0.5,
          textColor: '#FFD700',
          enableGsapEffects: false,
          fontSize: 72
        }
      },
      {
        description: 'Corporate tech presentation style',
        props: {
          texts: ['INNOVATION', 'TRANSFORMATION', 'SUCCESS', 'FUTURE'],
          speed: 1.2,
          textColor: '#0066FF',
          backgroundColor: '#001122',
          fontSize: 56
        }
      },
      {
        description: 'Gaming/esports style with bright colors',
        props: {
          customText: 'GAME ON!',
          speed: 3,
          textColor: '#FF00FF',
          backgroundColor: '#110011',
          maxBlur: 20,
          fontSize: 96
        }
      }
    ]
  },

  GenerativeCanvas: {
    name: 'GenerativeCanvas',
    description: '🎨 Advanced mathematical generative art renderer with HTML5 Canvas and optional GSAP enhancements',
    category: 'animation',
    props: [
      { name: 'backgroundColor', type: 'string', required: false, default: 'black', description: 'Background color of the canvas' },
      { name: 'strokeColor', type: 'string', required: false, default: '#ffffff', description: 'Color of the generated pattern lines' },
      { name: 'strokeOpacity', type: 'number', required: false, default: 0.39, description: 'Opacity of the stroke lines (0-1)' },
      { name: 'strokeWidth', type: 'number', required: false, default: 1, description: 'Width of the stroke lines in pixels' },
      { name: 'animationSpeed', type: 'number', required: false, default: 1, description: 'Speed multiplier for the mathematical animation' },
      { name: 'iterations', type: 'number', required: false, default: 20000, description: 'Number of points to calculate and render' },
      { name: 'enableGsapEffects', type: 'boolean', required: false, default: true, description: 'Enable GSAP-powered canvas effects' },
      { name: 'glowEffect', type: 'boolean', required: false, default: false, description: 'Add glowing effect to the canvas' },
      { name: 'pulseEffect', type: 'boolean', required: false, default: false, description: 'Add breathing/pulse scaling effect' },
      { name: 'colorCycle', type: 'boolean', required: false, default: false, description: 'Cycle through rainbow colors over time' }
    ],
    examples: [
      {
        description: 'Classic monochrome generative art',
        props: {
          backgroundColor: 'black',
          strokeColor: '#ffffff',
          strokeOpacity: 0.4,
          animationSpeed: 1,
          iterations: 20000
        }
      },
      {
        description: 'Colorful animated pattern with glow',
        props: {
          backgroundColor: '#001122',
          strokeColor: '#00FFFF',
          strokeOpacity: 0.6,
          animationSpeed: 1.5,
          glowEffect: true,
          colorCycle: true,
          enableGsapEffects: true
        }
      },
      {
        description: 'Pulsing organic pattern',
        props: {
          backgroundColor: '#110000',
          strokeColor: '#FF6600',
          strokeOpacity: 0.5,
          animationSpeed: 0.8,
          pulseEffect: true,
          glowEffect: true,
          iterations: 30000
        }
      },
      {
        description: 'High-speed mathematical visualization',
        props: {
          backgroundColor: 'black',
          strokeColor: '#00FF00',
          strokeOpacity: 0.3,
          animationSpeed: 3,
          iterations: 40000,
          strokeWidth: 0.5,
          colorCycle: true
        }
      },
      {
        description: 'Minimal artistic approach',
        props: {
          backgroundColor: '#FAFAFA',
          strokeColor: '#333333',
          strokeOpacity: 0.8,
          animationSpeed: 0.5,
          iterations: 15000,
          strokeWidth: 2,
          enableGsapEffects: false
        }
      }
    ]
  },

  LetterFlickering: {
    name: 'LetterFlickering',
    description: '🎪 Letter flickering animation with 3D rotation, smooth scaling, and audio sync - multi-phase text animation',
    category: 'animation',
    props: [
      { name: 'text', type: 'string', required: false, default: 'EXPLORE', description: 'Text to animate with hinge effect' },
      { name: 'targetLetterIndex', type: 'number', required: false, default: 4, description: 'Index of letter to zoom into (0-based)' },
      { name: 'fontSize', type: 'number', required: false, default: 120, description: 'Base font size in pixels' },
      { name: 'fontWeight', type: 'number | string', required: false, default: 800, description: 'Font weight (number or string)' },
      { name: 'color', type: 'string', required: false, default: '#f0f0f0', description: 'Text color' },
      { name: 'backgroundColor', type: 'string', required: false, default: '#1a1a1a', description: 'Background color' },
      { name: 'fontFamily', type: 'string', required: false, default: 'Arial Black, sans-serif', description: 'Font family' },
      { name: 'zoomInDuration', type: 'number', required: false, default: 30, description: 'Initial zoom duration in frames' },
      { name: 'hingeRotationDuration', type: 'number', required: false, default: 30, description: 'Hinge rotation duration in frames' },
      { name: 'fadeOutDuration', type: 'number', required: false, default: 15, description: 'Letter fade out duration in frames' },
      { name: 'finalZoomDuration', type: 'number', required: false, default: 60, description: 'Final zoom into target letter duration in frames' },
      { name: 'initialScale', type: 'number', required: false, default: 1, description: 'Starting scale factor' },
      { name: 'midZoomScale', type: 'number', required: false, default: 4, description: 'Mid-animation scale factor' },
      { name: 'finalZoomScale', type: 'number', required: false, default: 50, description: 'Final zoom scale factor' },
      { name: 'hingeRotationAngle', type: 'number', required: false, default: 90, description: 'Rotation angle in degrees for hinge effect' },
      { name: 'perspective', type: 'number', required: false, default: 800, description: '3D perspective value in pixels' },
      { name: 'transformOrigin', type: 'string', required: false, default: 'center top', description: 'Transform origin for rotation' },
      { name: 'audioSync', type: 'ComponentAudioSync', required: false, description: '🎵 Audio sync configuration: { override?: boolean, enabled?: boolean, type?: "beat"|"bass"|"mids"|"highs"|"overall", reactivity?: 0-2, property?: "scale"|"opacity"|"color"|"all" }. Adds audio-reactive effects to the hinge animation.' }
    ],
    examples: [
      {
        description: 'Classic EXPLORE text with default hinge effect',
        props: {
          text: 'EXPLORE',
          targetLetterIndex: 4,
          fontSize: 120,
          color: '#f0f0f0',
          backgroundColor: '#1a1a1a'
        }
      },
      {
        description: 'Fast action text with custom timing',
        props: {
          text: 'ACTION',
          targetLetterIndex: 2,
          fontSize: 150,
          color: '#FF6347',
          backgroundColor: '#000000',
          zoomInDuration: 20,
          hingeRotationDuration: 20,
          finalZoomDuration: 40,
          finalZoomScale: 80
        }
      },
      {
        description: 'Cinematic text with slow elegant timing',
        props: {
          text: 'CINEMA',
          targetLetterIndex: 0,
          fontSize: 100,
          color: '#FFD700',
          backgroundColor: '#001122',
          zoomInDuration: 45,
          hingeRotationDuration: 45,
          fadeOutDuration: 30,
          finalZoomDuration: 90,
          midZoomScale: 3,
          finalZoomScale: 30
        }
      },
      {
        description: '🎵 Audio-reactive hinge text with beat sync',
        props: {
          text: 'BEAT DROP',
          targetLetterIndex: 5,
          fontSize: 128,
          color: '#00FFFF',
          backgroundColor: '#110022',
          audioSync: {
            override: true,
            enabled: true,
            type: 'beat',
            reactivity: 2.0,
            property: 'all'
          }
        }
      },
      {
        description: 'Gaming style with bright colors and fast animation',
        props: {
          text: 'LEVEL UP',
          targetLetterIndex: 6,
          fontSize: 140,
          fontWeight: 900,
          color: '#00FF00',
          backgroundColor: '#000011',
          zoomInDuration: 15,
          hingeRotationDuration: 25,
          finalZoomScale: 100,
          perspective: 1200
        }
      }
    ]
  },

  GSAPHingeZoom: {
    name: 'GSAPHingeZoom',
    description: '🔥 TRUE GSAP hinge effect with audio-reactive timeline - GSAP animation speed synced with audio beats and intensity',
    category: 'animation',
    props: [
      { name: 'text', type: 'string', required: false, default: 'EXPLORE', description: 'Text to animate with true hinge effect' },
      { name: 'targetLetterIndex', type: 'number', required: false, default: 4, description: 'Index of letter to zoom into after hinge (0-based, 4="O" in EXPLORE)' },
      { name: 'fontSize', type: 'number', required: false, default: 120, description: 'Base font size in pixels' },
      { name: 'fontWeight', type: 'number | string', required: false, default: 800, description: 'Font weight (number or string)' },
      { name: 'color', type: 'string', required: false, default: '#f0f0f0', description: 'Text color' },
      { name: 'backgroundColor', type: 'string', required: false, default: '#1a1a1a', description: 'Background color' },
      { name: 'fontFamily', type: 'string', required: false, default: 'Arial Black, sans-serif', description: 'Font family' },
      { name: 'initialZoomDuration', type: 'number', required: false, default: 30, description: 'Phase 1: Whole word zoom duration in frames' },
      { name: 'hingeRotationDuration', type: 'number', required: false, default: 30, description: 'Phase 2: Hinge rotation duration in frames (parallel to zoom)' },
      { name: 'fadeOutDuration', type: 'number', required: false, default: 15, description: 'Phase 3: Non-target letters fade duration in frames' },
      { name: 'letterZoomDuration', type: 'number', required: false, default: 60, description: 'Phase 4: Target letter massive zoom duration in frames' },
      { name: 'wordZoomScale', type: 'number', required: false, default: 4, description: 'How much whole word zooms (4x like original)' },
      { name: 'letterZoomScale', type: 'number', required: false, default: 50, description: 'How much target letter zooms (50x like original)' },
      { name: 'hingeRotationAngle', type: 'number', required: false, default: 90, description: 'Hinge rotation angle in degrees' },
      { name: 'perspective', type: 'number', required: false, default: 800, description: '3D perspective value in pixels' },
      { name: 'transformOrigin', type: 'string', required: false, default: 'center top', description: 'Transform origin for hinge rotation' },
      { name: 'audioSync', type: 'ComponentAudioSync', required: false, description: '🎵 Audio sync configuration: Adds beat-reactive visual effects (glow, opacity, background)' },
      { name: 'audioTimelineSync', type: 'boolean', required: false, default: false, description: '🔥 NEW: Enable audio-reactive GSAP timeline speed - timeline speed responds to audio intensity and beats' },
      { name: 'maxTimelineSpeed', type: 'number', required: false, default: 2.0, description: 'Maximum timeline speed multiplier when audio-reactive' },
      { name: 'minTimelineSpeed', type: 'number', required: false, default: 0.5, description: 'Minimum timeline speed multiplier when audio-reactive' },
      { name: 'timelineSmoothing', type: 'number', required: false, default: 0.8, description: 'Speed change smoothing factor (0-1, higher = smoother)' },
      { name: 'beatPause', type: 'boolean', required: false, default: false, description: 'Pause timeline momentarily on strong beats for dramatic effect' },
      { name: 'beatResume', type: 'boolean', required: false, default: true, description: 'Resume timeline after beat pause' }
    ],
    examples: [
      {
        description: 'Classic EXPLORE hinge effect - exactly like the reference',
        props: {
          text: 'EXPLORE',
          targetLetterIndex: 4,
          fontSize: 120,
          color: '#f0f0f0',
          backgroundColor: '#1a1a1a'
        }
      },
      {
        description: 'DISCOVER effect targeting letter C',
        props: {
          text: 'DISCOVER',
          targetLetterIndex: 3,
          fontSize: 140,
          color: '#00FFFF',
          backgroundColor: '#000022'
        }
      },
      {
        description: 'Fast ACTION hinge with custom timing',
        props: {
          text: 'ACTION',
          targetLetterIndex: 2,
          fontSize: 150,
          color: '#FF6347',
          backgroundColor: '#000000',
          initialZoomDuration: 20,
          hingeRotationDuration: 20,
          letterZoomDuration: 40
        }
      },
      {
        description: '🎵 Audio-reactive BEAT DROP hinge effect',
        props: {
          text: 'BEAT DROP',
          targetLetterIndex: 5,
          fontSize: 128,
          color: '#00FFFF',
          backgroundColor: '#110022',
          audioSync: {
            override: true,
            enabled: true,
            type: 'beat',
            reactivity: 2.0,
            property: 'all'
          }
        }
      },
      {
        description: 'Cinematic slow CINEMA hinge with elegant timing',
        props: {
          text: 'CINEMA',
          targetLetterIndex: 0,
          fontSize: 100,
          color: '#FFD700',
          backgroundColor: '#001122',
          initialZoomDuration: 45,
          hingeRotationDuration: 45,
          fadeOutDuration: 30,
          letterZoomDuration: 90
        }
      },
      {
        description: '🔥 NEW: Audio-reactive timeline - GSAP speed synced with audio beats',
        props: {
          text: 'SYNC TEST',
          targetLetterIndex: 0,
          fontSize: 150,
          color: '#FF6347',
          backgroundColor: '#000011',
          audioSync: {
            override: true,
            enabled: true,
            type: 'beat',
            reactivity: 1.5,
            property: 'all'
          },
          audioTimelineSync: true,
          maxTimelineSpeed: 2.5,
          minTimelineSpeed: 0.3,
          timelineSmoothing: 0.7
        }
      },
      {
        description: '🎵 Beat pause effect - timeline pauses dramatically on beats',
        props: {
          text: 'BEAT PAUSE',
          targetLetterIndex: 5,
          fontSize: 140,
          color: '#00FFFF',
          backgroundColor: '#110022',
          audioSync: {
            override: true,
            enabled: true,
            type: 'bass',
            reactivity: 2.0
          },
          audioTimelineSync: true,
          maxTimelineSpeed: 1.8,
          minTimelineSpeed: 0.5,
          beatPause: true,
          beatResume: true
        }
      }
    ]
  },

  // Audio Components - Type 1: Background + Type 2: Audio-Synced
  AudioPlayer: {
    name: 'AudioPlayer',
    description: '🎵 Type 1: Background audio player with fade effects and volume control',
    category: 'audio',
    props: [
      { name: 'audioUrl', type: 'string', required: false, description: 'URL of the audio file to play' },
      { name: 'volume', type: 'number', required: false, default: 1, description: 'Audio volume (0-1)' },
      { name: 'startTime', type: 'number', required: false, default: 0, description: 'Start time in seconds' },
      { name: 'fadeIn', type: 'number', required: false, default: 0, description: 'Fade in duration in seconds' },
      { name: 'fadeOut', type: 'number', required: false, default: 0, description: 'Fade out duration in seconds' },
      { name: 'loop', type: 'boolean', required: false, default: false, description: 'Loop the audio' },
    ],
    examples: [
      {
        description: 'Background music with fade effects',
        props: {
          audioUrl: 'https://example.com/background-music.mp3',
          volume: 0.8,
          fadeIn: 2,
          fadeOut: 3,
          loop: true,
        },
      },
      {
        description: 'Narration audio with precise timing',
        props: {
          audioUrl: 'https://example.com/narration.wav',
          volume: 1,
          startTime: 5,
          fadeIn: 1,
          loop: false,
        },
      },
    ],
  },

  BeatReactiveShape: {
    name: 'BeatReactiveShape',
    description: '🎵 Type 2: Shape that reacts to audio beats and frequency analysis',
    category: 'audio',
    props: [
      { name: 'audioUrl', type: 'string', required: false, description: 'URL of the audio file for analysis' },
      { name: 'baseColor', type: 'string', required: false, default: '#333333', description: 'Base color of the shape' },
      { name: 'beatColor', type: 'string', required: false, default: '#FF6347', description: 'Color when beat is detected' },
      { name: 'shape', type: 'string', required: false, default: 'circle', description: 'Shape type', options: ['circle', 'square', 'triangle'] },
      { name: 'size', type: 'number', required: false, default: 100, description: 'Size of the shape in pixels' },
      { name: 'reactivity', type: 'number', required: false, default: 1, description: 'How reactive to audio (0-2)' },
    ],
    examples: [
      {
        description: 'Circle that pulses to the beat',
        props: {
          audioUrl: 'https://example.com/electronic-beat.mp3',
          shape: 'circle',
          beatColor: '#00FFFF',
          reactivity: 1.5,
          size: 150,
        },
      },
      {
        description: 'Square that reacts to bass frequencies',
        props: {
          audioUrl: 'https://example.com/bass-heavy.wav',
          shape: 'square',
          baseColor: '#1a1a1a',
          beatColor: '#FF1493',
          reactivity: 2,
          size: 120,
        },
      },
    ],
  },

  AudioSyncedText: {
    name: 'AudioSyncedText',
    description: '🎵 Type 2: Text that scales and reacts to audio frequency analysis',
    category: 'audio',
    props: [
      { name: 'text', type: 'string', required: true, description: 'Text to display' },
      { name: 'audioUrl', type: 'string', required: false, description: 'URL of the audio file for analysis' },
      { name: 'baseSize', type: 'number', required: false, default: 48, description: 'Base font size in pixels' },
      { name: 'color', type: 'string', required: false, default: '#FFFFFF', description: 'Text color' },
      { name: 'syncType', type: 'string', required: false, default: 'overall', description: 'Audio frequency to sync to', options: ['bass', 'mids', 'highs', 'overall'] },
      { name: 'reactivity', type: 'number', required: false, default: 1, description: 'How reactive to audio (0-2)' },
      { name: 'glowEffect', type: 'boolean', required: false, default: false, description: 'Add glow effect synchronized with audio' },
    ],
    examples: [
      {
        description: 'Title that reacts to bass frequencies',
        props: {
          text: 'FEEL THE BEAT',
          audioUrl: 'https://example.com/music.mp3',
          syncType: 'bass',
          baseSize: 72,
          color: '#FF6347',
          glowEffect: true,
          reactivity: 1.5,
        },
      },
      {
        description: 'Subtitle synced to overall audio levels',
        props: {
          text: 'Audio Visualization',
          audioUrl: 'https://example.com/ambient.wav',
          syncType: 'overall',
          baseSize: 36,
          color: '#00FFFF',
          reactivity: 1,
        },
      },
      {
        description: 'High-frequency reactive text',
        props: {
          text: 'TREBLE BOOST',
          audioUrl: 'https://example.com/electronic.mp3',
          syncType: 'highs',
          baseSize: 48,
          color: '#FFD700',
          glowEffect: true,
          reactivity: 2,
        },
      },
    ],
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
 * 🎵 GLOBAL AUDIO ORCHESTRATION SYSTEM - MAJOR ARCHITECTURE UPDATE
 * 
 * CRITICAL: This rendering engine now supports GLOBAL AUDIO SYNCHRONIZATION
 * across all components. This is a comprehensive audio-visual orchestration system.
 * 
 * 🎯 GLOBAL AUDIO MODES:
 * 1. "all" - Every component syncs with audio (respects excludeComponents)
 * 2. "selective" - Only components listed in syncComponents array sync
 * 3. "none" - No components sync, audio plays as background only
 * 4. "manual" - Components must explicitly opt-in with audioSync prop
 * 
 * 🎛️ MASTER CONTROLS:
 * - enabled: boolean - Global on/off switch for entire video
 * - defaultReactivity: 0-2 - Base reactivity level for all syncing components
 * - masterIntensity: 0-1 - Master volume control for all audio effects
 * - syncComponents: string[] - Whitelist of component names (selective mode)
 * - excludeComponents: string[] - Blacklist of component names (all mode)
 * 
 * 🎵 COMPONENT AUDIO SYNC TYPES:
 * - "beat": Reacts to detected audio beats (percussion, rhythm)
 * - "bass": Syncs to low frequencies (0-4 bands, sub-bass, bass)
 * - "mids": Syncs to mid frequencies (4-16 bands, vocals, melody)
 * - "highs": Syncs to high frequencies (16-32 bands, treble, cymbals)
 * - "overall": Syncs to overall audio levels (full spectrum average)
 * 
 * 🎨 AUDIO-REACTIVE EFFECTS APPLIED:
 * - Scale variations (1.0 to 1.3x based on audio intensity)
 * - Opacity changes (0.7 to 1.0 based on audio activity)
 * - Glow effects on beat detection (text-shadow, box-shadow)
 * - Color brightness/saturation boosts on beats
 * - All effects respect component's original animations
 * 
 * 📋 JSON CONFIGURATION EXAMPLES:
 * 
 * GLOBAL SYNC - All components:
 * {
 *   "audioConfig": {
 *     "audioUrl": "music.mp3",
 *     "globalSync": {
 *       "enabled": true,
 *       "mode": "all",
 *       "defaultReactivity": 1.5,
 *       "masterIntensity": 0.8
 *     }
 *   }
 * }
 * 
 * SELECTIVE SYNC - Choose components:
 * {
 *   "audioConfig": {
 *     "globalSync": {
 *       "enabled": true,
 *       "mode": "selective",
 *       "syncComponents": ["TitleCard", "CountdownTimer"]
 *     }
 *   }
 * }
 * 
 * COMPONENT OVERRIDE - Custom per-component:
 * {
 *   "component": "TitleCard",
 *   "props": {
 *     "audioSync": {
 *       "override": true,
 *       "enabled": true,
 *       "type": "bass",
 *       "reactivity": 2.0
 *     }
 *   }
 * }
 * 
 * 🏗️ ARCHITECTURE:
 * - GlobalAudioProvider: Wraps entire video, provides shared audio analysis
 * - useAudioEnhancedProps: Hook for components to get audio-reactive values
 * - Single audio file analysis shared across ALL components for performance
 * - Backwards compatible: Existing videos work unchanged
 * 
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
 * - AudioPlayer: ✅ Production-ready with error handling
 * - All components: ✅ Audio sync with graceful degradation
 * 
 * For detailed implementation guide, see:
 * - GLOBAL_AUDIO_ORCHESTRATION_SUMMARY.md
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
    DrawSVG: 'SAFE',                // No external resources, built-in presets only
    HyperspaceText: 'SAFE',         // No external resources, pure procedural effects
    GenerativeCanvas: 'SAFE',       // No external resources, pure mathematical canvas art
    MinimalTest: 'SAFE',            // No external resources
    
    // Audio Components - 🎵 PRODUCTION SAFE
    AudioPlayer: 'SAFE',            // ✅ Graceful fallback for invalid audio URLs
    BeatReactiveShape: 'SAFE',      // ✅ Safe fallback when no audio provided
    AudioSyncedText: 'SAFE',        // ✅ Safe fallback when no audio provided
  };
};