import React, { memo, useMemo, useRef, useEffect } from 'react';
import type { PlantInstance, EnemyType, ProjectileType, SunResource, PlantType, GameAreaDimensions } from '../game/types';
import PlantOptimized from './PlantOptimized';
import EnemyOptimized from './EnemyOptimized';
import SunResource from './SunResource';
import LawnMower from './LawnMower';
import { ROWS, COLS } from '../game/constants';
import { useMobileTouch } from '../hooks/useMobileTouch';

interface MobileGameGridProps {
  gameArea: GameAreaDimensions;
  plants: PlantInstance[];
  enemies: EnemyType[];
  projectiles: ProjectileType[];
  sunResources: SunResource[];
  selectedPlant: PlantType | null;
  debugMessage?: string;
  onPlacePlant: (row: number, col: number) => void;
  onCollectSun: (id: string) => void;
  lawnMowers?: Array<{row: number; activated: boolean; position: number}>;
}

// Performance: Memoized grid cell component
const GridCell = memo<{
  row: number;
  col: number;
  isOccupied: boolean;
  canPlace: boolean;
  onPlace: (row: number, col: number) => void;
  cellWidth: number;
  cellHeight: number;
  isMobile: boolean;
}>(({ row, col, isOccupied, canPlace, onPlace, cellWidth, cellHeight, isMobile }) => {
  const handleClick = () => {
    if (canPlace && !isOccupied) {
      onPlace(row, col);
    }
  };

  const cellStyle = useMemo(() => ({
    left: `${col * cellWidth}px`,
    top: `${row * cellHeight}px`,
    width: `${cellWidth}px`,
    height: `${cellHeight}px`,
  }), [col, row, cellWidth, cellHeight]);

  const cellClasses = useMemo(() => {
    const baseClasses = ['grid-cell', 'absolute', 'border', 'transition-all', 'duration-200'];
    
    if (canPlace && !isOccupied) {
      baseClasses.push(
        'grid-cell-available',
        'cursor-pointer',
        'border-green-300',
        'bg-green-100/30',
        'hover:bg-green-200/50',
        'active:bg-green-300/70'
      );
      if (isMobile) {
        baseClasses.push('min-h-[60px]'); // Larger touch targets on mobile
      }
    } else {
      baseClasses.push(
        'border-gray-200',
        'bg-gray-50/20'
      );
    }
    
    return baseClasses.join(' ');
  }, [canPlace, isOccupied, isMobile]);

  return (
    <div
      className={cellClasses}
      style={cellStyle}
      onClick={handleClick}
      role={canPlace ? 'button' : undefined}
      tabIndex={canPlace ? 0 : undefined}
      aria-label={canPlace ? `Place plant at row ${row + 1}, column ${col + 1}` : undefined}
    >
      {/* Visual indicator for mobile users */}
      {isMobile && canPlace && !isOccupied && (
        <div className="absolute inset-2 border-2 border-dashed border-green-400 rounded-lg opacity-60" />
      )}
    </div>
  );
});

GridCell.displayName = 'GridCell';

const MobileGameGrid: React.FC<MobileGameGridProps> = memo(({
  gameArea,
  plants,
  enemies,
  projectiles,
  sunResources,
  selectedPlant,
  debugMessage,
  onPlacePlant,
  onCollectSun,
  lawnMowers = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Performance: Memoize cell dimensions
  const { cellWidth, cellHeight } = useMemo(() => ({
    cellWidth: gameArea.width / COLS,
    cellHeight: gameArea.height / ROWS,
  }), [gameArea.width, gameArea.height]);
  
  // Performance: Memoize occupied positions
  const occupiedPositions = useMemo(() => {
    const positions = new Set<string>();
    plants.forEach(plant => {
      positions.add(`${plant.row}-${plant.col}`);
    });
    return positions;
  }, [plants]);
  
  // Mobile touch handling
  const { attachTouchHandlers, isMobile } = useMobileTouch({
    onTap: (x, y) => {
      // Convert touch coordinates to grid position
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);
      
      // Check if tap is on a sun resource first
      const touchedSun = sunResources.find(sun => {
        const sunX = sun.x - 25; // sun width/2
        const sunY = sun.y - 25; // sun height/2
        return x >= sunX && x <= sunX + 50 && y >= sunY && y <= sunY + 50;
      });
      
      if (touchedSun) {
        onCollectSun(touchedSun.id);
        return;
      }
      
      // Otherwise try to place plant
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        onPlacePlant(row, col);
      }
    },
    onLongPress: (x, y) => {
      // Long press could show plant info or cancel selection
      if (selectedPlant) {
        // Cancel plant selection on long press
        // This would need to be passed as a prop or handled differently
        console.log('Long press detected - could cancel selection');
      }
    }
  });
  
  // Attach touch handlers
  useEffect(() => {
    if (containerRef.current && isMobile) {
      return attachTouchHandlers(containerRef.current);
    }
  }, [attachTouchHandlers, isMobile]);
  
  // Performance: Memoize grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const key = `cell-${row}-${col}`;
        const isOccupied = occupiedPositions.has(`${row}-${col}`);
        const canPlace = selectedPlant !== null;
        
        cells.push(
          <GridCell
            key={key}
            row={row}
            col={col}
            isOccupied={isOccupied}
            canPlace={canPlace}
            onPlace={onPlacePlant}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            isMobile={isMobile}
          />
        );
      }
    }
    return cells;
  }, [occupiedPositions, selectedPlant, onPlacePlant, cellWidth, cellHeight, isMobile]);
  
  // Performance: Memoize projectile elements
  const projectileElements = useMemo(() => 
    projectiles.map(projectile => (
      <div
        key={projectile.id}
        className="absolute w-2 h-2 bg-green-400 rounded-full shadow-sm animate-pulse"
        style={{
          left: `${projectile.x}px`,
          top: `${projectile.y}px`,
          zIndex: 30,
        }}
      />
    )),
    [projectiles]
  );
  
  // Performance: Memoize container style
  const containerStyle = useMemo(() => ({
    width: `${gameArea.width}px`,
    height: `${gameArea.height}px`,
  }), [gameArea.width, gameArea.height]);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-garden/20">
      {/* Game Grid Container */}
      <div
        ref={containerRef}
        className={`garden-grid relative bg-gradient-to-b from-green-200 to-green-300 ${
          isMobile ? 'touch-manipulation' : ''
        }`}
        style={containerStyle}
      >
        {/* Grid Cells */}
        {gridCells}
        
        {/* Lawn Mowers */}
        {lawnMowers.map((mower, index) => (
          <LawnMower
            key={`mower-${index}`}
            row={mower.row}
            position={mower.position}
            activated={mower.activated}
            gameAreaHeight={gameArea.height}
          />
        ))}
        
        {/* Plants */}
        {plants.map(plant => (
          <PlantOptimized
            key={plant.id}
            plant={plant}
            gameAreaWidth={gameArea.width}
            gameAreaHeight={gameArea.height}
          />
        ))}
        
        {/* Enemies */}
        {enemies.map(enemy => (
          <EnemyOptimized
            key={enemy.id}
            enemy={enemy}
            gameAreaWidth={gameArea.width}
            gameAreaHeight={gameArea.height}
          />
        ))}
        
        {/* Projectiles */}
        {projectileElements}
        
        {/* Sun Resources */}
        {sunResources.map(sun => (
          <SunResource
            key={sun.id}
            id={sun.id}
            x={sun.x}
            y={sun.y}
            onCollect={onCollectSun}
            isMobile={isMobile}
          />
        ))}
      </div>
      
      {/* Mobile Instructions */}
      {isMobile && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-40">
          {selectedPlant ? `Tap to place ${selectedPlant.name}` : 'Select a plant to begin'}
        </div>
      )}
      
      {/* Debug Message */}
      {debugMessage && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded text-center z-40">
          {debugMessage}
        </div>
      )}
    </div>
  );
});

MobileGameGrid.displayName = 'MobileGameGrid';

export default MobileGameGrid;