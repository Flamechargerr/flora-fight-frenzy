import React, { memo, useMemo } from 'react';
import type { PlantInstance } from '../game/types';
import { ROWS, COLS } from '../game/constants';

interface PlantProps {
  plant: PlantInstance;
  gameAreaWidth: number;
  gameAreaHeight: number;
  onAction?: (plantId: string) => void;
}

// Performance: Memoize style calculations
const calculatePlantStyle = (plant: PlantInstance, cellWidth: number, cellHeight: number) => {
  const left = plant.col * cellWidth;
  const top = plant.row * cellHeight;
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${cellWidth}px`,
    height: `${cellHeight}px`,
    zIndex: 10 + plant.row, // Layer plants by row for proper depth
  };
};

// Performance: Memoize health bar calculations
const calculateHealthPercentage = (plant: PlantInstance) => {
  const maxHealth = plant.maxHealth || 300;
  const currentHealth = plant.health || maxHealth;
  return Math.max(0, (currentHealth / maxHealth) * 100);
};

const Plant: React.FC<PlantProps> = memo(({ plant, gameAreaWidth, gameAreaHeight, onAction }) => {
  // Performance: Memoize cell dimensions
  const { cellWidth, cellHeight } = useMemo(() => ({
    cellWidth: gameAreaWidth / COLS,
    cellHeight: gameAreaHeight / ROWS,
  }), [gameAreaWidth, gameAreaHeight]);
  
  // Performance: Memoize style object
  const plantStyle = useMemo(
    () => calculatePlantStyle(plant, cellWidth, cellHeight),
    [plant.col, plant.row, cellWidth, cellHeight]
  );
  
  // Performance: Memoize health percentage
  const healthPercentage = useMemo(
    () => calculateHealthPercentage(plant),
    [plant.health, plant.maxHealth]
  );
  
  // Performance: Memoize health bar visibility
  const showHealthBar = useMemo(
    () => healthPercentage < 100 && healthPercentage > 0,
    [healthPercentage]
  );
  
  // Performance: Memoize plant color based on type and health
  const plantColor = useMemo(() => {
    const baseColor = plant.type.color;
    if (healthPercentage < 30) {
      return baseColor.replace('bg-', 'bg-red-');
    } else if (healthPercentage < 60) {
      return baseColor.replace('bg-', 'bg-yellow-');
    }
    return baseColor;
  }, [plant.type.color, healthPercentage]);
  
  // Performance: Memoize animation classes
  const animationClasses = useMemo(() => {
    const classes = ['plant', 'transition-all', 'duration-200'];
    
    if (plant.type.id === 'sunflower') {
      classes.push('animate-float');
    } else if (plant.type.id === 'peashooter' || plant.type.id === 'iceshooter' || plant.type.id === 'fireshooter') {
      classes.push('hover:animate-pulse');
    }
    
    return classes.join(' ');
  }, [plant.type.id]);
  
  // Performance: Memoize click handler to prevent recreation
  const handleClick = useMemo(() => {
    if (!onAction) return undefined;
    return () => onAction(plant.id);
  }, [onAction, plant.id]);

  return (
    <div
      className={`${animationClasses} ${plantColor} absolute rounded-full shadow-md flex items-center justify-center cursor-pointer transform hover:scale-110 active:scale-95`}
      style={plantStyle}
      onClick={handleClick}
      title={`${plant.type.name} (Health: ${Math.round(plant.health || 0)})`}
    >
      {/* Plant Icon */}
      <div className="text-2xl relative z-10 select-none">
        {plant.type.icon}
      </div>
      
      {/* Health Bar */}
      {showHealthBar && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-red-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300 rounded-full"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      )}
      
      {/* Glow effect for special plants */}
      {(plant.type.id === 'fireshooter') && (
        <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-20" />
      )}
      {(plant.type.id === 'iceshooter') && (
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-20" />
      )}
    </div>
  );
});

Plant.displayName = 'Plant';

export default Plant;