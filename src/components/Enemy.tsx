
import { memo } from 'react';

interface EnemyProps {
  enemy: {
    id: string;
    health: number;
    speed: number;
    row: number;
    position: number;
    type: string;
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
  const cellHeight = gameArea.height / gridDimensions.rows;
  const top = enemy.row * cellHeight + (cellHeight / 2);
  const size = cellHeight * 0.85;
  
  // Health percentage for health bar - adjust for different zombie types
  let maxHealth = 100;
  if (enemy.type === 'cone') maxHealth = 150;
  if (enemy.type === 'bucket') maxHealth = 200;
  if (enemy.type === 'door') maxHealth = 300;
  
  const healthPercentage = (enemy.health / maxHealth) * 100;
  
  // Add walking animation
  const isWalking = true;
  const wobbleStyle = {
    animation: 'zombieWalk 0.8s infinite alternate',
  };
  
  return (
    <div 
      className="enemy"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        top: `${top - (size/2)}px`, 
        left: `${enemy.position}px`,
        transition: 'left 0.1s linear',
        ...(isWalking ? wobbleStyle : {})
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Zombie body */}
        <div className="absolute w-[50%] h-[40%] bg-gray-700 rounded-md bottom-0 flex items-center justify-center">
          <div className="absolute w-[80%] h-[70%] bg-red-900 top-0 rounded-sm flex items-center justify-center">
            <div className="w-[80%] h-[20%] bg-white"></div>
          </div>
        </div>
        
        {/* Zombie head */}
        <div className="absolute w-[70%] h-[65%] bg-gray-300 rounded-full border-4 border-gray-700 flex items-center justify-center overflow-hidden">
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
          
          {/* Zombie-specific headgear */}
          {enemy.type === 'cone' && (
            <div className="absolute w-[80%] h-[60%] bg-orange-400 -top-[20%] rounded-t-full overflow-hidden">
              <div className="absolute w-full h-full bg-orange-600 opacity-50 rotate-45 scale-150"></div>
              <div className="absolute bottom-0 left-[40%] w-[20%] h-[30%] bg-orange-600"></div>
            </div>
          )}
          
          {enemy.type === 'bucket' && (
            <div className="absolute w-[90%] h-[70%] bg-gray-400 -top-[30%] rounded-t-full overflow-hidden">
              <div className="absolute w-full h-[20%] bottom-0 bg-gray-500"></div>
              <div className="absolute w-full h-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
            </div>
          )}
          
          {enemy.type === 'door' && (
            <div className="absolute w-[120%] h-[100%] -top-[10%] pointer-events-none">
              <div className="absolute left-[10%] w-[80%] h-[60%] bg-amber-700 rounded-t-lg border-2 border-amber-900">
                <div className="absolute w-[20%] h-[20%] rounded-full bg-yellow-600 top-[50%] left-[10%]"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Arms */}
        <div className="absolute w-[20%] h-[50%] bg-gray-600 -left-[15%] top-[30%] rounded-md transform -rotate-12 origin-top-right"></div>
        <div className="absolute w-[20%] h-[50%] bg-gray-600 -right-[15%] top-[30%] rounded-md transform rotate-12 origin-top-left"></div>
      </div>
      
      {/* Health bar */}
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
    </div>
  );
});

export default Enemy;
