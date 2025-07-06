import React from 'react';
import { PowerupType, ActivePowerup } from '../../game/types';
import { Clock } from 'lucide-react';

interface PowerupPanelProps {
  powerups: PowerupType[];
  activePowerups: ActivePowerup[];
  onUsePowerup: (powerup: PowerupType) => void;
  powerupCooldowns: { [key: string]: number };
}

const PowerupPanel: React.FC<PowerupPanelProps> = ({
  powerups,
  activePowerups,
  onUsePowerup,
  powerupCooldowns
}) => {
  const formatTime = (ms: number) => Math.ceil(ms / 1000);

  return (
    <div className="w-full md:w-auto">
      {/* Mobile horizontal layout */}
      <div className="md:hidden">
        <div className="glass-dark rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Power-ups</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {powerups.map(powerup => {
              const isOnCooldown = (powerupCooldowns[powerup.id] || 0) > 0;
              const isActive = activePowerups.some(ap => ap.type.id === powerup.id && ap.isActive);
              
              return (
                <button
                  key={powerup.id}
                  onClick={() => !isOnCooldown && !isActive && onUsePowerup(powerup)}
                  disabled={isOnCooldown || isActive}
                  className={`aspect-square rounded-lg p-2 transition-all duration-200 border-2 ${
                    isActive 
                      ? 'bg-primary/20 border-primary animate-pulse' 
                      : isOnCooldown 
                        ? 'bg-muted/50 border-muted cursor-not-allowed opacity-60' 
                        : 'bg-card/80 border-border hover:border-primary/50 hover:scale-105'
                  }`}
                  title={powerup.description}
                >
                  <div className="text-2xl mb-1">{powerup.icon}</div>
                  <div className="text-xs font-medium text-center leading-tight">
                    {powerup.name.split(' ')[0]}
                  </div>
                  {isOnCooldown && (
                    <div className="text-xs text-destructive font-bold">
                      {formatTime(powerupCooldowns[powerup.id])}s
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop vertical layout */}
      <div className="hidden md:block">
        <div className="glass-dark w-[120px] rounded-xl p-3 space-y-2">
          <div className="text-center bg-accent/20 rounded-lg py-2 mb-2 border border-accent/30">
            <span className="text-xs text-foreground font-bold">POWERS</span>
          </div>
          
          {powerups.map(powerup => {
            const isOnCooldown = (powerupCooldowns[powerup.id] || 0) > 0;
            const isActive = activePowerups.some(ap => ap.type.id === powerup.id && ap.isActive);
            
            return (
              <button
                key={powerup.id}
                onClick={() => !isOnCooldown && !isActive && onUsePowerup(powerup)}
                disabled={isOnCooldown || isActive}
                className={`w-full aspect-square rounded-lg p-2 transition-all duration-200 border-2 ${
                  isActive 
                    ? 'bg-primary/20 border-primary animate-pulse' 
                    : isOnCooldown 
                      ? 'bg-muted/50 border-muted cursor-not-allowed opacity-60' 
                      : 'bg-card/80 border-border hover:border-primary/50 hover:scale-105'
                }`}
                title={powerup.description}
              >
                <div className="text-xl mb-1">{powerup.icon}</div>
                <div className="text-[10px] font-medium text-center leading-tight">
                  {powerup.name.split(' ')[0]}
                </div>
                {isOnCooldown && (
                  <div className="text-xs text-destructive font-bold flex items-center justify-center gap-1">
                    <Clock className="w-2 h-2" />
                    {formatTime(powerupCooldowns[powerup.id])}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PowerupPanel;