
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
}

export interface PlantInstance {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  lastFired: number;
  health?: number;
  maxHealth?: number;
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
}

export interface PowerupType {
  id: string;
  name: string;
  description: string;
  duration: number;
  icon: string;
  effectType: 'lightning' | 'freeze' | 'burn' | 'boost';
  cooldown: number;
}

export interface ActivePowerup {
  id: string;
  type: PowerupType;
  startTime: number;
  endTime: number;
  isActive: boolean;
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
