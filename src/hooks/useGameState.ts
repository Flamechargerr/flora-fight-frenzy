
import { useState, useEffect, useCallback, useRef } from 'react';

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
}

export interface PlantInstance {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  lastFired: number;
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

export interface UseGameStateProps {
  onGameOver: () => void;
}

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
    damage: 10, 
    range: 900, 
    cooldown: 2000,
    color: 'bg-blue-400',
    icon: '❄️' 
  },
  { 
    id: 'fireshooter', 
    name: 'Fire Shooter', 
    cost: 200, 
    damage: 35, 
    range: 800, 
    cooldown: 2500,
    color: 'bg-red-500',
    icon: '🔥' 
  },
];

export const useGameState = ({ onGameOver }: UseGameStateProps) => {
  const [sunAmount, setSunAmount] = useState(150);
  const [currentWave, setCurrentWave] = useState(1);
  const [waveProgress, setWaveProgress] = useState(0);
  const [sunResources, setSunResources] = useState<SunResource[]>([]);
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [plants, setPlants] = useState<PlantInstance[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileType[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showWaveMessage, setShowWaveMessage] = useState(false);
  const [waveMessage, setWaveMessage] = useState('');
  const [waveCompleted, setWaveCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [gameWon, setGameWon] = useState(false);
  const [debugMessage, setDebugMessage] = useState('Initializing game...');
  
  // Wave configuration
  const waveConfig = useRef({
    1: { enemies: 5, speed: 60, health: 100, interval: 5000, types: ['basic'] },
    2: { enemies: 8, speed: 80, health: 150, interval: 4500, types: ['basic', 'cone'] },
    3: { enemies: 12, speed: 90, health: 200, interval: 4000, types: ['basic', 'cone', 'bucket'] },
    4: { enemies: 15, speed: 100, health: 250, interval: 3500, types: ['basic', 'cone', 'bucket'] },
    5: { enemies: 20, speed: 120, health: 300, interval: 3000, types: ['basic', 'cone', 'bucket', 'door'] }
  });
  
  const enemiesLeftInWave = useRef(waveConfig.current[1].enemies);
  const enemiesSpawned = useRef(0);
  const enemySpawnTimer = useRef<NodeJS.Timeout | null>(null);
  const gameStarted = useRef(false);
  const activeEnemies = useRef(0);
  const gameArea = DEFAULT_GAME_AREA;

  // Starts a wave with announcement
  const showWaveAnnouncement = (waveNumber: number) => {
    const messages = {
      1: "Wave 1: The Scouts - Zombies spotted on the horizon!",
      2: "Wave 2: The Horde - More zombies are coming!",
      3: "Wave 3: The Heavy-Duty - Tougher zombies approaching!",
      4: "Wave 4: The Swarm - Zombie numbers increasing!",
      5: "Wave 5: Final Stand - The undead elite approaches!"
    };
    
    setWaveMessage(messages[waveNumber as keyof typeof messages]);
    setShowWaveMessage(true);
    setDebugMessage(`Announcing wave ${waveNumber}`);
    
    setTimeout(() => {
      setShowWaveMessage(false);
      startWave(waveNumber);
    }, 3000);
  };
  
  // Start game on initialization
  useEffect(() => {
    console.log("Game initialization started");
    setTimeout(() => {
      gameStarted.current = true;
      showWaveAnnouncement(1);
      setDebugMessage("First wave announcement triggered");
    }, 1000);
    
    return () => {
      if (enemySpawnTimer.current) {
        clearInterval(enemySpawnTimer.current);
      }
    };
  }, []);

  // Create a new enemy with the correct properties
  const createEnemy = (waveSettings: { speed: number; health: number; types: string[] }) => {
    const id = `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const row = Math.floor(Math.random() * ROWS);
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
      position: gameArea.width, // start from the right edge
      type
    };
  };
  
  // Helper function to spawn a new enemy
  const spawnNewEnemy = (waveSettings: any) => {
    const newEnemy = createEnemy(waveSettings);
    setEnemies(prev => [...prev, newEnemy]);
    enemiesSpawned.current++;
    activeEnemies.current++;
    setWaveProgress(enemiesSpawned.current);
    setDebugMessage(`Spawned enemy ${enemiesSpawned.current}/${waveSettings.enemies}, active: ${activeEnemies.current}`);
  };
  
  // Start a wave with fixed enemy spawning
  const startWave = (waveNumber: number) => {
    console.log(`Starting wave ${waveNumber}`);
    setCurrentWave(waveNumber);
    const waveSettings = waveConfig.current[waveNumber as keyof typeof waveConfig.current];
    enemiesLeftInWave.current = waveSettings.enemies;
    enemiesSpawned.current = 0;
    activeEnemies.current = 0;
    setWaveProgress(0);
    setWaveCompleted(false);
    setDebugMessage(`Wave ${waveNumber} started. Spawning enemies...`);
    
    // Clear any existing timers
    if (enemySpawnTimer.current) {
      clearInterval(enemySpawnTimer.current);
      enemySpawnTimer.current = null;
    }
    
    // Spawn first enemy immediately
    spawnNewEnemy(waveSettings);
    
    // Then set up recurring spawns with a reliable interval timer
    enemySpawnTimer.current = setInterval(() => {
      if (enemiesSpawned.current < waveSettings.enemies && !waveCompleted && gameStarted.current) {
        spawnNewEnemy(waveSettings);
      } else if (enemiesSpawned.current >= waveSettings.enemies) {
        // Stop spawning when all enemies for the wave have been spawned
        if (enemySpawnTimer.current) {
          clearInterval(enemySpawnTimer.current);
          enemySpawnTimer.current = null;
          setDebugMessage(`All enemies for wave ${waveNumber} spawned. ${activeEnemies.current} enemies active.`);
        }
      }
    }, waveSettings.interval);
  };
  
  // Complete a wave
  const completeWave = () => {
    setWaveCompleted(true);
    setScore(prev => prev + (currentWave * 100)); // Bonus for completing wave
    
    if (currentWave < 5) { 
      // Start countdown to next wave
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            showWaveAnnouncement(currentWave + 1);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Game won after wave 5
      setGameWon(true);
    }
  };

  // Generate a sun resource
  const generateSun = useCallback(() => {
    const id = Date.now().toString();
    const x = Math.random() * (gameArea.width - 100) + 50;
    const y = Math.random() * (gameArea.height - 100) + 50;
    
    setSunResources(prev => [...prev, { id, x, y }]);
    
    // Remove sun after 10 seconds if not collected
    setTimeout(() => {
      setSunResources(prev => prev.filter(sun => sun.id !== id));
    }, 10000);
  }, [gameArea.width, gameArea.height]);

  // Handle sun collection
  const collectSun = useCallback((id: string) => {
    setSunAmount(prev => prev + 25);
    setSunResources(prev => prev.filter(sun => sun.id !== id));
  }, []);

  // Fire a projectile
  const fireProjectile = (plant: PlantInstance, targetPosition: number) => {
    const cellWidth = gameArea.width / COLS;
    const plantPosition = (plant.col + 1) * cellWidth;
    
    let projectileType = 'pea';
    if (plant.type.id === 'iceshooter') projectileType = 'ice';
    if (plant.type.id === 'fireshooter') projectileType = 'fire';
    
    const newProjectile = {
      id: `proj-${Date.now()}-${Math.random()}`,
      row: plant.row,
      startX: plantPosition - cellWidth/2,
      endX: targetPosition,
      type: projectileType,
      progress: 0
    };
    
    setProjectiles(prev => [...prev, newProjectile]);
  };

  // Place a plant on the grid
  const placePlant = (row: number, col: number) => {
    if (!selectedPlant) return;
    if (sunAmount < selectedPlant.cost) return;
    
    // Check if there's already a plant at this position
    const plantExists = plants.some(p => p.row === row && p.col === col);
    if (plantExists) return;
    
    const newPlant = {
      id: `plant-${Date.now()}`,
      type: selectedPlant,
      row,
      col,
      lastFired: 0
    };
    
    setPlants(prev => [...prev, newPlant]);
    setSunAmount(prev => prev - selectedPlant.cost);
    setSelectedPlant(null);
  };

  // Generate an enemy callback (not currently used but kept for future use)
  const generateEnemy = useCallback(() => {
    if (isGameOver || waveCompleted || enemiesSpawned.current >= enemiesLeftInWave.current || !gameStarted.current) {
      return;
    }
    
    const waveSettings = waveConfig.current[currentWave as keyof typeof waveConfig.current];
    spawnNewEnemy(waveSettings);
  }, [currentWave, isGameOver, waveCompleted]);

  // Game loop - Main game logic
  useEffect(() => {
    if (isGameOver || gameWon) return;

    // Sun generation timer - more frequent sun
    const sunTimer = setInterval(() => {
      generateSun();
    }, 3000);
    
    // Projectile movement timer
    const projectileTimer = setInterval(() => {
      setProjectiles(prevProjectiles => {
        return prevProjectiles.map(proj => {
          const newProgress = proj.progress + 0.1;
          if (newProgress >= 1) {
            return null; // Remove completed projectiles
          }
          return { ...proj, progress: newProgress };
        }).filter(Boolean) as ProjectileType[];
      });
    }, 50);
    
    // Game tick timer
    const gameTickTimer = setInterval(() => {
      // Check if wave is complete when all enemies defeated
      if (enemies.length === 0 && enemiesSpawned.current >= enemiesLeftInWave.current && 
          gameStarted.current && !waveCompleted && activeEnemies.current === 0) {
        completeWave();
      }
      
      // Move enemies
      setEnemies(prevEnemies => {
        if (prevEnemies.length === 0) return prevEnemies;
        
        const newEnemies = prevEnemies.map(enemy => {
          // Move enemy based on speed
          const newPosition = enemy.position - (enemy.speed / 10);
          
          // Check for game over condition
          if (newPosition <= 0) {
            setIsGameOver(true);
            onGameOver();
          }
          
          return { ...enemy, position: newPosition };
        });
        
        // Filter out any enemies with health <= 0
        return newEnemies.filter(enemy => enemy.health > 0);
      });
      
      // Plant actions (like sunflowers generating sun, plants attacking)
      setPlants(prevPlants => {
        const now = Date.now();
        
        prevPlants.forEach(plant => {
          // Sunflower generates sun
          if (plant.type.id === 'sunflower' && now - plant.lastFired > plant.type.cooldown) {
            plant.lastFired = now;
            
            // Generate sun near this sunflower
            const cellWidth = gameArea.width / COLS;
            const cellHeight = gameArea.height / ROWS;
            const x = (plant.col * cellWidth) + (cellWidth / 2);
            const y = (plant.row * cellHeight) + (cellHeight / 2);
            
            setSunResources(prev => [...prev, { 
              id: `sun-${Date.now()}`, 
              x: x + (Math.random() * 40 - 20), 
              y: y + (Math.random() * 40 - 20) 
            }]);
          }
          
          // Attack plants damage enemies
          if (plant.type.damage > 0 && now - plant.lastFired > plant.type.cooldown) {
            // Find enemies in the same row
            const enemiesInRange = enemies.filter(enemy => {
              const cellWidth = gameArea.width / COLS;
              const plantPosition = (plant.col + 1) * cellWidth;
              
              return enemy.row === plant.row && enemy.position < plantPosition + plant.type.range;
            });
            
            if (enemiesInRange.length > 0) {
              plant.lastFired = now;
              
              // Attack the first enemy
              const targetEnemy = enemiesInRange[0];
              
              // Fire a visual projectile
              fireProjectile(plant, targetEnemy.position);
              
              setEnemies(prevEnemies => {
                return prevEnemies.map(enemy => {
                  if (enemy.id === targetEnemy.id) {
                    const newHealth = enemy.health - plant.type.damage;
                    
                    if (newHealth <= 0) {
                      // Enemy defeated
                      setScore(prev => prev + 10);
                      activeEnemies.current--; // Decrement active enemies count
                      return { ...enemy, health: 0 };
                    }
                    
                    return { ...enemy, health: newHealth };
                  }
                  return enemy;
                }).filter(enemy => enemy.health > 0);
              });
            }
          }
        });
        
        return [...prevPlants];
      });
    }, 100);
    
    // Auto-generate sun for sunflower plants
    const sunflowerTimer = setInterval(() => {
      const sunflowers = plants.filter(p => p.type.id === 'sunflower');
      if (sunflowers.length > 0) {
        // Create sun near a random sunflower
        const randomSunflower = sunflowers[Math.floor(Math.random() * sunflowers.length)];
        const cellWidth = gameArea.width / COLS;
        const cellHeight = gameArea.height / ROWS;
        const x = (randomSunflower.col * cellWidth) + (cellWidth / 2);
        const y = (randomSunflower.row * cellHeight) + (cellHeight / 2);
        
        setSunResources(prev => [...prev, { 
          id: `sun-${Date.now()}`, 
          x: x + (Math.random() * 40 - 20), 
          y: y + (Math.random() * 40 - 20) 
        }]);
      }
    }, 7000);
    
    return () => {
      clearInterval(sunTimer);
      clearInterval(projectileTimer);
      if (enemySpawnTimer.current) clearInterval(enemySpawnTimer.current);
      clearInterval(gameTickTimer);
      clearInterval(sunflowerTimer);
    };
  }, [
    currentWave, enemies, generateSun, 
    gameArea.height, gameArea.width, isGameOver, 
    onGameOver, plants, waveCompleted, gameWon
  ]);

  return {
    sunAmount,
    currentWave,
    waveProgress,
    sunResources,
    enemies,
    plants,
    projectiles,
    selectedPlant,
    setSelectedPlant,
    isGameOver,
    score,
    showWaveMessage,
    waveMessage,
    waveCompleted,
    countdown,
    gameWon,
    debugMessage,
    enemiesSpawned,
    enemiesLeftInWave,
    placePlant,
    collectSun,
    gameArea,
    plantTypes: PLANT_TYPES,
  };
};
