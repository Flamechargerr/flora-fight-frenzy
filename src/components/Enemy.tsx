
import { memo, useState, useEffect } from 'react';

interface EnemyProps {
  enemy: {
    id: string;
    health: number;
    speed: number;
    row: number;
    position: number;
    type: string;
    isEating?: boolean;
    targetPlant?: string;
    isFrozen?: boolean;
    isBurning?: boolean;
    burnDamage?: number;
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
  const size = cellHeight * 0.85;
  
  // Health percentage for health bar - adjust for different zombie types
  let maxHealth = 100;
  if (enemy.type === 'cone') maxHealth = 150;
  if (enemy.type === 'bucket') maxHealth = 200;
  if (enemy.type === 'door') maxHealth = 300;
  
  const healthPercentage = (enemy.health / maxHealth) * 100;
  
  // Add eating and walking animations
  const isEating = enemy.isEating;
  const isWalking = !isEating;
  
  // Determine movement speed based on frozen status
  const movementSpeed = enemy.isFrozen ? '0.15s linear' : '0.1s linear';
  
  const wobbleStyle = {
    animation: isWalking ? 'zombieWalk 0.8s infinite alternate' : 'none',
  };
  
  const eatingStyle = {
    animation: isEating ? 'zombieEat 0.5s infinite' : 'none',
  };
  
  return (
    <div 
      className="enemy"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        top: `${top - (size/2)}px`, 
        left: `${enemy.position}px`,
        transition: `left ${movementSpeed}`,
        ...(isWalking ? wobbleStyle : eatingStyle)
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Frozen effect overlay */}
        {enemy.isFrozen && (
          <div className="absolute inset-0 z-20 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-blue-300/30"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNhY2VlZmYiPjwvcmVjdD4KPC9zdmc+')]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-blue-100/10 animate-pulse"></div>
            {/* Ice crystals */}
            <div className="absolute top-[10%] left-[10%] w-[15%] h-[15%] bg-blue-100 rotate-45"></div>
            <div className="absolute top-[15%] right-[20%] w-[10%] h-[20%] bg-blue-100 -rotate-30"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[15%] h-[10%] bg-blue-100 rotate-20"></div>
          </div>
        )}
        
        {/* Burning effect overlay */}
        {enemy.isBurning && (
          <div className="absolute inset-0 z-20 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-red-500/20"></div>
            {/* Fire particles */}
            <div className="absolute bottom-0 left-[10%] w-[20%] h-[40%] bg-orange-500 rounded-t-full animate-flame"></div>
            <div className="absolute bottom-0 left-[30%] w-[15%] h-[30%] bg-yellow-500 rounded-t-full animate-flame" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-0 right-[20%] w-[25%] h-[45%] bg-red-600 rounded-t-full animate-flame" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        
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
          
          {/* Zombie mouth - animate when eating */}
          <div 
            className="absolute w-[60%] h-[20%] bg-red-900 bottom-[20%] rounded-md flex items-center justify-around"
            style={isEating ? { animation: 'mouthOpen 0.5s infinite' } : {}}
          >
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
      
      {/* Status indicators */}
      <div className="absolute -top-4 left-0 flex space-x-1">
        {enemy.isFrozen && (
          <div className="bg-blue-500 text-white px-1 text-xs rounded-sm">
            ❄️
          </div>
        )}
        {enemy.isBurning && (
          <div className="bg-red-500 text-white px-1 text-xs rounded-sm">
            🔥
          </div>
        )}
      </div>
    </div>
  );
});

export default Enemy;
