import { EnemyType, WaveConfig } from '../types';
import { ZOMBIE_DAMAGE } from '../constants';

export const createEnemy = (waveSettings: WaveConfig, gameAreaWidth: number): EnemyType => {
  const id = `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // CRITICAL FIX: Use an explicit array of row values instead of calculating them
  // This guarantees that zombies are ONLY created at exact integer rows
  const fixedRows = [0, 1, 2, 3, 4]; // Only these exact row values are allowed
  const rowIndex = Math.floor(Math.random() * fixedRows.length);
  const row = fixedRows[rowIndex]; // Get the exact integer row value
  
  // Log for debugging
  console.log(`Creating zombie with FIXED row value: ${row}`);
  
  const type = waveSettings.types[Math.floor(Math.random() * waveSettings.types.length)];
  
  // Different health for different zombie types
  let healthModifier = 1;
  if (type === 'cone') healthModifier = 1.5;
  if (type === 'bucket') healthModifier = 2;
  if (type === 'door') healthModifier = 2.5;
  if (type === 'newspaper') healthModifier = 1.8;
  if (type === 'football') healthModifier = 3;
  if (type === 'dancing') healthModifier = 2.2;
  if (type === 'gargantuar') healthModifier = 5;
  
  // Different speeds for different zombie types
  let speedModifier = 1;
  if (type === 'newspaper') speedModifier = 1.2;
  if (type === 'football') speedModifier = 0.8;
  if (type === 'dancing') speedModifier = 1.1;
  if (type === 'gargantuar') speedModifier = 0.5;
  
  // FIX: Use exact integer speed with no decimals
  const speed = Math.max(1, Math.floor(waveSettings.speed * speedModifier));
  
  return {
    id,
    health: Math.max(10, Math.floor(waveSettings.health * healthModifier)),
    speed: speed, // Integer speed with no variation
    row: row, // Exact integer row from fixed array
    position: Math.floor(gameAreaWidth), // Start from right edge, exact integer
    type,
    isEating: false,
    damage: ZOMBIE_DAMAGE[type as keyof typeof ZOMBIE_DAMAGE] || 1
  };
};