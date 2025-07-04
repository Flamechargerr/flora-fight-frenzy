
import React from 'react';
import { Sun, Zap, Target, Trophy } from 'lucide-react';

interface GameHeaderProps {
  sunAmount: number;
  currentWave: number;
  waveProgress: number;
  score: number;
  level: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  sunAmount,
  currentWave,
  waveProgress,
  score,
  level,
}) => {
  const estimatedTotalEnemies = 10 * currentWave;
  const progressPercentage = Math.min((waveProgress / estimatedTotalEnemies) * 100, 100);
  
  return (
    <div className="glass mb-4 p-3 sm:p-4 rounded-xl">
      {/* Mobile layout */}
      <div className="block sm:hidden">
        {/* Top row - Sun and Level */}
        <div className="flex items-center justify-between mb-3">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-2 rounded-lg flex items-center shadow-lg border border-yellow-300">
            <Sun className="text-yellow-900 w-4 h-4 mr-2" />
            <span className="font-bold text-yellow-900 text-sm">{sunAmount}</span>
          </div>
          
          <div className="bg-gradient-to-r from-primary to-primary/90 px-3 py-2 rounded-lg flex items-center shadow-lg">
            <Trophy className="text-primary-foreground w-4 h-4 mr-2" />
            <span className="font-bold text-primary-foreground text-sm">L{level}</span>
          </div>
        </div>
        
        {/* Bottom row - Wave progress and Score */}
        <div className="space-y-2">
          <div className="bg-card/80 px-3 py-2 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">Wave {currentWave}/5</span>
              <span className="text-xs text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-destructive via-secondary to-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="bg-card/80 px-3 py-2 rounded-lg border border-border flex items-center justify-center">
            <Target className="text-accent w-4 h-4 mr-2" />
            <span className="font-bold text-foreground text-sm">Score: {score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 rounded-lg flex items-center shadow-lg border border-yellow-300">
            <Sun className="text-yellow-900 w-5 h-5 mr-2" />
            <span className="font-bold text-yellow-900">{sunAmount}</span>
          </div>
          
          <div className="bg-card/80 px-4 py-2 rounded-lg border border-border">
            <div className="flex items-center mb-1">
              <Zap className="text-destructive w-4 h-4 mr-2" />
              <span className="text-sm font-medium text-foreground">Wave {currentWave}/5</span>
            </div>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-destructive via-secondary to-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-2 rounded-lg flex items-center shadow-lg">
            <Trophy className="text-primary-foreground w-4 h-4 mr-2" />
            <span className="font-bold text-primary-foreground">Level {level}</span>
          </div>
          
          <div className="bg-card/80 px-4 py-2 rounded-lg border border-border flex items-center">
            <Target className="text-accent w-4 h-4 mr-2" />
            <span className="font-bold text-foreground">Score: {score.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
