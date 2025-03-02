
import { useState, useEffect, useCallback, useRef } from 'react';
import PlantCard from './PlantCard';
import SunResource from './SunResource';
import Enemy from './Enemy';
import Plant from './Plant';
import { Sun } from 'lucide-react';

interface GameBoardProps {
  onGameOver: () => void;
}

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

interface EnemyType {
  id: string;
  health: number;
  speed: number;
  row: number;
  position: number;
}

interface PlantInstance {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  lastFired: number;
}

interface GridPosition {
  row: number;
  col: number;
}

const GameBoard = ({ onGameOver }: GameBoardProps) => {
  const [sunAmount, setSunAmount] = useState(150); // Starting with more sun
  const [currentWave, setCurrentWave] = useState(1);
  const [waveProgress, setWaveProgress] = useState(0);
  const [sunResources, setSunResources] = useState<{id: string, x: number, y: number}[]>([]);
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [plants, setPlants] = useState<PlantInstance[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showWaveMessage, setShowWaveMessage] = useState(false);
  const [waveMessage, setWaveMessage] = useState('');
  const [waveCompleted, setWaveCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [gameWon, setGameWon] = useState(false);
  
  const waveConfig = useRef({
    1: { enemies: 10, speed: 80, health: 100, interval: 3000 },
    2: { enemies: 15, speed: 100, health: 150, interval: 2500 },
    3: { enemies: 20, speed: 120, health: 200, interval: 2000 }
  });
  
  const enemiesLeftInWave = useRef(waveConfig.current[1].enemies);
  const enemiesSpawned = useRef(0);
  
  const ROWS = 5;
  const COLS = 9;
  const gameArea = { width: 900, height: 500 };

  // Plant types
  const plantTypes: PlantType[] = [
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
  ];

  // Start the first wave
  useEffect(() => {
    setTimeout(() => {
      showWaveAnnouncement(1);
    }, 1000);
  }, []);

  // Wave announcement handler
  const showWaveAnnouncement = (waveNumber: number) => {
    const messages = {
      1: "Wave 1: The Scouts - Zombies spotted on the horizon!",
      2: "Wave 2: The Horde - More zombies are coming!",
      3: "Wave 3: Final Stand - The undead elite approaches!"
    };
    
    setWaveMessage(messages[waveNumber as keyof typeof messages]);
    setShowWaveMessage(true);
    
    setTimeout(() => {
      setShowWaveMessage(false);
      startWave(waveNumber);
    }, 3000);
  };
  
  // Start a wave
  const startWave = (waveNumber: number) => {
    setCurrentWave(waveNumber);
    enemiesLeftInWave.current = waveConfig.current[waveNumber as keyof typeof waveConfig.current].enemies;
    enemiesSpawned.current = 0;
    setWaveProgress(0);
    setWaveCompleted(false);
  };
  
  // Complete a wave
  const completeWave = () => {
    setWaveCompleted(true);
    setScore(prev => prev + (currentWave * 100)); // Bonus for completing wave
    
    if (currentWave < 3) {
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
      // Game won after wave 3
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

  // Generate enemies for current wave
  const generateEnemy = useCallback(() => {
    if (isGameOver || waveCompleted || enemiesSpawned.current >= enemiesLeftInWave.current) return;
    
    const waveSettings = waveConfig.current[currentWave as keyof typeof waveConfig.current];
    const id = Date.now().toString();
    const row = Math.floor(Math.random() * ROWS);
    const health = waveSettings.health;
    const speed = waveSettings.speed + (Math.random() * 20 - 10); // Add some variation
    
    setEnemies(prev => [...prev, { 
      id, 
      health, 
      speed, 
      row, 
      position: gameArea.width // start from the right edge
    }]);
    
    enemiesSpawned.current++;
  }, [currentWave, gameArea.width, isGameOver, waveCompleted]);

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

  // Game loop
  useEffect(() => {
    if (isGameOver || gameWon) return;

    // Sun generation timer - more frequent sun
    const sunTimer = setInterval(() => {
      generateSun();
    }, 3000);
    
    // Enemy generation timer based on current wave
    const waveSettings = waveConfig.current[currentWave as keyof typeof waveConfig.current];
    const enemyTimer = setInterval(() => {
      if (enemiesSpawned.current < waveSettings.enemies && !waveCompleted) {
        generateEnemy();
      }
    }, waveSettings.interval);
    
    // Game tick timer
    const gameTickTimer = setInterval(() => {
      // Check if wave is complete
      if (enemies.length === 0 && enemiesSpawned.current >= waveSettings.enemies && !waveCompleted) {
        completeWave();
      }
      
      // Move enemies
      setEnemies(prevEnemies => {
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
        
        return newEnemies;
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
              
              setEnemies(prevEnemies => {
                return prevEnemies.map(enemy => {
                  if (enemy.id === targetEnemy.id) {
                    const newHealth = enemy.health - plant.type.damage;
                    
                    if (newHealth <= 0) {
                      // Enemy defeated
                      setScore(prev => prev + 10);
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
      clearInterval(enemyTimer);
      clearInterval(gameTickTimer);
      clearInterval(sunflowerTimer);
    };
  }, [
    currentWave, enemies, generateEnemy, generateSun, 
    gameArea.height, gameArea.width, isGameOver, 
    onGameOver, plants, COLS, ROWS, waveCompleted, gameWon
  ]);

  // Render grid
  const renderGrid = () => {
    const cells = [];
    const cellWidth = 100 / COLS;
    const cellHeight = 100 / ROWS;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isOccupied = plants.some(p => p.row === row && p.col === col);
        const isAvailable = !isOccupied && selectedPlant !== null;
        
        cells.push(
          <div 
            key={`cell-${row}-${col}`}
            className={`grid-cell ${isAvailable ? 'available' : ''} ${isOccupied ? 'unavailable' : ''}`}
            style={{ 
              width: `${cellWidth}%`, 
              height: `${cellHeight}%`,
              position: 'absolute',
              left: `${col * cellWidth}%`,
              top: `${row * cellHeight}%`,
            }}
            onClick={() => isAvailable && placePlant(row, col)}
          >
            {/* Show visual indicator when placing plants */}
            {selectedPlant && !isOccupied && (
              <div className="absolute inset-0 bg-garden-light/30 flex items-center justify-center rounded-md">
                <span className="text-2xl opacity-50">{selectedPlant.icon}</span>
              </div>
            )}
          </div>
        );
      }
    }
    
    return cells;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Game UI Header */}
      <div className="glass mb-4 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-garden-light/50 px-4 py-2 rounded-lg flex items-center mr-4">
            <Sun className="text-yellow-400 w-5 h-5 mr-2" />
            <span className="font-bold">{sunAmount}</span>
          </div>
          
          <div className="bg-garden-light/50 px-4 py-2 rounded-lg">
            <span className="text-sm">Wave {currentWave}/3</span>
            <div className="w-32 h-2 bg-white/50 rounded-full mt-1">
              <div 
                className="h-full bg-garden rounded-full transition-all duration-200"
                style={{ width: `${(waveProgress / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-garden-light/50 px-4 py-2 rounded-lg">
          <span className="font-bold">Score: {score}</span>
        </div>
      </div>
      
      {/* Game Board */}
      <div className="relative flex-1 flex">
        {/* Plant Selection */}
        <div className="w-40 glass rounded-xl p-3 mr-4 flex flex-col gap-3 overflow-y-auto">
          {plantTypes.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              selected={selectedPlant?.id === plant.id}
              canAfford={sunAmount >= plant.cost}
              onClick={() => setSelectedPlant(selectedPlant?.id === plant.id ? null : plant)}
            />
          ))}
        </div>
        
        {/* Game Grid */}
        <div 
          className="flex-1 glass rounded-xl relative overflow-hidden"
          style={{ height: `${gameArea.height}px` }}
        >
          {/* Grid background - grass texture */}
          <div className="absolute inset-0 bg-garden-light/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjZGU5YzYiPjwvcmVjdD4KPC9zdmc+')] opacity-50" />
          
          {/* Grid cells */}
          {renderGrid()}
          
          {/* Plants */}
          {plants.map((plant) => (
            <Plant
              key={plant.id}
              plant={plant}
              gridDimensions={{ rows: ROWS, cols: COLS }}
              gameAreaSize={gameArea}
            />
          ))}
          
          {/* Enemies */}
          {enemies.map((enemy) => (
            <Enemy
              key={enemy.id}
              enemy={enemy}
              gridDimensions={{ rows: ROWS, cols: COLS }}
              gameAreaSize={gameArea}
            />
          ))}
          
          {/* Sun resources */}
          {sunResources.map((sun) => (
            <SunResource
              key={sun.id}
              id={sun.id}
              x={sun.x}
              y={sun.y}
              onCollect={collectSun}
            />
          ))}
          
          {/* Wave message overlay */}
          {showWaveMessage && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 animate-fadeIn">
              <div className="text-center p-6 bg-garden-dark/90 rounded-xl border-2 border-garden">
                <h2 className="text-3xl font-bold text-white mb-2">{waveMessage}</h2>
                <p className="text-yellow-200">Prepare your defenses!</p>
              </div>
            </div>
          )}
          
          {/* Between waves countdown */}
          {waveCompleted && currentWave < 3 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 animate-fadeIn">
              <div className="text-center p-6 bg-garden-dark/90 rounded-xl border-2 border-garden">
                <h2 className="text-3xl font-bold text-white mb-2">Wave {currentWave} Complete!</h2>
                <p className="text-yellow-200 mb-4">Next wave starting in {countdown} seconds</p>
                <p className="text-white">Plant more defenses while you can!</p>
              </div>
            </div>
          )}
          
          {/* Game won overlay */}
          {gameWon && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fadeIn">
              <h2 className="text-4xl font-bold text-white mb-2">Victory!</h2>
              <p className="text-xl text-white mb-6">The garden is saved! Final Score: {score}</p>
              <p className="text-white mb-4 max-w-md text-center">
                "Thank you, brave defender," whispers the elder Sunflower. "The Plant Stars will remember your bravery."
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-garden rounded-lg text-white font-bold hover:bg-garden-dark transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
          
          {/* Game over overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fadeIn">
              <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>
              <p className="text-xl text-white mb-6">The zombies have invaded! Final Score: {score}</p>
              <p className="text-white mb-4 max-w-md text-center">
                "We'll rise again," the plants whisper as the zombies overrun your garden.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-garden rounded-lg text-white font-bold hover:bg-garden-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
