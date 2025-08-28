
import React, { useEffect, useState } from 'react';
import Plant from '../Plant';
import Enemy from '../Enemy';
import SunResource from '../SunResource';
import LawnMower from '../LawnMower';
import GrassBG from '../../assets/grass/GrassBG.svg.tsx';
import Flower1 from '../../assets/grass/Flower1.svg.tsx';
import Flower2 from '../../assets/grass/Flower2.svg.tsx';
import DebugGridOverlay from '../DebugGridOverlay'; // Import the debug overlay
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
  // Add debug state
  const [showDebug, setShowDebug] = useState(true);
  
  // Toggle debug overlay with 'D' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Render grid cells
  const renderGrid = () => {
    const cells = [];
    const cellWidth = 100 / COLS;
    const cellHeight = 100 / ROWS;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        // CRITICAL FIX: Use strict integer equality for occupied check
        const isOccupied = plants.some(p => 
          Math.floor(p.row) === row && Math.floor(p.col) === col
        );
        const isAvailable = !isOccupied && selectedPlant !== null;
        
        // Create checkerboard pattern for improved visibility
        const isEvenCell = (row + col) % 2 === 0;
        
        cells.push(
          <div 
            key={`cell-${row}-${col}`}
            className={`pvz-grid-cell ${isAvailable ? 'can-place' : ''}`}
            style={{ 
              width: `${cellWidth}%`, 
              height: `${cellHeight}%`,
              position: 'absolute',
              left: `${col * cellWidth}%`,
              top: `${row * cellHeight}%`,
              // Enhanced visibility with clear borders and background
              background: isEvenCell 
                ? 'rgba(90, 140, 65, 0.3)' 
                : 'rgba(80, 130, 55, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              // Highlight available placement cells
              boxShadow: isAvailable 
                ? 'inset 0 0 0 4px rgba(72, 187, 120, 0.8)' 
                : 'none',
              zIndex: 5, // Ensure cells are above background but below plants
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              // CRITICAL FIX: Ensure precise click handling
              e.stopPropagation();
              if (isAvailable) {
                console.log(`Placing plant at EXACT row: ${row}, col: ${col}`);
                onPlacePlant(row, col);
              }
            }}
            data-row={row}
            data-col={col}
          >
            {/* Show visual indicator when placing plants with improved visibility */}
            {selectedPlant && !isOccupied && (
              <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center rounded-sm animate-pulse">
                <div className="transform scale-75">
                  <span className="text-3xl">{selectedPlant.icon}</span>
                </div>
              </div>
            )}
            
            {/* Show grid coordinates */}
            <div className="text-[10px] text-white/60 font-bold select-none pointer-events-none">
              {row},{col}
            </div>
            
            {/* Show occupied indicator */}
            {isOccupied && (
              <div className="absolute inset-0 rounded-sm border-2 border-red-500/50"></div>
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
        
        {/* Game grid with authentic PvZ styling */}
        <div 
          className="pvz-game-board garden-grid relative flex-1 overflow-hidden"
          style={{ 
            height: `${gameArea.height}px`
          }}
        >
          {/* Animated grass SVG background */}
          <GrassBG className="absolute inset-0 w-full h-full animate-pulse-slow pointer-events-none" style={{zIndex: 0}} />
          {/* Randomly placed flowers for realism */}
          <Flower1 className="absolute left-[10%] top-[20%] w-8 h-8 animate-float pointer-events-none" />
          <Flower2 className="absolute right-[15%] bottom-[18%] w-10 h-10 animate-float-slow pointer-events-none" />
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
              enemy={{
                ...enemy,
                row: Math.floor(enemy.row), // Ensure integer row
                position: Math.floor(enemy.position) // Ensure integer position
              }}
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
          
          {/* Render the debug grid overlay when enabled */}
          {showDebug && (
            <DebugGridOverlay 
              rows={ROWS} 
              cols={COLS} 
              width={gameArea.width} 
              height={gameArea.height} 
            />
          )}
          
          {/* Debug indicator with more detailed info */}
          <div className="absolute bottom-2 left-2 text-xs bg-black/80 text-white px-2 py-1 rounded z-50">
            Zombies: {enemies.length} | Plants: {plants.length} | Grid: {ROWS}x{COLS} | Debug: {showDebug ? 'ON' : 'OFF'} (Press D)
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
