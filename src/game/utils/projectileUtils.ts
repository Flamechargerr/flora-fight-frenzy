
import { PlantInstance, ProjectileType } from '../types';

export const createProjectile = (
  plant: PlantInstance, 
  targetPosition: number, 
  cellWidth: number
): ProjectileType => {
  const plantPosition = (plant.col + 1) * cellWidth;
  
  let projectileType = 'pea';
  if (plant.type.id === 'iceshooter') projectileType = 'ice';
  if (plant.type.id === 'fireshooter') projectileType = 'fire';
  
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
    const newProgress = proj.progress + 0.1;
    if (newProgress >= 1) {
      return null; // Remove completed projectiles
    }
    return { ...proj, progress: newProgress };
  }).filter(Boolean) as ProjectileType[];
};
