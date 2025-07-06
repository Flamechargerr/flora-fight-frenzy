
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/10 p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col items-center justify-center overflow-hidden">
          {/* Professional background */}
          <div className="absolute inset-0">
            {/* Subtle animated grid */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                animation: 'scroll 20s linear infinite'
              }}
            ></div>
            
            {/* Ambient lighting */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="w-full max-w-2xl mb-10 relative z-10">
            {/* Massive explosion rings */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 border-4 border-red-600/50 rounded-full animate-ping opacity-30"></div>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-48 border-4 border-orange-500/60 rounded-full animate-ping opacity-40" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-32 h-32 border-4 border-yellow-400/70 rounded-full animate-ping opacity-50" style={{animationDelay: '0.6s'}}></div>
            
          {/* Professional title */}
            <div className="relative text-center mb-8">
              <h1 className="text-6xl md:text-7xl font-bold text-center tracking-wide text-white mb-4">
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  PLANT DEFENSE
                </span>
              </h1>
              <div className="text-xl md:text-2xl font-semibold text-gray-300">
                Strategic Tower Defense
              </div>
            </div>
            
            {/* Intense warning stripes */}
            <div className="w-full grid grid-cols-20 gap-1 mt-6 h-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={`stripe-${i}`} 
                  className="h-full bg-yellow-400 transform"
                  style={{ 
                    transform: i % 2 === 0 ? 'skewX(45deg)' : 'skewX(-45deg)',
                    opacity: i % 2 === 0 ? 0.9 : 0.5,
                    animation: 'pulse 1s infinite',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Professional game preview */}
          <div className="flex items-center justify-center space-x-12 mb-12 relative">
            {/* Plant defenders preview */}
            <div className="relative bg-green-900/20 rounded-xl p-6 border border-green-700/30">
              <div className="grid grid-cols-3 gap-3">
                {['☀️', '🌱', '🛡️'].map((icon, i) => (
                  <div 
                    key={`plant-${i}`}
                    className="w-10 h-10 bg-green-600/30 rounded-lg flex items-center justify-center text-lg border border-green-500/50 backdrop-blur-sm"
                    style={{ 
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <div className="text-center mt-3 text-green-300 font-semibold text-sm">Plant Defense</div>
            </div>
            
            {/* VS indicator */}
            <div className="text-4xl font-bold text-white bg-slate-700/50 rounded-full w-16 h-16 flex items-center justify-center border border-slate-500">
              VS
            </div>
            
            {/* Zombie threat preview */}
            <div className="relative bg-red-900/20 rounded-xl p-6 border border-red-700/30">
              <div className="grid grid-cols-3 gap-3">
                {['🧟', '🧠', '💀'].map((icon, i) => (
                  <div 
                    key={`zombie-${i}`}
                    className="w-10 h-10 bg-red-600/30 rounded-lg flex items-center justify-center text-lg border border-red-500/50 backdrop-blur-sm"
                    style={{ 
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <div className="text-center mt-3 text-red-300 font-semibold text-sm">Zombie Horde</div>
            </div>
          </div>
          
          {/* Professional loading system */}
          <div className="w-full max-w-lg relative">
            <div className="space-y-4 mb-6">
              <div className="relative">
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-[growWidth_3s_ease-out_forwards] relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-medium">Initializing Game Engine...</div>
              </div>
              
              <div className="relative">
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 animate-[growWidth_3s_ease-out_forwards] relative" style={{animationDelay: '0.8s'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-medium">Loading Plant Database...</div>
              </div>
              
              <div className="relative">
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-[growWidth_3s_ease-out_forwards] relative" style={{animationDelay: '1.6s'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-medium">Preparing Battlefield...</div>
              </div>
            </div>
          </div>
          
          <div className="text-slate-300 text-lg mt-6 flex items-center justify-center">
            <div className="mr-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Loading Game Assets...</span>
            <div className="ml-3 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
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
          <div className="max-w-2xl glass p-6 rounded-xl text-left relative overflow-hidden">
            {/* Digital scan lines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0"
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(255, 255, 255, 0.1) 50%)',
                backgroundSize: '4px 4px'
              }}
            ></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-garden mb-4 flex items-center">
                <span className="w-2 h-2 bg-garden rounded-full animate-ping mr-2"></span>
                The Last Garden
              </h2>
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
                className="mt-4 bg-garden hover:bg-garden-dark px-6 py-3 rounded-lg text-white font-bold relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative">Begin Defense!</span>
              </button>
            </div>
            
            {/* Classified stamp */}
            <div className="absolute top-3 right-3 text-red-600 border-2 border-red-600 rounded px-2 py-1 text-xs transform rotate-12">
              URGENT
            </div>
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
          <div className="glass mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link 
                to="/" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors mobile-touch-target"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                <span className="text-sm sm:text-base">Back to Home</span>
              </Link>
              
              <div className="flex flex-col items-center text-center">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Flora Fight Frenzy
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Level {currentLevel} of 5</p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-muted-foreground hover:text-foreground transition-colors mobile-touch-target p-2 rounded-lg hover:bg-muted/50"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                
                <Link 
                  to="/leaderboard" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors mobile-touch-target p-2 rounded-lg hover:bg-muted/50"
                >
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                  <span className="hidden sm:inline text-sm">Leaderboard</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Game Content */}
          <div className="w-full animate-fadeIn">
            {!gameStarted ? (
              <div className="glass p-4 sm:p-6 md:p-8 rounded-xl text-center max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Ready to Defend Your Garden?</h2>
                <p className="mb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Place your plants strategically to defend against the zombie horde. 
                  Collect sun to plant more defenders. Don't let zombies reach the left side of your garden!
                </p>
                <button 
                  onClick={() => setGameStarted(true)}
                  className="game-button text-lg flex items-center mx-auto"
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
