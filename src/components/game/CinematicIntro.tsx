
import React, { useEffect, useState } from 'react';
import { Play, AlertTriangle, Skull } from 'lucide-react';

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
          title: "THE INVASION BEGINS",
          dialogue1: {
            speaker: "Commander Sunflower",
            avatar: "🌻",
            text: "EMERGENCY ALERT! Zombies have breached the perimeter! They're coming for our brains! We need to defend the house at all costs!"
          },
          dialogue2: {
            speaker: "Zombie General",
            avatar: "🧟",
            text: "BRAAAINS... MUST... EAT... BRAINS... DESTROY... PLANTS..."
          },
          finale: {
            speaker: "Tactical Peashooter",
            avatar: "🌱",
            text: "All defensive plants report to battle stations! We are initiating emergency protocol DEFEND-GARDEN! This is NOT a drill!"
          }
        };
      case 2:
        return {
          title: "MUTANT ZOMBIES APPROACHING",
          dialogue1: {
            speaker: "Dr. Snapdragon",
            avatar: "🔬",
            text: "WARNING! Our sensors detect genetically modified zombies with enhanced capabilities! Standard defenses may be ineffective!"
          },
          dialogue2: {
            speaker: "Elite Zombie",
            avatar: "🧠",
            text: "STRONGER... FASTER... MORE BRAINS... CRUSH... PLANTS..."
          },
          finale: {
            speaker: "Defense Minister",
            avatar: "🌱",
            text: "Deploy frost plants to slow their advance! Utilize explosive plants for area damage! We cannot let them reach the house!"
          }
        };
      case 3:
        return {
          title: "CODE RED: MASSIVE HORDE INBOUND",
          dialogue1: {
            speaker: "Scout Cherry",
            avatar: "🍒",
            text: "CRITICAL ALERT! Zombie numbers exceeding all previous encounters! They've broken through the outer perimeter!"
          },
          dialogue2: {
            speaker: "Zombie Commander",
            avatar: "🪣",
            text: "TOO MANY... UNSTOPPABLE... HOUSE SOON... FALL... BRAINS MINE..."
          },
          finale: {
            speaker: "Tactical Officer",
            avatar: "⚡",
            text: "All plants to battle stations! Activate emergency reserves! Layer your defenses! We MUST hold the line!"
          }
        };
      case 4:
        return {
          title: "LAST STAND: THE HORDE ADVANCES",
          dialogue1: {
            speaker: "General Walnut",
            avatar: "🥜",
            text: "CRITICAL SITUATION! Our outer defenses have fallen! The zombies are too numerous! Prepare for close-quarters battle!"
          },
          dialogue2: {
            speaker: "Zombie King",
            avatar: "👑",
            text: "VICTORY... SOON... PLANTS DYING... BRAINS... ALMOST MINE..."
          },
          finale: {
            speaker: "Strategic Command",
            avatar: "🌿",
            text: "Activate all emergency protocols! Use every plant at your disposal! The fate of all living beings depends on our stand here!"
          }
        };
      case 5:
        return {
          title: "FINAL DEFENSE: EXTINCTION EVENT",
          dialogue1: {
            speaker: "High Command",
            avatar: "🌻",
            text: "THIS IS NOT A DRILL! The main zombie army has arrived! If we fail here, humanity falls. Deploy all available defenses IMMEDIATELY!"
          },
          dialogue2: {
            speaker: "Dr. Zomboss",
            avatar: "💀",
            text: "RESISTANCE... FUTILE... HOUSE... WILL FALL... BRAINS... WILL BE CONSUMED..."
          },
          finale: {
            speaker: "Plant Coalition",
            avatar: "🌿",
            text: "This is our FINAL STAND! Every plant to battle stations! The survival of all life depends on what we do in the next few minutes!"
          }
        };
      default:
        return {
          title: "PLANTS VS. ZOMBIES",
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
  
  // Random flicker effect for the title
  const flickerClass = "animate-flicker inline-block";
  
  // Split the title to apply flicker to some letters
  const titleElements = story.title.split('').map((letter, index) => {
    // Apply flicker animation to some letters randomly but consistently
    const shouldFlicker = (index * 7) % 3 === 0;
    return (
      <span key={index} className={shouldFlicker ? flickerClass : ""}>
        {letter}
      </span>
    );
  });
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Background atmosphere - animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Flickering emergency lights on top */}
        <div className="absolute top-0 left-0 w-full h-16 flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-20 h-8 bg-red-600 rounded-b-lg opacity-75 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        {/* Plant forces on the left - more militaristic */}
        <div className="absolute -left-10 bottom-0 w-1/3 h-2/3 opacity-30">
          <div className="absolute bottom-0 left-[5%] w-[20%] h-[60%] bg-green-900 rounded-t-md"></div>
          <div className="absolute bottom-0 left-[15%] w-[25%] h-[70%] bg-green-800 rounded-t-md"></div>
          <div className="absolute bottom-0 left-[30%] w-[20%] h-[50%] bg-green-900 rounded-t-md"></div>
          <div className="absolute bottom-0 left-[45%] w-[30%] h-[80%] bg-green-800 rounded-t-md"></div>
          <div className="absolute bottom-0 left-[65%] w-[25%] h-[65%] bg-green-900 rounded-t-md"></div>
        </div>
        
        {/* Zombie hordes on the right - more menacing */}
        <div className="absolute -right-10 bottom-0 w-1/3 h-2/3 opacity-30">
          <div className="absolute bottom-0 right-[5%] w-[15%] h-[85%] bg-gray-800 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[15%] w-[20%] h-[70%] bg-gray-900 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[30%] w-[15%] h-[90%] bg-gray-800 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[40%] w-[20%] h-[75%] bg-gray-900 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[55%] w-[15%] h-[85%] bg-gray-800 rounded-t-sm"></div>
          <div className="absolute bottom-0 right-[65%] w-[25%] h-[80%] bg-gray-900 rounded-t-sm"></div>
        </div>
        
        {/* Random warning flashes */}
        <div className="absolute top-20 right-40 animate-pulse opacity-30" style={{ animationDuration: '2s' }}>
          <Skull className="text-red-600 w-20 h-20" />
        </div>
        <div className="absolute bottom-40 left-30 animate-pulse opacity-30" style={{ animationDuration: '3s', animationDelay: '1s' }}>
          <AlertTriangle className="text-yellow-500 w-20 h-20" />
        </div>
        
        {/* Random floating particles - debris from battle */}
        <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-gray-500 rounded-full animate-float" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-[50%] left-[70%] w-2 h-2 bg-red-500 rounded-full animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-[70%] left-[20%] w-4 h-4 bg-gray-600 rounded-full animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[80%] w-3 h-3 bg-gray-700 rounded-full animate-float" style={{ animationDuration: '6s', animationDelay: '3s' }}></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-3xl w-full px-6">
        {/* Title Phase */}
        <div className={`transition-all duration-1000 ${phase === 'title' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-16 absolute'}`}>
          <div className="relative">
            <div className="absolute inset-0 blur-md opacity-70 flex items-center justify-center">
              <h1 className="text-5xl font-bold text-center text-red-600">
                {story.title}
              </h1>
            </div>
            <h1 className="text-5xl font-bold text-center text-red-500 mb-4 tracking-widest">
              {titleElements}
            </h1>
          </div>
          <div className="w-full max-w-lg mx-auto h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          
          {/* Warning signs */}
          <div className="flex justify-between mt-4">
            <div className="w-16 h-8 bg-yellow-600 flex items-center justify-center rounded animate-pulse">
              <span className="text-xs text-black font-bold">WARNING</span>
            </div>
            <div className="w-16 h-8 bg-yellow-600 flex items-center justify-center rounded animate-pulse" style={{ animationDelay: '0.5s' }}>
              <span className="text-xs text-black font-bold">DANGER</span>
            </div>
          </div>
        </div>
        
        {/* Dialogue 1 Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'dialogue1' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/70 border-2 border-green-900 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-900 flex items-center justify-center text-2xl border border-green-700">
                {story.dialogue1.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-green-500 text-lg uppercase flex items-center">
                  {story.dialogue1.speaker}
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                </h3>
                <p className="text-gray-200 leading-relaxed font-bold">{story.dialogue1.text}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dialogue 2 Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'dialogue2' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/70 border-2 border-red-900 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-2xl border border-red-900">
                {story.dialogue2.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-red-500 text-lg uppercase flex items-center">
                  {story.dialogue2.speaker}
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </h3>
                <p className="text-gray-300 leading-relaxed font-bold">{story.dialogue2.text}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Finale Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'finale' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/70 border-2 border-yellow-900 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center text-2xl border border-yellow-700">
                {story.finale.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-yellow-500 text-lg uppercase flex items-center">
                  {story.finale.speaker}
                  <span className="ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
                </h3>
                <p className="text-white leading-relaxed font-bold">{story.finale.text}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className={`transition-all duration-1000 text-center mt-8 ${skipEnabled ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={handleSkip}
            className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-lg text-white font-bold flex items-center mx-auto transition-colors border border-red-500"
          >
            <Play className="w-5 h-5 mr-2" />
            {phase === 'finale' ? 'DEPLOY PLANTS NOW!' : 'SKIP BRIEFING'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinematicIntro;
