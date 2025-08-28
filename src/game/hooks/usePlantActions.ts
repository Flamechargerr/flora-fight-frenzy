
import { useCallback } from 'react';
import { PlantInstance, EnemyType, ProjectileType, PlantType, SunResource } from '../types';
import { PLANT_HEALTH } from '../constants';
import { createProjectile, applyProjectileEffects } from '../utils/projectileUtils';
import { generateSunNearPlant } from '../utils/sunUtils';

interface UsePlantActionsProps {
  gameArea: { width: number; height: number };
  setPlants: React.Dispatch<React.SetStateAction<PlantInstance[]>>;
  setSunAmount: React.Dispatch<React.SetStateAction<number>>;
  setSunResources: React.Dispatch<React.SetStateAction<SunResource[]>>;
  setProjectiles: React.Dispatch<React.SetStateAction<ProjectileType[]>>;
  setEnemies: React.Dispatch<React.SetStateAction<EnemyType[]>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPlant: React.Dispatch<React.SetStateAction<PlantType | null>>;
  activeEnemies: React.MutableRefObject<number>;
  soundManager?: any; // Add sound manager
}

export const usePlantActions = ({
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
}: UsePlantActionsProps) => {

  // Fire a projectile
  const fireProjectile = useCallback((plant: PlantInstance, targetEnemy: EnemyType) => {
    const cellWidth = gameArea.width / 9; // Using 9 as COLS
    
    // Fix: Use precise integer calculations
    const plantCol = Math.floor(plant.col);
    const plantPosition = Math.floor((plantCol + 1) * cellWidth);
    const targetPosition = Math.floor(targetEnemy.position);
    
    // Handle Torchwood pea conversion - check for torchwoods in the path
    let projectileType = 'pea';
    if (plant.type.id === 'iceshooter') projectileType = 'ice';
    if (plant.type.id === 'fireshooter') projectileType = 'fire';
    
    // Create the projectile with precise position values
    const newProjectile = createProjectile(
      { ...plant, row: Math.floor(plant.row), col: plantCol },
      targetPosition, 
      Math.floor(cellWidth)
    );
    
    // Check if projectile passes through a torchwood
    setPlants(prevPlants => {
      const torchwoods = prevPlants.filter(p => 
        p.type.id === 'torchwood' && 
        p.row === plant.row && 
        p.col > plant.col
      );
      
      if (torchwoods.length > 0 && (projectileType === 'pea')) {
        // Convert to fire projectile if passing through torchwood
        newProjectile.type = 'fire';
        
        // Update the torchwood's lastFired property
        return prevPlants.map(p => {
          if (p.id === torchwoods[0].id) {
            return {...p, lastFired: Date.now()};
          }
          return p;
        });
      }
      
      return prevPlants;
    });
    
    setProjectiles(prev => [...prev, newProjectile]);
    
    // Apply effects based on projectile type
    const updatedEnemy = applyProjectileEffects(targetEnemy, newProjectile.type);
    
    // Update enemy with applied effects
    setEnemies(prevEnemies => {
      return prevEnemies.map(enemy => 
        enemy.id === updatedEnemy.id ? updatedEnemy : enemy
      );
    });
  }, [gameArea.width, setProjectiles, setEnemies, setPlants]);

  // Place a plant on the grid
  const placePlant = useCallback((row: number, col: number, selectedPlant: PlantType | null, plants: PlantInstance[], sunAmount: number) => {
    if (!selectedPlant) return;
    if (sunAmount < selectedPlant.cost) return;
    
    // CRITICAL FIX: Force row and col to be exact integers
    const exactRow = Math.floor(Number(row));
    const exactCol = Math.floor(Number(col));
    
    console.log(`PLACING PLANT at EXACT grid position: [${exactRow},${exactCol}]`);
    
    // Check if position is valid (within grid bounds)
    if (exactRow < 0 || exactRow >= 5 || exactCol < 0 || exactCol >= 9) {
      console.error(`Invalid grid position: [${exactRow},${exactCol}]`);
      return;
    }
    
    // Check for existing plants using strict integer comparison
    const plantExists = plants.some(p => 
      Math.floor(p.row) === exactRow && Math.floor(p.col) === exactCol
    );
    
    if (plantExists) {
      console.log(`Cannot place plant - position [${exactRow},${exactCol}] already occupied`);
      return;
    }
    
    const maxHealth = PLANT_HEALTH[selectedPlant.id as keyof typeof PLANT_HEALTH] || 300;
    
    // Create plant with guaranteed integer positions
    const newPlant = {
      id: `plant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: selectedPlant,
      row: exactRow, // Force integer row
      col: exactCol, // Force integer column
      lastFired: 0,
      health: maxHealth,
      maxHealth
    };
    
    // Log for debugging
    console.log(`Created new plant:`, JSON.stringify(newPlant, null, 2));
    
    setPlants(prev => [...prev, newPlant]);
    setSunAmount(prev => prev - selectedPlant.cost);
    setSelectedPlant(null);
    
    // Play plant sound
    if (soundManager) {
      soundManager.playPlantSound(selectedPlant.id);
    }
    
    // Immediately trigger cherry bomb if there are zombies in range
    if (selectedPlant.id === 'cherrybomb') {
      setTimeout(() => {
        setEnemies(prevEnemies => {
          const cellWidth = gameArea.width / 9;
          const plantPosition = (newPlant.col + 0.5) * cellWidth;
          
          // Find enemies in range (3x3 grid around cherry bomb)
          const enemiesInRange = prevEnemies.filter(enemy => {
            const rowDiff = Math.abs(enemy.row - newPlant.row);
            const inSameRow = rowDiff <= 1; // Center row and one above/below
            const inRange = Math.abs(enemy.position - plantPosition) < cellWidth * 1.5;
            
            return inSameRow && inRange;
          });
          
          if (enemiesInRange.length > 0) {
            // Mark the cherry bomb as activated
            setPlants(prevPlants => 
              prevPlants.map(p => 
                p.id === newPlant.id ? {...p, lastFired: Date.now()} : p
              )
            );
            
            // After animation, remove the cherry bomb
            setTimeout(() => {
              setPlants(prevPlants => prevPlants.filter(p => p.id !== newPlant.id));
            }, 1000);
            
            // Apply damage to enemies in range
            const updatedEnemies = prevEnemies.map(enemy => {
              if (enemiesInRange.some(e => e.id === enemy.id)) {
                const newHealth = enemy.health - selectedPlant.damage;
                if (newHealth <= 0) {
                  setScore(prev => prev + 10);
                  activeEnemies.current--;
                  return { ...enemy, health: 0 };
                }
                return { ...enemy, health: newHealth };
              }
              return enemy;
            });
            
            return updatedEnemies.filter(enemy => enemy.health > 0);
          }
          
          return prevEnemies;
        });
      }, 100);
    }
  }, [setPlants, setSunAmount, setSelectedPlant, gameArea.width, setEnemies, setScore, activeEnemies]);

  // Process plant actions (sunflowers generating sun, plants attacking)
  const processPlantActions = useCallback((
    plants: PlantInstance[], 
    enemies: EnemyType[]
  ) => {
    const now = Date.now();
    
    plants.forEach(plant => {
      // Calculate cooldown reduction if plant is boosted
      const cooldownMultiplier = plant.boosted ? 0.5 : 1; // 50% cooldown reduction when boosted
      const effectiveCooldown = plant.type.cooldown * cooldownMultiplier;
      
      // Sunflower generates sun - generates more sun when boosted
      if (plant.type.id === 'sunflower' && now - plant.lastFired > effectiveCooldown) {
        plant.lastFired = now;
        
        // Generate sun near this sunflower with precise positioning
        const cellWidth = Math.floor(gameArea.width / 9);
        const cellHeight = Math.floor(gameArea.height / 5);
        const x = Math.floor((plant.col * cellWidth) + (cellWidth / 2));
        const y = Math.floor((plant.row * cellHeight) + (cellHeight / 2));
        
        // Generate multiple suns if boosted
        const sunCount = plant.boosted ? 3 : 1; // Increased to 3 when boosted
        
        for (let i = 0; i < sunCount; i++) {
          const offset = i * 20; // Space out multiple suns
          const newSun = generateSunNearPlant(x + offset, y);
          setSunResources(prev => [...prev, newSun]);
        }
        
        // Play sunflower sound
        if (soundManager) {
          soundManager.playPlantSound('sunflower');
        }
      }
      
      // Puff-shroom generates sun - generates sun when boosted
      if (plant.type.id === 'puffshroom' && now - plant.lastFired > effectiveCooldown) {
        plant.lastFired = now;
        
        // Generate sun near this puff-shroom with precise positioning
        const cellWidth = Math.floor(gameArea.width / 9);
        const cellHeight = Math.floor(gameArea.height / 5);
        const x = Math.floor((plant.col * cellWidth) + (cellWidth / 2));
        const y = Math.floor((plant.row * cellHeight) + (cellHeight / 2));
        
        // Generate sun only when boosted
        if (plant.boosted) {
          const sunCount = 2; // Generate 2 suns when boosted
          
          for (let i = 0; i < sunCount; i++) {
            const offset = i * 20; // Space out multiple suns
            const newSun = generateSunNearPlant(x + offset, y);
            setSunResources(prev => [...prev, newSun]);
          }
        }
        
        // Play puff-shroom sound
        if (soundManager) {
          soundManager.playPlantSound('puffshroom');
        }
      }
      
      // Spikeweed passive damage to zombies walking over it
      if (plant.type.id === 'spikeweed' && plant.type.isPassive && now - plant.lastFired > effectiveCooldown) {
        const cellWidth = gameArea.width / 9;
        const plantPosition = (plant.col + 0.5) * cellWidth;
        
        // Find zombies walking over this spikeweed
        const zombiesOverSpikeweed = enemies.filter(enemy => 
          enemy.row === plant.row && 
          Math.abs(enemy.position - plantPosition) < 30
        );
        
        if (zombiesOverSpikeweed.length > 0) {
          plant.lastFired = now;
          
          // Apply damage to all zombies walking over it
          // Increased damage when boosted
          const damageFactor = plant.boosted ? 3 : 1; // Triple damage when boosted
          
          setEnemies(prevEnemies => {
            return prevEnemies.map(enemy => {
              if (zombiesOverSpikeweed.some(z => z.id === enemy.id)) {
                const newHealth = enemy.health - (plant.type.damage * damageFactor);
                
                if (newHealth <= 0) {
                  setScore(prev => prev + 10);
                  activeEnemies.current--;
                  return { ...enemy, health: 0 };
                }
                
                return { ...enemy, health: newHealth };
              }
              return enemy;
            }).filter(enemy => enemy.health > 0);
          });
        }
      }
      
      // Scaredy-shroom hides when zombies approach
      if (plant.type.id === 'scaredyshroom' && plant.type.scared) {
        const cellWidth = gameArea.width / 9;
        const plantPosition = (plant.col + 0.5) * cellWidth;
        
        // Check if zombies are near
        const zombiesNearby = enemies.some(enemy => 
          enemy.row === plant.row && 
          Math.abs(enemy.position - plantPosition) < 100
        );
        
        // Set scared state
        plant.isScared = zombiesNearby;
        
        // Only attack if not scared
        if (!zombiesNearby && now - plant.lastFired > effectiveCooldown) {
          // Find enemies in the same row
          const enemiesInRange = enemies.filter(enemy => {
            const cellWidth = gameArea.width / 9;
            const plantPosition = Math.floor((plant.col + 1) * cellWidth);
            
            // Fix: Use precise integer row matching
            const exactRowMatch = Math.floor(enemy.row) === Math.floor(plant.row);
            // Fix: More precise range calculation
            const inRange = Math.floor(enemy.position) < plantPosition + plant.type.range;
            
            return exactRowMatch && inRange;
          });
          
          // Sort enemies by position to always attack the closest one first
          const sortedEnemies = [...enemiesInRange].sort((a, b) => a.position - b.position);
          
          if (sortedEnemies.length > 0) {
            plant.lastFired = now;
            
            // Damage modifier for boosted plants
            const damageFactor = plant.boosted ? 2 : 1; // Double damage when boosted
            
            // Attack the first enemy
            const targetEnemy = sortedEnemies[0];
            
            // Fire a visual projectile
            fireProjectile(plant, targetEnemy);
                      
            // Play shoot sound
            if (soundManager) {
              soundManager.playShootSound(plant.type.id);
            }
            
            setEnemies(prevEnemies => {
              return prevEnemies.map(enemy => {
                if (enemy.id === targetEnemy.id) {
                  // Apply base damage with damage factor
                  const newHealth = enemy.health - (plant.type.damage * damageFactor);
                  
                  if (newHealth <= 0) {
                    // Enemy defeated
                    setScore(prev => prev + 10);
                    activeEnemies.current--; // Decrement active enemies count
                    return { ...enemy, health: 0 };
                  }
                  
                  return { ...enemy, health: newHealth };
                }
                return enemy;
              }).filter(enemy => enemy.health > 0);
            });
          }
        }
      }
      
      // Ice-shroom freezes zombies in area
      if (plant.type.id === 'iceshroom' && plant.type.isAreaEffect && now - plant.lastFired > effectiveCooldown) {
        plant.lastFired = now;
        
        // Find all enemies in range
        const cellWidth = gameArea.width / 9;
        const plantPosition = (plant.col + 0.5) * cellWidth;
        
        const enemiesInRange = enemies.filter(enemy => 
          Math.abs(enemy.position - plantPosition) < plant.type.range
        );
        
        if (enemiesInRange.length > 0) {
          // Apply freeze effect to all enemies in range
          // Extended freeze duration when boosted
          const freezeDuration = plant.boosted ? 15000 : 10000; // 15s when boosted, 10s normally
          
          setEnemies(prevEnemies => {
            return prevEnemies.map(enemy => {
              if (enemiesInRange.some(e => e.id === enemy.id)) {
                return {
                  ...enemy,
                  isFrozen: true,
                  speed: enemy.speed * 0.2, // Slow down significantly
                  frozenExpiry: Date.now() + freezeDuration
                };
              }
              return enemy;
            });
          });
          
          // Play ice-shroom sound
          if (soundManager) {
            soundManager.playPlantSound('iceshroom');
          }
        }
      }
      
      // Jalapeño destroys all zombies in lane
      if (plant.type.id === 'jalapeno' && plant.type.isAreaEffect && plant.type.affectsLanes && now - plant.lastFired > effectiveCooldown) {
        plant.lastFired = now;
        
        // Find all enemies in the same row
        const enemiesInLane = enemies.filter(enemy => 
          enemy.row === plant.row
        );
        
        if (enemiesInLane.length > 0) {
          // Apply massive damage to all enemies in lane
          // Increased damage when boosted
          const damageFactor = plant.boosted ? 1.5 : 1; // 50% extra damage when boosted
          const baseDamage = plant.type.damage * damageFactor;
          
          setEnemies(prevEnemies => {
            return prevEnemies.map(enemy => {
              if (enemiesInLane.some(e => e.id === enemy.id)) {
                const newHealth = enemy.health - baseDamage;
                
                if (newHealth <= 0) {
                  setScore(prev => prev + 10);
                  activeEnemies.current--;
                  return { ...enemy, health: 0 };
                }
                
                return { ...enemy, health: newHealth };
              }
              return enemy;
            }).filter(enemy => enemy.health > 0);
          });
          
          // Play jalapeño sound
          if (soundManager) {
            soundManager.playPlantSound('jalapeno');
          }
          
          // Remove the jalapeño after use
          setTimeout(() => {
            setPlants(prevPlants => prevPlants.filter(p => p.id !== plant.id));
          }, 500);
        }
      }
      
      // Attack plants damage enemies
      if (plant.type.damage > 0 && !plant.type.isPassive && !plant.type.isPeaConverter && 
          plant.type.id !== 'scaredyshroom' && plant.type.id !== 'iceshroom' && 
          plant.type.id !== 'jalapeno' && now - plant.lastFired > effectiveCooldown) {
        // Find enemies in the same row
        const enemiesInRange = enemies.filter(enemy => {
          const cellWidth = gameArea.width / 9;
          const plantPosition = Math.floor((plant.col + 1) * cellWidth);
          
          // Fix: Use precise integer row matching
          const exactRowMatch = Math.floor(enemy.row) === Math.floor(plant.row);
          // Fix: More precise range calculation
          const inRange = Math.floor(enemy.position) < plantPosition + plant.type.range;
          
          return exactRowMatch && inRange;
        });
        
        // Sort enemies by position to always attack the closest one first
        const sortedEnemies = [...enemiesInRange].sort((a, b) => a.position - b.position);
        
        if (sortedEnemies.length > 0) {
          plant.lastFired = now;
          
          // Damage modifier for boosted plants
          const damageFactor = plant.boosted ? 2 : 1; // Double damage when boosted
          
          // For threepeater, also check adjacent rows
          if (plant.type.id === 'threepeater' && plant.type.affectsLanes === 3) {
            [-1, 0, 1].forEach(rowOffset => {
              const targetRow = plant.row + rowOffset;
              if (targetRow >= 0 && targetRow < 5) { // 5 is ROWS constant
                const enemiesInThisRow = enemies.filter(enemy => {
                  const cellWidth = gameArea.width / 9;
                  const plantPosition = Math.floor((plant.col + 1) * cellWidth);
                  
                  // Fix: Use precise integer row matching
                  const exactRowMatch = Math.floor(enemy.row) === Math.floor(targetRow);
                  // Fix: More precise range calculation
                  const inRange = Math.floor(enemy.position) < plantPosition + plant.type.range;
                  
                  return exactRowMatch && inRange;
                });
                
                if (enemiesInThisRow.length > 0) {
                  // Target first enemy in this row
                  const targetEnemy = enemiesInThisRow[0];
                  
                  // Fire a visual projectile
                  fireProjectile({...plant, row: targetRow}, targetEnemy);
                  
                  // Play shoot sound
                  if (soundManager) {
                    soundManager.playShootSound(plant.type.id);
                  }
                  
                  setEnemies(prevEnemies => {
                    return prevEnemies.map(enemy => {
                      if (enemy.id === targetEnemy.id) {
                        const newHealth = enemy.health - (plant.type.damage * damageFactor);
                        
                        if (newHealth <= 0) {
                          setScore(prev => prev + 10);
                          activeEnemies.current--;
                          return { ...enemy, health: 0 };
                        }
                        
                        return { ...enemy, health: newHealth };
                      }
                      return enemy;
                    }).filter(enemy => enemy.health > 0);
                  });
                }
              }
            });
          } else {
            // Attack the first enemy
            const targetEnemy = sortedEnemies[0];
            
            // Fire a visual projectile
            fireProjectile(plant, targetEnemy);
                      
            // Play shoot sound
            if (soundManager) {
              soundManager.playShootSound(plant.type.id);
            }
            
            // For repeater, fire a second projectile after a short delay
            if (plant.type.id === 'repeatershooter') {
              // If boosted, fire additional projectiles
              const projectileCount = plant.boosted ? 4 : 2; // 4 when boosted, 2 normally
              
              for (let i = 1; i < projectileCount; i++) {
                setTimeout(() => {
                  setEnemies(prevEnemies => {
                    const enemyStillExists = prevEnemies.some(e => e.id === targetEnemy.id);
                    if (enemyStillExists) {
                      const updatedEnemy = prevEnemies.find(e => e.id === targetEnemy.id)!;
                      fireProjectile(plant, updatedEnemy);
                      
                      return prevEnemies.map(enemy => {
                        if (enemy.id === targetEnemy.id) {
                          const newHealth = enemy.health - (plant.type.damage * damageFactor);
                          
                          if (newHealth <= 0) {
                            setScore(prev => prev + 10);
                            activeEnemies.current--;
                            return { ...enemy, health: 0 };
                          }
                          
                          return { ...enemy, health: newHealth };
                        }
                        return enemy;
                      }).filter(enemy => enemy.health > 0);
                    }
                    return prevEnemies;
                  });
                }, 200 * i); // Faster spacing when boosted
              }
            }
            
            // Apply additional burning damage over time for enemies hit by fire
            if (plant.type.id === 'fireshooter') {
              const burnDuration = plant.boosted ? 4000 : 3000; // Longer burn when boosted
              const burnInterval = 500; // Apply burn damage every 0.5 seconds
              let burnTicks = burnDuration / burnInterval;
              
              const burnTimer = setInterval(() => {
                if (burnTicks <= 0) {
                  clearInterval(burnTimer);
                  return;
                }
                
                setEnemies(prevEnemies => {
                  return prevEnemies.map(enemy => {
                    if (enemy.id === targetEnemy.id && enemy.isBurning) {
                      const newHealth = enemy.health - (plant.boosted ? 7 : 5); // More burn damage when boosted
                      
                      if (newHealth <= 0) {
                        // Enemy defeated by burn damage
                        setScore(prev => prev + 10);
                        activeEnemies.current--; // Decrement active enemies count
                        return { ...enemy, health: 0 };
                      }
                      
                      return { ...enemy, health: newHealth };
                    }
                    return enemy;
                  }).filter(enemy => enemy.health > 0);
                });
                
                burnTicks--;
              }, burnInterval);
            }
            
            setEnemies(prevEnemies => {
              return prevEnemies.map(enemy => {
                if (enemy.id === targetEnemy.id) {
                  // Apply base damage with damage factor
                  const newHealth = enemy.health - (plant.type.damage * damageFactor);
                  
                  if (newHealth <= 0) {
                    // Enemy defeated
                    setScore(prev => prev + 10);
                    activeEnemies.current--; // Decrement active enemies count
                    return { ...enemy, health: 0 };
                  }
                  
                  return { ...enemy, health: newHealth };
                }
                return enemy;
              }).filter(enemy => enemy.health > 0);
            });
          }
        }
      }
    });
    
    return plants;
  }, [gameArea, setEnemies, setScore, activeEnemies, fireProjectile, setSunResources, soundManager]);

  return {
    placePlant,
    processPlantActions
  };
};
