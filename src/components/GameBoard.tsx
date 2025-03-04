
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import PlantSelectionPanel from './game/PlantSelectionPanel';
import GameHeader from './game/GameHeader';
import GameGrid from './game/GameGrid';
import GameMessages from './game/GameMessages';

interface GameBoardProps {
  onGameOver: () => void;
}

const GameBoard = ({ onGameOver }: GameBoardProps) => {
  const {
    sunAmount,
    currentWave,
    waveProgress,
    sunResources,
    enemies,
    plants,
    projectiles,
    selectedPlant,
    setSelectedPlant,
    isGameOver,
    score,
    showWaveMessage,
    waveMessage,
    waveCompleted,
    countdown,
    gameWon,
    debugMessage,
    enemiesSpawned,
    enemiesLeftInWave,
    placePlant,
    collectSun,
    gameArea,
    plantTypes,
  } = useGameState({ onGameOver });

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Game UI Header */}
      <GameHeader
        sunAmount={sunAmount}
        currentWave={currentWave}
        waveProgress={enemiesSpawned.current}
        totalEnemies={enemiesLeftInWave.current}
        score={score}
      />
      
      {/* Game Board */}
      <div className="relative flex-1 flex">
        {/* Plant Selection */}
        <PlantSelectionPanel
          plantTypes={plantTypes}
          selectedPlant={selectedPlant}
          sunAmount={sunAmount}
          onSelectPlant={setSelectedPlant}
        />
        
        {/* Game Grid */}
        <div className="relative flex-1">
          <GameGrid
            gameArea={gameArea}
            plants={plants}
            enemies={enemies}
            projectiles={projectiles}
            sunResources={sunResources}
            selectedPlant={selectedPlant}
            debugMessage={debugMessage}
            onPlacePlant={placePlant}
            onCollectSun={collectSun}
          />
          
          {/* Game Messages & Overlays */}
          <GameMessages
            showWaveMessage={showWaveMessage}
            waveMessage={waveMessage}
            waveCompleted={waveCompleted}
            countdown={countdown}
            currentWave={currentWave}
            gameWon={gameWon}
            isGameOver={isGameOver}
            score={score}
            onRestart={handleRestart}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
