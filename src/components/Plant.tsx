
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
  const size = Math.min(cellWidth, cellHeight) * 0.85;
  
  // Show animation for shooting plants
  const isShootingPlant = plant.type.id === 'peashooter' || plant.type.id === 'iceshooter';
  const isShooting = isShootingPlant && Date.now() - plant.lastFired < 500;
  
  return (
    <div 
      className="plant"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${left - (size/2)}px`, 
        top: `${top - (size/2)}px`,
        zIndex: 5
      }}
    >
      {plant.type.id === 'sunflower' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Stem */}
          <div className="absolute w-[10%] h-[40%] bg-green-600 bottom-0 rounded-sm"></div>
          {/* Leaves */}
          <div className="absolute w-[25%] h-[15%] bg-green-500 rounded-full transform rotate-45 left-[25%] bottom-[25%]"></div>
          <div className="absolute w-[25%] h-[15%] bg-green-500 rounded-full transform -rotate-45 right-[25%] bottom-[25%]"></div>
          {/* Flower */}
          <div className="absolute w-[80%] h-[80%] rounded-full bg-yellow-400 top-[5%] flex items-center justify-center">
            <div className="absolute w-[70%] h-[70%] bg-yellow-600 rounded-full flex items-center justify-center">
              <div className="w-[50%] h-[50%] bg-yellow-800 rounded-full"></div>
            </div>
            {/* Petals */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-[30%] h-[30%] bg-yellow-300 rounded-full"
                style={{ 
                  transform: `rotate(${i * 45}deg) translateY(-130%)`,
                }}
              ></div>
            ))}
          </div>
          {/* Face */}
          <div className="absolute w-[15%] h-[8%] bg-black rounded-full top-[35%] left-[30%]"></div>
          <div className="absolute w-[15%] h-[8%] bg-black rounded-full top-[35%] right-[30%]"></div>
          <div className="absolute w-[30%] h-[10%] bg-black rounded-full top-[50%] transform scale-y-50 scale-x-75"></div>
        </div>
      )}
      
      {plant.type.id === 'peashooter' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Stem and pot */}
          <div className="absolute w-[15%] h-[40%] bg-green-600 bottom-[10%] rounded-sm"></div>
          <div className="absolute w-[50%] h-[15%] bg-amber-800 bottom-0 rounded-md"></div>
          {/* Head */}
          <div className="absolute w-[75%] h-[65%] bg-green-500 rounded-full top-[5%] flex items-center justify-center">
            {/* Face */}
            <div className="absolute w-[15%] h-[15%] bg-black rounded-full top-[30%] left-[25%]"></div>
            <div className="absolute w-[15%] h-[15%] bg-black rounded-full top-[30%] right-[25%]"></div>
            <div className="absolute w-[25%] h-[10%] bg-black rounded-full top-[50%] transform scale-y-50"></div>
          </div>
          {/* Shooter */}
          <div className="absolute w-[40%] h-[30%] bg-green-600 rounded-full top-[20%] right-[-10%] flex items-center justify-center">
            <div className="absolute w-[50%] h-[50%] rounded-full bg-green-700 right-[10%]"></div>
          </div>
          {/* Projectile animation when firing */}
          {isShooting && (
            <div className="absolute w-[20%] h-[20%] bg-green-400 rounded-full right-[-50%] top-[25%] animate-pulse">
              <div className="absolute inset-0 bg-green-500 rounded-full transform scale-75"></div>
            </div>
          )}
        </div>
      )}
      
      {plant.type.id === 'wallnut' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Nut body */}
          <div className="absolute w-[85%] h-[85%] bg-amber-600 rounded-full flex items-center justify-center">
            <div className="absolute w-[85%] h-[85%] bg-amber-500 rounded-full"></div>
            {/* Face */}
            <div className="absolute w-[15%] h-[10%] bg-black rounded-full top-[35%] left-[25%]"></div>
            <div className="absolute w-[15%] h-[10%] bg-black rounded-full top-[35%] right-[25%]"></div>
            <div className="absolute w-[40%] h-[15%] border-t-4 border-black top-[55%] rounded-t-full transform scale-y-50"></div>
          </div>
        </div>
      )}
      
      {plant.type.id === 'iceshooter' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Stem and pot */}
          <div className="absolute w-[15%] h-[40%] bg-blue-700 bottom-[10%] rounded-sm"></div>
          <div className="absolute w-[50%] h-[15%] bg-blue-900 bottom-0 rounded-md"></div>
          {/* Head */}
          <div className="absolute w-[75%] h-[65%] bg-blue-400 rounded-full top-[5%] flex items-center justify-center">
            {/* Ice crystals */}
            <div className="absolute w-[20%] h-[30%] bg-blue-200 -top-[5%] transform rotate-45"></div>
            <div className="absolute w-[20%] h-[30%] bg-blue-200 -top-[15%] left-[40%] transform -rotate-15"></div>
            <div className="absolute w-[20%] h-[30%] bg-blue-200 -top-[5%] right-[10%] transform rotate-60"></div>
            {/* Face */}
            <div className="absolute w-[15%] h-[15%] bg-black rounded-full top-[30%] left-[25%]"></div>
            <div className="absolute w-[15%] h-[15%] bg-black rounded-full top-[30%] right-[25%]"></div>
            <div className="absolute w-[25%] h-[10%] bg-black rounded-full top-[50%] transform scale-y-50"></div>
          </div>
          {/* Shooter */}
          <div className="absolute w-[40%] h-[30%] bg-blue-500 rounded-full top-[20%] right-[-10%] flex items-center justify-center">
            <div className="absolute w-[50%] h-[50%] rounded-full bg-blue-600 right-[10%]"></div>
          </div>
          {/* Projectile animation when firing */}
          {isShooting && (
            <div className="absolute w-[20%] h-[20%] bg-blue-300 rounded-full right-[-50%] top-[25%] animate-pulse">
              <div className="absolute inset-0 bg-blue-400 rounded-full transform scale-75"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Plant;
