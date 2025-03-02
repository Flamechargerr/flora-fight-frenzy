
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import { ArrowLeft, Trophy, Volume2, VolumeX, Play } from 'lucide-react';

const Game = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleGameOver = () => {
    console.log("Game over triggered from GameBoard");
    setIsGameOver(true);
  };

  useEffect(() => {
    // Auto-hide intro after 8 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-garden-light/30 to-garden/20 p-4 sm:p-6 md:p-8">
      {/* Story Intro */}
      {showIntro && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 animate-fadeIn">
          <div className="max-w-2xl glass p-6 rounded-xl text-left">
            <h2 className="text-2xl font-bold text-garden mb-4">The Last Garden</h2>
            <p className="mb-3 text-white">
              As zombie hordes approach your precious garden, the ancient Plant Stars have awakened to defend their realm. 
            </p>
            <p className="mb-3 text-white">
              "For centuries we have lived in peace," whispers the elder Sunflower, "but now the undead threaten our existence."
            </p>
            <p className="mb-3 text-white">
              You must help the Plant Stars survive three waves of zombies. Collect sunlight to grow your defenses and stop the zombies before they cross your garden!
            </p>
            <button 
              onClick={() => setShowIntro(false)}
              className="mt-4 bg-garden px-4 py-2 rounded-lg text-white font-bold hover:bg-garden-dark transition-colors"
            >
              Begin Defense!
            </button>
          </div>
        </div>
      )}

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
        {!gameStarted ? (
          <div className="glass p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-garden-dark mb-4">Ready to Defend Your Garden?</h2>
            <p className="mb-6 text-gray-700">
              Place your plants strategically to defend against the zombie horde. 
              Collect sun to plant more defenders. Don't let zombies reach the left side of your garden!
            </p>
            <button 
              onClick={() => setGameStarted(true)}
              className="bg-garden hover:bg-garden-dark text-white font-bold py-3 px-8 rounded-lg text-lg flex items-center mx-auto transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Defending!
            </button>
          </div>
        ) : (
          <GameBoard onGameOver={handleGameOver} />
        )}
      </div>
    </div>
  );
};

export default Game;
