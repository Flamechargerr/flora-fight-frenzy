import { useState, useRef, useCallback } from 'react';
import { EnemyType, WaveConfigMap } from '../types';
import { createEnemy } from '../utils/enemyUtils';
import { getWaveMessage } from '../utils/waveUtils';

interface UseWaveManagementProps {
  waveConfig: WaveConfigMap;
  gameAreaWidth: number;
  setEnemies: React.Dispatch<React.SetStateAction<EnemyType[]>>;
  setWaveMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowWaveMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setDebugMessage: React.Dispatch<React.SetStateAction<string>>;
  setWaveCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setCurrentWave: React.Dispatch<React.SetStateAction<number>>;
  setWaveProgress: React.Dispatch<React.SetStateAction<number>>;
  setGameWon: React.Dispatch<React.SetStateAction<boolean>>;
  currentWave: number;
}

export const useWaveManagement = ({
  waveConfig,
  gameAreaWidth,
  setEnemies,
  setWaveMessage,
  setShowWaveMessage,
  setDebugMessage,
  setWaveCompleted,
  setCountdown,
  setScore,
  setCurrentWave,
  setWaveProgress,
  setGameWon,
  currentWave
}: UseWaveManagementProps) => {
  const enemiesLeftInWave = useRef(waveConfig[1].enemies);
  const enemiesSpawned = useRef(0);
  const enemySpawnTimer = useRef<NodeJS.Timeout | null>(null);
  const gameStarted = useRef(false);
  const activeEnemies = useRef(0);

  // Show wave announcement
  const showWaveAnnouncement = useCallback((waveNumber: number) => {
    const message = getWaveMessage(waveNumber);
    
    setWaveMessage(message);
    setShowWaveMessage(true);
    setDebugMessage(`Announcing wave ${waveNumber}`);
    
    setTimeout(() => {
      setShowWaveMessage(false);
      startWave(waveNumber);
    }, 3000);
  }, [setWaveMessage, setShowWaveMessage, setDebugMessage]);

  // Spawn a new enemy
  const spawnNewEnemy = useCallback((waveSettings: any) => {
    const newEnemy = createEnemy(waveSettings, gameAreaWidth);
    
    // CRITICAL FIX: Validate and ensure the enemy has an exact integer row before adding to state
    const validatedEnemy = {
      ...newEnemy,
      row: Math.floor(newEnemy.row), // Force integer row
      position: Math.floor(newEnemy.position) // Force integer position
    };
    
    // Additional validation - ensure row is only one of the fixed values
    if (validatedEnemy.row < 0 || validatedEnemy.row > 4) {
      console.error(`Invalid row value detected: ${validatedEnemy.row}. Correcting to valid range.`);
      validatedEnemy.row = Math.min(4, Math.max(0, Math.floor(validatedEnemy.row)));
    }
    
    // Log for debugging
    console.log(`Spawning zombie at FIXED row: ${validatedEnemy.row}`);
    
    setEnemies(prev => [...prev, validatedEnemy]);
    enemiesSpawned.current++;
    activeEnemies.current++;
    setWaveProgress(enemiesSpawned.current);
    setDebugMessage(`Spawned enemy ${enemiesSpawned.current}/${waveSettings.enemies}, row: ${validatedEnemy.row}, active: ${activeEnemies.current}`);
  }, [gameAreaWidth, setEnemies, setWaveProgress, setDebugMessage]);

  // Start a wave
  const startWave = useCallback((waveNumber: number) => {
    console.log(`Starting wave ${waveNumber}`);
    setCurrentWave(waveNumber);
    const waveSettings = waveConfig[waveNumber as keyof typeof waveConfig];
    enemiesLeftInWave.current = waveSettings.enemies;
    enemiesSpawned.current = 0;
    activeEnemies.current = 0;
    setWaveProgress(0);
    setWaveCompleted(false);
    setDebugMessage(`Wave ${waveNumber} started. Spawning enemies...`);
    
    // Clear any existing timers
    if (enemySpawnTimer.current) {
      clearInterval(enemySpawnTimer.current);
      enemySpawnTimer.current = null;
    }
    
    // Spawn first enemy immediately
    spawnNewEnemy(waveSettings);
    
    // Then set up recurring spawns with the interval from wave config
    const spawnInterval = waveSettings.interval || 5000; // Use wave interval or default to 5000ms
    
    enemySpawnTimer.current = setInterval(() => {
      if (enemiesSpawned.current < waveSettings.enemies && gameStarted.current) {
        spawnNewEnemy(waveSettings);
        
        // Check if we've spawned all enemies
        if (enemiesSpawned.current >= waveSettings.enemies) {
          // Stop spawning when all enemies for the wave have been spawned
          if (enemySpawnTimer.current) {
            clearInterval(enemySpawnTimer.current);
            enemySpawnTimer.current = null;
            setDebugMessage(`All enemies for wave ${waveNumber} spawned. ${activeEnemies.current} enemies active.`);
          }
        }
      }
    }, spawnInterval);
  }, [waveConfig, setCurrentWave, setWaveProgress, setWaveCompleted, setDebugMessage, spawnNewEnemy]);

  // Complete a wave
  const completeWave = useCallback(() => {
    setWaveCompleted(true);
    setScore(prev => prev + (currentWave * 100)); // Bonus for completing wave
    
    // Check if there are more waves
    const maxWave = Math.max(...Object.keys(waveConfig).map(Number));
    
    if (currentWave < maxWave) { 
      // Start countdown to next wave
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            showWaveAnnouncement(currentWave + 1);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Game won after final wave
      setGameWon(true);
    }
  }, [setWaveCompleted, setScore, currentWave, setCountdown, showWaveAnnouncement, setGameWon, waveConfig]);

  // Initialize game
  const initializeGame = useCallback(() => {
    console.log("Game initialization started");
    setTimeout(() => {
      gameStarted.current = true;
      showWaveAnnouncement(1);
      setDebugMessage("First wave announcement triggered");
    }, 1000);
    
    return () => {
      if (enemySpawnTimer.current) {
        clearInterval(enemySpawnTimer.current);
      }
    };
  }, [showWaveAnnouncement, setDebugMessage]);

  // Return values and functions needed by useGameState
  return {
    enemiesLeftInWave,
    enemiesSpawned,
    activeEnemies,
    gameStarted,
    showWaveAnnouncement,
    startWave,
    completeWave,
    initializeGame
  };
};