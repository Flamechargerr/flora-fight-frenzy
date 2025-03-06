
import { PlantType, WaveConfigMap } from './types';

// Game board dimensions
export const ROWS = 5;
export const COLS = 9;
export const DEFAULT_GAME_AREA = { width: 900, height: 500 };

// Plant types definition - more like PVZ
export const PLANT_TYPES: PlantType[] = [
  { 
    id: 'sunflower', 
    name: 'Sunflower', 
    cost: 50, 
    damage: 0, 
    range: 0, 
    cooldown: 5000,
    color: 'bg-yellow-400',
    icon: '🌻' 
  },
  { 
    id: 'peashooter', 
    name: 'Peashooter', 
    cost: 100, 
    damage: 20, 
    range: 900, 
    cooldown: 1500,
    color: 'bg-green-500',
    icon: '🌱' 
  },
  { 
    id: 'wallnut', 
    name: 'Wall Nut', 
    cost: 50, 
    damage: 0, 
    range: 0, 
    cooldown: 0,
    color: 'bg-amber-800',
    icon: '🥜' 
  },
  { 
    id: 'iceshooter', 
    name: 'Snow Pea', 
    cost: 175, 
    damage: 15, // PVZ ice does less damage but slows
    range: 900, 
    cooldown: 2000,
    color: 'bg-blue-400',
    icon: '❄️' 
  },
  { 
    id: 'fireshooter', 
    name: 'Fire Peashooter', 
    cost: 200, 
    damage: 40, // Fire does more damage in PVZ
    range: 800, 
    cooldown: 2500,
    color: 'bg-red-500',
    icon: '🔥' 
  },
];

// Initial plant health values - more like PVZ
export const PLANT_HEALTH = {
  sunflower: 300,
  peashooter: 300,
  wallnut: 4000, // Wall nuts have much higher health in PVZ
  iceshooter: 300,
  fireshooter: 300
};

// Zombie damage values - like in PVZ
export const ZOMBIE_DAMAGE = {
  basic: 1,
  cone: 1,
  bucket: 1, // All zombies do same bite damage in PVZ
  door: 1,  // The difference is in their health/armor
  gargantuar: 5 // Except special zombies
};

// Wave configuration - PVZ style progressive difficulty
export const WAVE_CONFIG: WaveConfigMap = {
  1: { enemies: 5, speed: 40, health: 200, interval: 6000, types: ['basic'] },
  2: { enemies: 8, speed: 45, health: 250, interval: 5500, types: ['basic', 'cone'] },
  3: { enemies: 12, speed: 50, health: 300, interval: 5000, types: ['basic', 'cone', 'bucket'] },
  4: { enemies: 15, speed: 55, health: 350, interval: 4500, types: ['basic', 'cone', 'bucket'] },
  5: { enemies: 20, speed: 60, health: 450, interval: 4000, types: ['basic', 'cone', 'bucket', 'door'] }
};

// Wave announcement messages - PVZ style humor
export const WAVE_MESSAGES = {
  1: "Wave 1: The Zombies are coming! Get ready!",
  2: "Wave 2: More brains... I mean zombies approaching!",
  3: "Wave 3: Look at all those zombies! Are they having a convention?",
  4: "Wave 4: HUGE WAVE OF ZOMBIES APPROACHING!",
  5: "Wave 5: FINAL WAVE! Dr. Zomboss sent his best undead!"
};

// PVZ style powerup cooldowns
export const POWERUP_COOLDOWNS = {
  shovel: 0,
  freeze: 30000,
  burn: 45000,
  lightning: 60000,
  boost: 20000
};
