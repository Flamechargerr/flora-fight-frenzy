
export interface PlantType {
  id: string;
  name: string;
  cost: number;
  damage: number;
  range: number;
  cooldown: number;
  color: string;
  icon: string;
}

export interface EnemyType {
  id: string;
  health: number;
  speed: number;
  row: number;
  position: number;
  type: string;
  isEating?: boolean;
  targetPlant?: string;
  damage?: number;
  isFrozen?: boolean;
  isBurning?: boolean;
  burnDamage?: number;
  isElectrified?: boolean;
  electricDamage?: number;
  // New PVZ-like properties
  isSlowed?: boolean;
  isStunned?: boolean;
  armor?: number;
}

export interface PlantInstance {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  lastFired: number;
  health?: number;
  maxHealth?: number;
  // New PVZ-like properties
  isAsleep?: boolean;
  isBoosted?: boolean;
  plantAge?: number;
}

export interface ProjectileType {
  id: string;
  row: number;
  startX: number;
  endX: number;
  type: string;
  progress: number;
}

export interface GameAreaDimensions {
  width: number;
  height: number;
}

export interface SunResource {
  id: string;
  x: number;
  y: number;
  value?: number; // Different sun values like in PVZ
}

export interface PowerupType {
  id: string;
  name: string;
  description: string;
  duration: number;
  icon: string;
  effectType: 'lightning' | 'freeze' | 'burn' | 'boost' | 'shovel' | 'bomb';
  cooldown: number;
  cost?: number; // Some powerups cost sun in PVZ
}

export interface ActivePowerup {
  id: string;
  type: PowerupType;
  startTime: number;
  endTime: number;
  isActive: boolean;
  targetRow?: number; // For row-specific powerups like in PVZ
  targetCol?: number; // For column-specific powerups
}

export interface UseGameStateProps {
  onGameOver: () => void;
}

export interface WaveConfig {
  enemies: number;
  speed: number;
  health: number; 
  interval: number;
  types: string[];
}

export interface WaveConfigMap {
  [key: number]: WaveConfig;
}

// New PVZ-like types
export interface Achievements {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  icon: string;
}

export interface PlayerStats {
  sunCollected: number;
  zombiesKilled: number;
  plantsPlanted: number;
  levelsCompleted: number;
}
