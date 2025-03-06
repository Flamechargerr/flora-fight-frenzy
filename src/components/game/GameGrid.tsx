
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
            }}
            onClick={() => isAvailable && onPlacePlant(row, col)}
          >
            {/* Show visual indicator when placing plants */}
            {selectedPlant && !isOccupied && (
              <div className="absolute inset-0 bg-garden-light/30 flex items-center justify-center rounded-md">
                <span className="text-2xl opacity-50">{selectedPlant.icon}</span>
              </div>
            )}
          </div>
        );
      }
    }
    
    return cells;
  };

  return (
    <div 
      className="flex-1 glass rounded-xl relative overflow-hidden"
      style={{ height: `${gameArea.height}px` }}
    >
      {/* Grid background - grass texture */}
      <div className="absolute inset-0 bg-garden-light/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjZGU5YzYiPjwvcmVjdD4KPC9zdmc+')] opacity-50" />
      
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
      
      {/* Lawn Mowers */}
      {lawnMowers.map((mower, index) => (
        <LawnMower
          key={`mower-${index}`}
          row={mower.row}
          activated={mower.activated}
          gameAreaSize={gameArea}
          gridDimensions={{ rows: ROWS, cols: COLS }}
          position={mower.position}
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
        Zombies: {enemies.length} | Active Mowers: {lawnMowers.filter(m => m.activated).length} | Status: {debugMessage}
      </div>
    </div>
  );
};

export default GameGrid;
