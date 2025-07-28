import React, { useCallback } from 'react';
import { useSyncedGsap } from '../hooks/useSyncedGsap';
import { gsap } from 'gsap';

export interface GsapTitleProps {
  text: string;
  color?: string;
  fontSize?: number;
  animationType?: 'slideUp' | 'stagger' | 'bounce';
}

export const GsapTitle: React.FC<GsapTitleProps> = ({ 
  text, 
  color = 'white',
  fontSize = 96,
  animationType = 'slideUp'
}) => {
  const createTimeline = useCallback((element: HTMLDivElement) => {
    const timeline = gsap.timeline({ paused: true });
    
    const h1 = element.querySelector('h1');
    if (!h1) return timeline;

    // Split text into characters for stagger animation
    if (animationType === 'stagger') {
      const chars = text.split('').map((char) => 
        `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      h1.innerHTML = chars;
      timeline.from(h1.querySelectorAll('span'), {
        opacity: 0,
        y: 50,
        duration: 0.1,
        stagger: 0.05,
      });
    } else if (animationType === 'bounce') {
      timeline.from(h1, {
        opacity: 0,
        scale: 0.3,
        duration: 1,
        ease: "bounce.out"
      });
    } else {
      // Default slide up
      timeline.from(h1, {
        opacity: 0,
        y: 100,
        duration: 1,
      });
    }
    
    return timeline;
  }, [text, animationType]);

  const ref = useSyncedGsap(createTimeline);

  return (
    <div 
      ref={ref} 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        height: '100%' 
      }}
    >
      <h1 style={{ 
        fontSize: `${fontSize}px`, 
        textAlign: 'center', 
        color,
        margin: 0,
        fontWeight: 'bold',
      }}>
        {text}
      </h1>
    </div>
  );
};