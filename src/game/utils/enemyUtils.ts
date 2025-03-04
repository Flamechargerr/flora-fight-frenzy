
import { EnemyType, WaveConfig } from '../types';
import { ZOMBIE_DAMAGE } from '../constants';

export const createEnemy = (waveSettings: WaveConfig, gameAreaWidth: number): EnemyType => {
  const id = `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const row = Math.floor(Math.random() * 5); // Using 5 as ROWS
  const type = waveSettings.types[Math.floor(Math.random() * waveSettings.types.length)];
  
  // Different health for different zombie types
  let healthModifier = 1;
  if (type === 'cone') healthModifier = 1.5;
  if (type === 'bucket') healthModifier = 2;
  if (type === 'door') healthModifier = 2.5;
  
  return {
    id,
    health: waveSettings.health * healthModifier,
    speed: waveSettings.speed + (Math.random() * 20 - 10), // Add some variation
    row,
    position: gameAreaWidth, // start from the right edge
    type,
    isEating: false,
    damage: ZOMBIE_DAMAGE[type as keyof typeof ZOMBIE_DAMAGE] || 1
  };
};
