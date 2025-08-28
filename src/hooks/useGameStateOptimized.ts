import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

// Performance optimization: Move constants outside component
const GAME_TICK_INTERVAL = 100;
const PROJECTILE_UPDATE_INTERVAL = 50;
const SUN_GENERATION_INTERVAL = 3000;
const SUNFLOWER_PRODUCTION_INTERVAL = 7000;
const SUN_CLEANUP_DELAY = 10000;

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
  
  // Performance: Memoize game area to prevent unnecessary re-renders
  const gameArea = useMemo(() => DEFAULT_GAME_AREA, []);
  
  // Performance: Use refs for frequently accessed values to avoid re-renders
  const gameTickRef = useRef<NodeJS.Timeout>();
  const sunTimerRef = useRef<NodeJS.Timeout>();
  const projectileTimerRef = useRef<NodeJS.Timeout>();
  const sunflowerTimerRef = useRef<NodeJS.Timeout>();
  const isGameOverRef = useRef(false);
  const gameWonRef = useRef(false);
  
  // Performance: Memoize cell dimensions to avoid recalculation
  const cellDimensions = useMemo(() => ({
    width: gameArea.width / COLS,
    height: gameArea.height / ROWS
  }), [gameArea.width, gameArea.height]);
  
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

  // Performance: Memoized sun generation to prevent function recreation
  const generateSun = useCallback(() => {
    if (isGameOverRef.current || gameWonRef.current) return;
    
    const newSun = generateRandomSun(gameArea);
    setSunResources(prev => {
      // Performance: Check array length to prevent memory issues
      if (prev.length > 20) {
        return [newSun, ...prev.slice(0, 19)]; // Keep only 20 suns max
      }
      return [newSun, ...prev];
    });
    
    // Performance: Use setTimeout with ref cleanup
    const timeoutId = setTimeout(() => {
      setSunResources(prev => prev.filter(sun => sun.id !== newSun.id));
    }, SUN_CLEANUP_DELAY);
    
    return () => clearTimeout(timeoutId);
  }, [gameArea]);

  // Performance: Optimized collect sun with ref checks
  const collectSun = useCallback((id: string) => {
    setSunAmount(prev => prev + 25);
    setSunResources(prev => prev.filter(sun => sun.id !== id));
  }, []);

  // Performance: Memoized plant placement handler
  const handlePlacePlant = useCallback((row: number, col: number) => {
    if (isGameOverRef.current || gameWonRef.current) return;
    placePlant(row, col, selectedPlant, plants, sunAmount);
  }, [placePlant, selectedPlant, plants, sunAmount]);

  // Performance: Optimized enemy removal with batch updates
  const removeEnemy = useCallback((id: string) => {
    setEnemies(prev => {
      const enemyIndex = prev.findIndex(e => e.id === id);
      if (enemyIndex === -1) return prev;
      
      const enemy = prev[enemyIndex];
      setScore(prevScore => prevScore + 10);
      
      if (activeEnemies && typeof activeEnemies.current === 'number') {
        activeEnemies.current = Math.max(0, activeEnemies.current - 1);
      }
      
      // Performance: Use splice instead of filter for better performance
      const newEnemies = [...prev];
      newEnemies.splice(enemyIndex, 1);
      return newEnemies;
    });
  }, [activeEnemies]);

  // Performance: Optimized game tick function with early returns
  const gameTickHandler = useCallback(() => {
    if (isGameOverRef.current || gameWonRef.current) return;

    // Check wave completion first (lightweight check)
    if (enemies.length === 0 && enemiesSpawned.current >= enemiesLeftInWave.current && 
        gameStarted.current && !waveCompleted && activeEnemies.current === 0) {
      completeWave();
      return;
    }
    
    // Performance: Early return if no enemies
    if (enemies.length === 0) return;
    
    // Performance: Calculate plants with position once
    const plantsWithPosition = plants.map(plant => ({
      ...plant,
      position: plant.col * cellDimensions.width + (cellDimensions.width / 2)
    }));
    
    // Performance: Batch enemy updates
    setEnemies(prevEnemies => {
      const updatedEnemies = prevEnemies.map(enemy => {
        // Performance: Use for loop instead of filter for better performance
        let targetPlant = null;
        for (let i = 0; i < plantsWithPosition.length; i++) {
          const plant = plantsWithPosition[i];
          if (plant.row === enemy.row && 
              plant.position >= enemy.position - 30 && 
              plant.position <= enemy.position + 10) {
            targetPlant = plant;
            break;
          }
        }
        
        if (targetPlant && !enemy.isEating) {
          return { 
            ...enemy, 
            isEating: true, 
            targetPlant: targetPlant.id,
            speed: 0
          };
        } else if (enemy.isEating && enemy.targetPlant) {
          return enemy; // No change needed
        } else {
          const newPosition = enemy.position - (enemy.speed / 10);
          
          if (newPosition <= 0) {
            isGameOverRef.current = true;
            setIsGameOver(true);
            onGameOver();
          }
          
          return { ...enemy, position: newPosition };
        }
      });
      
      // Performance: Filter once at the end
      return updatedEnemies.filter(enemy => enemy.health > 0);
    });
    
    // Performance: Batch plant updates
    setPlants(prevPlants => {
      const updatedPlants: PlantInstance[] = [];
      let plantsRemoved = false;
      
      for (let i = 0; i < prevPlants.length; i++) {
        const plant = prevPlants[i];
        
        // Performance: Count eating enemies more efficiently
        let totalDamage = 0;
        for (let j = 0; j < enemies.length; j++) {
          const enemy = enemies[j];
          if (enemy.isEating && enemy.targetPlant === plant.id) {
            totalDamage += enemy.damage || 1;
          }
        }
        
        if (totalDamage > 0) {
          const newHealth = (plant.health || 0) - totalDamage;
          if (newHealth <= 0) {
            plantsRemoved = true;
            continue; // Skip this plant (remove it)
          }
          updatedPlants.push({ ...plant, health: newHealth });
        } else {
          updatedPlants.push(plant);
        }
      }
      
      // Performance: Only update enemy eating status if plants were removed
      if (plantsRemoved) {
        setEnemies(prevEnemies => 
          prevEnemies.map(enemy => {
            if (enemy.isEating && !updatedPlants.some(p => p.id === enemy.targetPlant)) {
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
    
    // Performance: Process plant actions with optimized data
    setPlants(prevPlants => processPlantActions(prevPlants, enemies));
  }, [
    enemies, plants, cellDimensions.width, onGameOver, processPlantActions,
    currentWave, completeWave, enemiesSpawned, enemiesLeftInWave, 
    activeEnemies, gameStarted, waveCompleted
  ]);

  // Performance: Optimized sunflower production
  const sunflowerProductionHandler = useCallback(() => {
    if (isGameOverRef.current || gameWonRef.current) return;
    
    const sunflowers = plants.filter(p => p.type.id === 'sunflower');
    if (sunflowers.length === 0) return;
    
    const randomSunflower = sunflowers[Math.floor(Math.random() * sunflowers.length)];
    const x = (randomSunflower.col * cellDimensions.width) + (cellDimensions.width / 2);
    const y = (randomSunflower.row * cellDimensions.height) + (cellDimensions.height / 2);
    
    setSunResources(prev => {
      // Performance: Limit sun resources
      if (prev.length > 15) return prev;
      
      return [...prev, { 
        id: `sun-${Date.now()}-${Math.random()}`, 
        x: x + (Math.random() * 40 - 20), 
        y: y + (Math.random() * 40 - 20) 
      }];
    });
  }, [plants, cellDimensions]);

  // Performance: Optimized projectile updates
  const projectileUpdateHandler = useCallback(() => {
    if (isGameOverRef.current || gameWonRef.current) return;
    
    setProjectiles(prevProjectiles => {
      if (prevProjectiles.length === 0) return prevProjectiles;
      return updateProjectiles(prevProjectiles);
    });
  }, []);

  // Performance: Update refs when game state changes
  useEffect(() => {
    isGameOverRef.current = isGameOver;
    gameWonRef.current = gameWon;
  }, [isGameOver, gameWon]);

  // Performance: Optimized timer management
  useEffect(() => {
    if (isGameOver || gameWon) {
      // Clear all timers when game ends
      if (gameTickRef.current) clearInterval(gameTickRef.current);
      if (sunTimerRef.current) clearInterval(sunTimerRef.current);
      if (projectileTimerRef.current) clearInterval(projectileTimerRef.current);
      if (sunflowerTimerRef.current) clearInterval(sunflowerTimerRef.current);
      return;
    }

    // Performance: Set up optimized intervals
    sunTimerRef.current = setInterval(generateSun, SUN_GENERATION_INTERVAL);
    projectileTimerRef.current = setInterval(projectileUpdateHandler, PROJECTILE_UPDATE_INTERVAL);
    gameTickRef.current = setInterval(gameTickHandler, GAME_TICK_INTERVAL);
    sunflowerTimerRef.current = setInterval(sunflowerProductionHandler, SUNFLOWER_PRODUCTION_INTERVAL);
    
    return () => {
      if (gameTickRef.current) clearInterval(gameTickRef.current);
      if (sunTimerRef.current) clearInterval(sunTimerRef.current);
      if (projectileTimerRef.current) clearInterval(projectileTimerRef.current);
      if (sunflowerTimerRef.current) clearInterval(sunflowerTimerRef.current);
    };
  }, [
    isGameOver, gameWon, generateSun, projectileUpdateHandler, 
    gameTickHandler, sunflowerProductionHandler
  ]);

  // Initialize game
  useEffect(() => {
    const cleanup = initializeGame();
    return cleanup;
  }, [initializeGame]);

  // Performance: Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
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
  }), [
    sunAmount, currentWave, waveProgress, sunResources, enemies, plants, projectiles,
    selectedPlant, isGameOver, score, showWaveMessage, waveMessage, waveCompleted,
    countdown, gameWon, debugMessage, enemiesSpawned, enemiesLeftInWave,
    handlePlacePlant, collectSun, gameArea, removeEnemy
  ]);
};