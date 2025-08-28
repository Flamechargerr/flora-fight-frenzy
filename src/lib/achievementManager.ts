/**
 * Achievement System for Flora Fight Frenzy
 * Tracks player progress and unlocks achievements
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  hidden: boolean; // Some achievements are hidden until unlocked
  category: 'combat' | 'defense' | 'survival' | 'collection' | 'special';
}

export interface AchievementStats {
  zombiesDefeated: number;
  plantsPlaced: number;
  sunCollected: number;
  wavesCompleted: number;
  levelsCompleted: number;
  gamesPlayed: number;
  totalScore: number;
  highestScore: number;
  survivedWithoutLawnMower: number;
  perfectWaves: number; // Waves completed without taking damage
  plantsLost: number;
  timePlayedSeconds: number;
  consecutiveWins: number;
  biggestCombo: number;
}

class AchievementManager {
  private static instance: AchievementManager;
  private achievements: Map<string, Achievement> = new Map();
  private stats: AchievementStats = this.getDefaultStats();
  private listeners: Array<(achievement: Achievement) => void> = [];

  private constructor() {
    this.initializeAchievements();
    this.loadProgress();
  }

  static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  private getDefaultStats(): AchievementStats {
    return {
      zombiesDefeated: 0,
      plantsPlaced: 0,
      sunCollected: 0,
      wavesCompleted: 0,
      levelsCompleted: 0,
      gamesPlayed: 0,
      totalScore: 0,
      highestScore: 0,
      survivedWithoutLawnMower: 0,
      perfectWaves: 0,
      plantsLost: 0,
      timePlayedSeconds: 0,
      consecutiveWins: 0,
      biggestCombo: 0
    };
  }

  private initializeAchievements() {
    const achievementData: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
      // Combat Achievements
      {
        id: 'first_blood',
        title: 'First Blood',
        description: 'Defeat your first zombie',
        icon: '⚔️',
        rarity: 'common',
        maxProgress: 1,
        hidden: false,
        category: 'combat'
      },
      {
        id: 'zombie_slayer',
        title: 'Zombie Slayer',
        description: 'Defeat 100 zombies',
        icon: '🗡️',
        rarity: 'common',
        maxProgress: 100,
        hidden: false,
        category: 'combat'
      },
      {
        id: 'undead_hunter',
        title: 'Undead Hunter',
        description: 'Defeat 500 zombies',
        icon: '🏹',
        rarity: 'rare',
        maxProgress: 500,
        hidden: false,
        category: 'combat'
      },
      {
        id: 'apocalypse_survivor',
        title: 'Apocalypse Survivor',
        description: 'Defeat 1000 zombies',
        icon: '💀',
        rarity: 'epic',
        maxProgress: 1000,
        hidden: false,
        category: 'combat'
      },

      // Defense Achievements
      {
        id: 'green_thumb',
        title: 'Green Thumb',
        description: 'Plant your first defender',
        icon: '🌱',
        rarity: 'common',
        maxProgress: 1,
        hidden: false,
        category: 'defense'
      },
      {
        id: 'gardener',
        title: 'Gardener',
        description: 'Plant 50 defenders',
        icon: '🌿',
        rarity: 'common',
        maxProgress: 50,
        hidden: false,
        category: 'defense'
      },
      {
        id: 'master_gardener',
        title: 'Master Gardener',
        description: 'Plant 200 defenders',
        icon: '🌳',
        rarity: 'rare',
        maxProgress: 200,
        hidden: false,
        category: 'defense'
      },
      {
        id: 'botanical_fortress',
        title: 'Botanical Fortress',
        description: 'Survive a wave without losing any plants',
        icon: '🏰',
        rarity: 'epic',
        maxProgress: 1,
        hidden: false,
        category: 'defense'
      },

      // Collection Achievements
      {
        id: 'sun_collector',
        title: 'Sun Collector',
        description: 'Collect 1000 sun points',
        icon: '☀️',
        rarity: 'common',
        maxProgress: 1000,
        hidden: false,
        category: 'collection'
      },
      {
        id: 'solar_powered',
        title: 'Solar Powered',
        description: 'Collect 5000 sun points',
        icon: '🔆',
        rarity: 'rare',
        maxProgress: 5000,
        hidden: false,
        category: 'collection'
      },

      // Survival Achievements
      {
        id: 'last_stand',
        title: 'Last Stand',
        description: 'Survive until the final wave without using a lawnmower',
        icon: '🛡️',
        rarity: 'legendary',
        maxProgress: 1,
        hidden: true,
        category: 'survival'
      },
      {
        id: 'perfect_defense',
        title: 'Perfect Defense',
        description: 'Complete 5 perfect waves (no damage taken)',
        icon: '⭐',
        rarity: 'epic',
        maxProgress: 5,
        hidden: false,
        category: 'survival'
      },
      {
        id: 'marathon_survivor',
        title: 'Marathon Survivor',
        description: 'Play for 1 hour total',
        icon: '⏱️',
        rarity: 'rare',
        maxProgress: 3600, // 1 hour in seconds
        hidden: false,
        category: 'survival'
      },

      // Special Achievements
      {
        id: 'speed_runner',
        title: 'Speed Runner',
        description: 'Complete level 1 in under 3 minutes',
        icon: '🏃',
        rarity: 'epic',
        maxProgress: 1,
        hidden: true,
        category: 'special'
      },
      {
        id: 'high_scorer',
        title: 'High Scorer',
        description: 'Achieve a score of 10,000 points',
        icon: '🏆',
        rarity: 'rare',
        maxProgress: 1,
        hidden: false,
        category: 'special'
      },
      {
        id: 'legend',
        title: 'Garden Legend',
        description: 'Complete all levels with perfect scores',
        icon: '👑',
        rarity: 'legendary',
        maxProgress: 5,
        hidden: true,
        category: 'special'
      }
    ];

    achievementData.forEach(data => {
      const achievement: Achievement = {
        ...data,
        progress: 0,
        unlocked: false
      };
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Event handlers for updating progress
  onZombieDefeated() {
    this.stats.zombiesDefeated++;
    this.updateAchievementProgress('first_blood', 1);
    this.updateAchievementProgress('zombie_slayer', this.stats.zombiesDefeated);
    this.updateAchievementProgress('undead_hunter', this.stats.zombiesDefeated);
    this.updateAchievementProgress('apocalypse_survivor', this.stats.zombiesDefeated);
    this.saveProgress();
  }

  onPlantPlaced() {
    this.stats.plantsPlaced++;
    this.updateAchievementProgress('green_thumb', 1);
    this.updateAchievementProgress('gardener', this.stats.plantsPlaced);
    this.updateAchievementProgress('master_gardener', this.stats.plantsPlaced);
    this.saveProgress();
  }

  onSunCollected(amount: number) {
    this.stats.sunCollected += amount;
    this.updateAchievementProgress('sun_collector', this.stats.sunCollected);
    this.updateAchievementProgress('solar_powered', this.stats.sunCollected);
    this.saveProgress();
  }

  onWaveCompleted(perfect: boolean = false) {
    this.stats.wavesCompleted++;
    if (perfect) {
      this.stats.perfectWaves++;
      this.updateAchievementProgress('perfect_defense', this.stats.perfectWaves);
    }
    this.saveProgress();
  }

  onLevelCompleted() {
    this.stats.levelsCompleted++;
    this.stats.consecutiveWins++;
    this.saveProgress();
  }

  onGameStarted() {
    this.stats.gamesPlayed++;
    this.saveProgress();
  }

  onScoreAchieved(score: number) {
    this.stats.totalScore += score;
    if (score > this.stats.highestScore) {
      this.stats.highestScore = score;
      if (score >= 10000) {
        this.updateAchievementProgress('high_scorer', 1);
      }
    }
    this.saveProgress();
  }

  onPlayTimeUpdate(seconds: number) {
    this.stats.timePlayedSeconds += seconds;
    this.updateAchievementProgress('marathon_survivor', this.stats.timePlayedSeconds);
    this.saveProgress();
  }

  onPlantLost() {
    this.stats.plantsLost++;
    this.saveProgress();
  }

  onLawnMowerUsed() {
    this.stats.consecutiveWins = 0; // Reset streak if lawnmower is used
    this.saveProgress();
  }

  private updateAchievementProgress(achievementId: string, progress: number) {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.progress = Math.min(progress, achievement.maxProgress);
    
    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      this.unlockAchievement(achievement);
    }
  }

  private unlockAchievement(achievement: Achievement) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    
    // Notify listeners
    this.listeners.forEach(listener => listener(achievement));
    
    console.log(`Achievement unlocked: ${achievement.title}`);
  }

  // Public methods
  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.unlocked);
  }

  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.getAllAchievements().filter(a => a.category === category);
  }

  getStats(): AchievementStats {
    return { ...this.stats };
  }

  getCompletionPercentage(): number {
    const total = this.achievements.size;
    const unlocked = this.getUnlockedAchievements().length;
    return Math.round((unlocked / total) * 100);
  }

  addAchievementListener(listener: (achievement: Achievement) => void) {
    this.listeners.push(listener);
  }

  removeAchievementListener(listener: (achievement: Achievement) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private saveProgress() {
    try {
      const data = {
        achievements: Object.fromEntries(
          Array.from(this.achievements.entries()).map(([id, achievement]) => [
            id,
            {
              progress: achievement.progress,
              unlocked: achievement.unlocked,
              unlockedAt: achievement.unlockedAt
            }
          ])
        ),
        stats: this.stats
      };
      localStorage.setItem('flora_achievements', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save achievement progress:', error);
    }
  }

  private loadProgress() {
    try {
      const saved = localStorage.getItem('flora_achievements');
      if (!saved) return;

      const data = JSON.parse(saved);
      
      // Load achievement progress
      if (data.achievements) {
        Object.entries(data.achievements).forEach(([id, savedData]: [string, any]) => {
          const achievement = this.achievements.get(id);
          if (achievement && savedData) {
            achievement.progress = savedData.progress || 0;
            achievement.unlocked = savedData.unlocked || false;
            if (savedData.unlockedAt) {
              achievement.unlockedAt = new Date(savedData.unlockedAt);
            }
          }
        });
      }

      // Load stats
      if (data.stats) {
        this.stats = { ...this.getDefaultStats(), ...data.stats };
      }
    } catch (error) {
      console.warn('Failed to load achievement progress:', error);
    }
  }

  resetProgress() {
    this.stats = this.getDefaultStats();
    this.achievements.forEach(achievement => {
      achievement.progress = 0;
      achievement.unlocked = false;
      delete achievement.unlockedAt;
    });
    localStorage.removeItem('flora_achievements');
  }
}

export default AchievementManager;