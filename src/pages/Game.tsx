
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import CinematicIntro from '../components/game/CinematicIntro';
import PowerUpsBar from '../components/game/PowerUpsBar';
import SoundManager from '../lib/soundManager';
import AchievementManager from '../lib/achievementManager';
import { ArrowLeft, Trophy, Volume2, VolumeX, Play, ChevronRight, Settings, Star, Award } from 'lucide-react';

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
  const [showAchievement, setShowAchievement] = useState<any>(null);
  const [gameStats, setGameStats] = useState({ startTime: Date.now(), zombiesKilled: 0, plantsPlaced: 0 });
  
  const soundManager = useRef(SoundManager.getInstance());
  const achievementManager = useRef(AchievementManager.getInstance());
  
  // Initialize sound and achievement systems
  useEffect(() => {
    soundManager.current.initSounds();
    soundManager.current.setMuted(isMuted);
    
    // Listen for achievement unlocks
    const handleAchievement = (achievement: any) => {
      setShowAchievement(achievement);
      soundManager.current.playSound('victory', 0.3);
      setTimeout(() => setShowAchievement(null), 4000);
    };
    
    achievementManager.current.addAchievementListener(handleAchievement);
    achievementManager.current.onGameStarted();
    
    return () => {
      achievementManager.current.removeAchievementListener(handleAchievement);
    };
  }, [isMuted]);
  
  const handleGameOver = () => {
    console.log("Game over triggered from GameBoard");
    soundManager.current.playGameOverSound();
    achievementManager.current.onScoreAchieved(score);
    const playTime = Math.floor((Date.now() - gameStats.startTime) / 1000);
    achievementManager.current.onPlayTimeUpdate(playTime);
    setIsGameOver(true);
  };

  const handleLevelComplete = (levelScore: number) => {
    setScore(prev => prev + levelScore);
    soundManager.current.playVictorySound();
    achievementManager.current.onLevelCompleted();
    achievementManager.current.onScoreAchieved(levelScore);
    setShowLevelComplete(true);
  };

  const handleNextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(prev => prev + 1);
      setShowLevelComplete(false);
      setShowCinematic(true);
      soundManager.current.playWaveStartSound();
    } else {
      // Final victory - all levels completed!
      setShowLevelComplete(false);
      achievementManager.current.onScoreAchieved(score * 2); // Bonus for completing all levels
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    soundManager.current.setMuted(newMutedState);
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
    <div className="pvz-game-interface min-h-screen bg-gradient-to-b from-garden-light/30 to-garden/20 p-4 sm:p-6 md:p-8">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-full max-w-md mb-10 relative">
            {/* Danger warning pulses */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/20 rounded-full animate-pulse opacity-30"></div>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-800/30 rounded-full animate-pulse opacity-40" style={{animationDelay: '0.5s'}}></div>
            
            {/* Title with intense styling */}
            <h1 className="text-5xl md:text-6xl font-bold text-garden text-center mb-2 relative">
              <span className="absolute -inset-1 blur-lg text-red-600 opacity-70">
                Flora Fight Frenzy
              </span>
              <span className="relative z-10 bg-gradient-to-r from-garden-dark via-garden to-garden-dark bg-clip-text text-transparent animate-pulse">
                Flora Fight Frenzy
              </span>
            </h1>
            
            <div className="text-center text-gray-400 text-sm relative">
              <span className="text-red-500 font-bold">THE BATTLE FOR BOTANICAL SURVIVAL BEGINS</span>
            </div>
            
            {/* Danger warning tape */}
            <div className="w-full flex overflow-hidden mt-4 h-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={`warning-${i}`} 
                  className="h-full flex-1 bg-yellow-400"
                  style={{ 
                    transform: i % 2 === 0 ? 'skewX(45deg)' : 'skewX(-45deg)',
                    margin: '0 2px',
                    opacity: i % 2 === 0 ? 0.8 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-12 mb-12 relative">
            {/* Chaotic pulse effect behind combatants */}
            <div className="absolute inset-0 bg-black/50 blur-xl"></div>
            
            {/* Plant side */}
            <div className="w-32 h-32 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-green-900/30 blur-xl rounded-full animate-pulse"></div>
              <div className="relative w-20 h-20 animate-bounce" style={{ animationDuration: '2s' }}>
                <div className="absolute inset-0 bg-green-700 rounded-full"></div>
                <div className="absolute inset-[15%] bg-green-500 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🌱</div>
                </div>
                
                {/* Plant energy glow */}
                <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* VS */}
            <div className="relative z-10">
              <div className="absolute inset-0 text-3xl font-bold text-red-600 blur-sm animate-pulse">VS</div>
              <div className="text-3xl font-bold text-red-500 animate-pulse">VS</div>
            </div>
            
            {/* Zombie side */}
            <div className="w-32 h-32 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-red-900/30 blur-xl rounded-full animate-pulse"></div>
              <div className="relative w-20 h-20 animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                <div className="absolute inset-[15%] bg-gray-600 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🧟</div>
                </div>
                
                {/* Zombie energy glow */}
                <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Loading bar with intense styling */}
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 blur-md bg-red-500/20 rounded-full"></div>
            <div className="relative z-10 h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-red-600 via-garden to-red-600 animate-[growWidth_3s_ease-in-out_forwards]"></div>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm mt-2 flex items-center">
            <span className="mr-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Loading combat systems...
          </div>
          
          {/* Emergency classification */}
          <div className="absolute bottom-8 left-8 border-2 border-red-700 rounded px-3 py-1">
            <div className="text-red-500 text-xs font-mono">CLASSIFIED INFORMATION</div>
            <div className="text-xs text-gray-400 font-mono">SECURITY LEVEL: MAXIMUM</div>
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
                  setGameStats({ startTime: Date.now(), zombiesKilled: 0, plantsPlaced: 0 });
                  achievementManager.current.onGameStarted();
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

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{showAchievement.icon}</div>
              <div>
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                <p className="text-sm opacity-90">{showAchievement.title}</p>
                <p className="text-xs opacity-75">{showAchievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Header and Board */}
      {!isLoading && !showCinematic && !showIntro && !showLevelComplete && !isGameOver && (
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
                onClick={toggleMute}
                className="text-gray-600 hover:text-garden-dark transition-colors relative group"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {isMuted ? 'Unmute' : 'Mute'}
                </span>
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
                  onClick={() => {
                    setGameStarted(true);
                    setGameStats({ startTime: Date.now(), zombiesKilled: 0, plantsPlaced: 0 });
                    soundManager.current.playPlantSound();
                  }}
                  className="bg-garden hover:bg-garden-dark text-white font-bold py-3 px-8 rounded-lg text-lg flex items-center mx-auto transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
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
          <PowerUpsBar />
        </>
      )}
    </div>
  );
};

export default Game;
