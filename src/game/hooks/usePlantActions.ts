
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
  activeEnemies
}: UsePlantActionsProps) => {

  // Fire a projectile
  const fireProjectile = useCallback((plant: PlantInstance, targetEnemy: EnemyType) => {
    const cellWidth = gameArea.width / 9; // Using 9 as COLS
    
    // Handle Torchwood pea conversion - check for torchwoods in the path
    let projectileType = 'pea';
    if (plant.type.id === 'iceshooter') projectileType = 'ice';
    if (plant.type.id === 'fireshooter') projectileType = 'fire';
    
    // Create the projectile
    const newProjectile = createProjectile(plant, targetEnemy.position, cellWidth);
    
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
    
    // Check if there's already a plant at this position
    const plantExists = plants.some(p => p.row === row && p.col === col);
    if (plantExists) return;
    
    const maxHealth = PLANT_HEALTH[selectedPlant.id as keyof typeof PLANT_HEALTH] || 300;
    
    const newPlant = {
      id: `plant-${Date.now()}`,
      type: selectedPlant,
      row,
      col,
      lastFired: 0,
      health: maxHealth,
      maxHealth
    };
    
    setPlants(prev => [...prev, newPlant]);
    setSunAmount(prev => prev - selectedPlant.cost);
    setSelectedPlant(null);
    
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
      // Sunflower generates sun
      if (plant.type.id === 'sunflower' && now - plant.lastFired > plant.type.cooldown) {
        plant.lastFired = now;
        
        // Generate sun near this sunflower
        const cellWidth = gameArea.width / 9;
        const cellHeight = gameArea.height / 5;
        const x = (plant.col * cellWidth) + (cellWidth / 2);
        const y = (plant.row * cellHeight) + (cellHeight / 2);
        
        const newSun = generateSunNearPlant(x, y);
        setSunResources(prev => [...prev, newSun]);
      }
      
      // Spikeweed passive damage to zombies walking over it
      if (plant.type.id === 'spikeweed' && plant.type.isPassive && now - plant.lastFired > plant.type.cooldown) {
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
          setEnemies(prevEnemies => {
            return prevEnemies.map(enemy => {
              if (zombiesOverSpikeweed.some(z => z.id === enemy.id)) {
                const newHealth = enemy.health - plant.type.damage;
                
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
      
      // Attack plants damage enemies
      if (plant.type.damage > 0 && !plant.type.isPassive && !plant.type.isPeaConverter && now - plant.lastFired > plant.type.cooldown) {
        // Find enemies in the same row
        const enemiesInRange = enemies.filter(enemy => {
          const cellWidth = gameArea.width / 9;
          const plantPosition = (plant.col + 1) * cellWidth;
          
          return enemy.row === plant.row && enemy.position < plantPosition + plant.type.range;
        });
        
        if (enemiesInRange.length > 0) {
          plant.lastFired = now;
          
          // For threepeater, also check adjacent rows
          if (plant.type.id === 'threepeater' && plant.type.affectsLanes === 3) {
            [-1, 0, 1].forEach(rowOffset => {
              const targetRow = plant.row + rowOffset;
              if (targetRow >= 0 && targetRow < 5) { // 5 is ROWS constant
                const enemiesInThisRow = enemies.filter(enemy => {
                  const cellWidth = gameArea.width / 9;
                  const plantPosition = (plant.col + 1) * cellWidth;
                  
                  return enemy.row === targetRow && enemy.position < plantPosition + plant.type.range;
                });
                
                if (enemiesInThisRow.length > 0) {
                  // Target first enemy in this row
                  const targetEnemy = enemiesInThisRow[0];
                  
                  // Fire a visual projectile
                  fireProjectile({...plant, row: targetRow}, targetEnemy);
                  
                  setEnemies(prevEnemies => {
                    return prevEnemies.map(enemy => {
                      if (enemy.id === targetEnemy.id) {
                        const newHealth = enemy.health - plant.type.damage;
                        
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
            const targetEnemy = enemiesInRange[0];
            
            // Fire a visual projectile
            fireProjectile(plant, targetEnemy);
            
            // For repeater, fire a second projectile after a short delay
            if (plant.type.id === 'repeatershooter') {
              setTimeout(() => {
                setEnemies(prevEnemies => {
                  const enemyStillExists = prevEnemies.some(e => e.id === targetEnemy.id);
                  if (enemyStillExists) {
                    const updatedEnemy = prevEnemies.find(e => e.id === targetEnemy.id)!;
                    fireProjectile(plant, updatedEnemy);
                    
                    return prevEnemies.map(enemy => {
                      if (enemy.id === targetEnemy.id) {
                        const newHealth = enemy.health - plant.type.damage;
                        
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
              }, 300);
            }
            
            // Apply additional burning damage over time for enemies hit by fire
            if (plant.type.id === 'fireshooter') {
              const burnDuration = 3000; // 3 seconds of burning
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
                      const newHealth = enemy.health - 5; // 5 burn damage per tick
                      
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
                  // Apply base damage
                  const newHealth = enemy.health - plant.type.damage;
                  
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
  }, [gameArea, setEnemies, setScore, activeEnemies, fireProjectile, setSunResources]);

  return {
    placePlant,
    processPlantActions
  };
};
