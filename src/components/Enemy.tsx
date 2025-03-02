
import { memo } from 'react';

interface EnemyProps {
  enemy: {
    id: string;
    health: number;
    speed: number;
    row: number;
    position: number;
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

const Enemy = memo(({ enemy, gridDimensions, gameAreaSize }: EnemyProps) => {
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  const top = enemy.row * cellHeight + (cellHeight / 2);
  const size = cellHeight * 0.8;
  
  // Health percentage for health bar
  const healthPercentage = (enemy.health / 100) * 100;
  
  return (
    <div 
      className="enemy"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        top: `${top - (size/2)}px`, 
        left: `${enemy.position}px`,
        transition: 'left 0.1s linear'
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Zombie head */}
        <div className="absolute w-[70%] h-[70%] bg-gray-300 rounded-full border-4 border-gray-700 flex items-center justify-center overflow-hidden">
          <div className="absolute w-full h-full bg-green-900/30"></div>
          
          {/* Zombie eyes */}
          <div className="absolute w-[25%] h-[25%] bg-red-600 rounded-full top-[20%] left-[20%] flex items-center justify-center">
            <div className="w-[60%] h-[60%] bg-black rounded-full"></div>
          </div>
          <div className="absolute w-[25%] h-[25%] bg-red-600 rounded-full top-[20%] right-[20%] flex items-center justify-center">
            <div className="w-[60%] h-[60%] bg-black rounded-full"></div>
          </div>
          
          {/* Zombie mouth */}
          <div className="absolute w-[60%] h-[20%] bg-red-900 bottom-[20%] rounded-md flex items-center justify-around">
            <div className="w-[10%] h-[80%] bg-yellow-100"></div>
            <div className="w-[10%] h-[80%] bg-yellow-100"></div>
            <div className="w-[10%] h-[80%] bg-yellow-100"></div>
          </div>
        </div>
        
        {/* Zombie body */}
        <div className="absolute w-[50%] h-[30%] bg-gray-700 rounded-md bottom-0 flex items-center justify-center">
          <div className="absolute w-[80%] h-[70%] bg-red-900 top-0 rounded-sm flex items-center justify-center">
            <div className="w-[80%] h-[20%] bg-white"></div>
          </div>
        </div>
        
        {/* Arms */}
        <div className="absolute w-[20%] h-[50%] bg-gray-600 -left-[15%] top-[30%] rounded-md transform -rotate-12 origin-top-right"></div>
        <div className="absolute w-[20%] h-[50%] bg-gray-600 -right-[15%] top-[30%] rounded-md transform rotate-12 origin-top-left"></div>
      </div>
      
      {/* Health bar */}
      <div className="absolute -bottom-5 left-0 w-full h-2 bg-black/60 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-200"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
    </div>
  );
});

export default Enemy;
