
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
  const [isAnimating, setIsAnimating] = useState(false);
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
    if (plant.lastFired > 0 && 
       (plant.type.id === 'peashooter' || 
        plant.type.id === 'iceshooter' || 
        plant.type.id === 'fireshooter' ||
        plant.type.id === 'repeatershooter' ||
        plant.type.id === 'threepeater')) {
      setIsRecoil(true);
      const timer = setTimeout(() => {
        setIsRecoil(false);
      }, 200);
      return () => clearTimeout(timer);
    }
    
    // Special animation for cherry bomb
    if (plant.type.id === 'cherrybomb' && plant.lastFired > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
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

    case 'cherrybomb':
      plantContent = (
        <div className={`w-full h-full flex items-center justify-center ${isAnimating ? 'animate-pulse' : ''}`}>
          <div className="w-[80%] h-[80%] flex items-center justify-center relative">
            {/* Cherry bombs are two cherries connected */}
            <div className="absolute left-[25%] top-[30%] w-[50%] h-[50%] bg-red-600 rounded-full 
              shadow-md border border-red-800"></div>
            <div className="absolute right-[25%] top-[30%] w-[50%] h-[50%] bg-red-600 rounded-full 
              shadow-md border border-red-800"></div>
            
            {/* Stems */}
            <div className="absolute left-[40%] top-[10%] w-[6%] h-[25%] bg-green-800 
              transform rotate-[-15deg]"></div>
            <div className="absolute right-[40%] top-[10%] w-[6%] h-[25%] bg-green-800 
              transform rotate-[15deg]"></div>
            
            {/* Leaves where stems meet */}
            <div className="absolute top-[5%] left-[45%] w-[15%] h-[10%] bg-green-700 rounded-full"></div>
            
            {/* Explosion animation if activated */}
            {isAnimating && (
              <>
                <div className="absolute inset-[-50%] bg-orange-500 rounded-full opacity-60 animate-ping"></div>
                <div className="absolute inset-[-30%] bg-red-500 rounded-full opacity-40 animate-ping" 
                  style={{ animationDelay: '0.1s' }}></div>
              </>
            )}
          </div>
        </div>
      );
      break;

    case 'repeatershooter':
      plantContent = (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isRecoil ? 'recoil' : ''}`}>
          {/* Main head similar to peashooter but with two shooters */}
          <div className="w-[80%] h-[80%] rounded-full bg-green-600 flex items-center justify-center relative">
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
            
            {/* Double shooters */}
            <div className="absolute w-[25%] h-[25%] bg-green-800 rounded-full right-[0%]"></div>
            <div className="absolute w-[25%] h-[25%] bg-green-800 rounded-full right-[20%]"></div>
          </div>
          
          {/* Stem */}
          <div className="absolute w-[15%] h-[30%] bg-green-700 -bottom-[10%]"></div>
          <div className="absolute w-[25%] h-[8%] bg-amber-800 -bottom-[15%]"></div>
        </div>
      );
      break;

    case 'threepeater':
      plantContent = (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isRecoil ? 'recoil' : ''}`}>
          {/* Three heads in a row */}
          <div className="relative w-full h-full">
            {/* Center head */}
            <div className="absolute inset-[15%] rounded-full bg-green-700 flex items-center justify-center">
              {/* Center face */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex w-[60%] justify-between mt-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="w-4 h-1 bg-black rounded-full mt-2"></div>
              </div>
              
              {/* Shooter */}
              <div className="absolute w-[25%] h-[25%] bg-green-800 rounded-full right-[-5%]"></div>
            </div>
            
            {/* Top head (smaller) */}
            <div className="absolute top-0 left-[25%] w-[50%] h-[40%] rounded-full bg-green-700 flex items-center justify-center">
              {/* Top face */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex w-[60%] justify-between">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                <div className="w-3 h-0.5 bg-black rounded-full mt-1"></div>
              </div>
              
              {/* Shooter */}
              <div className="absolute w-[25%] h-[25%] bg-green-800 rounded-full right-[-5%]"></div>
            </div>
            
            {/* Bottom head (smaller) */}
            <div className="absolute bottom-0 left-[25%] w-[50%] h-[40%] rounded-full bg-green-700 flex items-center justify-center">
              {/* Bottom face */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex w-[60%] justify-between">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                <div className="w-3 h-0.5 bg-black rounded-full mt-1"></div>
              </div>
              
              {/* Shooter */}
              <div className="absolute w-[25%] h-[25%] bg-green-800 rounded-full right-[-5%]"></div>
            </div>
          </div>
        </div>
      );
      break;

    case 'spikeweed':
      plantContent = (
        <div className="w-full h-full flex items-center justify-center">
          {/* Spikeweed is flat with spikes */}
          <div className="w-[100%] h-[40%] relative">
            {/* Base */}
            <div className="absolute inset-0 bg-lime-700 rounded-sm"></div>
            
            {/* Spikes - arranged in a pattern */}
            <div className="absolute top-[-30%] left-[10%] w-[5%] h-[60%] bg-lime-500 transform rotate-[-10deg]"></div>
            <div className="absolute top-[-40%] left-[25%] w-[5%] h-[70%] bg-lime-500 transform rotate-[5deg]"></div>
            <div className="absolute top-[-50%] left-[40%] w-[5%] h-[80%] bg-lime-500 transform rotate-[-5deg]"></div>
            <div className="absolute top-[-45%] left-[55%] w-[5%] h-[75%] bg-lime-500 transform rotate-[10deg]"></div>
            <div className="absolute top-[-35%] left-[70%] w-[5%] h-[65%] bg-lime-500 transform rotate-[-8deg]"></div>
            <div className="absolute top-[-25%] left-[85%] w-[5%] h-[55%] bg-lime-500 transform rotate-[12deg]"></div>
          </div>
        </div>
      );
      break;

    case 'torchwood':
      plantContent = (
        <div className="w-full h-full flex items-center justify-center">
          {/* Torchwood is a tree trunk with fire */}
          <div className="w-[60%] h-[80%] bg-amber-800 rounded-md relative flex flex-col items-center">
            {/* Tree texture */}
            <div className="absolute left-[20%] top-[10%] w-[60%] h-[15%] bg-amber-900 rounded-sm"></div>
            <div className="absolute left-[30%] top-[40%] w-[40%] h-[10%] bg-amber-900 rounded-sm"></div>
            <div className="absolute left-[15%] top-[70%] w-[70%] h-[15%] bg-amber-900 rounded-sm"></div>
            
            {/* Face */}
            <div className="absolute top-[20%] w-full flex justify-center">
              <div className="w-[15%] h-[15%] bg-black rounded-full mx-2"></div>
              <div className="w-[15%] h-[15%] bg-black rounded-full mx-2"></div>
            </div>
            
            {/* Fire on top */}
            <div className="absolute -top-[30%] left-[15%] w-[70%] h-[40%]">
              <div className="absolute bottom-0 left-0 w-full h-full">
                <div className="absolute bottom-0 left-[10%] w-[20%] h-[80%] bg-orange-600 rounded-t-full animate-flame"></div>
                <div className="absolute bottom-0 left-[35%] w-[30%] h-[100%] bg-orange-500 rounded-t-full animate-flame" 
                  style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute bottom-0 left-[65%] w-[25%] h-[70%] bg-orange-600 rounded-t-full animate-flame" 
                  style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute bottom-0 left-[25%] w-[50%] h-[60%] bg-yellow-500 rounded-t-full animate-flame" 
                  style={{ animationDelay: '0.15s' }}></div>
              </div>
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
