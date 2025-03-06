
import { memo } from 'react';

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
  
  return (
    <div 
      className={`absolute transition-transform duration-300 ${activated ? 'animate-lawn-mower' : ''}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${position}px`,
        top: `${top - (size/2)}px`,
        zIndex: 30,
        transform: activated ? 'rotate(5deg)' : 'rotate(0deg)',
        transition: 'transform 0.1s ease-in-out, left 0.2s linear'
      }}
    >
      <div className="w-full h-full relative">
        {/* Metallic base */}
        <div className="absolute inset-0 bg-gray-400 rounded-md overflow-hidden">
          {/* Metal texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500"></div>
          
          {/* Engine top */}
          <div className="absolute top-[5%] left-[15%] w-[70%] h-[30%] bg-gray-600 rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-500"></div>
          </div>
          
          {/* Handle */}
          <div className="absolute top-[10%] right-[10%] w-[45%] h-[12%] bg-gray-800 rounded-full transform rotate-[-10deg]"></div>
          
          {/* Blade housing */}
          <div className="absolute bottom-[15%] left-[-5%] w-[50%] h-[40%] bg-red-600 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700"></div>
            
            {/* Spinning blade */}
            <div className={`absolute inset-0 flex items-center justify-center ${activated ? 'animate-spin' : ''}`} style={{ animationDuration: "0.1s" }}>
              <div className="w-[80%] h-[10%] bg-gray-200 rounded-full"></div>
              <div className="w-[10%] h-[80%] bg-gray-200 rounded-full"></div>
            </div>
          </div>
          
          {/* Wheels with better detail */}
          <div className={`absolute bottom-[-10%] left-[15%] w-[20%] h-[20%] bg-black rounded-full ${activated ? 'animate-spin' : ''}`} style={{ animationDuration: "0.2s" }}>
            <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-gray-500 rounded-full"></div>
          </div>
          <div className={`absolute bottom-[-10%] right-[15%] w-[20%] h-[20%] bg-black rounded-full ${activated ? 'animate-spin' : ''}`} style={{ animationDuration: "0.2s" }}>
            <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-gray-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Add dust effect when activated */}
        {activated && (
          <div className="absolute left-[-10px] bottom-0 w-[15px] h-[15px]">
            <div className="absolute w-full h-full bg-gray-300/70 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
});

export default LawnMower;
