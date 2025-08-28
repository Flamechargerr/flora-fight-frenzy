import { SunResource, GameAreaDimensions } from '../types';

export const generateRandomSun = (gameArea: GameAreaDimensions): SunResource => {
  const id = `sun-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  // Fix: Ensure sun spawns within visible area with proper padding
  const x = Math.floor(Math.random() * (gameArea.width - 100) + 50);
  const y = Math.floor(Math.random() * (gameArea.height - 150) + 50); // Adjusted for better visibility
  
  return { id, x, y };
};

export const generateSunNearPlant = (
  x: number, 
  y: number
): SunResource => {
  // Fix: Ensure sun spawns near plant with proper positioning
  return { 
    id: `sun-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
    x: Math.floor(x + (Math.random() * 40 - 20)), 
    y: Math.floor(y + (Math.random() * 40 - 20))
  };
};