
import { memo, useState, useEffect } from 'react';

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
  const [isRecoil, setIsRecoil] = useState(false);
  const cellWidth = gameAreaSize.width / gridDimensions.cols;
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  const left = plant.col * cellWidth + (cellWidth / 2);
  const top = plant.row * cellHeight + (cellHeight / 2);
  const size = Math.min(cellWidth, cellHeight) * 0.8;
  
  // Health percentage for health bar
  const healthPercentage = plant.health && plant.maxHealth 
    ? (plant.health / plant.maxHealth) * 100 
    : 100;
  
  // Monitor plant.lastFired to trigger recoil animation
  useEffect(() => {
    if (plant.lastFired > 0 && (plant.type.id === 'peashooter' || plant.type.id === 'iceshooter' || plant.type.id === 'fireshooter')) {
      setIsRecoil(true);
      const timer = setTimeout(() => {
        setIsRecoil(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [plant.lastFired, plant.type.id]);
  
  // Different plant visualization based on type
  let plantContent = null;
  
  switch (plant.type.id) {
    case 'sunflower':
      plantContent = (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Main sunflower head - simplified as in the image */}
          <div className="w-[80%] h-[80%] rounded-full bg-yellow-300 flex items-center justify-center border-2 border-yellow-400 relative">
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-[60%] justify-between mt-2">
                <div className="w-3 h-1 bg-black rounded-full"></div>
                <div className="w-3 h-1 bg-black rounded-full"></div>
              </div>
              
              {/* Mouth */}
              <div className="w-6 h-1 bg-black rounded-full mt-3"></div>
            </div>
          </div>
          
          {/* Stem */}
          <div className="absolute w-[15%] h-[30%] bg-green-700 -bottom-[10%]"></div>
        </div>
      );
      break;
      
    case 'peashooter':
      plantContent = (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isRecoil ? 'recoil' : ''}`}>
          {/* Main head - simplified as in the image */}
          <div className="w-[80%] h-[80%] rounded-full bg-green-500 flex items-center justify-center relative">
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-[60%] justify-between mt-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              
              {/* Mouth */}
              <div className="w-6 h-1 bg-black rounded-full mt-3"></div>
            </div>
            
            {/* Shooter - dark spot on the right side */}
            <div className="absolute w-[30%] h-[30%] bg-green-800 rounded-full right-[-5%]"></div>
          </div>
          
          {/* Stem */}
          <div className="absolute w-[15%] h-[30%] bg-green-700 -bottom-[10%]"></div>
          <div className="absolute w-[25%] h-[8%] bg-brown-500 -bottom-[15%] bg-amber-800"></div>
        </div>
      );
      break;
      
    case 'iceshooter':
      plantContent = (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isRecoil ? 'recoil' : ''}`}>
          {/* Main head - with ice blue color */}
          <div className="w-[80%] h-[80%] rounded-full bg-blue-300 flex items-center justify-center relative">
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-[60%] justify-between mt-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              
              {/* Mouth */}
              <div className="w-6 h-1 bg-black rounded-full mt-3"></div>
            </div>
            
            {/* Shooter - dark spot on the right side */}
            <div className="absolute w-[30%] h-[30%] bg-blue-500 rounded-full right-[-5%]"></div>
          </div>
          
          {/* Stem */}
          <div className="absolute w-[15%] h-[30%] bg-green-700 -bottom-[10%]"></div>
          <div className="absolute w-[25%] h-[8%] bg-brown-500 -bottom-[15%] bg-amber-800"></div>
        </div>
      );
      break;
      
    case 'fireshooter':
      plantContent = (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isRecoil ? 'recoil' : ''}`}>
          {/* Main head - with fire red color */}
          <div className="w-[80%] h-[80%] rounded-full bg-red-400 flex items-center justify-center relative">
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-[60%] justify-between mt-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              
              {/* Mouth */}
              <div className="w-6 h-1 bg-black rounded-full mt-3"></div>
            </div>
            
            {/* Shooter - dark spot on the right side */}
            <div className="absolute w-[30%] h-[30%] bg-red-600 rounded-full right-[-5%]"></div>
          </div>
          
          {/* Stem */}
          <div className="absolute w-[15%] h-[30%] bg-green-700 -bottom-[10%]"></div>
          <div className="absolute w-[25%] h-[8%] bg-brown-500 -bottom-[15%] bg-amber-800"></div>
        </div>
      );
      break;
      
    case 'wallnut':
      plantContent = (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[80%] h-[80%] rounded-full bg-amber-300 flex items-center justify-center relative">
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-[60%] justify-between mt-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              
              {/* Mouth - changes with health */}
              {healthPercentage > 50 ? (
                <div className="w-6 h-1 bg-black rounded-full mt-3"></div>
              ) : (
                <div className="w-6 h-1 bg-black rounded-full mt-3 transform scale-y-50"></div>
              )}
            </div>
            
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
