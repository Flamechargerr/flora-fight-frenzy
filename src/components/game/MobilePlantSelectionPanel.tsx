import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import { PlantType } from '../../game/types';
import { useMobileTouch } from '../../hooks/useMobileTouch';

interface MobilePlantSelectionPanelProps {
  plantTypes: PlantType[];
  selectedPlant: PlantType | null;
  onSelectPlant: (plant: PlantType | null) => void;
  sunAmount: number;
  containerHeight: number;
  isMobile?: boolean;
}

// Performance: Memoized plant card component
const PlantCard = memo<{
  plant: PlantType;
  isSelected: boolean;
  canAfford: boolean;
  onSelect: () => void;
  isMobile: boolean;
}>(({ plant, isSelected, canAfford, onSelect, isMobile }) => {
  const cardClasses = useMemo(() => {
    const baseClasses = [
      'plant-card',
      'relative',
      'p-3',
      'rounded-lg',
      'border-2',
      'transition-all',
      'duration-300',
      'cursor-pointer',
      'select-none'
    ];
    
    if (isMobile) {
      baseClasses.push('min-h-[80px]', 'touch-manipulation');
    } else {
      baseClasses.push('min-h-[70px]');
    }
    
    if (isSelected) {
      baseClasses.push('border-green-500', 'bg-green-100', 'shadow-lg', 'scale-105');
    } else if (canAfford) {
      baseClasses.push('border-gray-300', 'bg-white', 'hover:border-green-400', 'hover:shadow-md', 'hover:scale-102', 'active:scale-95');
    } else {
      baseClasses.push('border-gray-200', 'bg-gray-100', 'opacity-50', 'cursor-not-allowed');
    }
    
    return baseClasses.join(' ');
  }, [isSelected, canAfford, isMobile]);

  const handleClick = () => {
    if (canAfford) {
      // Haptic feedback on mobile
      if (isMobile && navigator.vibrate) {
        navigator.vibrate(30);
      }
      onSelect();
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role="button"
      tabIndex={canAfford ? 0 : -1}
      aria-label={`${plant.name} - Cost: ${plant.cost} sun ${canAfford ? '' : '(not affordable)'}`}
    >
      {/* Plant Icon */}
      <div className="text-center mb-2">
        <div className={`text-3xl ${isMobile ? 'text-4xl' : ''}`}>{plant.icon}</div>
      </div>
      
      {/* Plant Info */}
      <div className="text-center">
        <div className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'} text-gray-800 mb-1`}>
          {plant.name}
        </div>
        <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600 mb-1`}>
          ☀️ {plant.cost}
        </div>
        {plant.damage > 0 && (
          <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-red-600`}>
            ⚔️ {plant.damage}
          </div>
        )}
      </div>
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
      
      {/* Cooldown Indicator (if needed) */}
      {!canAfford && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <span className="text-red-600 font-bold text-xs">Need {plant.cost - sunAmount} more</span>
        </div>
      )}
    </div>
  );
});

PlantCard.displayName = 'PlantCard';

const MobilePlantSelectionPanel: React.FC<MobilePlantSelectionPanelProps> = memo(({
  plantTypes,
  selectedPlant,
  onSelectPlant,
  sunAmount,
  containerHeight,
  isMobile = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Mobile swipe handling for plant selection
  const { attachTouchHandlers } = useMobileTouch({
    onDrag: (startX, startY, endX, endY) => {
      const deltaX = endX - startX;
      if (Math.abs(deltaX) > 50 && scrollContainerRef.current) {
        // Horizontal swipe - scroll plant selection
        const scrollAmount = deltaX > 0 ? -100 : 100;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  });
  
  // Attach swipe handlers to scroll container
  useEffect(() => {
    if (scrollContainerRef.current && isMobile) {
      return attachTouchHandlers(scrollContainerRef.current);
    }
  }, [attachTouchHandlers, isMobile]);
  
  // Performance: Memoize plant cards
  const plantCards = useMemo(() => 
    plantTypes.map(plant => {
      const canAfford = sunAmount >= plant.cost;
      const isSelected = selectedPlant?.id === plant.id;
      
      return (
        <PlantCard
          key={plant.id}
          plant={plant}
          isSelected={isSelected}
          canAfford={canAfford}
          onSelect={() => {
            if (isSelected) {
              onSelectPlant(null); // Deselect if already selected
            } else {
              onSelectPlant(plant);
            }
          }}
          isMobile={isMobile}
        />
      );
    }), [plantTypes, sunAmount, selectedPlant, onSelectPlant, isMobile]);
  
  // Performance: Memoize container classes
  const containerClasses = useMemo(() => {
    const baseClasses = [
      'glass',
      'rounded-xl',
      'shadow-lg',
      'border',
      'border-gray-200/50',
      'backdrop-blur-sm'
    ];
    
    if (isMobile) {
      if (isExpanded) {
        baseClasses.push('fixed', 'bottom-0', 'left-0', 'right-0', 'z-50', 'rounded-b-none', 'max-h-[60vh]');
      } else {
        baseClasses.push('fixed', 'bottom-4', 'left-4', 'right-4', 'z-40');
      }
    } else {
      baseClasses.push('w-full', 'md:w-64', 'flex-shrink-0');
    }
    
    return baseClasses.join(' ');
  }, [isMobile, isExpanded]);
  
  // Mobile layout
  if (isMobile) {
    return (
      <div className={containerClasses}>
        {/* Header */}
        <div 
          className="p-4 border-b border-gray-200/50 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="font-bold text-gray-800">Plant Arsenal</h3>
              <p className="text-sm text-gray-600">☀️ {sunAmount} sun</p>
            </div>
          </div>
          <div className="text-gray-400">
            {isExpanded ? '⬇️' : '⬆️'}
          </div>
        </div>
        
        {/* Selected Plant Preview */}
        {!isExpanded && selectedPlant && (
          <div className="p-3 flex items-center gap-3">
            <div className="text-2xl">{selectedPlant.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{selectedPlant.name}</div>
              <div className="text-xs text-gray-600">Cost: {selectedPlant.cost} sun</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlant(null);
              }}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="Deselect plant"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Expanded Plant Grid */}
        {isExpanded && (
          <div className="p-4">
            {/* Swipe Hint */}
            <div className="text-xs text-gray-500 text-center mb-3">
              Swipe left/right to browse • Tap to select
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {plantCards}
            </div>
            
            {/* Close Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className={containerClasses} style={{ maxHeight: `${containerHeight}px` }}>
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🌱</span>
          <h3 className="font-bold text-gray-800">Plant Arsenal</h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>☀️</span>
          <span className="font-semibold text-yellow-600">{sunAmount}</span>
          <span className="text-gray-600">sun</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          {plantCards}
        </div>
      </div>
      
      {selectedPlant && (
        <div className="p-4 border-t border-gray-200/50 bg-green-50">
          <div className="text-sm">
            <div className="font-semibold text-green-800 mb-1">Selected: {selectedPlant.name}</div>
            <div className="text-gray-600 mb-2">{selectedPlant.description || 'Click on the grid to place this plant.'}</div>
            <button
              onClick={() => onSelectPlant(null)}
              className="text-red-600 hover:text-red-800 text-sm font-semibold"
            >
              Cancel Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

MobilePlantSelectionPanel.displayName = 'MobilePlantSelectionPanel';

export default MobilePlantSelectionPanel;