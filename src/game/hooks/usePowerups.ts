import { useCallback } from 'react';

interface PowerupProps {
  sunAmount: number;
  setSunAmount: React.Dispatch<React.SetStateAction<number>>;
  setEnemies: React.Dispatch<React.SetStateAction<any[]>>;
  setPlants: React.Dispatch<React.SetStateAction<any[]>>;
  setSunResources: React.Dispatch<React.SetStateAction<any[]>>;
  gameArea: { width: number; height: number };
  soundManager?: any;
}

export const usePowerups = ({
  sunAmount,
  setSunAmount,
  setEnemies,
  setPlants,
  setSunResources,
  gameArea,
  soundManager
}: PowerupProps) => {

  // Plant Food - Temporarily boosts all plants on screen
  const usePlantFood = useCallback(() => {
    const PLANT_FOOD_COST = 75;
    
    if (sunAmount < PLANT_FOOD_COST) return false;
    
    setSunAmount(prev => prev - PLANT_FOOD_COST);
    
    // Apply plant food effect to all plants
    setPlants(prevPlants => {
      return prevPlants.map(plant => {
        // Plant food effect gives plants a temporary boost
        const boostedPlant = {
          ...plant,
          boosted: true,
          boostExpiry: Date.now() + 15000, // Increased to 15 seconds
          lastFired: 0 // Reset cooldown to fire immediately
        };
        
        // Play boost sound
        if (soundManager) {
          soundManager.playPowerupSound('plantFood');
        }
        
        return boostedPlant;
      });
    });
    
    return true;
  }, [sunAmount, setSunAmount, setPlants, soundManager]);
  
  // Freeze - Temporarily freeze all zombies on screen
  const useFreeze = useCallback(() => {
    const FREEZE_COST = 100;
    
    if (sunAmount < FREEZE_COST) return false;
    
    setSunAmount(prev => prev - FREEZE_COST);
    
    // Freeze all enemies on screen
    setEnemies(prevEnemies => {
      return prevEnemies.map(enemy => {
        // Apply frozen effect
        return {
          ...enemy,
          isFrozen: true,
          speed: enemy.speed * 0.2, // Slow down even more significantly
          frozenExpiry: Date.now() + 10000 // Increased to 10 seconds
        };
      });
    });
    
    // Play freeze sound
    if (soundManager) {
      soundManager.playPowerupSound('freeze');
    }
    
    return true;
  }, [sunAmount, setSunAmount, setEnemies, soundManager]);
  
  // Sun Boost - Instantly gives extra sun and increases sun production
  const useSunBoost = useCallback(() => {
    const SUN_BOOST_COST = 50;
    const BONUS_SUN = 200; // Increased bonus sun
    
    if (sunAmount < SUN_BOOST_COST) return false;
    
    setSunAmount(prev => prev - SUN_BOOST_COST + BONUS_SUN);
    
    // Generate bonus sun particles
    for (let i = 0; i < 8; i++) { // Increased number of sun particles
      setTimeout(() => {
        const x = Math.random() * (gameArea.width - 100) + 50;
        const y = Math.random() * (gameArea.height - 100) + 50;
        
        setSunResources(prev => [
          ...prev, 
          { 
            id: `sunboost-${Date.now()}-${i}`, 
            x, 
            y,
            collected: false
          }
        ]);
      }, i * 200); // Faster generation
    }
    
    // Play sun boost sound
    if (soundManager) {
      soundManager.playPowerupSound('sunBoost');
    }
    
    return true;
  }, [sunAmount, setSunAmount, setSunResources, gameArea, soundManager]);
  
  // New Powerup: Cherry Bomb - Instantly destroys all zombies in a large area
  const useCherryBomb = useCallback(() => {
    const CHERRY_BOMB_COST = 150;
    
    if (sunAmount < CHERRY_BOMB_COST) return false;
    
    setSunAmount(prev => prev - CHERRY_BOMB_COST);
    
    // Destroy all enemies on screen with large area effect
    setEnemies(prevEnemies => {
      const updatedEnemies = prevEnemies.map(enemy => {
        // Apply massive damage to all enemies
        const newHealth = enemy.health - 150; // Massive damage
        
        if (newHealth <= 0) {
          return { ...enemy, health: 0 };
        }
        
        return { ...enemy, health: newHealth };
      });
      
      // Play cherry bomb sound
      if (soundManager) {
        soundManager.playPowerupSound('cherryBomb');
      }
      
      return updatedEnemies.filter(enemy => enemy.health > 0);
    });
    
    return true;
  }, [sunAmount, setSunAmount, setEnemies, soundManager]);
  
  // New Powerup: Lawn Mower - Activates all lawn mowers to clear lanes
  const useLawnMower = useCallback(() => {
    const LAWN_MOWER_COST = 200;
    
    if (sunAmount < LAWN_MOWER_COST) return false;
    
    setSunAmount(prev => prev - LAWN_MOWER_COST);
    
    // This would activate all lawn mowers (implementation depends on lawn mower system)
    // For now, we'll just destroy all enemies in the first wave of each lane
    setEnemies(prevEnemies => {
      // Group enemies by row
      const enemiesByRow: Record<number, any[]> = {};
      prevEnemies.forEach(enemy => {
        if (!enemiesByRow[enemy.row]) {
          enemiesByRow[enemy.row] = [];
        }
        enemiesByRow[enemy.row].push(enemy);
      });
      
      // Destroy first wave of enemies in each row
      const updatedEnemies = prevEnemies.map(enemy => {
        const rowEnemies = enemiesByRow[enemy.row] || [];
        const firstWave = rowEnemies.filter(e => e.position > 400); // Enemies near the right side
        
        if (firstWave.some(e => e.id === enemy.id)) {
          // Apply massive damage to first wave enemies
          const newHealth = enemy.health - 200;
          
          if (newHealth <= 0) {
            return { ...enemy, health: 0 };
          }
          
          return { ...enemy, health: newHealth };
        }
        
        return enemy;
      });
      
      // Play lawnmower sound
      if (soundManager) {
        soundManager.playPowerupSound('lawnMower');
      }
      
      return updatedEnemies.filter(enemy => enemy.health > 0);
    });
    
    return true;
  }, [sunAmount, setSunAmount, setEnemies, soundManager]);
  
  return {
    usePlantFood,
    useFreeze,
    useSunBoost,
    useCherryBomb, // New powerup
    useLawnMower   // New powerup
  };
};