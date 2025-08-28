
import React from 'react';
import { PlantType } from '../game/types';
import { Sun } from 'lucide-react';
import PeashooterSVG from '../assets/plants/Peashooter.svg.tsx';
import SunflowerSVG from '../assets/plants/Sunflower.svg.tsx';

interface PlantCardProps {
  plant: PlantType;
  selected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, selected, canAfford, onClick }) => {
  return (
    <div 
      className={`pvz-seed-packet relative ${selected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''} cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95`}
      onClick={canAfford ? onClick : undefined}
    >
      {/* Seed packet background with PvZ styling */}
      <div className="w-full h-full bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-md border-2 border-yellow-500 shadow-md relative overflow-hidden">
        {/* Seed packet top flap */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-yellow-200 to-yellow-400 border-b border-yellow-500"></div>
        
        {/* Plant image/icon area */}
        <div className="relative w-full h-[70%] mt-3 overflow-hidden flex items-center justify-center">
          {plant.id === 'peashooter' ? (
            <PeashooterSVG style={{ width: '80%', height: '80%' }} />
          ) : plant.id === 'sunflower' ? (
            <SunflowerSVG style={{ width: '80%', height: '80%' }} />
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
                  span.className = 'text-2xl';
                  container.appendChild(span);
                }
              }}
            />
          ) : (
            <span className="text-2xl">{plant.icon}</span>
          )}
        </div>
        
        {/* Sun cost indicator with classic PvZ styling */}
        <div className="absolute top-1 right-1 bg-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-yellow-600 shadow">
          <span className="text-xs font-bold text-yellow-300">{plant.cost}</span>
        </div>
        
        {/* Plant name with classic PvZ font styling */}
        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-b from-green-700 to-green-900 flex items-center justify-center border-t-2 border-green-600">
          <h3 className="pvz-text text-[10px] font-bold text-yellow-200 uppercase tracking-wide truncate px-1">{plant.name}</h3>
        </div>
        
        {/* Disabled overlay with more authentic styling */}
        {!canAfford && (
          <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
            <div className="bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded-full border border-red-800">
              NEED SUN
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;
