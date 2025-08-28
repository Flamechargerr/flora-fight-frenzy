
import { PlantType, WaveConfigMap } from './types';

// Game board dimensions
export const ROWS = 5;
export const COLS = 9;
export const DEFAULT_GAME_AREA = { width: 900, height: 500 };
export const STARTING_SUN = 250; // Updated starting sun

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
    icon: '🌻',
    image: '/plants/sunflower.png'
  },
  { 
    id: 'peashooter', 
    name: 'Peashooter', 
    cost: 100, 
    damage: 20, 
    range: 900, 
    cooldown: 1500,
    color: 'bg-green-500',
    icon: '🌱',
    image: '/plants/peashooter.png'
  },
  { 
    id: 'wallnut', 
    name: 'Wall Nut', 
    cost: 50, 
    damage: 0, 
    range: 0, 
    cooldown: 0,
    color: 'bg-amber-800',
    icon: '🥜',
    image: '/plants/wallnut.png'
  },
  { 
    id: 'iceshooter', 
    name: 'Ice Shooter', 
    cost: 175, 
    damage: 10, // Less damage but slows zombies
    range: 900, 
    cooldown: 2000,
    color: 'bg-blue-400',
    icon: '❄️',
    image: '/plants/iceshooter.png'
  },
  { 
    id: 'fireshooter', 
    name: 'Fire Shooter', 
    cost: 200, 
    damage: 50, // Increased from 35 to 50 - highest damage
    range: 800, 
    cooldown: 2500,
    color: 'bg-red-500',
    icon: '🔥',
    image: '/plants/fireshooter.png'
  },
  // Plant variations with correct mechanics
  { 
    id: 'cherrybomb', 
    name: 'Cherry Bomb', 
    cost: 150, 
    damage: 100, // High damage in area
    range: 150, // Small area effect
    cooldown: 0, // One-time use
    isAreaEffect: true, // Flag for area damage
    color: 'bg-red-600',
    icon: '🍒',
    image: '/plants/cherrybomb.png'
  },
  { 
    id: 'repeatershooter', 
    name: 'Repeater', 
    cost: 200, 
    damage: 40, // Double damage of peashooter
    range: 900, 
    cooldown: 1400, // Slightly faster than peashooter
    color: 'bg-green-600',
    icon: '🌿',
    image: '/plants/repeater.png'
  },
  { 
    id: 'threepeater', 
    name: 'Threepeater', 
    cost: 325, 
    damage: 20, // Same as peashooter but hits 3 lanes
    range: 900, 
    cooldown: 1600,
    affectsLanes: 3, // Affects 3 lanes
    color: 'bg-green-700',
    icon: '☘️',
    image: '/plants/threepeater.png'
  },
  { 
    id: 'spikeweed', 
    name: 'Spikeweed', 
    cost: 100, 
    damage: 10, // Continuous damage to zombies walking over it
    range: 50, // Very short range
    cooldown: 500, // Quick damage ticks
    isPassive: true, // Flag for passive damage
    color: 'bg-lime-600',
    icon: '🌵',
    image: '/plants/spikeweed.png'
  },
  { 
    id: 'torchwood', 
    name: 'Torchwood', 
    cost: 175, 
    damage: 5, // Converts normal peas to fire peas
    range: 100,
    cooldown: 0, // Passive effect
    isPeaConverter: true, // Flag for pea conversion
    color: 'bg-orange-700',
    icon: '🪵',
    image: '/plants/torchwood.png'
  },
  // New enhanced plants
  { 
    id: 'puffshroom', 
    name: 'Puff-shroom', 
    cost: 0, 
    damage: 20, 
    range: 300, 
    cooldown: 1500,
    color: 'bg-purple-400',
    icon: '🍄',
    image: '/plants/puffshroom.png',
    isNightPlant: true // Only available at night
  },
  { 
    id: 'scaredyshroom', 
    name: 'Scaredy-shroom', 
    cost: 25, 
    damage: 20, 
    range: 400, 
    cooldown: 2000,
    color: 'bg-purple-500',
    icon: '😨',
    image: '/plants/scaredyshroom.png',
    isNightPlant: true, // Only available at night
    scared: true // Hides when zombies approach
  },
  { 
    id: 'hypnoshroom', 
    name: 'Hypno-shroom', 
    cost: 75, 
    damage: 0, 
    range: 0, 
    cooldown: 0,
    color: 'bg-purple-600',
    icon: '😵',
    image: '/plants/hypnoshroom.png',
    isNightPlant: true, // Only available at night
    isHypnotize: true // Hypnotizes zombies
  },
  { 
    id: 'iceshroom', 
    name: 'Ice-shroom', 
    cost: 75, 
    damage: 20, 
    range: 900, 
    cooldown: 0,
    color: 'bg-blue-300',
    icon: '🧊',
    image: '/plants/iceshroom.png',
    isNightPlant: true, // Only available at night
    isAreaEffect: true, // Area effect
    freezeDuration: 10000 // Freeze duration in ms
  },
  { 
    id: 'jalapeno', 
    name: 'Jalapeño', 
    cost: 125, 
    damage: 200, 
    range: 900, 
    cooldown: 0,
    color: 'bg-red-700',
    icon: '🌶️',
    image: '/plants/jalapeno.png',
    isNightPlant: true, // Only available at night
    isAreaEffect: true, // Area effect
    affectsLanes: 1 // Affects entire lane
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
  torchwood: 600,
  // New plant health values
  puffshroom: 100,
  scaredyshroom: 150,
  hypnoshroom: 200,
  iceshroom: 150,
  jalapeno: 100
};

// Zombie damage values
export const ZOMBIE_DAMAGE = {
  basic: 1,
  cone: 1.5,
  bucket: 2,
  door: 3,
  newspaper: 2.5,
  football: 3.5,
  dancing: 2,
  gargantuar: 5
};

// Wave configuration
export const WAVE_CONFIG: WaveConfigMap = {
  1: { enemies: 5, speed: 60, health: 100, interval: 5000, types: ['basic'] },
  2: { enemies: 8, speed: 80, health: 150, interval: 4500, types: ['basic', 'cone'] },
  3: { enemies: 12, speed: 90, health: 200, interval: 4000, types: ['basic', 'cone', 'bucket'] },
  4: { enemies: 15, speed: 100, health: 250, interval: 3500, types: ['basic', 'cone', 'bucket'] },
  5: { enemies: 20, speed: 120, health: 300, interval: 3000, types: ['basic', 'cone', 'bucket', 'door'] },
  // New enhanced waves
  6: { enemies: 25, speed: 130, health: 350, interval: 3000, types: ['basic', 'cone', 'bucket', 'door'] },
  7: { enemies: 30, speed: 140, health: 400, interval: 2500, types: ['basic', 'cone', 'bucket', 'door', 'newspaper'] },
  8: { enemies: 35, speed: 150, health: 450, interval: 2500, types: ['basic', 'cone', 'bucket', 'door', 'newspaper', 'football'] },
  9: { enemies: 40, speed: 160, health: 500, interval: 2000, types: ['basic', 'cone', 'bucket', 'door', 'newspaper', 'football', 'dancing'] },
  10: { enemies: 50, speed: 180, health: 600, interval: 1500, types: ['basic', 'cone', 'bucket', 'door', 'newspaper', 'football', 'dancing', 'gargantuar'] }
};

// Wave announcement messages
export const WAVE_MESSAGES = {
  1: "Wave 1: The Scouts - Zombies spotted on the horizon!",
  2: "Wave 2: The Horde - More zombies are coming!",
  3: "Wave 3: The Heavy-Duty - Tougher zombies approaching!",
  4: "Wave 4: The Swarm - Zombie numbers increasing!",
  5: "Wave 5: Final Stand - The undead elite approaches!",
  // New wave messages
  6: "Wave 6: The Reinforcements - More zombies are coming!",
  7: "Wave 7: The Newspaper Gang - Watch out for newspaper zombies!",
  8: "Wave 8: Football Fury - Football zombies are charging!",
  9: "Wave 9: Dancing Zombies - They're dancing toward your house!",
  10: "Wave 10: Gargantuar Attack - The giants are here!"
};
