
import React, { useEffect } from 'react';
import Plant from '../Plant';
import Enemy from '../Enemy';
import SunResource from '../SunResource';
import LawnMower from '../LawnMower';
import { Home } from 'lucide-react';
import { 
  PlantType, 
  PlantInstance, 
  ProjectileType, 
  EnemyType, 
  SunResource as SunResourceType,
} from '../../hooks/useGameState';

// Number of rows and columns in the grid
const ROWS = 5;
const COLS = 9;

interface GameGridProps {
  gameArea: { width: number; height: number };
  plants: PlantInstance[];
  enemies: EnemyType[];
  projectiles: ProjectileType[];
  sunResources: SunResourceType[];
  selectedPlant: PlantType | null;
  debugMessage: string;
  lawnMowers: { row: number; activated: boolean; position: number }[];
  onPlacePlant: (row: number, col: number) => void;
  onCollectSun: (id: string) => void;
}

const GameGrid: React.FC<GameGridProps> = ({
  gameArea,
  plants,
  enemies,
  projectiles,
  sunResources,
  selectedPlant,
  debugMessage,
  lawnMowers,
  onPlacePlant,
  onCollectSun,
}) => {
  // Render grid cells
  const renderGrid = () => {
    const cells = [];
    const cellWidth = 100 / COLS;
    const cellHeight = 100 / ROWS;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isOccupied = plants.some(p => p.row === row && p.col === col);
        const isAvailable = !isOccupied && selectedPlant !== null;
        
        // Create checkerboard pattern - alternate colors
        const isEvenCell = (row + col) % 2 === 0;
        
        cells.push(
          <div 
            key={`cell-${row}-${col}`}
            className={`grid-cell ${isAvailable ? 'available' : ''} ${isOccupied ? 'unavailable' : ''}`}
            style={{ 
              width: `${cellWidth}%`, 
              height: `${cellHeight}%`,
              position: 'absolute',
              left: `${col * cellWidth}%`,
              top: `${row * cellHeight}%`,
              backgroundColor: isEvenCell ? 'rgba(246, 238, 183, 0.6)' : 'rgba(188, 217, 165, 0.6)',
              border: '1px solid rgba(105, 84, 45, 0.3)'
            }}
            onClick={() => isAvailable && onPlacePlant(row, col)}
          >
            {/* Show visual indicator when placing plants */}
            {selectedPlant && !isOccupied && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center rounded-sm">
                <span className="text-2xl opacity-50">{selectedPlant.icon}</span>
              </div>
            )}
          </div>
        );
      }
    }
    
    return cells;
  };

  // Calculate dimensions for lawn mower area and house
  const lawnMowerWidth = gameArea.width * 0.07; // 7% of game width for lawn mower area
  const houseWidth = gameArea.width * 0.12; // 12% of game width for house
  
  // House animation based on enemies proximity
  const isZombieClose = enemies.some(enemy => enemy.position < gameArea.width * 0.3);
  
  return (
    <div className="flex-1 relative">
      {/* Container with house, lawn mowers and game grid */}
      <div 
        className="flex flex-row h-full rounded-xl overflow-hidden"
        style={{ height: `${gameArea.height}px` }}
      >
        {/* House area */}
        <div 
          className="relative"
          style={{ 
            width: `${houseWidth}px`,
            backgroundColor: '#8f6f5c',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414 1.413 1.414-1.414 1.414-1.414-1.414zm-2.83 2.828l1.415-1.414 1.414 1.414-1.414 1.414-1.414-1.414zM44.544 11.74l1.414-1.414 1.414 1.415-1.414 1.415-1.414-1.415zm-2.83 2.83l1.415-1.415 1.414 1.414-1.414 1.414-1.414-1.414zM41.716 8.915l1.414-1.415 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83 2.827l1.415-1.414 1.414 1.414-1.414 1.414-1.414-1.414zM38.886 6.085l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83 2.83l1.415-1.415 1.414 1.414-1.414 1.414-1.414-1.414zM40.3 20.114l-7.07-7.07 1.414-1.414 7.07 7.07-1.414 1.414zM30 21.53l1.415-1.414 5.656 5.657-1.414 1.414L30 21.53zm2.83-2.83l1.414-1.413 5.657 5.656-1.414 1.415-5.657-5.657zM27.172 24.357l1.414-1.414 5.656 5.657-1.414 1.414-5.656-5.657zM30 21.53l1.415-1.414 5.656 5.657-1.414 1.414L30 21.53zm-2.83 2.828l1.415-1.414 5.657 5.657-1.414 1.414-5.657-5.657zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
          }}
        >
          {/* Terrified house face */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${isZombieClose ? 'animate-pulse' : ''}`}>
            <div 
              className="relative w-[70%] h-[60%] flex flex-col items-center justify-center"
              style={{ transform: isZombieClose ? 'translateY(-5%)' : 'translateY(0)' }}
            >
              {/* House icon */}
              <Home 
                className={`w-full h-full text-amber-900 transition-all duration-300 ${isZombieClose ? 'text-red-900' : ''}`}
              />
              
              {/* Scared face overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Windows as eyes - wide open when zombies are close */}
                <div className="flex justify-center w-full gap-[30%] mt-[15%]">
                  <div className={`bg-white w-[20%] transition-all duration-300 ${isZombieClose ? 'h-[30%] rounded-full' : 'h-[20%] rounded-md'}`}>
                    <div className={`bg-black w-full h-full rounded-full transform scale-75 transition-all ${isZombieClose ? 'scale-60' : ''}`}></div>
                  </div>
                  <div className={`bg-white w-[20%] transition-all duration-300 ${isZombieClose ? 'h-[30%] rounded-full' : 'h-[20%] rounded-md'}`}>
                    <div className={`bg-black w-full h-full rounded-full transform scale-75 transition-all ${isZombieClose ? 'scale-60' : ''}`}></div>
                  </div>
                </div>
                
                {/* Door as mouth - open when zombies are close */}
                <div 
                  className={`bg-amber-950 mt-[10%] rounded-t-md w-[30%] transition-all duration-300 ${
                    isZombieClose ? 'h-[25%] animate-mouthOpen' : 'h-[5%]'
                  }`}
                ></div>
              </div>
            </div>
            
            {/* Sweat drops when zombies are close */}
            {isZombieClose && (
              <>
                <div className="absolute top-[30%] right-[25%] w-[8%] h-[15%] bg-blue-300 rounded-full opacity-80 animate-sweatDrop" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-[25%] left-[25%] w-[6%] h-[12%] bg-blue-300 rounded-full opacity-80 animate-sweatDrop" style={{ animationDelay: '0s' }}></div>
              </>
            )}
            
            {/* SOS sign when zombies are close */}
            {isZombieClose && (
              <div className="absolute top-[10%] w-[70%] bg-red-700 text-white text-center text-xs py-1 rounded-md animate-pulse">
                SOS!
              </div>
            )}
          </div>
        </div>
        
        {/* Lawn mower area */}
        <div 
          className="lawn-mower-lane relative"
          style={{ 
            width: `${lawnMowerWidth}px`,
          }}
        >
          {/* Lawn mowers now positioned in their own area */}
          {lawnMowers.map((mower, index) => (
            <LawnMower
              key={`mower-${index}`}
              row={mower.row}
              activated={mower.activated}
              gameAreaSize={gameArea}
              gridDimensions={{ rows: ROWS, cols: COLS }}
              position={mower.position}
              lawnMowerAreaWidth={lawnMowerWidth}
            />
          ))}
        </div>
        
        {/* Game grid */}
        <div 
          className="garden-grid relative flex-1 overflow-hidden"
          style={{ 
            height: `${gameArea.height}px`,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23855e42\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundColor: '#8DB255'
          }}
        >
          {/* Grid cells */}
          {renderGrid()}
          
          {/* Plants */}
          {plants.map((plant) => (
            <Plant
              key={plant.id}
              plant={plant}
              gridDimensions={{ rows: ROWS, cols: COLS }}
              gameAreaSize={gameArea}
            />
          ))}
          
          {/* Projectiles with enhanced effects */}
          {projectiles.map((projectile) => (
            <div 
              key={projectile.id}
              className={`absolute h-4 rounded-full z-10 ${
                projectile.type === 'pea' ? 'bg-green-500 w-4' : 
                projectile.type === 'ice' ? 'bg-blue-400 w-4' : 
                'bg-red-500 w-5'
              }`}
              style={{
                left: projectile.startX + (projectile.endX - projectile.startX) * projectile.progress,
                top: (projectile.row * (gameArea.height / ROWS)) + (gameArea.height / ROWS / 2) - 8,
                boxShadow: projectile.type === 'fire' ? '0 0 15px #ff3821' : 
                          projectile.type === 'ice' ? '0 0 12px #41c7ff' : '0 0 5px #5bd942'
              }}
            >
              {/* Enhanced projectile effects */}
              {projectile.type === 'fire' && (
                <>
                  <div className="absolute inset-0 animate-pulse bg-yellow-500 rounded-full opacity-60 scale-[1.3]" />
                  <div className="absolute inset-0 animate-pulse bg-orange-500 rounded-full opacity-40 scale-[1.6]" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute top-[-4px] left-0 w-6 h-3 bg-yellow-400 rounded-full animate-flame" />
                </>
              )}
              
              {projectile.type === 'ice' && (
                <>
                  <div className="absolute inset-0 animate-pulse bg-blue-300 rounded-full opacity-60 scale-[1.3]" />
                  <div className="absolute inset-0 animate-pulse bg-blue-100 rounded-full opacity-40 scale-[1.5]" style={{ animationDelay: '0.1s' }} />
                  <div className="absolute top-[-3px] left-0 w-5 h-2 bg-blue-200 rounded-full opacity-70" />
                </>
              )}
            </div>
          ))}
          
          {/* Enemies */}
          {enemies.map((enemy) => (
            <Enemy
              key={enemy.id}
              enemy={enemy}
              gridDimensions={{ rows: ROWS, cols: COLS }}
              gameAreaSize={gameArea}
            />
          ))}
          
          {/* Sun resources */}
          {sunResources.map((sun) => (
            <SunResource
              key={sun.id}
              id={sun.id}
              x={sun.x}
              y={sun.y}
              onCollect={onCollectSun}
            />
          ))}
          
          {/* Debug indicator */}
          <div className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
            Zombies: {enemies.length} | Active Mowers: {lawnMowers.filter(m => m.activated).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
