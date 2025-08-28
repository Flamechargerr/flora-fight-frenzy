import React from 'react';
import { usePowerups } from '../game/hooks/usePowerups';

interface PowerupPanelProps {
  sunAmount: number;
  setSunAmount: React.Dispatch<React.SetStateAction<number>>;
  setEnemies: React.Dispatch<React.SetStateAction<any[]>>;
  setPlants: React.Dispatch<React.SetStateAction<any[]>>;
  setSunResources: React.Dispatch<React.SetStateAction<any[]>>;
  gameArea: { width: number; height: number };
  soundManager?: any;
  isMobile?: boolean;
}

const PowerupPanel: React.FC<PowerupPanelProps> = ({
  sunAmount,
  setSunAmount,
  setEnemies,
  setPlants,
  setSunResources,
  gameArea,
  soundManager,
  isMobile
}) => {
  const { usePlantFood, useFreeze, useSunBoost, useCherryBomb, useLawnMower } = usePowerups({
    sunAmount,
    setSunAmount,
    setEnemies,
    setPlants,
    setSunResources,
    gameArea,
    soundManager
  });
  
  const handlePlantFood = () => {
    const success = usePlantFood();
    if (!success) {
      // Show insufficient sun notification
      console.log('Not enough sun for Plant Food!');
    }
  };
  
  const handleFreeze = () => {
    const success = useFreeze();
    if (!success) {
      // Show insufficient sun notification
      console.log('Not enough sun for Freeze!');
    }
  };
  
  const handleSunBoost = () => {
    const success = useSunBoost();
    if (!success) {
      // Show insufficient sun notification
      console.log('Not enough sun for Sun Boost!');
    }
  };
  
  // Handlers for new powerups
  const handleCherryBomb = () => {
    const success = useCherryBomb();
    if (!success) {
      // Show insufficient sun notification
      console.log('Not enough sun for Cherry Bomb!');
    }
  };
  
  const handleLawnMower = () => {
    const success = useLawnMower();
    if (!success) {
      // Show insufficient sun notification
      console.log('Not enough sun for Lawn Mower!');
    }
  };
  
  return (
    <div className="powerup-panel flex justify-center items-center gap-4 p-3 bg-amber-100/80 rounded-xl border-4 border-amber-800/50 shadow-lg">
      <button 
        onClick={handlePlantFood}
        disabled={sunAmount < 75}
        className={`powerup-button relative ${sunAmount < 75 ? 'opacity-50' : 'hover:scale-105'} transition-all duration-200`}
        title="Plant Food (75 sun): Boosts all plants for 15 seconds"
      >
        <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center border-2 border-amber-800">
          <div className="flex flex-col items-center">
            <span className="text-2xl">🌱</span>
            <span className="text-xs font-bold text-white">Food</span>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-amber-800 text-sm font-bold">
          75
        </div>
      </button>
      
      <button 
        onClick={handleFreeze}
        disabled={sunAmount < 100}
        className={`powerup-button relative ${sunAmount < 100 ? 'opacity-50' : 'hover:scale-105'} transition-all duration-200`}
        title="Freeze (100 sun): Slows all zombies for 10 seconds"
      >
        <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center border-2 border-amber-800">
          <div className="flex flex-col items-center">
            <span className="text-2xl">❄️</span>
            <span className="text-xs font-bold text-white">Freeze</span>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-amber-800 text-sm font-bold">
          100
        </div>
      </button>
      
      <button 
        onClick={handleSunBoost}
        disabled={sunAmount < 50}
        className={`powerup-button relative ${sunAmount < 50 ? 'opacity-50' : 'hover:scale-105'} transition-all duration-200`}
        title="Sun Boost (50 sun): Gives 200 sun and generates 8 extra sun particles"
      >
        <div className="w-14 h-14 bg-yellow-500 rounded-lg flex items-center justify-center border-2 border-amber-800">
          <div className="flex flex-col items-center">
            <span className="text-2xl">☀️</span>
            <span className="text-xs font-bold text-white">Boost</span>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-amber-800 text-sm font-bold">
          50
        </div>
      </button>
      
      {/* New Powerups */}
      <button 
        onClick={handleCherryBomb}
        disabled={sunAmount < 150}
        className={`powerup-button relative ${sunAmount < 150 ? 'opacity-50' : 'hover:scale-105'} transition-all duration-200`}
        title="Cherry Bomb (150 sun): Deals massive damage to all zombies"
      >
        <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center border-2 border-amber-800">
          <div className="flex flex-col items-center">
            <span className="text-2xl">💣</span>
            <span className="text-xs font-bold text-white">Bomb</span>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-amber-800 text-sm font-bold">
          150
        </div>
      </button>
      
      <button 
        onClick={handleLawnMower}
        disabled={sunAmount < 200}
        className={`powerup-button relative ${sunAmount < 200 ? 'opacity-50' : 'hover:scale-105'} transition-all duration-200`}
        title="Lawn Mower (200 sun): Activates all lawn mowers to clear lanes"
      >
        <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center border-2 border-amber-800">
          <div className="flex flex-col items-center">
            <span className="text-2xl">刈</span>
            <span className="text-xs font-bold text-white">Mower</span>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-amber-800 text-sm font-bold">
          200
        </div>
      </button>
    </div>
  );
};

export default PowerupPanel;