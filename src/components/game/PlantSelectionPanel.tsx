
import React from 'react';
import PlantCard from '../PlantCard';
import { PlantType } from '../../game/types';
import { Leaf, Sun } from 'lucide-react';

interface PlantSelectionPanelProps {
  plantTypes: PlantType[];
  selectedPlant: PlantType | null;
  sunAmount: number;
  onSelectPlant: (plant: PlantType | null) => void;
  containerHeight?: number;
}

const PlantSelectionPanel: React.FC<PlantSelectionPanelProps> = ({
  plantTypes,
  selectedPlant,
  sunAmount,
  onSelectPlant,
  containerHeight,
}) => {
  // Only allow selecting the first 7 plants
  const availablePlants = plantTypes.slice(0, 7);

  return (
    <div className="w-full md:w-auto">
      {/* Mobile horizontal layout */}
      <div className="md:hidden">
        <div className="glass-dark rounded-xl p-3 mb-4">
          {/* Header with sun counter */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Plant Arsenal</span>
            </div>
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full shadow-lg">
              <Sun className="w-4 h-4" />
              <span className="font-bold text-sm">{sunAmount}</span>
            </div>
          </div>
          
          {/* Horizontal plant grid */}
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {availablePlants.map(plant => (
              <div key={plant.id} className="aspect-[3/4]">
                <PlantCard
                  plant={plant}
                  selected={selectedPlant?.id === plant.id}
                  canAfford={sunAmount >= plant.cost}
                  onClick={() => onSelectPlant(selectedPlant?.id === plant.id ? null : plant)}
                />
              </div>
            ))}
          </div>
          
          {/* Selected plant info */}
          {selectedPlant && (
            <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedPlant.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedPlant.name}</p>
                  <p className="text-xs text-muted-foreground">Tap on grid to place</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop vertical layout */}
      <div className="hidden md:block">
        <div 
          className="glass-dark w-[140px] rounded-xl flex flex-col gap-2 overflow-y-auto p-3"
          style={containerHeight ? { maxHeight: `${containerHeight}px` } : {}}
        >
          {/* Header */}
          <div className="w-full text-center bg-primary/20 rounded-lg py-2 mb-2 border border-primary/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Leaf className="w-3 h-3 text-primary" />
              <span className="text-xs text-foreground font-bold">PLANTS</span>
            </div>
            <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-1 rounded-md mx-2">
              <Sun className="w-3 h-3" />
              <span className="font-bold text-xs">{sunAmount}</span>
            </div>
          </div>
          
          {/* Vertical plant list */}
          {availablePlants.map(plant => (
            <div key={plant.id} className="aspect-[3/4]">
              <PlantCard
                plant={plant}
                selected={selectedPlant?.id === plant.id}
                canAfford={sunAmount >= plant.cost}
                onClick={() => onSelectPlant(selectedPlant?.id === plant.id ? null : plant)}
              />
            </div>
          ))}
          
          {/* Selected plant info */}
          {selectedPlant && (
            <div className="mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-center">
                <span className="text-lg block mb-1">{selectedPlant.icon}</span>
                <p className="text-xs font-semibold text-foreground">{selectedPlant.name}</p>
                <p className="text-[10px] text-muted-foreground">Click to place</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantSelectionPanel;
