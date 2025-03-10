
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
      className="w-40 glass rounded-xl p-3 flex flex-col gap-3 overflow-y-auto"
      style={containerHeight ? { maxHeight: `${containerHeight}px` } : {}}
    >
      {availablePlants.map(plant => (
        <PlantCard
          key={plant.id}
          plant={plant}
          selected={selectedPlant?.id === plant.id}
          canAfford={sunAmount >= plant.cost}
          onClick={() => onSelectPlant(selectedPlant?.id === plant.id ? null : plant)}
        />
      ))}
    </div>
  );
};

export default PlantSelectionPanel;
