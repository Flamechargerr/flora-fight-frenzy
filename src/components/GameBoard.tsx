
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
  
  // Initialize game state
  const { 
    sunAmount, currentWave, waveProgress, 
    sunResources, enemies, plants, projectiles, 
    selectedPlant, setSelectedPlant, score, 
    showWaveMessage, waveMessage, waveCompleted, countdown, 
    gameWon, isGameOver, debugMessage, placePlant, collectSun, gameArea, 
    plantTypes 
  } = useGameState({ 
    onGameOver,
    onLevelComplete,
    level
  });
  
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
