
import { memo, useState, useEffect } from 'react';
import PeashooterSVG from '../assets/plants/Peashooter.svg.tsx';
import SunflowerSVG from '../assets/plants/Sunflower.svg.tsx';
import WallNutSVG from '../assets/plants/WallNut.svg.tsx';

interface PlantProps {
  plant: {
    id: string;
    type: {
      id: string;
      name: string;
      color: string;
      icon: string;
      damage: number;
    };
    row: number;
    col: number;
    lastFired: number;
    health?: number;
    maxHealth?: number;
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

const Plant = memo(({ plant, gridDimensions, gameAreaSize }: PlantProps) => {
  const [isRecoil, setIsRecoil] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // COMPLETE FIX: Use absolute cell-based positioning
  // Calculate cell dimensions precisely
  const cellWidth = Math.floor(gameAreaSize.width / gridDimensions.cols);
  const cellHeight = Math.floor(gameAreaSize.height / gridDimensions.rows);
  
  // Force exact integer row and column
  const exactRow = Math.floor(plant.row);
  const exactCol = Math.floor(plant.col);
  
  // Calculate absolute position at center of cell
  const left = exactCol * cellWidth;
  const top = exactRow * cellHeight;
  
  // Use cell size for plant size (slightly smaller than cell)
  const size = Math.min(cellWidth, cellHeight) * 0.75;
  
  // Health percentage for health bar
  const healthPercentage = plant.health && plant.maxHealth 
    ? (plant.health / plant.maxHealth) * 100 
    : 100;
  
  // Monitor plant.lastFired to trigger recoil animation
  useEffect(() => {
    if (plant.lastFired > 0 && 
       (plant.type.id === 'peashooter' || 
        plant.type.id === 'iceshooter' || 
        plant.type.id === 'fireshooter' ||
        plant.type.id === 'repeatershooter' ||
        plant.type.id === 'threepeater')) {
      setIsRecoil(true);
      const timer = setTimeout(() => {
        setIsRecoil(false);
      }, 200);
      return () => clearTimeout(timer);
    }
    
    // Special animation for cherry bomb
    if (plant.type.id === 'cherrybomb' && plant.lastFired > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [plant.lastFired, plant.type.id]);
  
  // Different plant visualization based on type
  let plantContent;
  
  switch (plant.type.id) {
    case 'sunflower':
      plantContent = (
        <div className="w-full h-full flex items-center justify-center">
          <SunflowerSVG style={{ width: '100%', height: '100%' }} />
        </div>
      );
      break;
      
    case 'peashooter':
      plantContent = (
        <div className={`w-full h-full flex items-center justify-center ${isRecoil ? 'recoil' : ''}`}>
          <PeashooterSVG style={{ width: '100%', height: '100%' }} />
        </div>
      );
      break;
      
    case 'wallnut':
      plantContent = (
        <div className="w-full h-full flex items-center justify-center">
          <WallNutSVG style={{ width: '100%', height: '100%' }} />
        </div>
      );
      break;
      
    default:
      plantContent = (
        <div className={`w-full h-full rounded-full bg-${plant.type.color} flex items-center justify-center`}>
          <span className="text-2xl">{plant.type.icon}</span>
        </div>
      );
  }
  
  return (
    <div 
      className="absolute rounded-full shadow-md"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        // Position exactly at the center of the cell
        left: `${left + (cellWidth / 2) - (size / 2)}px`, 
        top: `${top + (cellHeight / 2) - (size / 2)}px`,
        zIndex: 10,
        // Debug outline
        outline: '2px solid rgba(0, 255, 0, 0.7)'
      }}
      data-row={exactRow}
      data-col={exactCol}
    >
      {plantContent}
      
      {/* Health bar */}
      <div className="absolute -top-4 left-0 w-full h-2 bg-gray-800/50 rounded overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-600 to-green-400" 
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      {/* Position indicator for debugging */}
      <div className="absolute -bottom-5 left-0 w-full text-center text-xs bg-black/80 text-white rounded px-1">
        {exactRow},{exactCol}
      </div>
    </div>
  );
});

export default Plant;
