
import { PlantInstance, ProjectileType, EnemyType } from '../types';

export const createProjectile = (
  plant: PlantInstance, 
  targetPosition: number, 
  cellWidth: number
): ProjectileType => {
  const plantPosition = (plant.col + 1) * cellWidth;
  
  let projectileType = 'pea';
  if (plant.type.id === 'iceshooter') projectileType = 'ice';
  if (plant.type.id === 'fireshooter') projectileType = 'fire';
  if (plant.type.id === 'lightningshooter') projectileType = 'lightning';
  
  return {
    id: `proj-${Date.now()}-${Math.random()}`,
    row: plant.row,
    startX: plantPosition - cellWidth/2,
    endX: targetPosition,
    type: projectileType,
    progress: 0
  };
};

export const updateProjectiles = (projectiles: ProjectileType[]): ProjectileType[] => {
  return projectiles.map(proj => {
    const newProgress = proj.progress + (proj.type === 'lightning' ? 0.2 : 0.1); // Lightning travels faster
    if (newProgress >= 1) {
      return null; // Remove completed projectiles
    }
    return { ...proj, progress: newProgress };
  }).filter(Boolean) as ProjectileType[];
};

// Apply projectile effects to enemies
export const applyProjectileEffects = (enemy: EnemyType, projectileType: string): EnemyType => {
  let updatedEnemy = { ...enemy };
  
  switch (projectileType) {
    case 'ice':
      // Apply freezing effect
      updatedEnemy.isFrozen = true;
      updatedEnemy.speed = updatedEnemy.speed * 0.5; // Slow the zombie by 50%
      
      // Set a timeout to remove the frozen effect after 5 seconds
      setTimeout(() => {
        updatedEnemy.isFrozen = false;
        updatedEnemy.speed = updatedEnemy.speed * 2; // Restore original speed
      }, 5000);
      break;
      
    case 'fire':
      // Apply burning effect - with more damage over time
      updatedEnemy.isBurning = true;
      updatedEnemy.burnDamage = 3; // Increased damage per tick
      
      // Set a timeout to remove the burning effect after 4 seconds
      setTimeout(() => {
        updatedEnemy.isBurning = false;
        updatedEnemy.burnDamage = 0;
      }, 4000);
      break;
      
    case 'lightning':
      // Apply electrified effect
      updatedEnemy.isElectrified = true;
      updatedEnemy.electricDamage = 5; // High damage per tick
      updatedEnemy.speed = updatedEnemy.speed * 0.3; // Significant slow effect
      
      // Set a timeout to remove the electrified effect after 2 seconds
      setTimeout(() => {
        updatedEnemy.isElectrified = false;
        updatedEnemy.electricDamage = 0;
        updatedEnemy.speed = updatedEnemy.speed / 0.3; // Restore original speed
      }, 2000);
      break;
      
    default:
      // Regular pea - no special effects
      break;
  }
  
  return updatedEnemy;
};
