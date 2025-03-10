
import React from 'react';
import PlantCard from '../PlantCard';
import { PlantType } from '../../game/types';

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
    <div 
      className="w-[120px] rounded-xl flex flex-col gap-2 overflow-y-auto bg-gray-900/90 border border-gray-800 p-2"
      style={containerHeight ? { maxHeight: `${containerHeight}px` } : {}}
    >
      <div className="w-full text-center bg-gray-800 rounded py-1 mb-1 border-b border-gray-700">
        <span className="text-xs text-gray-300 font-bold">PLANTS</span>
      </div>
      
      {availablePlants.map(plant => (
        <div key={plant.id} className="h-[60px]">
          <PlantCard
            plant={plant}
            selected={selectedPlant?.id === plant.id}
            canAfford={sunAmount >= plant.cost}
            onClick={() => onSelectPlant(selectedPlant?.id === plant.id ? null : plant)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlantSelectionPanel;
