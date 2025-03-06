
import { memo, useEffect, useState } from 'react';

interface LawnMowerProps {
  row: number;
  activated: boolean;
  gameAreaSize: {
    width: number;
    height: number;
  };
  gridDimensions: {
    rows: number;
    cols: number;
  };
  position: number;
}

const LawnMower = memo(({ 
  row, 
  activated, 
  gameAreaSize, 
  gridDimensions,
  position
}: LawnMowerProps) => {
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  const top = row * cellHeight + (cellHeight / 2);
  const size = Math.min(cellHeight * 0.8, 50);
  
  // Add smoke/dust particle effect system
  const [particles, setParticles] = useState<{id: number, x: number, y: number, opacity: number, size: number}[]>([]);
  
  // Generate particles when activated
  useEffect(() => {
    if (activated) {
      const interval = setInterval(() => {
        setParticles(current => {
          // Remove old particles
          const filtered = current.filter(p => p.opacity > 0);
          
          // Add new particles when moving
          const newParticles = [...filtered];
          if (activated) {
            const particleCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < particleCount; i++) {
              newParticles.push({
                id: Date.now() + i,
                x: position - Math.random() * 10,
                y: top + (Math.random() * 15 - 7.5),
                opacity: 0.7 + Math.random() * 0.3,
                size: 3 + Math.random() * 5
              });
            }
          }
          
          // Fade out existing particles
          return newParticles.map(p => ({
            ...p,
            x: p.x - 2,
            opacity: p.opacity - 0.05,
            size: p.size + 0.2
          }));
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [activated, position, top]);
  
  // Calculate engine rotation for animation
  const engineRotation = activated ? `${Math.sin(Date.now() * 0.05) * 3}deg` : '0deg';
  
  return (
    <>
      {/* Dust particles */}
      {particles.map((particle) => (
        <div 
          key={particle.id}
          className="absolute rounded-full bg-gray-300"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            zIndex: 25
          }}
        />
      ))}
      
      <div 
        className={`absolute transition-transform ${activated ? 'animate-lawn-mower' : ''}`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          left: `${position}px`,
          top: `${top - (size/2)}px`,
          zIndex: 30,
          transform: activated ? 'rotate(2deg)' : 'rotate(0deg)',
          transition: 'transform 0.05s ease-in-out, left 0.1s linear'
        }}
      >
        <div className="w-full h-full relative">
          {/* Main body - metallic base with gradient */}
          <div className="absolute inset-0 rounded-md overflow-hidden bg-gradient-to-b from-gray-300 to-gray-500 shadow-md">
            {/* Metallic texture with light reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 via-transparent to-gray-900/20"></div>
            
            {/* Engine top with more detail */}
            <div 
              className="absolute top-[5%] left-[15%] w-[70%] h-[30%] bg-gradient-to-b from-gray-700 to-gray-600 rounded-sm shadow-inner"
              style={{ transform: `rotate(${engineRotation})` }}
            >
              {/* Engine details */}
              <div className="absolute left-[10%] top-[20%] w-[80%] h-[30%] bg-gray-800 rounded-sm"></div>
              <div className="absolute left-[20%] top-[60%] w-[60%] h-[20%] bg-gray-900 rounded-sm"></div>
              <div className="absolute right-[10%] top-[30%] w-[10%] h-[40%] bg-red-600 rounded-full"></div>
            </div>
            
            {/* Handle with grip texture */}
            <div className="absolute top-[10%] right-[10%] w-[45%] h-[12%] bg-gradient-to-r from-gray-900 to-gray-700 rounded-full transform rotate-[-10deg]">
              <div className="absolute inset-y-0 right-[10%] w-[70%] flex flex-col justify-evenly">
                <div className="w-full h-[2px] bg-gray-600"></div>
                <div className="w-full h-[2px] bg-gray-600"></div>
              </div>
            </div>
            
            {/* Blade housing with realistic details */}
            <div className="absolute bottom-[15%] left-[-5%] w-[50%] h-[40%] rounded-md overflow-hidden shadow-md bg-gradient-to-b from-red-600 via-red-500 to-red-700">
              {/* Vents on the housing */}
              <div className="absolute top-[10%] right-[10%] w-[30%] h-[80%] flex flex-col justify-evenly">
                <div className="w-full h-[2px] bg-red-900"></div>
                <div className="w-full h-[2px] bg-red-900"></div>
                <div className="w-full h-[2px] bg-red-900"></div>
              </div>
              
              {/* Spinning blade with better animation */}
              <div 
                className={`absolute inset-0 flex items-center justify-center ${activated ? 'animate-spin' : ''}`} 
                style={{ animationDuration: "0.05s" }}
              >
                <div className="w-[80%] h-[10%] bg-gray-200 rounded-full"></div>
                <div className="w-[10%] h-[80%] bg-gray-200 rounded-full transform rotate-90"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white opacity-30"></div>
              </div>
            </div>
            
            {/* Wheels with better hub detail and realistic look */}
            <div className="absolute bottom-[-10%] left-[15%] w-[20%] h-[20%] overflow-hidden">
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full ${activated ? 'animate-spin' : ''}`} 
                style={{ animationDuration: "0.1s" }}
              >
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-gradient-to-br from-gray-600 to-gray-700 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[90%] h-[5%] bg-gray-600"></div>
                  <div className="w-[5%] h-[90%] bg-gray-600"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-[-10%] right-[15%] w-[20%] h-[20%] overflow-hidden">
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full ${activated ? 'animate-spin' : ''}`}
                style={{ animationDuration: "0.1s" }}
              >
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-gradient-to-br from-gray-600 to-gray-700 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[90%] h-[5%] bg-gray-600"></div>
                  <div className="w-[5%] h-[90%] bg-gray-600"></div>
                </div>
              </div>
            </div>
            
            {/* Oil stains and wear marks for realism */}
            <div className="absolute bottom-[40%] right-[20%] w-[15%] h-[10%] bg-black/20 rounded-full"></div>
            <div className="absolute top-[60%] left-[30%] w-[10%] h-[5%] bg-brown-900/30 rounded-sm"></div>
          </div>
          
          {/* Add grass cutting effect when activated */}
          {activated && (
            <>
              <div className="absolute left-[-15px] bottom-0 w-[20px] h-[15px]">
                <div className="absolute w-full h-full bg-green-200/50 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute left-[-25px] bottom-[5px] w-[15px] h-[10px]">
                <div className="absolute w-full h-full bg-green-300/40 rounded-full animate-ping"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
});

export default LawnMower;
