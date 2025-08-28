import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  PlantType, PlantInstance, EnemyType, ProjectileType, GameAreaDimensions, SunResource, 
  WaveConfigMap
} from '../game/types';
import { 
  ROWS, COLS, DEFAULT_GAME_AREA, PLANT_TYPES, PLANT_HEALTH, ZOMBIE_DAMAGE, WAVE_CONFIG, STARTING_SUN
} from '../game/constants';
import { useWaveManagement } from '../game/hooks/useWaveManagement';
import { usePlantActions } from '../game/hooks/usePlantActions';
import { generateRandomSun } from '../game/utils/sunUtils';
import { updateProjectiles } from '../game/utils/projectileUtils';

export type { 
  PlantType, PlantInstance, EnemyType, ProjectileType, 
  GameAreaDimensions, SunResource
};
export { ROWS, COLS, DEFAULT_GAME_AREA, PLANT_TYPES };

export interface UseGameStateProps {
  onGameOver: () => void;
  onLevelComplete?: (score: number) => void;
  level?: number;
}

export const useGameState = ({ onGameOver, onLevelComplete, level }: UseGameStateProps) => {
  const [sunAmount, setSunAmount] = useState(STARTING_SUN);
  const [currentWave, setCurrentWave] = useState(1);
  const [waveProgress, setWaveProgress] = useState(0);
  const [sunResources, setSunResources] = useState<SunResource[]>([]);
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [plants, setPlants] = useState<PlantInstance[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileType[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showWaveMessage, setShowWaveMessage] = useState(false);
  const [waveMessage, setWaveMessage] = useState('');
  const [waveCompleted, setWaveCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [gameWon, setGameWon] = useState(false);
  const [debugMessage, setDebugMessage] = useState('Initializing game...');
  
  const gameArea = DEFAULT_GAME_AREA;
  
  const { 
    enemiesLeftInWave,
    enemiesSpawned,
    activeEnemies,
    gameStarted,
    completeWave,
    initializeGame
  } = useWaveManagement({
    waveConfig: WAVE_CONFIG as WaveConfigMap,
    gameAreaWidth: gameArea.width,
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
  });
  
  const { placePlant, processPlantActions } = usePlantActions({
    gameArea,
    setPlants,
    setSunAmount,
    setSunResources,
    setProjectiles,
    setEnemies,
    setScore,
    setSelectedPlant,
    activeEnemies
  });

  const generateSun = useCallback(() => {
    const newSun = generateRandomSun(gameArea);
    setSunResources(prev => [...prev, newSun]);
    
    setTimeout(() => {
      setSunResources(prev => prev.filter(sun => sun.id !== newSun.id));
    }, 10000);
  }, [gameArea]);

  const collectSun = useCallback((id: string) => {
    setSunAmount(prev => prev + 25);
    setSunResources(prev => prev.filter(sun => sun.id !== id));
  }, []);

  const handlePlacePlant = useCallback((row: number, col: number) => {
    placePlant(row, col, selectedPlant, plants, sunAmount);
  }, [placePlant, selectedPlant, plants, sunAmount]);

  const removeEnemy = useCallback((id: string) => {
    setEnemies(prev => {
      const enemy = prev.find(e => e.id === id);
      if (enemy) {
        setScore(prevScore => prevScore + 10);
        if (activeEnemies && typeof activeEnemies.current === 'number') {
          activeEnemies.current -= 1;
        }
      }
      return prev.filter(e => e.id !== id);
    });
  }, [activeEnemies]);

  useEffect(() => {
    const cleanup = initializeGame();
    return cleanup;
  }, [initializeGame]);

  useEffect(() => {
    if (isGameOver || gameWon) return;

    // Natural sun generation - falls from sky every 10-15 seconds like in PvZ
    const naturalSunTimer = setInterval(() => {
      const newSun = generateRandomSun(gameArea);
      setSunResources(prev => [...prev, newSun]);
      
      // Auto-remove sun after 15 seconds if not collected (authentic PvZ timing)
      setTimeout(() => {
        setSunResources(prev => prev.filter(sun => sun.id !== newSun.id));
      }, 15000);
    }, Math.random() * 5000 + 10000); // 10-15 seconds random interval
    
    const projectileTimer = setInterval(() => {
      setProjectiles(prevProjectiles => updateProjectiles(prevProjectiles));
    }, 50);
    
    const gameTickTimer = setInterval(() => {
      // Check wave completion
      if (enemies.length === 0 && enemiesSpawned.current >= enemiesLeftInWave.current && 
          gameStarted.current && !waveCompleted && activeEnemies.current === 0) {
        completeWave();
      }
      
      const plantsWithPosition = plants.map(plant => {
        const cellWidth = gameArea.width / COLS;
        const plantPosition = plant.col * cellWidth + (cellWidth / 2);
        return { ...plant, position: plantPosition };
      });
      
      setEnemies(prevEnemies => {
        if (prevEnemies.length === 0) return prevEnemies;
        
        const newEnemies = prevEnemies.map(enemy => {
          const plantsInPath = plantsWithPosition.filter(plant => 
            plant.row === enemy.row && plant.position >= enemy.position - 40 && plant.position <= enemy.position + 20
          );
          
          if (plantsInPath.length > 0 && !enemy.isEating) {
            const targetPlant = plantsInPath[0];
            return { 
              ...enemy, 
              isEating: true, 
              targetPlant: targetPlant.id,
              speed: 0
            };
          }
          else if (enemy.isEating && enemy.targetPlant) {
            return { ...enemy };
          }
          else {
            const newPosition = enemy.position - (enemy.speed / 10);
            
            // Trigger lawnmower if zombie reaches the end
            if (newPosition <= 80) { // Lawnmower activation zone
              // This will be handled by lawnmower collision detection
              if (newPosition <= 20) {
                setIsGameOver(true);
                onGameOver();
              }
            }
            
            return { ...enemy, position: newPosition };
          }
        });
        
        return newEnemies.filter(enemy => enemy.health > 0);
      });
      
      setPlants(prevPlants => {
        const updatedPlants = prevPlants.map(plant => {
          const eatingEnemies = enemies.filter(enemy => 
            enemy.isEating && enemy.targetPlant === plant.id
          );
          
          if (eatingEnemies.length > 0) {
            const totalDamage = eatingEnemies.reduce((sum, enemy) => 
              sum + (enemy.damage || 1), 0);
            
            const newHealth = (plant.health || 0) - totalDamage;
            
            if (newHealth <= 0) {
              return null;
            }
            
            return { ...plant, health: newHealth };
          }
          
          return plant;
        }).filter(Boolean) as PlantInstance[];
        
        if (updatedPlants.length < prevPlants.length) {
          setEnemies(prevEnemies => 
            prevEnemies.map(enemy => {
              const plantExists = updatedPlants.some(p => p.id === enemy.targetPlant);
              if (enemy.isEating && !plantExists) {
                return { 
                  ...enemy, 
                  isEating: false, 
                  targetPlant: undefined, 
                  speed: WAVE_CONFIG[currentWave as keyof typeof WAVE_CONFIG].speed
                };
              }
              return enemy;
            })
          );
        }
        
        return updatedPlants;
      });
      
      setPlants(prevPlants => {
        const updatedPlants = processPlantActions(prevPlants, enemies);
        return [...updatedPlants];
      });
    }, 100);
    
    // Sunflower sun production - every 24 seconds like in original PvZ
    const sunflowerProductionTimer = setInterval(() => {
      const sunflowers = plants.filter(p => p.type.id === 'sunflower');
      
      // Each sunflower produces sun independently
      sunflowers.forEach(sunflower => {
        const cellWidth = gameArea.width / COLS;
        const cellHeight = gameArea.height / ROWS;
        const x = (sunflower.col * cellWidth) + (cellWidth / 2);
        const y = (sunflower.row * cellHeight) + (cellHeight / 2);
        
        setSunResources(prev => [...prev, { 
          id: `sunflower-${sunflower.id}-${Date.now()}`, 
          x: x + (Math.random() * 30 - 15), // Small random offset like PvZ
          y: y + (Math.random() * 30 - 15)
        }]);
        
        // Sunflower-produced sun also disappears after 15 seconds
        setTimeout(() => {
          setSunResources(prev => prev.filter(sun => 
            !sun.id.includes(`sunflower-${sunflower.id}`)
          ));
        }, 15000);
      });
    }, 24000); // Authentic PvZ timing
    
    return () => {
      clearInterval(naturalSunTimer);
      clearInterval(projectileTimer);
      clearInterval(gameTickTimer);
      clearInterval(sunflowerProductionTimer);
    };
  }, [
    currentWave, enemies, generateSun, 
    gameArea.height, gameArea.width, isGameOver, 
    onGameOver, plants, waveCompleted, gameWon,
    completeWave, processPlantActions,
    enemiesSpawned, enemiesLeftInWave, activeEnemies, gameStarted
  ]);

  return {
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
    placePlant: handlePlacePlant,
    collectSun,
    gameArea,
    plantTypes: PLANT_TYPES,
    removeEnemy,
  };
};
