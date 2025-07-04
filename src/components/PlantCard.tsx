
import React from 'react';
import { PlantType } from '../game/types';
import { Sun, Lock } from 'lucide-react';

interface PlantCardProps {
  plant: PlantType;
  selected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, selected, canAfford, onClick }) => {
  const cardClasses = [
    'plant-card mobile-touch-target',
    selected ? 'plant-card-selected' : '',
    !canAfford ? 'plant-card-disabled' : 'plant-card-affordable'
  ].join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={canAfford ? onClick : undefined}
      role="button"
      tabIndex={canAfford ? 0 : -1}
      aria-label={`${plant.name} - ${plant.cost} sun${!canAfford ? ' (not affordable)' : ''}${selected ? ' (selected)' : ''}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canAfford) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-card to-card/80 rounded-lg relative overflow-hidden">
        {/* Plant image/icon area */}
        <div className="relative w-full h-[70%] overflow-hidden bg-gradient-to-br from-muted to-muted/80 rounded-t-lg flex items-center justify-center">
          {plant.image ? (
            <img 
              src={plant.image} 
              alt={plant.name} 
              className="w-full h-full object-contain p-1" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  const span = document.createElement('span');
                  span.textContent = plant.icon;
                  span.className = 'text-2xl sm:text-3xl';
                  container.appendChild(span);
                }
              }}
            />
          ) : (
            <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{plant.icon}</span>
          )}
        </div>
        
        {/* Sun cost indicator */}
        <div className="absolute top-1 right-1 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-md py-1 px-2 flex items-center gap-1 shadow-lg border border-yellow-300">
          <Sun className="w-3 h-3 text-yellow-900" />
          <span className="text-xs font-bold text-yellow-900">{plant.cost}</span>
        </div>
        
        {/* Name at bottom */}
        <div className="w-full h-[30%] flex items-center justify-center bg-gradient-to-b from-card-foreground/5 to-card-foreground/10 rounded-b-lg border-t border-border">
          <h3 className="text-[10px] sm:text-xs font-semibold text-foreground truncate px-2 text-center leading-tight">
            {plant.name}
          </h3>
        </div>
        
        {/* Disabled overlay */}
        {!canAfford && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-1">
              <Lock className="text-muted-foreground w-4 h-4" />
              <div className="flex items-center gap-1 bg-black/40 rounded-md px-2 py-1">
                <Sun className="text-yellow-400 w-3 h-3" />
                <span className="text-xs text-white font-medium">{plant.cost}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Selection indicator */}
        {selected && (
          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-md font-bold">
              ✓
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;
