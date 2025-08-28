
import React, { useState, useEffect, memo, useMemo } from 'react';
import SunSVG from '../assets/sun/Sun.svg?react';

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
  const sunStyle = useMemo(() => {
    const size = isMobile ? 60 : 48; // Larger on mobile for easier tapping
    const offset = size / 2;
    
    return {
      left: x - offset,
      top: y - offset,
      width: size,
      height: size,
      zIndex: 20,
      transition: 'top 0.3s, left 0.3s, transform 0.2s',
    };
  }, [x, y, isMobile]);
  
  // Performance: Memoize class names
  const classNames = useMemo(() => {
    const baseClasses = [
      'sun-resource',
      'absolute',
      'cursor-pointer',
      'select-none',
      'transform',
      'transition-all',
      'duration-200',
      'hover:scale-110',
      'active:scale-90',
      'animate-float'
    ];
    
    if (isMobile) {
      baseClasses.push('touch-manipulation'); // Optimize for touch
    }
    
    if (animate) {
      baseClasses.push('animate-bounceIn');
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
      <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
    </div>
  );
});

SunResource.displayName = 'SunResource';

export default SunResource;
