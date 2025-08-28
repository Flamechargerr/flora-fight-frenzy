import { PlantInstance, ProjectileType, EnemyType } from '../types';

export const createProjectile = (
  plant: PlantInstance, 
  targetPosition: number, 
  cellWidth: number
): ProjectileType => {
  // FIX: Ensure precise integer calculations for projectile position
  const plantCol = Math.floor(plant.col);
  const plantRow = Math.floor(plant.row);
  const plantPosition = Math.floor((plantCol + 1) * cellWidth);
  
  let projectileType = 'pea';
  if (plant.type.id === 'iceshooter') projectileType = 'ice';
  if (plant.type.id === 'fireshooter') projectileType = 'fire';
  if (plant.type.id === 'lightningshooter') projectileType = 'lightning';
  
  return {
    id: `proj-${Date.now()}-${Math.random()}`,
    row: plantRow, // Exact integer row
    startX: Math.floor(plantPosition - (cellWidth/2)), // Exact integer start position
    endX: Math.floor(targetPosition), // Exact integer target position
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
  // Create a deep copy of the enemy to avoid reference issues
  const updatedEnemy: EnemyType = JSON.parse(JSON.stringify(enemy));
  
  // FIX: Ensure enemy row is an integer
  updatedEnemy.row = Math.floor(updatedEnemy.row);
  
  switch (projectileType) {
    case 'ice':
      // Apply freezing effect
      updatedEnemy.isFrozen = true;
      updatedEnemy.speed = Math.floor(updatedEnemy.speed * 0.5); // Slow the zombie by 50%
      break;
      
    case 'fire':
      // Apply burning effect - with more damage over time
      updatedEnemy.isBurning = true;
      updatedEnemy.burnDamage = 3; // Increased damage per tick
      break;
      
    case 'lightning':
      // Apply electrified effect
      updatedEnemy.isElectrified = true;
      updatedEnemy.electricDamage = 5; // High damage per tick
      updatedEnemy.speed = Math.floor(updatedEnemy.speed * 0.3); // Significant slow effect
      break;
      
    default:
      // Regular pea - no special effects
      break;
  }
  
  return updatedEnemy;
};