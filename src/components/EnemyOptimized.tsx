import React, { memo, useMemo } from 'react';
import type { EnemyType } from '../game/types';
import { ROWS } from '../game/constants';

interface EnemyProps {
  enemy: EnemyType;
  gameAreaWidth: number;
  gameAreaHeight: number;
}

// Performance: Memoize enemy style calculations
const calculateEnemyStyle = (enemy: EnemyType, gameAreaHeight: number) => {
  const rowHeight = gameAreaHeight / ROWS;
  const top = enemy.row * rowHeight;
  
  return {
    left: `${enemy.position}px`,
    top: `${top}px`,
    width: '40px',
    height: '40px',
    zIndex: 20 + enemy.row, // Ensure enemies are above plants
    transform: enemy.isEating ? 'scale(1.1)' : 'scale(1)',
  };
};

// Performance: Memoize health percentage calculation
const calculateHealthPercentage = (enemy: EnemyType) => {
  const maxHealth = enemy.maxHealth || enemy.health || 100;
  const currentHealth = enemy.health || maxHealth;
  return Math.max(0, (currentHealth / maxHealth) * 100);
};

// Performance: Memoize enemy type styling
const getEnemyTypeStyle = (type: string, healthPercentage: number) => {
  const baseClasses = ['enemy', 'absolute', 'rounded-full', 'flex', 'items-center', 'justify-center', 'shadow-lg', 'transition-all', 'duration-200'];
  
  // Add type-specific styling
  switch (type) {
    case 'basic':
      baseClasses.push('bg-gray-600');
      break;
    case 'cone':
      baseClasses.push('bg-orange-600');
      break;
    case 'bucket':
      baseClasses.push('bg-gray-800');
      break;
    case 'door':
      baseClasses.push('bg-red-800');
      break;
    default:
      baseClasses.push('bg-gray-600');
  }
  
  // Add health-based styling
  if (healthPercentage < 30) {
    baseClasses.push('animate-shake');
  }
  
  return baseClasses.join(' ');
};

// Performance: Memoize enemy icon based on type and state
const getEnemyIcon = (type: string, isEating: boolean) => {
  if (isEating) {
    return '😋'; // Eating animation
  }
  
  switch (type) {
    case 'basic':
      return '🧟';
    case 'cone':
      return '🧟‍♂️';
    case 'bucket':
      return '🧟‍♀️';
    case 'door':
      return '🧟';
    default:
      return '🧟';
  }
};

const Enemy: React.FC<EnemyProps> = memo(({ enemy, gameAreaWidth, gameAreaHeight }) => {
  // Performance: Memoize style calculations
  const enemyStyle = useMemo(
    () => calculateEnemyStyle(enemy, gameAreaHeight),
    [enemy.position, enemy.row, enemy.isEating, gameAreaHeight]
  );
  
  // Performance: Memoize health percentage
  const healthPercentage = useMemo(
    () => calculateHealthPercentage(enemy),
    [enemy.health, enemy.maxHealth]
  );
  
  // Performance: Memoize class names
  const enemyClasses = useMemo(
    () => getEnemyTypeStyle(enemy.type, healthPercentage),
    [enemy.type, healthPercentage]
  );
  
  // Performance: Memoize enemy icon
  const enemyIcon = useMemo(
    () => getEnemyIcon(enemy.type, enemy.isEating || false),
    [enemy.type, enemy.isEating]
  );
  
  // Performance: Memoize health bar visibility
  const showHealthBar = useMemo(
    () => healthPercentage < 100 && healthPercentage > 0,
    [healthPercentage]
  );
  
  // Performance: Memoize animation classes
  const animationClasses = useMemo(() => {
    const classes = [];
    
    if (enemy.isEating) {
      classes.push('animate-ping');
    } else {
      classes.push('animate-float');
    }
    
    return classes.join(' ');
  }, [enemy.isEating]);

  return (
    <div
      className={`${enemyClasses} ${animationClasses}`}
      style={enemyStyle}
      title={`${enemy.type} Zombie (Health: ${Math.round(enemy.health || 0)})`}
    >
      {/* Enemy Icon */}
      <div className="text-2xl relative z-10 select-none">
        {enemyIcon}
      </div>
      
      {/* Health Bar */}
      {showHealthBar && (
        <div className="absolute -top-3 left-0 right-0 h-1 bg-red-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-300 rounded-full"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      )}
      
      {/* Eating Effect */}
      {enemy.isEating && (
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-30" />
      )}
      
      {/* Damage Effect */}
      {healthPercentage < 50 && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          {healthPercentage < 25 && (
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />
          )}
        </>
      )}
    </div>
  );
});

Enemy.displayName = 'Enemy';

export default Enemy;