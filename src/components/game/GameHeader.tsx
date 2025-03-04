
import React from 'react';
import { Sun } from 'lucide-react';

interface GameHeaderProps {
  sunAmount: number;
  currentWave: number;
  waveProgress: number;
  totalEnemies: number;
  score: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  sunAmount,
  currentWave,
  waveProgress,
  totalEnemies,
  score,
}) => {
  return (
    <div className="glass mb-4 p-3 rounded-xl flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-garden-light/50 px-4 py-2 rounded-lg flex items-center mr-4">
          <Sun className="text-yellow-400 w-5 h-5 mr-2" />
          <span className="font-bold">{sunAmount}</span>
        </div>
        
        <div className="bg-garden-light/50 px-4 py-2 rounded-lg">
          <span className="text-sm">Wave {currentWave}/5</span>
          <div className="w-32 h-2 bg-white/50 rounded-full mt-1">
            <div 
              className="h-full bg-garden rounded-full transition-all duration-200"
              style={{ width: `${(waveProgress / totalEnemies) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-garden-light/50 px-4 py-2 rounded-lg">
        <span className="font-bold">Score: {score}</span>
      </div>
    </div>
  );
};

export default GameHeader;
