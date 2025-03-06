
import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  level: number;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, level }) => {
  const [phase, setPhase] = useState<'title' | 'dialogue1' | 'dialogue2' | 'finale' | 'complete'>('title');
  const [skipEnabled, setSkipEnabled] = useState(false);
  
  // Get story based on current level
  const getStoryContent = () => {
    switch(level) {
      case 1:
        return {
          title: "The First Defense",
          dialogue1: {
            speaker: "Elder Sunflower",
            avatar: "🌻",
            text: "For centuries, we Plant Stars have lived in harmony with the earth. But now, the undead threaten our very existence."
          },
          dialogue2: {
            speaker: "Zombie Commander",
            avatar: "🧟",
            text: "Braaaaains... Plants... Destroy... Garden..."
          },
          finale: {
            speaker: "Minister Peashooter",
            avatar: "🌱",
            text: "Brave defender, position us strategically. We must hold the line against these creatures. Our survival depends on you!"
          }
        };
      case 2:
        return {
          title: "The Laboratory Awakening",
          dialogue1: {
            speaker: "Dr. Snapdragon",
            avatar: "🔬",
            text: "My research shows these zombies have evolved since the first wave. They're more resilient now."
          },
          dialogue2: {
            speaker: "General Rotbrain",
            avatar: "🧠",
            text: "First attack... failure. Now we bring... stronger zombies... special zombies..."
          },
          finale: {
            speaker: "Minister Peashooter",
            avatar: "🌱",
            text: "Our defense systems are evolving too. Look for the special powerups! They'll help us push back the horde."
          }
        };
      case 3:
        return {
          title: "Thunderstorm of the Undead",
          dialogue1: {
            speaker: "Captain Walnut",
            avatar: "🌰",
            text: "They're bringing reinforcements from the east graveyard. I've sent scouts to monitor their movements."
          },
          dialogue2: {
            speaker: "The Bucket Commander",
            avatar: "🪣",
            text: "We... unstoppable. Lawn mowers... useless. My armor... strong. Plants... weak."
          },
          finale: {
            speaker: "Lightning Reed",
            avatar: "⚡",
            text: "I've perfected the lightning technology! Deploy me to chain electricity through multiple zombies at once. Let's electrify them!"
          }
        };
      case 4:
        return {
          title: "The Winter Offensive",
          dialogue1: {
            speaker: "Ice Queen",
            avatar: "❄️",
            text: "The zombies are adapting to our normal attacks. We need to use the freezing powers of my ice plants to slow them down."
          },
          dialogue2: {
            speaker: "Zombie King",
            avatar: "👑",
            text: "Brains... almost ours. Plant kingdom... falling. Final push... begins now."
          },
          finale: {
            speaker: "Minister Peashooter",
            avatar: "🌱",
            text: "This is our darkest hour. Use every plant at your disposal. Combine fire and ice strategically. We must not fail!"
          }
        };
      case 5:
        return {
          title: "Final Stand of the Garden",
          dialogue1: {
            speaker: "Elder Sunflower",
            avatar: "🌻",
            text: "The ancient texts speak of a final confrontation. If we survive this wave, the zombie threat will be eliminated for a generation."
          },
          dialogue2: {
            speaker: "Dr. Zomboss",
            avatar: "🧪",
            text: "My ultimate creation... unstoppable. Your pitiful plants... will wither. Your garden... will be mine!"
          },
          finale: {
            speaker: "The Plant Council",
            avatar: "🌿",
            text: "Defender, the future of all plant life is in your hands. We bestow upon you our most powerful plants. May they serve you well in this final battle."
          }
        };
      default:
        return {
          title: "Plants vs. Zombies",
          dialogue1: {
            speaker: "Sunflower",
            avatar: "🌻",
            text: "We need your help to defend our garden!"
          },
          dialogue2: {
            speaker: "Zombie",
            avatar: "🧟",
            text: "Brains..."
          },
          finale: {
            speaker: "Peashooter",
            avatar: "🌱",
            text: "Plant us strategically to defeat the zombie horde!"
          }
        };
    }
  };
  
  const story = getStoryContent();
  
  // Auto-advance through phases
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Allow skipping after a short delay
    const skipTimer = setTimeout(() => {
      setSkipEnabled(true);
    }, 1000);
    timers.push(skipTimer);
    
    if (phase === 'title') {
      const timer = setTimeout(() => {
        setPhase('dialogue1');
      }, 2500);
      timers.push(timer);
    }
    else if (phase === 'dialogue1') {
      const timer = setTimeout(() => {
        setPhase('dialogue2');
      }, 4000);
      timers.push(timer);
    }
    else if (phase === 'dialogue2') {
      const timer = setTimeout(() => {
        setPhase('finale');
      }, 4000);
      timers.push(timer);
    }
    else if (phase === 'finale') {
      const timer = setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 4000);
      timers.push(timer);
    }
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [phase, onComplete]);
  
  const handleSkip = () => {
    if (skipEnabled) {
      setPhase('complete');
      onComplete();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Background atmosphere - animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Plant silhouettes on the left */}
        <div className="absolute -left-10 bottom-0 w-1/4 h-2/3 opacity-30">
          <div className="absolute bottom-0 left-[10%] w-[40%] h-[80%] bg-garden-dark rounded-t-full"></div>
          <div className="absolute bottom-0 left-[30%] w-[30%] h-[60%] bg-garden-dark rounded-t-full"></div>
          <div className="absolute bottom-0 left-[50%] w-[35%] h-[70%] bg-garden-dark rounded-t-full"></div>
        </div>
        
        {/* Zombie silhouettes on the right */}
        <div className="absolute -right-10 bottom-0 w-1/4 h-2/3 opacity-30">
          <div className="absolute bottom-0 right-[10%] w-[30%] h-[90%] bg-gray-800 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[30%] w-[25%] h-[75%] bg-gray-800 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[50%] w-[35%] h-[85%] bg-gray-800 rounded-t-sm"></div>
        </div>
        
        {/* Random floating particles */}
        <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-green-500/30 rounded-full animate-float" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-[50%] left-[70%] w-2 h-2 bg-yellow-500/30 rounded-full animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-[70%] left-[20%] w-4 h-4 bg-blue-500/30 rounded-full animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[80%] w-3 h-3 bg-red-500/30 rounded-full animate-float" style={{ animationDuration: '6s', animationDelay: '3s' }}></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-3xl w-full px-6">
        {/* Title Phase */}
        <div className={`transition-all duration-1000 ${phase === 'title' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-16 absolute'}`}>
          <h1 className="text-5xl font-bold text-center text-garden bg-gradient-to-r from-garden-dark to-garden bg-clip-text text-transparent mb-4">
            {story.title}
          </h1>
          <div className="w-full max-w-lg mx-auto h-1 bg-gradient-to-r from-transparent via-garden to-transparent"></div>
        </div>
        
        {/* Dialogue 1 Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'dialogue1' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/70 border border-garden/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-garden flex items-center justify-center text-2xl">
                {story.dialogue1.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-garden-light text-lg">{story.dialogue1.speaker}</h3>
                <p className="text-white leading-relaxed">{story.dialogue1.text}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dialogue 2 Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'dialogue2' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/70 border border-red-800/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
                {story.dialogue2.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-red-400 text-lg">{story.dialogue2.speaker}</h3>
                <p className="text-gray-300 leading-relaxed">{story.dialogue2.text}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Finale Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'finale' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/70 border border-yellow-600/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-800 flex items-center justify-center text-2xl">
                {story.finale.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-yellow-400 text-lg">{story.finale.speaker}</h3>
                <p className="text-white leading-relaxed">{story.finale.text}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className={`transition-all duration-1000 text-center mt-8 ${skipEnabled ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={handleSkip}
            className="bg-garden px-6 py-3 rounded-lg text-white font-bold flex items-center mx-auto hover:bg-garden-dark transition-colors"
          >
            <Play className="w-5 h-5 mr-2" />
            {phase === 'finale' ? 'Start Battle' : 'Skip Intro'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinematicIntro;
