import { memo } from 'react';
import { PlantType } from '../hooks/useGameState';

interface PlantProps {
  plant: {
    id: string;
    type: PlantType;
    row: number;
    col: number;
    lastFired: number;
    health?: number;
    maxHealth?: number;
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
  const isShootingPlant = plant.type.id === 'peashooter' || plant.type.id === 'iceshooter' || plant.type.id === 'fireshooter';
  const isShooting = isShootingPlant && Date.now() - plant.lastFired < 500;
  
  // Calculate plant health percentage if being eaten
  const healthPercentage = plant.health && plant.maxHealth 
    ? (plant.health / plant.maxHealth) * 100 
    : 100;
  
  return (
    <div 
      className="plant"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${left - (size/2)}px`, 
        top: `${top - (size/2)}px`,
        zIndex: 5,
        opacity: healthPercentage < 100 ? Math.max(0.6, healthPercentage / 100) : 1
      }}
    >
      {plant.type.id === 'sunflower' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Stem */}
          <div className="absolute w-[10%] h-[40%] bg-green-600 bottom-0 rounded-sm">
            <div className="absolute w-[160%] h-[30%] bg-green-500 rounded-full left-[-30%] bottom-[50%] rotate-45"></div>
            <div className="absolute w-[160%] h-[30%] bg-green-500 rounded-full left-[-30%] bottom-[30%] -rotate-45"></div>
          </div>
          {/* Flower */}
          <div className="absolute w-[80%] h-[80%] rounded-full bg-yellow-400 top-[5%] flex items-center justify-center animate-pulse">
            <div className="absolute w-[70%] h-[70%] bg-yellow-600 rounded-full flex items-center justify-center">
              <div className="w-[50%] h-[50%] bg-yellow-800 rounded-full"></div>
            </div>
            {/* Animated Petals */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-[30%] h-[30%] bg-yellow-300 rounded-full animate-pulse"
                style={{ 
                  transform: `rotate(${i * 45}deg) translateY(-130%)`,
                  animationDelay: `${i * 0.1}s`,
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
          <div className="absolute w-[15%] h-[40%] bg-green-600 bottom-[10%] rounded-sm">
            <div className="absolute w-[180%] h-[15%] bg-green-500 rounded-full left-[-40%] bottom-[70%] rotate-[-20deg]"></div>
            <div className="absolute w-[180%] h-[15%] bg-green-500 rounded-full left-[-40%] bottom-[50%] rotate-[20deg]"></div>
          </div>
          <div className="absolute w-[50%] h-[15%] bg-amber-800 bottom-0 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-60"></div>
          </div>
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
            <div className="absolute w-[60%] h-[5%] right-0 top-[35%] flex items-center">
              <div className="w-full h-full bg-gradient-to-r from-green-500 to-transparent rounded-full"></div>
            </div>
          )}
        </div>
      )}
      
      {plant.type.id === 'wallnut' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Nut body with texture */}
          <div className="absolute w-[85%] h-[85%] bg-amber-600 rounded-full flex items-center justify-center overflow-hidden">
            <div className="absolute w-[85%] h-[85%] bg-amber-500 rounded-full"></div>
            {/* Texture */}
            <div className="absolute w-full h-full opacity-30">
              <div className="absolute w-[40%] h-[40%] bg-amber-700 rounded-full top-[10%] left-[10%]"></div>
              <div className="absolute w-[30%] h-[30%] bg-amber-700 rounded-full bottom-[20%] right-[15%]"></div>
              <div className="absolute w-[20%] h-[20%] bg-amber-700 rounded-full top-[50%] right-[30%]"></div>
            </div>
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
          <div className="absolute w-[50%] h-[15%] bg-blue-900 bottom-0 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 opacity-50"></div>
          </div>
          {/* Head */}
          <div className="absolute w-[75%] h-[65%] bg-blue-400 rounded-full top-[5%] flex items-center justify-center overflow-hidden">
            {/* Ice effect */}
            <div className="absolute w-full h-full bg-gradient-to-br from-blue-300 to-blue-500"></div>
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
            <div className="absolute w-[60%] h-[5%] right-0 top-[35%] flex items-center">
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
            </div>
          )}
        </div>
      )}
      
      {plant.type.id === 'fireshooter' && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Stem and pot */}
          <div className="absolute w-[15%] h-[40%] bg-red-800 bottom-[10%] rounded-sm"></div>
          <div className="absolute w-[50%] h-[15%] bg-red-900 bottom-0 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-t from-red-950 to-transparent opacity-60"></div>
          </div>
          {/* Head */}
          <div className="absolute w-[75%] h-[65%] bg-red-500 rounded-full top-[5%] flex items-center justify-center overflow-hidden">
            {/* Fire effect */}
            <div className="absolute w-full h-full bg-gradient-to-br from-red-400 to-red-600"></div>
            {/* Flames */}
            <div className="absolute w-[20%] h-[40%] bg-yellow-500 -top-[10%] left-[40%] animate-pulse"></div>
            <div className="absolute w-[15%] h-[30%] bg-orange-500 -top-[5%] left-[25%] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute w-[15%] h-[30%] bg-orange-500 -top-[5%] right-[25%] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            {/* Face */}
            <div className="absolute w-[15%] h-[15%] bg-black rounded-full top-[30%] left-[25%]"></div>
            <div className="absolute w-[15%] h-[15%] bg-black rounded-full top-[30%] right-[25%]"></div>
            <div className="absolute w-[25%] h-[10%] bg-black rounded-full top-[50%] transform scale-y-50"></div>
          </div>
          {/* Shooter */}
          <div className="absolute w-[40%] h-[30%] bg-red-600 rounded-full top-[20%] right-[-10%] flex items-center justify-center">
            <div className="absolute w-[50%] h-[50%] rounded-full bg-red-700 right-[10%]"></div>
          </div>
          {/* Projectile animation when firing */}
          {isShooting && (
            <div className="absolute w-[60%] h-[5%] right-0 top-[35%] flex items-center">
              <div className="w-full h-full bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
            </div>
          )}
        </div>
      )}
      
      {/* Plant health bar - Only show when damaged */}
      {healthPercentage < 100 && (
        <div className="absolute -top-5 left-0 w-full h-2 bg-black/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-200"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
});

export default Plant;
