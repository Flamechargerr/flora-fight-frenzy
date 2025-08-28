import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AchievementManager, { Achievement } from '../lib/achievementManager';
import { ArrowLeft, Trophy, Lock, Star, Target, Shield, Zap } from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [category, setCategory] = useState<'all' | string>('all');

  useEffect(() => {
    const achievementManager = AchievementManager.getInstance();
    setAchievements(achievementManager.getAllAchievements());
    setStats(achievementManager.getStats());
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-200';
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-200 animate-pulse';
      default: return 'shadow-gray-200';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'combat': return <Target className="w-4 h-4" />;
      case 'defense': return <Shield className="w-4 h-4" />;
      case 'survival': return <Zap className="w-4 h-4" />;
      case 'collection': return <Star className="w-4 h-4" />;
      case 'special': return <Trophy className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (achievement.hidden && !achievement.unlocked) return false;
    
    const matchesFilter = filter === 'all' || 
      (filter === 'unlocked' && achievement.unlocked) ||
      (filter === 'locked' && !achievement.unlocked);
    
    const matchesCategory = category === 'all' || achievement.category === category;
    
    return matchesFilter && matchesCategory;
  });

  const completionPercentage = Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-garden-light/30 to-garden/20 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass mb-6 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="flex items-center text-garden-dark hover:text-garden transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-garden-dark to-garden bg-clip-text text-transparent">
              Achievements
            </h1>
            
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-semibold">{completionPercentage}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-garden to-garden-dark h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-garden">{stats.zombiesDefeated || 0}</div>
              <div className="text-sm text-gray-600">Zombies Defeated</div>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-garden">{stats.plantsPlaced || 0}</div>
              <div className="text-sm text-gray-600">Plants Placed</div>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-garden">{stats.levelsCompleted || 0}</div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-garden">{Math.floor((stats.timePlayedSeconds || 0) / 60)}m</div>
              <div className="text-sm text-gray-600">Time Played</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass mb-6 p-4 rounded-xl">
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-garden text-white' 
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'unlocked' 
                    ? 'bg-garden text-white' 
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Unlocked
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'locked' 
                    ? 'bg-garden text-white' 
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Locked
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'combat', 'defense', 'survival', 'collection', 'special'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                    category === cat 
                      ? 'bg-garden text-white' 
                      : 'bg-white/30 text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {cat !== 'all' && getCategoryIcon(cat)}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`glass p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                achievement.unlocked 
                  ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}` 
                  : 'border-gray-300 bg-gray-100/50 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.unlocked ? achievement.title : '???'}
                    </h3>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(achievement.category)}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                        achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                        achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.unlocked ? achievement.description : 'Keep playing to unlock this achievement!'}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {achievement.maxProgress > 1 && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress} / {achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-green-400 to-green-600' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}
                      style={{ width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="glass p-8 rounded-xl text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No achievements found</h3>
            <p className="text-gray-500">Try changing your filters or play some games to unlock achievements!</p>
            <Link 
              to="/game"
              className="inline-block mt-4 bg-garden hover:bg-garden-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Play Game
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;