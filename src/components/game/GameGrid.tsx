
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
        
        // PVZ style alternating row colors - no checkerboard pattern
        const isEvenRow = row % 2 === 0;
        
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
              backgroundColor: isEvenRow ? 'rgba(130, 180, 70, 0.6)' : 'rgba(100, 155, 60, 0.6)',
              borderBottom: '1px solid rgba(75, 50, 30, 0.5)',
              boxShadow: col === 0 ? 'inset 4px 0 6px rgba(0,0,0,0.1)' : 'none'
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

  return (
    <div 
      className="flex-1 rounded-xl relative overflow-hidden"
      style={{ 
        height: `${gameArea.height}px`,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264.888-.14 1.652-1.1 2.862-2.603 3.454-4.3.09-.256.384-.405.57-.405.187 0 .337.086.448.262.11.176.13.406.07.556-.92 2.161-2.544 3.972-4.668 5.3-.246.155-.525.155-.965.156-2.2.05-4.77-.32-7.246-1.04-1.653-.48-3.197-1.12-4.605-1.89-1.408-.77-2.7-1.7-3.726-2.78-.15-.15-.15-.39 0-.54.15-.15.29-.16.52-.05.71.36 1.548.89 2.4 1.36.65.36 1.34.69 2.074.94.115.04.28.02.342-.07.07-.09.05-.22-.01-.33-1.195-2.11-1.99-4.37-2.24-6.65-.11-.91.13-1.8.61-2.59.51-.81 1.35-1.42 2.35-1.65.43-.1.82.04 1.05.31.23.28.3.77.01 1.35-.3.59-.8 1.11-1.48 1.54-1.8 1.13-3.37 3.79-3.37 4.6 0 .258.156.494.413.566 1.23.346 2.498.533 3.89.533 6.71 0 10.59-5.05 10.59-10.204 0-4.29-3.421-7.784-7.613-7.784-4.195 0-7.617 3.494-7.617 7.784 0 2.174.89 4.145 2.316 5.567.146.146.118.338-.065.47-.184.132-.382.104-.528-.042C2.676 11.48 1.5 8.956 1.5 6.203 1.5.803 6.112-1.5 12.03-1.5c5.92 0 10.88 5.213 10.88 11.807 0 6.593-4.96 11.806-10.88 11.806-.18 0-.74 0-1.283-.38l-.003-.002-.002-.002z\' fill=\'%235E3C1A\' fill-rule=\'evenodd\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        backgroundColor: '#7DB347',
        border: '4px solid #5E3C1A',
        borderRadius: '6px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
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
      
      {/* Projectiles with enhanced PVZ-like effects */}
      {projectiles.map((projectile) => (
        <div 
          key={projectile.id}
          className={`absolute h-4 rounded-full z-10 ${
            projectile.type === 'pea' ? 'bg-green-600 w-4' : 
            projectile.type === 'ice' ? 'bg-blue-400 w-4' : 
            projectile.type === 'fire' ? 'bg-red-500 w-5' :
            'bg-yellow-300 w-3'
          }`}
          style={{
            left: projectile.startX + (projectile.endX - projectile.startX) * projectile.progress,
            top: (projectile.row * (gameArea.height / ROWS)) + (gameArea.height / ROWS / 2) - 8,
            boxShadow: projectile.type === 'fire' ? '0 0 15px #ff3821' : 
                      projectile.type === 'ice' ? '0 0 12px #41c7ff' : 
                      projectile.type === 'lightning' ? '0 0 20px #ffee00' :
                      '0 0 5px #5bd942'
          }}
        >
          {/* Enhanced projectile effects like in PVZ */}
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
          
          {projectile.type === 'lightning' && (
            <>
              <div className="absolute inset-0 animate-pulse bg-yellow-200 rounded-full opacity-70 scale-[1.4]" />
              <div className="absolute w-12 h-1 bg-yellow-300 left-[-4px] top-[30%] opacity-80" />
              <div className="absolute w-8 h-1 bg-yellow-200 left-[-2px] top-[60%] opacity-60 rotate-[15deg]" />
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
      
      {/* Sun resources - more like PVZ with pulsing effect */}
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
