
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import CinematicIntro from '../components/game/CinematicIntro';
import { ArrowLeft, Trophy, Volume2, VolumeX, Play, ChevronRight } from 'lucide-react';

const Game = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showCinematic, setShowCinematic] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleGameOver = () => {
    console.log("Game over triggered from GameBoard");
    setIsGameOver(true);
  };

  const handleLevelComplete = (levelScore: number) => {
    setScore(prev => prev + levelScore);
    setShowLevelComplete(true);
  };

  const handleNextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(prev => prev + 1);
      setShowLevelComplete(false);
      setShowCinematic(true); // Show cinematic for the new level
    } else {
      // Final victory screen after beating level 5
      setShowLevelComplete(false);
      // Show final victory screen
    }
  };

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide story intro after 8 seconds
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-garden-light/30 to-garden/20 p-4 sm:p-6 md:p-8">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-full max-w-md mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-garden text-center mb-2 animate-pulse">
              Flora Fight Frenzy
            </h1>
            <div className="text-center text-gray-400 text-sm">The battle for botanical survival begins</div>
          </div>
          
          <div className="flex items-center space-x-8 mb-12">
            {/* Plant side */}
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="relative w-20 h-20 animate-bounce" style={{ animationDuration: '2s' }}>
                <div className="absolute inset-0 bg-green-700 rounded-full"></div>
                <div className="absolute inset-[15%] bg-green-500 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🌱</div>
                </div>
              </div>
            </div>
            
            {/* VS */}
            <div className="text-3xl font-bold text-red-500 animate-pulse">VS</div>
            
            {/* Zombie side */}
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="relative w-20 h-20 animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                <div className="absolute inset-[15%] bg-gray-600 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🧟</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading bar */}
          <div className="w-full max-w-md h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-garden animate-[growWidth_3s_ease-in-out_forwards]"></div>
          </div>
          <div className="text-gray-400 text-sm">Loading game assets...</div>
        </div>
      )}

      {/* Cinematic Intro */}
      {!isLoading && showCinematic && (
        <CinematicIntro 
          onComplete={() => setShowCinematic(false)}
          level={currentLevel}
        />
      )}

      {/* Story Intro */}
      {!isLoading && !showCinematic && showIntro && (
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
              You must help the Plant Stars survive five waves of zombies. Collect sunlight to grow your defenses and stop the zombies before they cross your garden!
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

      {/* Level Complete Screen */}
      {showLevelComplete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-fadeIn">
          <div className="max-w-2xl glass p-8 rounded-xl text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h2 className="text-3xl font-bold text-garden mb-4">Level {currentLevel} Complete!</h2>
            <p className="mb-6 text-lg">
              {currentLevel < 5 ? (
                `You've successfully defended your garden! Are you ready for the next challenge?`
              ) : (
                `Victory! You've defeated all zombie waves and saved the garden!`
              )}
            </p>
            
            <div className="mb-8 p-4 bg-black/10 rounded-lg">
              <p className="text-lg font-semibold text-garden-dark">Level Score: +{score}</p>
              <p className="text-sm text-muted-foreground">Plants remaining: 8 | Zombies defeated: 25</p>
            </div>
            
            {currentLevel < 5 ? (
              <button
                onClick={handleNextLevel}
                className="flex items-center justify-center mx-auto bg-garden hover:bg-garden-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                Continue to Level {currentLevel + 1}
                <ChevronRight className="ml-1 w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-xl font-bold text-garden">You've completed all levels!</p>
                <div className="flex justify-center gap-4">
                  <Link 
                    to="/leaderboard"
                    className="bg-garden hover:bg-garden-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    View Leaderboard
                  </Link>
                  <Link 
                    to="/"
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Over screen */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-fadeIn">
          <div className="max-w-2xl glass p-8 rounded-xl text-center">
            <div className="text-4xl mb-2">💀</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="mb-6 text-lg">
              The zombies have overrun your garden! Your plants fought valiantly, but the horde was too strong.
            </p>
            
            <div className="mb-8 p-4 bg-black/10 rounded-lg">
              <p className="text-lg font-semibold">Final Score: {score}</p>
              <p className="text-sm text-muted-foreground">You reached level {currentLevel}</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsGameOver(false);
                  setCurrentLevel(1);
                  setScore(0);
                  setGameStarted(true);
                  setShowCinematic(true);
                }}
                className="bg-garden hover:bg-garden-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <Link 
                to="/"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Game Header */}
      {!isLoading && !showCinematic && (
        <>
          <div className="glass mb-6 p-4 rounded-xl flex items-center justify-between animate-fadeIn">
            <Link 
              to="/" 
              className="flex items-center text-garden-dark hover:text-garden transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-garden-dark to-garden bg-clip-text text-transparent">
                Flora Fight Frenzy
              </h1>
              <p className="text-sm text-garden-dark">Level {currentLevel} of 5</p>
            </div>
            
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
              <GameBoard 
                onGameOver={handleGameOver} 
                onLevelComplete={handleLevelComplete}
                level={currentLevel}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
