
import React from 'react';

interface LawnMowerProps {
  row: number;
  activated: boolean;
  position: number;
  gameAreaSize: {
    width: number;
    height: number;
  };
  gridDimensions: {
    rows: number;
    cols: number;
  };
  lawnMowerAreaWidth?: number;
}

const LawnMower: React.FC<LawnMowerProps> = ({
  row,
  activated,
  position,
  gameAreaSize,
  gridDimensions,
  lawnMowerAreaWidth = 0
}) => {
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  const top = row * cellHeight + (cellHeight / 2);
  const size = Math.min(cellHeight * 0.7, lawnMowerAreaWidth * 0.8);
  
  return (
    <div 
      className={`absolute transition-all ${activated ? 'animate-lawn-mower z-30' : 'z-10'}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: lawnMowerAreaWidth ? `${(lawnMowerAreaWidth - size) / 2}px` : `${position}px`,
        top: `${top - (size/2)}px`,
        transform: activated ? `translateX(${position}px)` : 'none'
      }}
    >
      {/* More realistic lawn mower design */}
      <div className="relative w-full h-full">
        {/* Main body - metal casing */}
        <div className="absolute inset-[5%] bg-gradient-to-b from-gray-300 to-gray-400 rounded-md border border-gray-500">
          {/* Engine top */}
          <div className="absolute top-[10%] left-[15%] right-[15%] h-[25%] bg-gray-600 rounded-sm"></div>
          
          {/* Handle */}
          <div className="absolute top-[-5%] right-[-10%] w-[15%] h-[60%] bg-gray-700 rounded-full transform rotate-[15deg]"></div>
          
          {/* Wheels */}
          <div className="absolute bottom-[-5%] left-[15%] w-[20%] h-[20%] bg-black rounded-full border border-gray-600"></div>
          <div className="absolute bottom-[-5%] right-[15%] w-[20%] h-[20%] bg-black rounded-full border border-gray-600"></div>
          
          {/* Blades visible at bottom */}
          <div className="absolute bottom-[0%] left-[30%] right-[30%] h-[10%] bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-1/4 h-full bg-gray-100"></div>
              <div className="w-1/4 h-full bg-gray-700"></div>
              <div className="w-1/4 h-full bg-gray-100"></div>
              <div className="w-1/4 h-full bg-gray-700"></div>
            </div>
          </div>
          
          {/* Grass discharge chute */}
          <div className="absolute right-[-5%] bottom-[30%] w-[20%] h-[15%] bg-green-700 rounded-r-md"></div>
        </div>
        
        {/* Blade effect when activated */}
        {activated && (
          <>
            <div className="absolute bottom-0 left-[20%] right-[20%] h-[20%] rounded-full bg-gray-100 opacity-80 animate-spin" style={{ animationDuration: '0.2s' }}></div>
            
            {/* Cut grass particles */}
            <div className="absolute w-[150%] h-full left-0">
              <div className="absolute bottom-[10%] left-[40%] w-2 h-1 bg-green-500 opacity-70 animate-particle" style={{ animationDelay: '0.1s' }}></div>
              <div className="absolute bottom-[20%] left-[60%] w-3 h-1 bg-green-500 opacity-70 animate-particle" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute bottom-[5%] left-[80%] w-2 h-2 bg-green-500 opacity-70 animate-particle" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-[15%] left-[100%] w-3 h-1 bg-green-500 opacity-70 animate-particle" style={{ animationDelay: '0.15s' }}></div>
              <div className="absolute bottom-[25%] left-[120%] w-2 h-1 bg-green-500 opacity-70 animate-particle" style={{ animationDelay: '0.25s' }}></div>
            </div>
            
            {/* Dust cloud behind */}
            <div className="absolute right-[-30%] bottom-0 w-[40%] h-[60%] rounded-full bg-amber-200 opacity-40 animate-pulse"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default LawnMower;
