
import { SunResource, GameAreaDimensions } from '../types';

export const generateRandomSun = (gameArea: GameAreaDimensions): SunResource => {
  const id = Date.now().toString();
  const x = Math.random() * (gameArea.width - 100) + 50;
  const y = Math.random() * (gameArea.height - 100) + 50;
  
  return { id, x, y };
};

export const generateSunNearPlant = (
  x: number, 
  y: number
): SunResource => {
  return { 
    id: `sun-${Date.now()}`, 
    x: x + (Math.random() * 40 - 20), 
    y: y + (Math.random() * 40 - 20) 
  };
};
