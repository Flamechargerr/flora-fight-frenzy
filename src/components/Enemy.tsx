
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
    isElectrified?: boolean;
    electricDamage?: number;
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
  
  // Enhanced burning animation
  const [burnIntensity, setBurnIntensity] = useState(0.5);
  const [electricPulse, setElectricPulse] = useState(0.7);
  
  useEffect(() => {
    if (enemy.isBurning) {
      const intervalId = setInterval(() => {
        setBurnIntensity(prev => prev === 0.5 ? 0.7 : 0.5);
      }, 200);
      return () => clearInterval(intervalId);
    }
  }, [enemy.isBurning]);
  
  // Electric effect animation
  useEffect(() => {
    if (enemy.isElectrified) {
      const intervalId = setInterval(() => {
        setElectricPulse(prev => prev === 0.7 ? 0.9 : 0.7);
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [enemy.isElectrified]);
  
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
            
            {/* More detailed ice crystals */}
            <div className="absolute top-[10%] left-[10%] w-[15%] h-[15%] bg-blue-100 rotate-45 shadow-sm"></div>
            <div className="absolute top-[15%] right-[20%] w-[10%] h-[20%] bg-blue-100 -rotate-30 shadow-sm"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[15%] h-[10%] bg-blue-100 rotate-20 shadow-sm"></div>
            <div className="absolute bottom-[30%] left-[25%] w-[12%] h-[18%] bg-blue-100 rotate-10 shadow-sm"></div>
            
            {/* Frost breath effect */}
            <div className="absolute left-[30%] right-[30%] top-[60%] bottom-[20%] bg-blue-100/50 rounded-full animate-pulse"></div>
          </div>
        )}
        
        {/* Burning effect overlay - enhanced with more particles */}
        {enemy.isBurning && (
          <div className="absolute inset-0 z-20 rounded-full overflow-hidden">
            <div className={`absolute inset-0 bg-red-500/30 animate-pulse`} style={{ opacity: burnIntensity }}></div>
            
            {/* Fire particles with improved animation */}
            <div className="absolute bottom-0 left-[10%] w-[20%] h-[60%] animate-flame">
              <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-t-full"></div>
              <div className="absolute inset-0 bg-yellow-300/30 rounded-t-full blur-sm"></div>
            </div>
            
            <div className="absolute bottom-0 left-[30%] w-[15%] h-[50%] animate-flame" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-yellow-500 to-yellow-300 rounded-t-full"></div>
              <div className="absolute inset-0 bg-yellow-300/30 rounded-t-full blur-sm"></div>
            </div>
            
            <div className="absolute bottom-0 right-[20%] w-[25%] h-[70%] animate-flame" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-red-700 via-red-600 to-orange-500 rounded-t-full"></div>
              <div className="absolute inset-0 bg-yellow-300/30 rounded-t-full blur-sm"></div>
            </div>
            
            {/* Smoke effect */}
            <div className="absolute w-[30%] h-[30%] top-[10%] left-[35%] opacity-40 animate-float" style={{ animationDuration: '3s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-700/80 to-gray-500/0 rounded-full blur-sm"></div>
            </div>
            
            {/* Ember particles with improved movement */}
            <div className="absolute w-[5%] h-[5%] bg-yellow-300 rounded-full animate-float" 
                 style={{ top: `${Math.random() * 50 + 10}%`, left: `${Math.random() * 60 + 20}%`, opacity: 0.8 }}></div>
            <div className="absolute w-[3%] h-[3%] bg-orange-400 rounded-full animate-float" 
                 style={{ top: `${Math.random() * 40 + 20}%`, left: `${Math.random() * 70 + 15}%`, opacity: 0.7, animationDelay: '0.3s' }}></div>
            <div className="absolute w-[4%] h-[4%] bg-red-500 rounded-full animate-float" 
                 style={{ top: `${Math.random() * 30 + 30}%`, left: `${Math.random() * 50 + 25}%`, opacity: 0.9, animationDelay: '0.7s' }}></div>
          </div>
        )}
        
        {/* NEW: Lightning/Electric effect overlay */}
        {enemy.isElectrified && (
          <div className="absolute inset-0 z-25 rounded-full overflow-hidden pointer-events-none">
            {/* Base electric glow */}
            <div className={`absolute inset-0 bg-blue-400/40`} style={{ opacity: electricPulse }}></div>
            
            {/* Electricity arcs - randomly positioned */}
            <div className="absolute inset-0">
              {/* Lightning bolt 1 */}
              <svg className="absolute w-full h-full" viewBox="0 0 100 100" style={{ opacity: electricPulse }}>
                <path d="M50,20 L60,40 L45,45 L55,80" 
                      stroke="#4fc3f7" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeDasharray="1 3"
                      className="animate-pulse"
                />
              </svg>
              
              {/* Lightning bolt 2 */}
              <svg className="absolute w-full h-full" viewBox="0 0 100 100" style={{ opacity: electricPulse, animationDelay: '0.2s' }}>
                <path d="M40,30 L30,50 L50,60 L40,75" 
                      stroke="#4fc3f7" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeDasharray="1 2"
                      className="animate-pulse"
                />
              </svg>
              
              {/* Lightning arc connecting parts */}
              <svg className="absolute w-full h-full" viewBox="0 0 100 100" style={{ opacity: electricPulse, animationDelay: '0.1s' }}>
                <path d="M30,40 C50,20 70,50 60,70" 
                      stroke="#90caf9" 
                      strokeWidth="1.5" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeDasharray="1 2"
                      className="animate-pulse"
                />
              </svg>
            </div>
            
            {/* Electric orbs - blinking randomly */}
            <div className="absolute w-[8%] h-[8%] bg-blue-300 rounded-full animate-ping" 
                style={{ top: '20%', left: '70%', opacity: 0.8, animationDuration: '0.8s' }}></div>
            <div className="absolute w-[6%] h-[6%] bg-blue-400 rounded-full animate-ping" 
                style={{ top: '60%', left: '30%', opacity: 0.7, animationDuration: '1s', animationDelay: '0.3s' }}></div>
            <div className="absolute w-[7%] h-[7%] bg-blue-200 rounded-full animate-ping" 
                style={{ top: '40%', left: '20%', opacity: 0.9, animationDuration: '0.7s', animationDelay: '0.1s' }}></div>
                
            {/* Halo effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/0 to-blue-300/30 animate-pulse"></div>
          </div>
        )}
        
        {/* Enhanced Zombie body */}
        <div className="absolute w-[40%] h-[60%] bottom-0 flex flex-col">
          {/* Torso */}
          <div className="w-full h-[60%] bg-green-900 rounded-md relative">
            {/* Torn clothes */}
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] bg-gray-700 rounded-sm transform rotate-12"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[25%] h-[30%] bg-gray-800 rounded-sm transform -rotate-5"></div>
            
            {/* Blood stains */}
            <div className="absolute top-[30%] right-[25%] w-[20%] h-[15%] bg-red-900/70 rounded-full"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[15%] h-[20%] bg-red-900/70 rounded-full"></div>
          </div>
          
          {/* Legs */}
          <div className="flex w-full h-[40%]">
            <div className="w-1/2 h-full bg-gray-700 mr-[1px]"></div>
            <div className="w-1/2 h-full bg-gray-800 ml-[1px]"></div>
          </div>
        </div>
        
        {/* Zombie head - more zombie-like */}
        <div className="absolute w-[70%] h-[65%] bg-green-800 rounded-full top-[5%] flex items-center justify-center overflow-hidden z-10">
          {/* Decomposed skin texture */}
          <div className="absolute inset-0">
            <div className="absolute top-[10%] left-[20%] w-[15%] h-[10%] bg-green-700 rounded-full opacity-70"></div>
            <div className="absolute top-[30%] right-[25%] w-[20%] h-[15%] bg-green-900 rounded-full opacity-70"></div>
            <div className="absolute bottom-[40%] left-[30%] w-[25%] h-[10%] bg-green-950 rounded-full opacity-60"></div>
          </div>
          
          {/* Zombie eyes - bloodshot and sunken */}
          <div className="absolute w-[25%] h-[25%] top-[20%] left-[20%] flex items-center justify-center">
            <div className="absolute inset-0 bg-red-800 rounded-full"></div>
            <div className="w-[60%] h-[60%] bg-yellow-900 rounded-full flex items-center justify-center">
              <div className="w-[60%] h-[60%] bg-black rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute w-[25%] h-[25%] top-[20%] right-[20%] flex items-center justify-center">
            <div className="absolute inset-0 bg-red-800 rounded-full"></div>
            <div className="w-[60%] h-[60%] bg-yellow-900 rounded-full flex items-center justify-center">
              <div className="w-[60%] h-[60%] bg-black rounded-full"></div>
            </div>
          </div>
          
          {/* Zombie mouth - more gruesome when eating */}
          <div 
            className="absolute w-[60%] h-[25%] bg-red-900 bottom-[20%] rounded-md flex items-center justify-around overflow-hidden"
            style={isEating ? { animation: 'mouthOpen 0.5s infinite' } : {}}
          >
            <div className="absolute inset-0 bg-red-950/50"></div>
            <div className="w-[8%] h-[90%] bg-yellow-200 transform rotate-[-5deg]"></div>
            <div className="w-[8%] h-[80%] bg-yellow-200 transform rotate-[3deg]"></div>
            <div className="w-[8%] h-[70%] bg-yellow-200 transform rotate-[-2deg]"></div>
            <div className="w-[8%] h-[85%] bg-yellow-200 transform rotate-[7deg]"></div>
            
            {/* Blood dripping when eating */}
            {isEating && (
              <div className="absolute bottom-0 left-[30%] w-[40%] h-[30%] bg-red-700 rounded-t-full"></div>
            )}
          </div>
          
          {/* Zombie-specific headgear */}
          {enemy.type === 'cone' && (
            <div className="absolute w-[80%] h-[60%] bg-orange-400 -top-[20%] rounded-t-full overflow-hidden">
              <div className="absolute w-full h-full bg-orange-600 opacity-50 rotate-45 scale-150"></div>
              <div className="absolute bottom-0 left-[40%] w-[20%] h-[30%] bg-orange-600"></div>
              <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-orange-700/20"></div>
            </div>
          )}
          
          {enemy.type === 'bucket' && (
            <div className="absolute w-[90%] h-[70%] -top-[30%] rounded-t-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-600"></div>
              <div className="absolute w-full h-[20%] bottom-0 bg-gray-700"></div>
              <div className="absolute w-[60%] h-[50%] top-[20%] left-[20%] bg-gradient-to-tr from-gray-700 to-gray-500 opacity-40"></div>
              <div className="absolute w-[10%] h-[40%] top-[10%] left-[45%] bg-gradient-to-b from-gray-300 to-gray-500"></div>
              <div className="absolute w-[80%] h-[10%] bottom-[20%] left-[10%] bg-gray-700 rounded-full"></div>
            </div>
          )}
          
          {enemy.type === 'door' && (
            <div className="absolute w-[120%] h-[100%] -top-[10%] pointer-events-none">
              <div className="absolute left-[10%] w-[80%] h-[60%] bg-amber-700 rounded-t-lg border-2 border-amber-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-600/30 to-amber-900/30"></div>
                <div className="absolute w-[30%] h-[70%] top-[15%] left-[15%] bg-amber-800/60"></div>
                <div className="absolute w-[30%] h-[70%] top-[15%] right-[15%] bg-amber-800/60"></div>
                <div className="absolute w-[20%] h-[20%] rounded-full bg-yellow-600 top-[50%] left-[10%]"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Arms */}
        <div className="absolute w-[20%] h-[50%] bg-green-900 -left-[15%] top-[30%] rounded-md transform -rotate-12 origin-top-right z-5">
          {/* Exposed bone */}
          <div className="absolute bottom-[10%] w-[50%] h-[20%] bg-gray-200 rounded-full"></div>
        </div>
        <div className="absolute w-[20%] h-[50%] bg-green-900 -right-[15%] top-[30%] rounded-md transform rotate-12 origin-top-left z-5">
          {/* Blood */}
          <div className="absolute top-[30%] w-[60%] h-[15%] bg-red-900 rounded-full"></div>
        </div>
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
      
      {/* Enhanced status indicators */}
      <div className="absolute -top-4 left-0 flex space-x-1">
        {enemy.isFrozen && (
          <div className="bg-blue-500 text-white px-1 text-xs rounded-sm shadow-md flex items-center">
            <span className="mr-1">❄️</span>
            <span className="text-[10px]">-50%</span>
          </div>
        )}
        {enemy.isBurning && (
          <div className="bg-red-500 text-white px-1 text-xs rounded-sm shadow-md flex items-center">
            <span className="mr-1">🔥</span>
            <span className="text-[10px]">-3HP</span>
          </div>
        )}
        {enemy.isElectrified && (
          <div className="bg-blue-400 text-white px-1 text-xs rounded-sm shadow-md flex items-center">
            <span className="mr-1">⚡</span>
            <span className="text-[10px]">-5HP</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default Enemy;
