
import { useCallback } from 'react';
import { PlantInstance, EnemyType, ProjectileType, PlantType, SunResource } from '../types';
import { PLANT_HEALTH } from '../constants';
import { createProjectile } from '../utils/projectileUtils';
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
  const fireProjectile = useCallback((plant: PlantInstance, targetPosition: number) => {
    const cellWidth = gameArea.width / 9; // Using 9 as COLS
    const newProjectile = createProjectile(plant, targetPosition, cellWidth);
    setProjectiles(prev => [...prev, newProjectile]);
  }, [gameArea.width, setProjectiles]);

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
  }, [setPlants, setSunAmount, setSelectedPlant]);

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
        const cellWidth = gameArea.width / 9; // Using 9 as COLS
        const cellHeight = gameArea.height / 5; // Using 5 as ROWS
        const x = (plant.col * cellWidth) + (cellWidth / 2);
        const y = (plant.row * cellHeight) + (cellHeight / 2);
        
        const newSun = generateSunNearPlant(x, y);
        setSunResources(prev => [...prev, newSun]);
      }
      
      // Attack plants damage enemies
      if (plant.type.damage > 0 && now - plant.lastFired > plant.type.cooldown) {
        // Find enemies in the same row
        const enemiesInRange = enemies.filter(enemy => {
          const cellWidth = gameArea.width / 9; // Using 9 as COLS
          const plantPosition = (plant.col + 1) * cellWidth;
          
          return enemy.row === plant.row && enemy.position < plantPosition + plant.type.range;
        });
        
        if (enemiesInRange.length > 0) {
          plant.lastFired = now;
          
          // Attack the first enemy
          const targetEnemy = enemiesInRange[0];
          
          // Fire a visual projectile
          fireProjectile(plant, targetEnemy.position);
          
          setEnemies(prevEnemies => {
            return prevEnemies.map(enemy => {
              if (enemy.id === targetEnemy.id) {
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
    });
    
    return plants;
  }, [gameArea, setSunResources, setEnemies, setScore, activeEnemies, fireProjectile]);

  return {
    placePlant,
    processPlantActions
  };
};
