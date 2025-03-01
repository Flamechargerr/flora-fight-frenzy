
import { memo } from 'react';

interface EnemyProps {
  enemy: {
    id: string;
    health: number;
    speed: number;
    row: number;
    position: number;
  };
  gridDimensions: {
    rows: number;
    cols: number;
  };
  gameAreaSize: {
    width: number;
    height: number;
  };
}

const Enemy = memo(({ enemy, gridDimensions, gameAreaSize }: EnemyProps) => {
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  const top = enemy.row * cellHeight + (cellHeight / 2);
  const size = cellHeight * 0.7;
  
  // Health percentage for health bar
  const healthPercentage = (enemy.health / 100) * 100;
  
  return (
    <div 
      className="enemy animate-pulse"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        top: `${top - (size/2)}px`, 
        left: `${enemy.position}px`,
        backgroundColor: '#42A5F5',
        transition: 'left 0.1s linear'
      }}
    >
      <span className="text-2xl">🐞</span>
      
      {/* Health bar */}
      <div className="absolute -bottom-3 left-0 w-full h-1 bg-white/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-200"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
    </div>
  );
});

export default Enemy;
