
import { useState } from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import { ArrowLeft, Trophy, Volume2, VolumeX } from 'lucide-react';

const Game = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const handleGameOver = () => {
    setIsGameOver(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-garden-light/30 to-garden/20 p-4 sm:p-6 md:p-8">
      {/* Game Header */}
      <div className="glass mb-6 p-4 rounded-xl flex items-center justify-between animate-fadeIn">
        <Link 
          to="/" 
          className="flex items-center text-garden-dark hover:text-garden transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-garden-dark to-garden bg-clip-text text-transparent">
          Flora Fight Frenzy
        </h1>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-600 hover:text-garden-dark transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          
          <Link 
            to="/leaderboard" 
            className="flex items-center text-garden-dark hover:text-garden transition-colors"
          >
            <Trophy className="w-5 h-5 mr-1" />
            <span>Leaderboard</span>
          </Link>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <GameBoard onGameOver={handleGameOver} />
      </div>
    </div>
  );
};

export default Game;
