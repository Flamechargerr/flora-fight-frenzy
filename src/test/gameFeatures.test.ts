import { PLANT_TYPES, WAVE_CONFIG } from '../game/constants';
import { createEnemy } from '../game/utils/enemyUtils';

describe('Game Features Test', () => {
  test('should have new plant types', () => {
    const newPlants = [
      'puffshroom',
      'scaredyshroom',
      'hypnoshroom',
      'iceshroom',
      'jalapeno'
    ];
    
    const plantIds = PLANT_TYPES.map(plant => plant.id);
    
    newPlants.forEach(plantId => {
      expect(plantIds).toContain(plantId);
    });
  });

  test('should have extended wave configuration', () => {
    // Check that we have waves 1-10
    for (let i = 1; i <= 10; i++) {
      expect(WAVE_CONFIG[i]).toBeDefined();
    }
    
    // Check that later waves have increased difficulty
    expect(WAVE_CONFIG[10].enemies).toBeGreaterThan(WAVE_CONFIG[1].enemies);
    expect(WAVE_CONFIG[10].speed).toBeGreaterThan(WAVE_CONFIG[1].speed);
    expect(WAVE_CONFIG[10].health).toBeGreaterThan(WAVE_CONFIG[1].health);
  });

  test('should create enemies with new zombie types', () => {
    const waveSettings = {
      enemies: 1,
      speed: 100,
      health: 100,
      interval: 1000,
      types: ['newspaper', 'football', 'dancing', 'gargantuar']
    };
    
    const enemy = createEnemy(waveSettings, 900);
    
    expect(waveSettings.types).toContain(enemy.type);
    expect(enemy.health).toBeGreaterThan(0);
    expect(enemy.speed).toBeGreaterThan(0);
    expect(enemy.row).toBeGreaterThanOrEqual(0);
    expect(enemy.row).toBeLessThanOrEqual(4);
  });

  test('should have proper plant properties', () => {
    const puffshroom = PLANT_TYPES.find(plant => plant.id === 'puffshroom');
    const jalapeno = PLANT_TYPES.find(plant => plant.id === 'jalapeno');
    
    expect(puffshroom).toBeDefined();
    expect(jalapeno).toBeDefined();
    
    // Check puffshroom properties
    expect(puffshroom?.isNightPlant).toBe(true);
    expect(puffshroom?.cost).toBe(0);
    
    // Check jalapeno properties
    expect(jalapeno?.isNightPlant).toBe(true);
    expect(jalapeno?.isAreaEffect).toBe(true);
    expect(jalapeno?.affectsLanes).toBe(1);
  });
});