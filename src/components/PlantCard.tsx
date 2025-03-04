import React from 'react';
import { PlantType } from '../hooks/useGameState';
import { Sun } from 'lucide-react';

interface PlantCardProps {
  plant: PlantType;
  selected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, selected, canAfford, onClick }) => {
  return (
    <div 
      className={`plant-card p-2 flex flex-col items-center ${selected ? 'ring-2 ring-offset-2 ring-white' : ''} ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={canAfford ? onClick : undefined}
    >
      <div className="w-full h-full flex flex-col items-center relative">
        <div className={`w-full h-full absolute inset-0 bg-gradient-to-b from-garden-dark/80 to-garden-dark rounded-lg ${selected ? 'border-2 border-yellow-400' : 'border border-gray-800'}`}></div>
        
        <div className={`relative w-14 h-14 rounded-full ${plant.color} flex items-center justify-center mb-1 overflow-hidden border-2 border-gray-800 shadow-md`}>
          <div className="absolute inset-0 bg-opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTEiPjwvcmVjdD4KPC9zdmc+')]"></div>
          <span className="text-2xl relative z-10">{plant.icon}</span>
        </div>
        
        <h3 className="text-sm font-bold text-white mb-1 mt-1 relative z-10">{plant.name}</h3>
        
        <div className="flex items-center bg-black/60 rounded-full px-3 py-1 relative z-10 border border-gray-700">
          <Sun className="text-yellow-400 w-4 h-4 mr-1" />
          <span className="text-xs font-bold text-yellow-100">{plant.cost}</span>
        </div>
        
        {!canAfford && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
            <Sun className="text-yellow-400 w-6 h-6 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;
