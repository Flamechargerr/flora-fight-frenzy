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
      role=\"button\"\n      tabIndex={canAfford ? 0 : -1}\n      aria-label={`${plant.name} - Cost: ${plant.cost} sun ${canAfford ? '' : '(not affordable)'}`}\n      onKeyDown={(e) => {\n        if ((e.key === 'Enter' || e.key === ' ') && canAfford) {\n          e.preventDefault();\n          handleClick();\n        }\n      }}\n    >\n      {/* Plant Icon */}\n      <div className=\"text-center mb-2\">\n        <div className={`text-3xl ${isMobile ? 'text-4xl' : ''}`}>{plant.icon}</div>\n      </div>\n      \n      {/* Plant Info */}\n      <div className=\"text-center\">\n        <div className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'} text-gray-800 mb-1`}>\n          {plant.name}\n        </div>\n        <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600 mb-1`}>\n          \u2600\ufe0f {plant.cost}\n        </div>\n        {plant.damage > 0 && (\n          <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-red-600`}>\n            \u2694\ufe0f {plant.damage}\n          </div>\n        )}\n      </div>\n      \n      {/* Selection Indicator */}\n      {isSelected && (\n        <div className=\"absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center\">\n          <span className=\"text-white text-xs font-bold\">\u2713</span>\n        </div>\n      )}\n      \n      {/* Cooldown Indicator (if needed) */}\n      {!canAfford && (\n        <div className=\"absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg\">\n          <span className=\"text-red-600 font-bold text-xs\">Need {plant.cost - sunAmount} more</span>\n        </div>\n      )}\n    </div>\n  );\n});\n\nPlantCard.displayName = 'PlantCard';\n\nconst MobilePlantSelectionPanel: React.FC<MobilePlantSelectionPanelProps> = memo(({\n  plantTypes,\n  selectedPlant,\n  onSelectPlant,\n  sunAmount,\n  containerHeight,\n  isMobile = false\n}) => {\n  const [isExpanded, setIsExpanded] = useState(false);\n  const scrollContainerRef = useRef<HTMLDivElement>(null);\n  \n  // Mobile swipe handling for plant selection\n  const { attachTouchHandlers } = useMobileTouch({\n    onDrag: (startX, startY, endX, endY) => {\n      const deltaX = endX - startX;\n      if (Math.abs(deltaX) > 50 && scrollContainerRef.current) {\n        // Horizontal swipe - scroll plant selection\n        const scrollAmount = deltaX > 0 ? -100 : 100;\n        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });\n      }\n    }\n  });\n  \n  // Attach swipe handlers to scroll container\n  useEffect(() => {\n    if (scrollContainerRef.current && isMobile) {\n      return attachTouchHandlers(scrollContainerRef.current);\n    }\n  }, [attachTouchHandlers, isMobile]);\n  \n  // Performance: Memoize plant cards\n  const plantCards = useMemo(() => \n    plantTypes.map(plant => {\n      const canAfford = sunAmount >= plant.cost;\n      const isSelected = selectedPlant?.id === plant.id;\n      \n      return (\n        <PlantCard\n          key={plant.id}\n          plant={plant}\n          isSelected={isSelected}\n          canAfford={canAfford}\n          onSelect={() => {\n            if (isSelected) {\n              onSelectPlant(null); // Deselect if already selected\n            } else {\n              onSelectPlant(plant);\n            }\n          }}\n          isMobile={isMobile}\n        />\n      );\n    }), [plantTypes, sunAmount, selectedPlant, onSelectPlant, isMobile]);\n  \n  // Performance: Memoize container classes\n  const containerClasses = useMemo(() => {\n    const baseClasses = [\n      'glass',\n      'rounded-xl',\n      'shadow-lg',\n      'border',\n      'border-gray-200/50',\n      'backdrop-blur-sm'\n    ];\n    \n    if (isMobile) {\n      if (isExpanded) {\n        baseClasses.push('fixed', 'bottom-0', 'left-0', 'right-0', 'z-50', 'rounded-b-none', 'max-h-[60vh]');\n      } else {\n        baseClasses.push('fixed', 'bottom-4', 'left-4', 'right-4', 'z-40');\n      }\n    } else {\n      baseClasses.push('w-full', 'md:w-64', 'flex-shrink-0');\n    }\n    \n    return baseClasses.join(' ');\n  }, [isMobile, isExpanded]);\n  \n  // Mobile layout\n  if (isMobile) {\n    return (\n      <div className={containerClasses}>\n        {/* Header */}\n        <div \n          className=\"p-4 border-b border-gray-200/50 flex items-center justify-between cursor-pointer\"\n          onClick={() => setIsExpanded(!isExpanded)}\n        >\n          <div className=\"flex items-center gap-3\">\n            <span className=\"text-2xl\">🌱</span>\n            <div>\n              <h3 className=\"font-bold text-gray-800\">Plant Arsenal</h3>\n              <p className=\"text-sm text-gray-600\">\u2600\ufe0f {sunAmount} sun</p>\n            </div>\n          </div>\n          <div className=\"text-gray-400\">\n            {isExpanded ? '⬇️' : '⬆️'}\n          </div>\n        </div>\n        \n        {/* Selected Plant Preview */}\n        {!isExpanded && selectedPlant && (\n          <div className=\"p-3 flex items-center gap-3\">\n            <div className=\"text-2xl\">{selectedPlant.icon}</div>\n            <div className=\"flex-1\">\n              <div className=\"font-semibold text-sm\">{selectedPlant.name}</div>\n              <div className=\"text-xs text-gray-600\">Cost: {selectedPlant.cost} sun</div>\n            </div>\n            <button\n              onClick={(e) => {\n                e.stopPropagation();\n                onSelectPlant(null);\n              }}\n              className=\"text-red-500 hover:text-red-700 p-1\"\n              aria-label=\"Deselect plant\"\n            >\n              ✕\n            </button>\n          </div>\n        )}\n        \n        {/* Expanded Plant Grid */}\n        {isExpanded && (\n          <div className=\"p-4\">\n            {/* Swipe Hint */}\n            <div className=\"text-xs text-gray-500 text-center mb-3\">\n              Swipe left/right to browse • Tap to select\n            </div>\n            \n            <div \n              ref={scrollContainerRef}\n              className=\"flex gap-3 overflow-x-auto pb-2 scrollbar-hide\"\n              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}\n            >\n              {plantCards}\n            </div>\n            \n            {/* Close Button */}\n            <div className=\"mt-4 text-center\">\n              <button\n                onClick={() => setIsExpanded(false)}\n                className=\"bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors\"\n              >\n                Close\n              </button>\n            </div>\n          </div>\n        )}\n      </div>\n    );\n  }\n  \n  // Desktop layout\n  return (\n    <div className={containerClasses} style={{ maxHeight: `${containerHeight}px` }}>\n      <div className=\"p-4 border-b border-gray-200/50\">\n        <div className=\"flex items-center gap-2 mb-3\">\n          <span className=\"text-2xl\">🌱</span>\n          <h3 className=\"font-bold text-gray-800\">Plant Arsenal</h3>\n        </div>\n        <div className=\"flex items-center gap-2 text-sm\">\n          <span>\u2600\ufe0f</span>\n          <span className=\"font-semibold text-yellow-600\">{sunAmount}</span>\n          <span className=\"text-gray-600\">sun</span>\n        </div>\n      </div>\n      \n      <div className=\"flex-1 overflow-y-auto p-4\">\n        <div className=\"grid gap-3\">\n          {plantCards}\n        </div>\n      </div>\n      \n      {selectedPlant && (\n        <div className=\"p-4 border-t border-gray-200/50 bg-green-50\">\n          <div className=\"text-sm\">\n            <div className=\"font-semibold text-green-800 mb-1\">Selected: {selectedPlant.name}</div>\n            <div className=\"text-gray-600 mb-2\">{selectedPlant.description || 'Click on the grid to place this plant.'}</div>\n            <button\n              onClick={() => onSelectPlant(null)}\n              className=\"text-red-600 hover:text-red-800 text-sm font-semibold\"\n            >\n              Cancel Selection\n            </button>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n});\n\nMobilePlantSelectionPanel.displayName = 'MobilePlantSelectionPanel';\n\nexport default MobilePlantSelectionPanel;