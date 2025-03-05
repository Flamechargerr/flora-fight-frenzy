
import { memo } from 'react';

interface PlantProps {
  plant: {
    id: string;
    type: {
      id: string;
      name: string;
      color: string;
      icon: string;
      damage: number;
    };
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
  const size = Math.min(cellWidth, cellHeight) * 0.8;
  
  // Health percentage for health bar
  const healthPercentage = plant.health && plant.maxHealth 
    ? (plant.health / plant.maxHealth) * 100 
    : 100;
  
  // Different plant visualization based on type
  let plantContent = null;
  
  switch (plant.type.id) {
    case 'sunflower':
      plantContent = (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[70%] h-[70%] rounded-full bg-yellow-400 flex items-center justify-center border-4 border-yellow-500">
            <div className="w-[60%] h-[60%] rounded-full bg-yellow-700 flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full bg-yellow-900"></div>
            </div>
          </div>
          <div className="absolute w-full h-full pointer-events-none">
            <div className="absolute w-[25%] h-[40%] bg-green-700 rounded-full -bottom-[15%] left-[37.5%]"></div>
            <div className="absolute w-[20%] h-[20%] bg-yellow-400 rounded-full top-[10%] right-[10%] transform rotate-45"></div>
            <div className="absolute w-[20%] h-[20%] bg-yellow-400 rounded-full top-[10%] left-[10%] transform -rotate-45"></div>
            <div className="absolute w-[20%] h-[20%] bg-yellow-400 rounded-full bottom-[30%] right-[5%] transform rotate-12"></div>
            <div className="absolute w-[20%] h-[20%] bg-yellow-400 rounded-full bottom-[30%] left-[5%] transform -rotate-12"></div>
          </div>
        </div>
      );
      break;
      
    case 'peashooter':
      plantContent = (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full bg-green-500 flex items-center justify-center border-4 border-green-600 relative overflow-visible">
            <div className="w-[50%] h-[50%] rounded-full bg-green-700"></div>
            
            {/* Shooter mouth */}
            <div className="absolute w-[40%] h-[40%] bg-green-800 rounded-full right-[-10%] flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full bg-black"></div>
            </div>
          </div>
          <div className="absolute w-full h-full pointer-events-none">
            <div className="absolute w-[25%] h-[40%] bg-green-700 rounded-full -bottom-[15%] left-[37.5%]"></div>
            <div className="absolute w-[30%] h-[15%] bg-green-600 rounded-full top-[20%] left-[35%]"></div>
          </div>
        </div>
      );
      break;
      
    case 'iceshooter':
      plantContent = (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full bg-blue-400 flex items-center justify-center border-4 border-blue-500 relative overflow-visible">
            <div className="w-[50%] h-[50%] rounded-full bg-blue-600"></div>
            
            {/* Ice crystals on top */}
            <div className="absolute w-[20%] h-[30%] bg-blue-200 top-[-15%] left-[25%] transform rotate-45"></div>
            <div className="absolute w-[15%] h-[25%] bg-blue-200 top-[-10%] right-[30%] transform -rotate-15"></div>
            
            {/* Shooter mouth */}
            <div className="absolute w-[40%] h-[40%] bg-blue-700 rounded-full right-[-10%] flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full bg-black"></div>
            </div>
          </div>
          <div className="absolute w-full h-full pointer-events-none">
            <div className="absolute w-[25%] h-[40%] bg-green-700 rounded-full -bottom-[15%] left-[37.5%]"></div>
            
            {/* Cold aura */}
            <div className="absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
          </div>
        </div>
      );
      break;
      
    case 'fireshooter':
      plantContent = (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full bg-red-500 flex items-center justify-center border-4 border-red-600 relative overflow-visible">
            <div className="w-[50%] h-[50%] rounded-full bg-red-700"></div>
            
            {/* Fire on top */}
            <div className="absolute w-[30%] h-[40%] bg-yellow-500 top-[-20%] left-[35%] rounded-t-full animate-flame"></div>
            <div className="absolute w-[20%] h-[30%] bg-orange-500 top-[-15%] left-[25%] rounded-t-full animate-flame" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute w-[25%] h-[35%] bg-red-600 top-[-18%] right-[20%] rounded-t-full animate-flame" style={{ animationDelay: '0.4s' }}></div>
            
            {/* Shooter mouth */}
            <div className="absolute w-[40%] h-[40%] bg-red-800 rounded-full right-[-10%] flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full bg-black"></div>
            </div>
          </div>
          <div className="absolute w-full h-full pointer-events-none">
            <div className="absolute w-[25%] h-[40%] bg-green-700 rounded-full -bottom-[15%] left-[37.5%]"></div>
            
            {/* Heat aura */}
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-10 animate-pulse"></div>
          </div>
        </div>
      );
      break;
      
    case 'wallnut':
      plantContent = (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[80%] h-[80%] rounded-full bg-amber-700 flex items-center justify-center border-4 border-amber-800">
            {/* Crack visual cues for damage */}
            {healthPercentage < 75 && (
              <div className="absolute top-[20%] right-[30%] w-[30%] h-[2px] bg-amber-900 transform rotate-45"></div>
            )}
            {healthPercentage < 50 && (
              <div className="absolute top-[40%] left-[20%] w-[40%] h-[3px] bg-amber-900 transform -rotate-25"></div>
            )}
            {healthPercentage < 25 && (
              <div className="absolute bottom-[30%] right-[25%] w-[35%] h-[4px] bg-amber-900 transform rotate-12"></div>
            )}
            
            {/* Face */}
            <div className="w-[60%] h-[60%] rounded-full bg-amber-600 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-[80%] justify-around mb-2">
                <div className="w-[25%] h-[25%] bg-amber-900 rounded-full"></div>
                <div className="w-[25%] h-[25%] bg-amber-900 rounded-full"></div>
              </div>
              
              {/* Mouth - changes with health */}
              {healthPercentage > 50 ? (
                <div className="w-[60%] h-[15%] bg-amber-900 rounded-full mt-2"></div>
              ) : (
                <div className="w-[60%] h-[15%] bg-amber-900 rounded-full mt-2 transform scale-y-50"></div>
              )}
            </div>
          </div>
        </div>
      );
      break;
      
    default:
      plantContent = <div className={`text-4xl ${plant.type.color}`}>{plant.type.icon}</div>;
  }
  
  return (
    <div 
      className="plant"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${left - (size/2)}px`, 
        top: `${top - (size/2)}px`
      }}
    >
      {plantContent}
      
      {/* Health bar for plants with health */}
      {plant.health !== undefined && plant.maxHealth !== undefined && (
        <div className="absolute -bottom-5 left-0 w-full h-2 bg-black/60 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-200 ${
              healthPercentage > 70 ? 'bg-green-500' : 
              healthPercentage > 30 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
});

export default Plant;
