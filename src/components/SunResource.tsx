
import React, { useState, useEffect, memo, useMemo, CSSProperties } from 'react';
// Use the new Sun SVG component
import SunSVG from '../assets/sun/Sun.svg.tsx';

interface SunResourceProps {
  id: string;
  x: number;
  y: number;
  onCollect: (id: string) => void;
  isMobile?: boolean;
}

const SunResource: React.FC<SunResourceProps> = memo(({ id, x, y, onCollect, isMobile = false }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Performance: Memoize click handler
  const handleClick = useMemo(() => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      setAnimate(false);
      // Quick feedback on mobile
      if (isMobile && navigator.vibrate) {
        navigator.vibrate(50); // Short haptic feedback
      }
      setTimeout(() => {
        onCollect(id);
      }, isMobile ? 150 : 300); // Faster on mobile
    };
  }, [id, onCollect, isMobile]);
  
  // Performance: Memoize style calculations
  const sunStyle = useMemo<CSSProperties>(() => {
    const size = isMobile ? 60 : 48; // Larger on mobile for easier tapping
    const offset = size / 2;
    
    return {
      position: 'absolute' as const,
      left: `${x - offset}px`,
      top: `${y - offset}px`,
      width: `${size}px`,
      height: `${size}px`,
      zIndex: 20,
      transition: 'top 0.3s, left 0.3s, transform 0.2s',
      pointerEvents: 'auto' as const
    };
  }, [x, y, isMobile]);
  
  // Performance: Memoize class names
  const classNames = useMemo(() => {
    const baseClasses = [
      'pvz-sun',
      'cursor-pointer',
      'select-none',
      'transform',
      'transition-all',
      'duration-200',
      animate ? 'animate-bounceIn' : ''
    ].filter(Boolean);
    
    if (isMobile) {
      baseClasses.push('touch-manipulation'); // Optimize for touch
    }
    
    return baseClasses.join(' ');
  }, [animate, isMobile]);

  return (
    <div
      className={classNames}
      style={sunStyle}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Collect 25 sun points"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      <SunSVG style={{ width: '100%', height: '100%' }} />
      
      {/* Mobile touch indicator */}
      {isMobile && (
        <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-pulse opacity-50" />
      )}
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse" 
        style={{
          animation: 'pulse 2s infinite ease-in-out',
          boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.3)'
        }}
      />
    </div>
  );
});

SunResource.displayName = 'SunResource';

export default SunResource;
