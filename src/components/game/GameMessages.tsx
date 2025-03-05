
import React from 'react';
import { Sparkles } from 'lucide-react';

interface GameMessagesProps {
  showWaveMessage: boolean;
  waveMessage: string;
  waveCompleted: boolean;
  countdown: number;
  gameWon: boolean; // Changed from isGameWon
  currentWave?: number;
  isGameOver?: boolean;
  score?: number;
  onRestart?: () => void;
}

const GameMessages: React.FC<GameMessagesProps> = ({
  showWaveMessage,
  waveMessage,
  waveCompleted,
  countdown,
  gameWon, // Changed from isGameWon
  currentWave = 1,
  isGameOver = false,
  score = 0,
  onRestart = () => {},
}) => {
  return (
    <>
      {/* Wave message overlay */}
      {showWaveMessage && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 animate-fadeIn">
          <div className="text-center p-6 bg-garden-dark/90 rounded-xl border-2 border-garden">
            <h2 className="text-3xl font-bold text-white mb-2">{waveMessage}</h2>
            <p className="text-yellow-200">Prepare your defenses!</p>
          </div>
        </div>
      )}
      
      {/* Between waves countdown */}
      {waveCompleted && currentWave < 5 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 animate-fadeIn">
          <div className="text-center p-6 bg-garden-dark/90 rounded-xl border-2 border-garden">
            <h2 className="text-3xl font-bold text-white mb-2">Wave {currentWave} Complete!</h2>
            <p className="text-yellow-200 mb-4">Next wave starting in {countdown} seconds</p>
            <p className="text-white">Plant more defenses while you can!</p>
          </div>
        </div>
      )}
      
      {/* Game won overlay */}
      {gameWon && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fadeIn">
          <h2 className="text-4xl font-bold text-white mb-2">Victory!</h2>
          <div className="flex items-center mb-4">
            <Sparkles className="text-yellow-400 w-6 h-6 mr-2" />
            <p className="text-xl text-white">Final Score: {score}</p>
            <Sparkles className="text-yellow-400 w-6 h-6 ml-2" />
          </div>
          <p className="text-white mb-4 max-w-md text-center">
            "Thank you, brave defender," whispers the elder Sunflower. "The Plant Stars will remember your bravery."
          </p>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-garden rounded-lg text-white font-bold hover:bg-garden-dark transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* Game over overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fadeIn">
          <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>
          <p className="text-xl text-white mb-6">The zombies have invaded! Final Score: {score}</p>
          <p className="text-white mb-4 max-w-md text-center">
            "We'll rise again," the plants whisper as the zombies overrun your garden.
          </p>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-garden rounded-lg text-white font-bold hover:bg-garden-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </>
  );
};

export default GameMessages;
