
import { PlantType, WaveConfigMap } from './types';

// Game board dimensions
export const ROWS = 5;
export const COLS = 9;
export const DEFAULT_GAME_AREA = { width: 900, height: 500 };

// Plant types definition
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
    name: 'Ice Shooter', 
    cost: 175, 
    damage: 10, // Less damage but slows zombies
    range: 900, 
    cooldown: 2000,
    color: 'bg-blue-400',
    icon: '❄️' 
  },
  { 
    id: 'fireshooter', 
    name: 'Fire Shooter', 
    cost: 200, 
    damage: 50, // Increased from 35 to 50 - highest damage
    range: 800, 
    cooldown: 2500,
    color: 'bg-red-500',
    icon: '🔥' 
  },
  // New plant variations
  { 
    id: 'cherrybomb', 
    name: 'Cherry Bomb', 
    cost: 150, 
    damage: 100, // High damage in area
    range: 150, // Small area effect
    cooldown: 0, // One-time use
    color: 'bg-red-600',
    icon: '🍒' 
  },
  { 
    id: 'repeatershooter', 
    name: 'Repeater', 
    cost: 200, 
    damage: 40, // Double damage of peashooter
    range: 900, 
    cooldown: 1400, // Slightly faster than peashooter
    color: 'bg-green-600',
    icon: '🌿' 
  },
  { 
    id: 'threepeater', 
    name: 'Threepeater', 
    cost: 325, 
    damage: 20, // Same as peashooter but hits 3 lanes
    range: 900, 
    cooldown: 1600,
    color: 'bg-green-700',
    icon: '☘️' 
  },
  { 
    id: 'spikeweed', 
    name: 'Spikeweed', 
    cost: 100, 
    damage: 10, // Continuous damage to zombies walking over it
    range: 100,
    cooldown: 1000,
    color: 'bg-lime-600',
    icon: '🌵' 
  },
  { 
    id: 'torchwood', 
    name: 'Torchwood', 
    cost: 175, 
    damage: 5, // Converts normal peas to fire peas
    range: 100,
    cooldown: 0, // Passive effect
    color: 'bg-orange-700',
    icon: '🪵' 
  }
];

// Initial plant health values
export const PLANT_HEALTH = {
  sunflower: 300,
  peashooter: 300,
  wallnut: 1000,
  iceshooter: 300,
  fireshooter: 300,
  cherrybomb: 200,
  repeatershooter: 300,
  threepeater: 400,
  spikeweed: 500,
  torchwood: 600
};

// Zombie damage values
export const ZOMBIE_DAMAGE = {
  basic: 1,
  cone: 1.5,
  bucket: 2,
  door: 3
};

// Wave configuration
export const WAVE_CONFIG: WaveConfigMap = {
  1: { enemies: 5, speed: 60, health: 100, interval: 5000, types: ['basic'] },
  2: { enemies: 8, speed: 80, health: 150, interval: 4500, types: ['basic', 'cone'] },
  3: { enemies: 12, speed: 90, health: 200, interval: 4000, types: ['basic', 'cone', 'bucket'] },
  4: { enemies: 15, speed: 100, health: 250, interval: 3500, types: ['basic', 'cone', 'bucket'] },
  5: { enemies: 20, speed: 120, health: 300, interval: 3000, types: ['basic', 'cone', 'bucket', 'door'] }
};

// Wave announcement messages
export const WAVE_MESSAGES = {
  1: "Wave 1: The Scouts - Zombies spotted on the horizon!",
  2: "Wave 2: The Horde - More zombies are coming!",
  3: "Wave 3: The Heavy-Duty - Tougher zombies approaching!",
  4: "Wave 4: The Swarm - Zombie numbers increasing!",
  5: "Wave 5: Final Stand - The undead elite approaches!"
};
