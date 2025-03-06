
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
      className={`absolute transition-all duration-200 ${activated ? 'animate-lawn-mower' : ''}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${position}px`,
        top: `${top - (size/2)}px`,
        zIndex: 30
      }}
    >
      <div className="w-full h-full relative">
        {/* Lawn mower body */}
        <div className="absolute inset-0 bg-gray-700 rounded-md">
          {/* Engine */}
          <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-gray-800 rounded-sm"></div>
          
          {/* Handle */}
          <div className="absolute top-[20%] right-[15%] w-[40%] h-[10%] bg-gray-900 rounded-full"></div>
          
          {/* Blade */}
          <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[40%] bg-gray-200 rounded-full border-2 border-gray-400">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[10%] bg-gray-400 rounded-full"></div>
              <div className="w-[10%] h-[80%] bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Wheels */}
          <div className="absolute bottom-[-10%] left-[15%] w-[20%] h-[20%] bg-black rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[15%] w-[20%] h-[20%] bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
});

export default LawnMower;
