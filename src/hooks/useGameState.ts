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
  soundManager?: any; // Add sound manager
}

export const useGameState = ({ onGameOver, onLevelComplete, level, soundManager }: UseGameStateProps) => {
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
  
  // Add a boolean to track if sun boost is active
  const [sunBoostActive, setSunBoostActive] = useState(false);
  
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
  
  // Update processPlantActions to handle boosted plants
  const { placePlant, processPlantActions } = usePlantActions({
    gameArea,
    setPlants,
    setSunAmount,
    setSunResources,
    setProjectiles,
    setEnemies,
    setScore,
    setSelectedPlant,
    activeEnemies,
    soundManager
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
    // Improved: More frequent with sun boost active
    const naturalSunTimer = setInterval(() => {
      const newSun = generateRandomSun(gameArea);
      setSunResources(prev => [...prev, newSun]);
      
      // Auto-remove sun after 15 seconds if not collected (authentic PvZ timing)
      setTimeout(() => {
        setSunResources(prev => prev.filter(sun => sun.id !== newSun.id));
      }, 15000);
      
      // Generate an extra sun if sun boost is active
      if (sunBoostActive) {
        setTimeout(() => {
          const bonusSun = generateRandomSun(gameArea);
          setSunResources(prev => [...prev, bonusSun]);
          
          setTimeout(() => {
            setSunResources(prev => prev.filter(sun => sun.id !== bonusSun.id));
          }, 15000);
        }, 1500);
      }
    }, sunBoostActive ? 6000 : 10000); // Faster sun generation with sun boost (6s to 10s)
    
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
        // Fix: Precise calculation of plant position with integer values
        const plantPosition = Math.floor(plant.col * cellWidth + (cellWidth / 2));
        return { 
          ...plant, 
          position: plantPosition,
          row: Math.floor(plant.row) // Ensure integer row
        };
      });
      
      setEnemies(prevEnemies => {
        if (prevEnemies.length === 0) return prevEnemies;
        
        // First, deep clone all enemies to prevent reference issues
        const deepClonedEnemies = prevEnemies.map(enemy => JSON.parse(JSON.stringify(enemy)));
        
        const newEnemies = deepClonedEnemies.map(enemy => {
          // CRITICAL FIX: Force enemy row to stay at its original integer value
          // This is the key fix to prevent lane shifting when plants are placed
          const originalRow = Math.floor(enemy.row);
          
          // Always keep the enemy in its original lane - this is crucial
          const enemyClone = {
            ...enemy,
            row: originalRow, // Lock to original integer row
            position: Math.floor(enemy.position) // Force integer position
          };
          
          // Ensure row is valid (0-4)
          if (enemyClone.row < 0) enemyClone.row = 0;
          if (enemyClone.row > 4) enemyClone.row = 4;
          
          // Check for plants in the same lane with strict integer comparison
          const plantsInPath = plantsWithPosition.filter(plant => {
            // CRITICAL FIX: Use strict integer equality with Math.floor
            const sameRow = Math.floor(plant.row) === originalRow;
            
            // Precise position check
            const inFrontOfZombie = 
              Math.floor(plant.position) >= Math.floor(enemyClone.position - 40) && 
              Math.floor(plant.position) <= Math.floor(enemyClone.position + 20);
            
            return sameRow && inFrontOfZombie;
          });
          
          if (plantsInPath.length > 0 && !enemyClone.isEating) {
            const targetPlant = plantsInPath[0];
            
            // CRITICAL FIX: Preserve the original row value exactly
            return { 
              ...enemyClone, 
              isEating: true, 
              targetPlant: targetPlant.id,
              speed: 0,
              row: originalRow // Keep original row - prevents shifting
            };
          }
          else if (enemyClone.isEating && enemyClone.targetPlant) {
            // CRITICAL FIX: Maintain original row while eating
            return { 
              ...enemyClone,
              row: originalRow // Keep original row - prevents shifting
            };
          }
          else {
            // Calculate new position for movement
            const newPosition = Math.floor(enemyClone.position - (enemyClone.speed / 10));
            
            // Trigger lawnmower if zombie reaches the end
            if (newPosition <= 120) {
              if (newPosition <= 20) {
                setIsGameOver(true);
                onGameOver();
              }
            }
            
            // CRITICAL FIX: Return zombie with original row preserved
            return { 
              ...enemyClone, 
              position: Math.floor(newPosition),
              row: originalRow // Keep original row - prevents shifting
            };
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
    // Enhanced: More frequent with plant food boost
    const sunflowerProductionTimer = setInterval(() => {
      const sunflowers = plants.filter(p => p.type.id === 'sunflower');
      
      // Each sunflower produces sun independently
      sunflowers.forEach(sunflower => {
        const cellWidth = gameArea.width / COLS;
        const cellHeight = gameArea.height / ROWS;
        const x = (sunflower.col * cellWidth) + (cellWidth / 2);
        const y = (sunflower.row * cellHeight) + (cellHeight / 2);
        
        // Generate multiple sun particles if boosted
        const sunCount = sunflower.boosted ? 2 : 1;
        
        for (let i = 0; i < sunCount; i++) {
          setTimeout(() => {
            setSunResources(prev => [...prev, { 
              id: `sunflower-${sunflower.id}-${Date.now()}-${i}`, 
              x: x + (Math.random() * 40 - 20), // Small random offset like PvZ
              y: y + (Math.random() * 40 - 20)
            }]);
            
            // Sunflower-produced sun also disappears after 15 seconds
            setTimeout(() => {
              setSunResources(prev => prev.filter(sun => 
                !sun.id.includes(`sunflower-${sunflower.id}-${Date.now()}-${i}`)
              ));
            }, 15000);
          }, i * 300); // Stagger the sun generation
        }
      });
    }, 20000); // Slightly faster sun production (20s instead of 24s)
    
    // Check for plant boost expiry
    const plantBoostTimer = setInterval(() => {
      setPlants(prevPlants => {
        const now = Date.now();
        
        return prevPlants.map(plant => {
          // If plant has a boost that has expired, remove the boost
          if (plant.boosted && plant.boostExpiry && plant.boostExpiry < now) {
            return {
              ...plant,
              boosted: false,
              boostExpiry: undefined
            };
          }
          return plant;
        });
      });
    }, 1000);
    
    return () => {
      clearInterval(naturalSunTimer);
      clearInterval(projectileTimer);
      clearInterval(gameTickTimer);
      clearInterval(sunflowerProductionTimer);
      clearInterval(plantBoostTimer); // Clear plant boost timer
    };
  }, [
    currentWave, enemies, generateSun, 
    gameArea.height, gameArea.width, isGameOver, 
    onGameOver, plants, waveCompleted, gameWon,
    completeWave, processPlantActions,
    enemiesSpawned, enemiesLeftInWave, activeEnemies, gameStarted,
    sunBoostActive // Add sunBoostActive dependency
  ]);
  
  // Effect to handle frozen zombie expiry
  useEffect(() => {
    if (isGameOver || gameWon) return;
    
    const freezeExpiryTimer = setInterval(() => {
      setEnemies(prevEnemies => {
        const now = Date.now();
        
        return prevEnemies.map(enemy => {
          // If enemy is frozen and the freeze has expired
          if (enemy.isFrozen && enemy.frozenExpiry && enemy.frozenExpiry < now) {
            return {
              ...enemy,
              isFrozen: false,
              speed: enemy.speed / 0.3 // Restore original speed (reverse the 0.3 multiplier)
            };
          }
          return enemy;
        });
      });
    }, 1000);
    
    return () => {
      clearInterval(freezeExpiryTimer);
    };
  }, [isGameOver, gameWon]);

  // Process status effect timeouts
  useEffect(() => {
    if (isGameOver || gameWon) return;
    
    // Create a map to track status effect timeouts for each enemy
    const statusEffectTimeouts = new Map();
    
    const statusEffectTimer = setInterval(() => {
      setEnemies(prevEnemies => {
        return prevEnemies.map(enemy => {
          let updatedEnemy = {...enemy};
          
          // Handle frozen effect expiration
          if (updatedEnemy.isFrozen) {
            const frozenTimeout = statusEffectTimeouts.get(`frozen-${enemy.id}`);
            if (!frozenTimeout) {
              // Set timeout for the frozen effect (5 seconds)
              statusEffectTimeouts.set(`frozen-${enemy.id}`, Date.now() + 5000);
            } else if (Date.now() >= frozenTimeout) {
              // Remove the frozen effect and restore speed
              updatedEnemy = {
                ...updatedEnemy,
                isFrozen: false,
                speed: updatedEnemy.speed * 2 // Restore original speed
              };
              statusEffectTimeouts.delete(`frozen-${enemy.id}`);
            }
          }
          
          // Handle burning effect expiration
          if (updatedEnemy.isBurning) {
            const burnTimeout = statusEffectTimeouts.get(`burning-${enemy.id}`);
            if (!burnTimeout) {
              // Set timeout for the burning effect (4 seconds)
              statusEffectTimeouts.set(`burning-${enemy.id}`, Date.now() + 4000);
            } else if (Date.now() >= burnTimeout) {
              // Remove the burning effect
              updatedEnemy = {
                ...updatedEnemy,
                isBurning: false,
                burnDamage: 0
              };
              statusEffectTimeouts.delete(`burning-${enemy.id}`);
            }
          }
          
          // Handle electrified effect expiration
          if (updatedEnemy.isElectrified) {
            const electrifiedTimeout = statusEffectTimeouts.get(`electrified-${enemy.id}`);
            if (!electrifiedTimeout) {
              // Set timeout for the electrified effect (2 seconds)
              statusEffectTimeouts.set(`electrified-${enemy.id}`, Date.now() + 2000);
            } else if (Date.now() >= electrifiedTimeout) {
              // Remove the electrified effect and restore speed
              updatedEnemy = {
                ...updatedEnemy,
                isElectrified: false,
                electricDamage: 0,
                speed: updatedEnemy.speed / 0.3 // Restore original speed
              };
              statusEffectTimeouts.delete(`electrified-${enemy.id}`);
            }
          }
          
          // Apply damage over time for burning and electrified effects
          if (updatedEnemy.isBurning && updatedEnemy.burnDamage) {
            updatedEnemy.health -= updatedEnemy.burnDamage;
          }
          
          if (updatedEnemy.isElectrified && updatedEnemy.electricDamage) {
            updatedEnemy.health -= updatedEnemy.electricDamage;
          }
          
          return updatedEnemy;
        }).filter(enemy => enemy.health > 0);
      });
    }, 1000); // Check every second
    
    return () => {
      clearInterval(statusEffectTimer);
    };
  }, [isGameOver, gameWon, setEnemies]);

  return {
    sunAmount,
    setSunAmount, // Expose setter for powerups
    currentWave,
    waveProgress,
    sunResources,
    setSunResources, // Expose setter for powerups
    enemies,
    setEnemies, // Expose setter for powerups
    plants,
    setPlants, // Expose setter for powerups
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
    sunBoostActive,
    setSunBoostActive, // Expose setter for sun boost powerup
  };
};
