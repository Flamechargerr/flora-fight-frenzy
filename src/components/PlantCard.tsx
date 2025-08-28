
import React from 'react';
import { PlantType } from '../game/types';
import { Sun } from 'lucide-react';
import PeashooterSVG from '../assets/plants/Peashooter.svg?react';
import SunflowerSVG from '../assets/plants/Sunflower.svg?react';

interface PlantCardProps {
  plant: PlantType;
  selected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, selected, canAfford, onClick }) => {
  return (
    <div 
      className={`plant-card border border-gray-800 ${selected ? 'ring-2 ring-yellow-400' : ''} ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 transition-transform'}`}
      onClick={canAfford ? onClick : undefined}
    >
      <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded">
        {/* Plant image/icon area */}
        <div className="relative w-full h-[75%] overflow-hidden bg-gradient-to-b from-green-200 to-green-400 rounded-t flex items-center justify-center border-b-4 border-green-700 shadow-inner">
          {plant.id === 'peashooter' ? (
            <PeashooterSVG style={{ width: '70%', height: '70%' }} />
          ) : plant.id === 'sunflower' ? (
            <SunflowerSVG style={{ width: '70%', height: '70%' }} />
          ) : plant.image ? (
            <img 
              src={plant.image} 
              alt={plant.name} 
              className="w-full h-full object-contain" 
              onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  const span = document.createElement('span');
                  span.textContent = plant.icon;
                  span.className = 'text-3xl';
                  container.appendChild(span);
                }
              }}
            />
          ) : (
            <span className="text-3xl">{plant.icon}</span>
          )}
        </div>
        
        {/* Sun cost indicator */}
        <div className="absolute top-0 right-0 bg-black/80 rounded-bl-md py-1 px-2 flex items-center gap-1 border-l border-b border-gray-700">
          <span className="text-sm font-bold text-yellow-400">{plant.cost}</span>
        </div>
        
        {/* Name at bottom */}
        <div className="w-full h-[25%] flex items-center justify-center bg-gray-900 rounded-b border-t border-gray-700">
          <h3 className="text-xs font-bold text-gray-200 truncate px-1">{plant.name}</h3>
        </div>
        
        {/* Disabled overlay */}
        {!canAfford && (
          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
            <Sun className="text-yellow-400 w-6 h-6 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;
