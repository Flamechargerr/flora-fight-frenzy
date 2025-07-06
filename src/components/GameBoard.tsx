
import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import GameHeader from './game/GameHeader';
import GameGrid from './game/GameGrid';
import PlantSelectionPanel from './game/PlantSelectionPanel';
import PowerupPanel from './game/PowerupPanel';
import GameMessages from './game/GameMessages';
import { POWERUP_TYPES } from '../game/constants';
import { PowerupType, ActivePowerup } from '../game/types';

interface GameBoardProps {
  onGameOver: () => void;
  onLevelComplete?: (score: number) => void;
  level?: number;
}

const GameBoard = ({ onGameOver, onLevelComplete = () => {}, level = 1 }: GameBoardProps) => {
  const [containerHeight, setContainerHeight] = useState(500);
  const [lawnMowers, setLawnMowers] = useState<Array<{row: number; activated: boolean; position: number}>>([]);
  const [activePowerups, setActivePowerups] = useState<ActivePowerup[]>([]);
  const [powerupCooldowns, setPowerupCooldowns] = useState<{ [key: string]: number }>({});
  
  // Initialize game state
  const { 
    sunAmount, currentWave, waveProgress, 
    sunResources, enemies, plants, projectiles, 
    selectedPlant, setSelectedPlant, score, 
    showWaveMessage, waveMessage, waveCompleted, countdown, 
    gameWon, isGameOver, debugMessage, placePlant, collectSun, gameArea, 
    plantTypes, removeEnemy
  } = useGameState({ 
    onGameOver,
    onLevelComplete,
    level
  });
  
  // Number of rows in the game grid
  const ROWS = 5;
  
  // Initialize lawn mowers
  useEffect(() => {
    const initialLawnMowers = [];
    for (let row = 0; row < ROWS; row++) {
      initialLawnMowers.push({
        row,
        activated: false,
        position: 20 // Position near the left edge
      });
    }
    setLawnMowers(initialLawnMowers);
  }, [ROWS]);
  
  // Handle zombie collisions with lawn mowers
  const handleZombieCollisions = useCallback((mower, enemiesList) => {
    const zombiesInPath = enemiesList.filter(
      enemy => enemy.row === mower.row && 
             enemy.position >= mower.position && 
             enemy.position <= mower.position + 60
    );
    
    if (zombiesInPath.length > 0) {
      // Remove zombies hit by lawn mower
      const zombieIds = zombiesInPath.map(z => z.id);
      console.log(`Lawn mower in row ${mower.row} hit zombies:`, zombieIds);
      
      // Remove each zombie that was hit
      zombieIds.forEach(id => removeEnemy(id));
    }
    
    return zombiesInPath.length > 0;
  }, [removeEnemy]);
  
  // Check for zombies that need to trigger lawn mowers
  useEffect(() => {
    if (enemies.length > 0) {
      const newLawnMowers = [...lawnMowers];
      let mowerActivated = false;
      
      enemies.forEach(enemy => {
        // If enemy is near the edge and there's an available mower in that row
        const mowerIndex = newLawnMowers.findIndex(
          m => m.row === enemy.row && !m.activated && enemy.position <= 60
        );
        
        if (mowerIndex !== -1) {
          console.log(`Activating mower in row ${enemy.row} for enemy at position ${enemy.position}`);
          newLawnMowers[mowerIndex].activated = true;
          mowerActivated = true;
        }
      });
      
      if (mowerActivated) {
        setLawnMowers(newLawnMowers);
      }
    }
  }, [enemies, lawnMowers]);
  
  // Update lawn mower positions when activated and handle zombie collisions
  useEffect(() => {
    const activeMowers = lawnMowers.filter(m => m.activated);
    
    if (activeMowers.length > 0) {
      const interval = setInterval(() => {
        setLawnMowers(prev => 
          prev.map(mower => {
            if (mower.activated && mower.position < gameArea.width + 100) {
              // Move the mower
              const updatedMower = { ...mower, position: mower.position + 20 };
              
              // Check for collisions with zombies
              handleZombieCollisions(updatedMower, enemies);
              
              return updatedMower;
            }
            return mower;
          })
        );
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [lawnMowers, gameArea.width, enemies, handleZombieCollisions]);
  
  // Handle powerup usage
  const handleUsePowerup = useCallback((powerup: PowerupType) => {
    const now = Date.now();
    const newActivePowerup: ActivePowerup = {
      id: `${powerup.id}-${now}`,
      type: powerup,
      startTime: now,
      endTime: now + powerup.duration,
      isActive: true
    };

    setActivePowerups(prev => [...prev, newActivePowerup]);
    setPowerupCooldowns(prev => ({ ...prev, [powerup.id]: powerup.cooldown }));

    // Apply powerup effects
    if (powerup.effectType === 'lightning') {
      enemies.forEach(enemy => removeEnemy(enemy.id));
    } else if (powerup.effectType === 'freeze') {
      // Freeze logic would go here - for now just slow them
      console.log('Freezing all zombies');
    } else if (powerup.effectType === 'burn') {
      console.log('Burning all zombies');
    }

    // Remove powerup when duration expires
    setTimeout(() => {
      setActivePowerups(prev => prev.filter(p => p.id !== newActivePowerup.id));
    }, powerup.duration);
  }, [enemies, removeEnemy]);

  // Update powerup cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerupCooldowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] = Math.max(0, updated[key] - 100);
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);
  
  // Set container height based on window size with mobile optimization
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      const minHeight = window.innerWidth < 768 ? 400 : 500; // Smaller min height on mobile
      const maxHeight = window.innerWidth < 768 ? 600 : 700; // Smaller max height on mobile
      
      const calculatedHeight = Math.min(maxHeight, Math.max(minHeight, viewportHeight * 0.5));
      setContainerHeight(calculatedHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  // Function to handle restart
  const handleRestart = () => {
    onGameOver();
  };
  
  return (
    <div className="w-full flex flex-col lg:flex-row max-w-[1920px] mx-auto gap-4">
      {/* Left Panel - Desktop only */}
      <div className="hidden lg:flex lg:flex-col lg:w-[160px] flex-shrink-0 gap-4">
        <PlantSelectionPanel 
          plantTypes={plantTypes}
          selectedPlant={selectedPlant}
          onSelectPlant={setSelectedPlant}
          sunAmount={sunAmount}
          containerHeight={containerHeight}
        />
        <PowerupPanel 
          powerups={POWERUP_TYPES}
          activePowerups={activePowerups}
          onUsePowerup={handleUsePowerup}
          powerupCooldowns={powerupCooldowns}
        />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Game Header */}
        <GameHeader 
          sunAmount={sunAmount} 
          currentWave={currentWave} 
          waveProgress={waveProgress} 
          score={score}
          level={level}
        />
        
        {/* Mobile panels */}
        <div className="lg:hidden">
          <PlantSelectionPanel 
            plantTypes={plantTypes}
            selectedPlant={selectedPlant}
            onSelectPlant={setSelectedPlant}
            sunAmount={sunAmount}
            containerHeight={containerHeight}
          />
          <PowerupPanel 
            powerups={POWERUP_TYPES}
            activePowerups={activePowerups}
            onUsePowerup={handleUsePowerup}
            powerupCooldowns={powerupCooldowns}
          />
        </div>
        
        {/* Game Grid Container */}
        <div className="flex-1 min-h-0">
          <div 
            className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-border/50"
            style={{ 
              minHeight: `${Math.min(containerHeight, window.innerHeight * 0.4)}px`,
              maxHeight: `${containerHeight}px`
            }}
          >
            <GameGrid 
              gameArea={{ 
                ...gameArea, 
                height: Math.min(containerHeight, window.innerHeight * 0.5)
              }}
              plants={plants}
              enemies={enemies}
              projectiles={projectiles}
              sunResources={sunResources}
              selectedPlant={selectedPlant}
              debugMessage={debugMessage}
              onPlacePlant={placePlant}
              onCollectSun={collectSun}
              lawnMowers={lawnMowers}
            />
          </div>
        </div>
        
        {/* Game Messages */}
        <GameMessages 
          showWaveMessage={showWaveMessage}
          waveMessage={waveMessage}
          waveCompleted={waveCompleted}
          countdown={countdown}
          gameWon={gameWon}
          isGameOver={isGameOver}
          currentWave={currentWave}
          score={score}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
};

export default GameBoard;
