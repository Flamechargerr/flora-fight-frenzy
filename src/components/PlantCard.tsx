
import { PlantType } from './GameBoard';
import { Sun } from 'lucide-react';

interface PlantCardProps {
  plant: PlantType;
  selected: boolean;
  canAfford: boolean;
  onClick: () => void;
}

const PlantCard = ({ plant, selected, canAfford, onClick }: PlantCardProps) => {
  return (
    <div 
      className={`plant-card p-3 flex flex-col items-center ${selected ? 'ring-2 ring-offset-2 ring-white' : ''} ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={canAfford ? onClick : undefined}
    >
      <div className={`w-12 h-12 rounded-full ${plant.color} flex items-center justify-center mb-1`}>
        <span className="text-2xl">{plant.icon}</span>
      </div>
      
      <h3 className="text-sm font-medium text-white mb-1">{plant.name}</h3>
      
      <div className="flex items-center bg-garden-dark/30 rounded-full px-2 py-0.5">
        <Sun className="text-sun w-3 h-3 mr-1" />
        <span className="text-xs text-white">{plant.cost}</span>
      </div>
    </div>
  );
};

export default PlantCard;
