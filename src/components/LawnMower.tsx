
import React from 'react';
import LawnMowerSVG from '../assets/plants/LawnMower.svg.tsx';

interface LawnMowerProps {
  row: number;
  activated: boolean;
  position: number;
  gameAreaSize: {
    width: number;
    height: number;
  };
  gridDimensions: {
    rows: number;
    cols: number;
  };
  lawnMowerAreaWidth?: number;
}

const LawnMower: React.FC<LawnMowerProps> = ({
  row,
  activated,
  position,
  gameAreaSize,
  gridDimensions,
  lawnMowerAreaWidth = 0
}) => {
  const cellHeight = gameAreaSize.height / gridDimensions.rows;
  const top = row * cellHeight + (cellHeight / 2);
  const size = Math.min(cellHeight * 0.7, lawnMowerAreaWidth * 0.8);
  
  return (
    <div
      className={`pvz-lawnmower ${activated ? 'activated' : ''}`}
      style={{
        position: 'absolute',
        left: `${lawnMowerAreaWidth / 2 - size / 2}px`,
        top: `${top - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 10,
        transition: 'left 0.2s',
      }}
    >
      <LawnMowerSVG style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LawnMower;
