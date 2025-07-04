
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
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
          {/* Explosive chaos background */}
          <div className="absolute inset-0">
            {/* Matrix rain effect */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(0, 255, 0, 0.15) 50%)',
                backgroundSize: '2px 8px',
                animation: 'scroll 0.8s linear infinite'
              }}
            ></div>
            
            {/* Nuclear explosion glow */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/30 rounded-full blur-3xl animate-pulse opacity-60"></div>
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-orange-500/40 rounded-full blur-2xl animate-pulse opacity-40" style={{animationDelay: '0.7s'}}></div>
            
            {/* Electric storm effects */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={`spark-${i}`}
                className="absolute animate-lightning"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '3px',
                  height: `${Math.random() * 200 + 50}px`,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(0,162,255,0.6))',
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: '0.3s'
                }}
              />
            ))}
            
            {/* Floating debris */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={`debris-${i}`}
                className="absolute bg-gray-600 opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="w-full max-w-2xl mb-10 relative z-10">
            {/* Massive explosion rings */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 border-4 border-red-600/50 rounded-full animate-ping opacity-30"></div>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-48 border-4 border-orange-500/60 rounded-full animate-ping opacity-40" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-32 h-32 border-4 border-yellow-400/70 rounded-full animate-ping opacity-50" style={{animationDelay: '0.6s'}}></div>
            
            {/* Epic title with multiple effects */}
            <div className="relative text-center mb-8">
              {/* Background glow layers */}
              <div className="absolute inset-0 blur-3xl opacity-50">
                <h1 className="text-7xl md:text-8xl font-black text-red-600 tracking-wider">
                  FLORA FIGHT FRENZY
                </h1>
              </div>
              <div className="absolute inset-0 blur-xl opacity-70">
                <h1 className="text-7xl md:text-8xl font-black text-orange-500 tracking-wider">
                  FLORA FIGHT FRENZY
                </h1>
              </div>
              
              {/* Main title with glitch effect */}
              <h1 className="text-7xl md:text-8xl font-black text-center tracking-wider relative z-10">
                <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-orange-600 bg-clip-text text-transparent animate-pulse">
                  FLORA FIGHT FRENZY
                </span>
              </h1>
              
              {/* Digital distortion overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-20"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ff0000\' fill-opacity=\'0.6\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")'
                }}
              ></div>
            </div>
            
            {/* Apocalyptic subtitle */}
            <div className="text-center relative mb-6">
              <div className="absolute inset-0 blur-md">
                <span className="text-2xl font-bold text-red-400">APOCALYPTIC BOTANICAL WARFARE</span>
              </div>
              <span className="text-2xl font-bold text-red-300 relative z-10">APOCALYPTIC BOTANICAL WARFARE</span>
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
          
          {/* Epic battle arena visualization */}
          <div className="flex items-center justify-center space-x-16 mb-12 relative">
            {/* Battlefield explosion effect */}
            <div className="absolute inset-0 bg-gradient-radial from-red-900/40 via-transparent to-transparent blur-2xl"></div>
            
            {/* Plant army formation */}
            <div className="relative">
              <div className="absolute -inset-8 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={`plant-${i}`}
                    className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm animate-bounce"
                    style={{ 
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${1.5 + Math.random()}s`
                    }}
                  >
                    🌱
                  </div>
                ))}
              </div>
              <div className="text-center mt-2 text-green-400 font-bold text-sm">PLANT DEFENDERS</div>
            </div>
            
            {/* Explosive VS with lightning */}
            <div className="relative z-10">
              <div className="absolute -inset-4 bg-yellow-400/30 blur-lg animate-pulse"></div>
              <div className="relative">
                <div className="absolute inset-0 text-6xl font-black text-red-600 blur-sm animate-pulse">⚡VS⚡</div>
                <div className="text-6xl font-black text-yellow-300 animate-pulse">⚡VS⚡</div>
              </div>
            </div>
            
            {/* Zombie horde formation */}
            <div className="relative">
              <div className="absolute -inset-8 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={`zombie-${i}`}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm animate-bounce"
                    style={{ 
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: `${1.8 + Math.random()}s`
                    }}
                  >
                    🧟
                  </div>
                ))}
              </div>
              <div className="text-center mt-2 text-red-400 font-bold text-sm">ZOMBIE HORDE</div>
            </div>
          </div>
          
          {/* Epic loading system */}
          <div className="w-full max-w-lg relative">
            {/* Multiple loading bars for different systems */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 blur-sm bg-red-500/30 rounded-full"></div>
                <div className="relative z-10 h-4 bg-gray-900 rounded-full overflow-hidden border border-red-700">
                  <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-[growWidth_3s_ease-in-out_forwards] relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-red-400 mt-1 font-mono">DEFENSE SYSTEMS: ONLINE</div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 blur-sm bg-green-500/30 rounded-full"></div>
                <div className="relative z-10 h-4 bg-gray-900 rounded-full overflow-hidden border border-green-700">
                  <div className="h-full bg-gradient-to-r from-green-600 via-lime-500 to-green-600 animate-[growWidth_3s_ease-in-out_forwards] relative" style={{animationDelay: '0.5s'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-green-400 mt-1 font-mono">PLANT ARSENAL: LOADED</div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 blur-sm bg-yellow-500/30 rounded-full"></div>
                <div className="relative z-10 h-4 bg-gray-900 rounded-full overflow-hidden border border-yellow-700">
                  <div className="h-full bg-gradient-to-r from-yellow-600 via-orange-400 to-yellow-600 animate-[growWidth_3s_ease-in-out_forwards] relative" style={{animationDelay: '1s'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-yellow-400 mt-1 font-mono">COMBAT PROTOCOLS: ACTIVE</div>
              </div>
            </div>
          </div>
          
          <div className="text-red-400 text-lg mt-4 flex items-center justify-center font-mono">
            <span className="mr-3 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            <span className="animate-pulse">INITIALIZING BOTANICAL WARFARE...</span>
            <span className="ml-3 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          </div>
          
          {/* Military classification stamps */}
          <div className="absolute bottom-8 left-8 space-y-2">
            <div className="border-2 border-red-700 rounded px-3 py-1 bg-black/80 transform -rotate-12">
              <div className="text-red-500 text-xs font-mono font-bold">TOP SECRET</div>
              <div className="text-xs text-gray-400 font-mono">PROJECT: FLORA DEFENSE</div>
            </div>
            <div className="border-2 border-yellow-600 rounded px-3 py-1 bg-black/80 transform rotate-6">
              <div className="text-yellow-500 text-xs font-mono font-bold">OPERATION: GARDEN WAR</div>
              <div className="text-xs text-gray-400 font-mono">CLEARANCE: ALPHA</div>
            </div>
          </div>
          
          {/* Additional warning indicators */}
          <div className="absolute top-8 right-8 space-y-2">
            <div className="bg-red-900/80 border-2 border-red-600 rounded-lg px-4 py-2 animate-pulse">
              <div className="text-red-400 text-sm font-mono font-bold">⚠ DEFCON 1 ⚠</div>
            </div>
            <div className="bg-yellow-900/80 border-2 border-yellow-600 rounded-lg px-4 py-2 animate-pulse" style={{animationDelay: '0.5s'}}>
              <div className="text-yellow-400 text-sm font-mono font-bold">🚨 ALERT 🚨</div>
            </div>
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
