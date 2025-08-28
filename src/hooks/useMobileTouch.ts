import { useEffect, useRef, useCallback } from 'react';

interface TouchPosition {
  x: number;
  y: number;
  identifier: number;
}

interface UseMobileTouchProps {
  onTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onDrag?: (startX: number, startY: number, endX: number, endY: number) => void;
  onPinch?: (scale: number) => void;
  disabled?: boolean;
}

export const useMobileTouch = ({
  onTap,
  onLongPress,
  onDrag,
  onPinch,
  disabled = false
}: UseMobileTouchProps) => {
  const touchStartRef = useRef<TouchPosition | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const initialDistanceRef = useRef<number | null>(null);
  
  const LONG_PRESS_DURATION = 500; // milliseconds
  const DRAG_THRESHOLD = 10; // pixels
  
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (disabled) return;
    
    // Prevent default to avoid scrolling/zooming
    event.preventDefault();
    
    const touch = event.touches[0];
    if (!touch) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    touchStartRef.current = {
      x,
      y,
      identifier: touch.identifier
    };
    
    isDraggingRef.current = false;
    
    // Handle pinch gesture
    if (event.touches.length === 2 && onPinch) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      initialDistanceRef.current = distance;
      return;
    }
    
    // Set up long press detection
    if (onLongPress) {
      longPressTimeoutRef.current = setTimeout(() => {
        if (touchStartRef.current && !isDraggingRef.current) {
          onLongPress(touchStartRef.current.x, touchStartRef.current.y);
        }
      }, LONG_PRESS_DURATION);
    }
  }, [disabled, onLongPress, onPinch]);
  
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    
    const touch = event.touches[0];
    if (!touch || !touchStartRef.current) return;
    
    // Handle pinch gesture
    if (event.touches.length === 2 && onPinch && initialDistanceRef.current) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      const scale = currentDistance / initialDistanceRef.current;
      onPinch(scale);
      return;
    }
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    const deltaX = Math.abs(currentX - touchStartRef.current.x);
    const deltaY = Math.abs(currentY - touchStartRef.current.y);
    
    // Check if we've moved enough to consider this a drag
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
      
      // Clear long press timeout since we're dragging
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }
  }, [disabled, onPinch]);
  
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    
    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    if (!touchStartRef.current) return;
    
    const touch = Array.from(event.changedTouches).find(
      t => t.identifier === touchStartRef.current?.identifier
    );
    
    if (!touch) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const endX = touch.clientX - rect.left;
    const endY = touch.clientY - rect.top;
    
    if (isDraggingRef.current && onDrag) {
      // Handle drag end
      onDrag(touchStartRef.current.x, touchStartRef.current.y, endX, endY);
    } else if (onTap && !isDraggingRef.current) {
      // Handle tap
      onTap(touchStartRef.current.x, touchStartRef.current.y);
    }
    
    // Reset state
    touchStartRef.current = null;
    isDraggingRef.current = false;
    initialDistanceRef.current = null;
  }, [disabled, onTap, onDrag]);
  
  const attachTouchHandlers = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return {
    attachTouchHandlers,
    isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
};