
import React, { useEffect } from 'react';
import Plant from '../Plant';
import Enemy from '../Enemy';
import SunResource from '../SunResource';
import LawnMower from '../LawnMower';
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

  // Calculate dimensions for lawn mower area
  const lawnMowerWidth = gameArea.width * 0.07; // 7% of game width for lawn mower area
  
  return (
    <div className="flex-1 relative">
      {/* Container with lawn mowers and game grid */}
      <div 
        className="flex flex-row h-full rounded-xl overflow-hidden"
        style={{ height: `${gameArea.height}px` }}
      >
        {/* Lawn mower area */}
        <div 
          className="lawn-mower-lane relative"
          style={{ 
            width: `${lawnMowerWidth}px`,
          }}
        >
          {/* Lawn mowers positioned in their own area */}
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
