
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
      className="pvz-seed-packet w-[120px] rounded-xl flex flex-col gap-2 overflow-y-auto bg-gradient-to-b from-green-800 to-green-900 border-4 border-yellow-800 p-2 shadow-lg"
      style={containerHeight ? { maxHeight: `${containerHeight}px` } : {}}
    >
      <div className="w-full text-center bg-gradient-to-b from-yellow-600 to-yellow-700 rounded py-1 mb-1 border-2 border-yellow-900 shadow-inner">
        <span className="pvz-title text-sm text-yellow-100 font-bold tracking-wider">PLANTS</span>
      </div>
      
      {availablePlants.map(plant => (
        <div key={plant.id} className="h-[70px] mb-1">
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
