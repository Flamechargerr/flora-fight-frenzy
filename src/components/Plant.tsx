
import { memo } from 'react';
import { PlantType } from './GameBoard';

interface PlantProps {
  plant: {
    id: string;
    type: PlantType;
    row: number;
    col: number;
    lastFired: number;
  };
  gridDimensions: {
    rows: number;
    cols: number;
  };
  gameAreaSize: {
    width: number;
    height: number;
  };
}

const Plant = memo(({ plant, gridDimensions, gameAreaSize }: PlantProps) => {
  const cellWidth = gameAreaSize.width / gridDimensions.cols;
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  
  const left = plant.col * cellWidth + (cellWidth / 2);
  const top = plant.row * cellHeight + (cellHeight / 2);
  const size = Math.min(cellWidth, cellHeight) * 0.7;
  
  return (
    <div 
      className="plant"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${left - (size/2)}px`, 
        top: `${top - (size/2)}px`,
        backgroundColor: plant.type.color,
        zIndex: 5
      }}
    >
      <span className="text-2xl">{plant.type.icon}</span>
    </div>
  );
});

export default Plant;
