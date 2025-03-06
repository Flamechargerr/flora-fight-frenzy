
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
    // PVZ-like projectile speeds - lightning is fastest, fire is slowest
    let speedMultiplier = 0.1; // base pea speed
    
    if (proj.type === 'lightning') speedMultiplier = 0.25; // lightning travels much faster
    else if (proj.type === 'fire') speedMultiplier = 0.08; // fire travels slower
    else if (proj.type === 'ice') speedMultiplier = 0.12; // ice is slightly faster than peas
    
    const newProgress = proj.progress + speedMultiplier;
    if (newProgress >= 1) {
      return null; // Remove completed projectiles
    }
    return { ...proj, progress: newProgress };
  }).filter(Boolean) as ProjectileType[];
};

// Apply projectile effects to enemies with more PVZ-like behavior
export const applyProjectileEffects = (enemy: EnemyType, projectileType: string): EnemyType => {
  let updatedEnemy = { ...enemy };
  
  switch (projectileType) {
    case 'ice':
      // Ice slows zombies significantly - more like PVZ
      updatedEnemy.isFrozen = true;
      updatedEnemy.speed = updatedEnemy.speed * 0.4; // Slow the zombie by 60%
      
      // Ice effect lasts longer in PVZ
      setTimeout(() => {
        if (updatedEnemy.isFrozen) {
          updatedEnemy.isFrozen = false;
          updatedEnemy.speed = updatedEnemy.speed / 0.4; // Restore original speed
        }
      }, 6000); // 6 seconds of slow
      break;
      
    case 'fire':
      // Fire causes continuous damage - like Jalapeno in PVZ
      updatedEnemy.isBurning = true;
      updatedEnemy.burnDamage = 4; // Higher damage per tick
      
      // Fire effect in PVZ is shorter but more damaging
      setTimeout(() => {
        if (updatedEnemy.isBurning) {
          updatedEnemy.isBurning = false;
          updatedEnemy.burnDamage = 0;
        }
      }, 3000); // 3 seconds of burn
      break;
      
    case 'lightning':
      // Lightning stuns and damages - similar to Lightning Reed in PVZ
      updatedEnemy.isElectrified = true;
      updatedEnemy.electricDamage = 6; // Higher damage
      updatedEnemy.speed = updatedEnemy.speed * 0.2; // Significant slow/stun effect
      
      // Lightning effect is short but powerful
      setTimeout(() => {
        if (updatedEnemy.isElectrified) {
          updatedEnemy.isElectrified = false;
          updatedEnemy.electricDamage = 0;
          updatedEnemy.speed = updatedEnemy.speed / 0.2; // Restore original speed
        }
      }, 1500); // 1.5 seconds of electrification
      break;
      
    default:
      // Regular pea - standard damage but no special effects
      break;
  }
  
  return updatedEnemy;
};
