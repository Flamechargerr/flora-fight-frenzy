import { Link } from 'react-router-dom';
import { Sun, Lock, Play } from 'lucide-react';

const levels = [
  { id: 1, name: 'Level 1', unlocked: true },
  { id: 2, name: 'Level 2', unlocked: true },
  { id: 3, name: 'Level 3', unlocked: false },
  { id: 4, name: 'Level 4', unlocked: false },
  { id: 5, name: 'Level 5', unlocked: false },
];

const LevelSelect = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-garden-light/30 to-garden/20 overflow-hidden">
      <div className="glass rounded-2xl p-10 w-full max-w-xl text-center z-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-garden-dark to-garden bg-clip-text text-transparent">
          Select a Level
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {levels.map(level => (
            <div key={level.id} className={`rounded-xl p-6 shadow-lg flex flex-col items-center justify-center border-2 ${level.unlocked ? 'border-garden bg-white/80' : 'border-gray-400 bg-gray-200/60 opacity-60'}`}>
              <div className="mb-2">
                {level.unlocked ? <Sun className="h-8 w-8 text-sun animate-float" /> : <Lock className="h-8 w-8 text-gray-400" />}
              </div>
              <div className="font-bold text-lg mb-2 text-garden-dark">{level.name}</div>
              {level.unlocked ? (
                <Link to="/game" className="flex items-center bg-garden text-white px-4 py-2 rounded-lg font-semibold hover:bg-garden-dark transition-colors">
                  <Play className="mr-2 h-4 w-4" /> Play
                </Link>
              ) : (
                <span className="text-gray-500 text-sm flex items-center"><Lock className="mr-1 h-4 w-4" /> Locked</span>
              )}
            </div>
          ))}
        </div>
        <Link to="/" className="text-garden-dark hover:text-garden font-semibold transition-colors">Back to Main Menu</Link>
      </div>
    </div>
  );
};

export default LevelSelect; 