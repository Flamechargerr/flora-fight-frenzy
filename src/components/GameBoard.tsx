
import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import GameHeader from './game/GameHeader';
import GameGrid from './game/GameGrid';
import PlantSelectionPanel from './game/PlantSelectionPanel';
import GameMessages from './game/GameMessages';

interface GameBoardProps {
  onGameOver: () => void;
  onLevelComplete?: (score: number) => void;
  level?: number;
}

const GameBoard = ({ onGameOver, onLevelComplete = () => {}, level = 1 }: GameBoardProps) => {
  const [containerHeight, setContainerHeight] = useState(500);
  const [lawnMowers, setLawnMowers] = useState<Array<{row: number; activated: boolean; position: number}>>([]);
  
  // Initialize game state
  const { 
    sunAmount, currentWave, waveProgress, 
    sunResources, enemies, plants, projectiles, 
    selectedPlant, setSelectedPlant, score, 
    showWaveMessage, waveMessage, waveCompleted, countdown, 
    gameWon, isGameOver, debugMessage, placePlant, collectSun, gameArea, 
    plantTypes, ROWS
  } = useGameState({ 
    onGameOver,
    onLevelComplete,
    level
  });
  
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
  
  // Check for zombies that need to trigger lawn mowers
  useEffect(() => {
    if (enemies.length > 0) {
      const newLawnMowers = [...lawnMowers];
      let mowerActivated = false;
      
      enemies.forEach(enemy => {
        // If enemy is near the edge and there's an available mower in that row
        const mowerIndex = newLawnMowers.findIndex(
          m => m.row === enemy.row && !m.activated && enemy.position <= 50
        );
        
        if (mowerIndex !== -1) {
          newLawnMowers[mowerIndex].activated = true;
          mowerActivated = true;
        }
      });
      
      if (mowerActivated) {
        setLawnMowers(newLawnMowers);
      }
    }
  }, [enemies, lawnMowers]);
  
  // Update lawn mower positions when activated
  useEffect(() => {
    const activeMowers = lawnMowers.filter(m => m.activated);
    
    if (activeMowers.length > 0) {
      const interval = setInterval(() => {
        setLawnMowers(prev => 
          prev.map(mower => {
            if (mower.activated && mower.position < gameArea.width + 100) {
              return { ...mower, position: mower.position + 20 };
            }
            return mower;
          })
        );
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [lawnMowers, gameArea.width]);
  
  // Handle level win condition
  useEffect(() => {
    if (gameWon && onLevelComplete) {
      onLevelComplete(score);
    }
  }, [gameWon, score, onLevelComplete]);
  
  // Set container height based on window size
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      const minHeight = 500;
      const maxHeight = 700;
      
      const calculatedHeight = Math.min(maxHeight, Math.max(minHeight, viewportHeight * 0.6));
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
    <div className="w-full flex flex-col">
      {/* Game Header with resources display */}
      <GameHeader 
        sunAmount={sunAmount} 
        currentWave={currentWave} 
        waveProgress={waveProgress} 
        score={score}
        level={level}
      />
      
      {/* Game container with grid and panel */}
      <div 
        className="flex flex-col md:flex-row gap-4 mb-4"
        style={{ minHeight: `${containerHeight}px` }}
      >
        {/* Plant selection panel - moved to left side */}
        <PlantSelectionPanel 
          plantTypes={plantTypes}
          selectedPlant={selectedPlant}
          onSelectPlant={setSelectedPlant}
          sunAmount={sunAmount}
          containerHeight={containerHeight}
        />
        
        {/* Main game grid */}
        <GameGrid 
          gameArea={{ ...gameArea, height: containerHeight }}
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
      
      {/* Wave announcements and countdown */}
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
  );
};

export default GameBoard;
