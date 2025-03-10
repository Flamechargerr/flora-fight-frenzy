
import React, { useEffect, useState } from 'react';
import { Play, AlertTriangle, Skull, Zap, Flame, Shield, BadgeX } from 'lucide-react';

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
  
  // Generate random lightning flashes
  const renderLightningFlashes = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <div 
        key={`lightning-${index}`}
        className="absolute animate-lightning"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 80 + 20}px`,
          height: `${Math.random() * 150 + 50}px`,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,162,255,0.4))',
          transform: `rotate(${Math.random() * 90 - 45}deg)`,
          opacity: 0,
          zIndex: 5,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: '0.5s'
        }}
      />
    ));
  };
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Dynamic background with intense elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated backdrop with glitch effects */}
        <div className="absolute inset-0 bg-black">
          {/* Matrix-like digital rain */}
          <div className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%2300ff00\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")',
              backgroundSize: '4px',
              animation: 'scroll 20s linear infinite'
            }}
          ></div>
          
          {/* Red alert overlay */}
          <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
          
          {/* Lightning flashes */}
          {renderLightningFlashes()}
          
          {/* Danger warning pulses */}
          <div className="absolute top-10 left-10 animate-pulse opacity-40">
            <BadgeX className="text-red-600 w-24 h-24" style={{animationDuration: '2.5s'}} />
          </div>
          <div className="absolute bottom-20 right-20 animate-pulse opacity-40">
            <Shield className="text-yellow-600 w-20 h-20" style={{animationDuration: '3s'}} />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-pulse opacity-30">
            <Flame className="text-orange-600 w-16 h-16" style={{animationDuration: '1.5s'}} />
          </div>
        </div>
        
        {/* Intense background elements */}
        <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-red-900/80 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-red-900/80 to-transparent"></div>
        <div className="absolute left-0 h-full w-16 bg-gradient-to-r from-red-900/80 to-transparent"></div>
        <div className="absolute right-0 h-full w-16 bg-gradient-to-l from-red-900/80 to-transparent"></div>
        
        {/* Warning stripes at top and bottom */}
        <div className="absolute top-0 w-full flex">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={`warning-top-${i}`} 
              className="h-6 flex-1 bg-yellow-400"
              style={{ 
                transform: i % 2 === 0 ? 'skewX(45deg)' : 'skewX(-45deg)',
                margin: '0 2px',
                opacity: i % 2 === 0 ? 0.8 : 0.3,
                animation: 'pulse 1.5s infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-0 w-full flex">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={`warning-bottom-${i}`} 
              className="h-6 flex-1 bg-yellow-400"
              style={{ 
                transform: i % 2 === 0 ? 'skewX(-45deg)' : 'skewX(45deg)',
                margin: '0 2px',
                opacity: i % 2 === 0 ? 0.8 : 0.3,
                animation: 'pulse 1.5s infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        
        {/* Random glitching elements */}
        <div className="absolute h-screen w-screen pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={`glitch-${i}`}
              className="absolute bg-red-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 5 + 2}px`,
                transform: `rotate(${Math.random() * 180}deg)`,
                opacity: 0,
                animation: 'glitch 0.2s forwards',
                animationDelay: `${Math.random() * 10}s`,
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
        
        {/* Zombie silhouettes in background */}
        <div className="absolute bottom-0 right-0 w-2/3 h-1/3 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={`zombie-${i}`} 
              className="absolute bottom-0"
              style={{
                right: `${i * 8 + Math.random() * 10}%`,
                width: '40px',
                height: `${80 + Math.random() * 40}px`,
                background: 'linear-gradient(to top, #374151, transparent)',
                borderRadius: '5px 5px 0 0',
                transform: `skewX(${Math.random() * 10 - 5}deg)`,
                animation: 'zombieApproach 30s linear infinite',
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[30px] h-[30px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, #374151 60%, transparent)'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Plant defenders silhouettes on left */}
        <div className="absolute bottom-0 left-0 w-2/3 h-1/3 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={`plant-${i}`} 
              className="absolute bottom-0"
              style={{
                left: `${i * 8 + Math.random() * 5}%`,
                width: '30px',
                height: `${50 + Math.random() * 20}px`,
                background: 'linear-gradient(to top, #065f46, transparent)',
                borderRadius: '0 0 5px 5px',
                animation: 'plantDefense 2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[25px] h-[25px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, #065f46 60%, transparent)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-3xl w-full px-6">
        {/* Title Phase */}
        <div className={`transition-all duration-1000 ${phase === 'title' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-16 absolute'}`}>
          <div className="relative">
            {/* Title with shadow effect */}
            <div className="mb-2 relative">
              <div className="absolute inset-0 blur-xl opacity-70 flex items-center justify-center">
                <h1 className="text-6xl font-bold text-center text-red-600">
                  {story.title}
                </h1>
              </div>
              <h1 className="text-6xl font-bold text-center text-red-500 tracking-widest relative z-10">
                {titleElements}
              </h1>
              {/* Digital distortion overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ff0000\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")'
                }}
              ></div>
            </div>
            
            <div className="w-full max-w-lg mx-auto h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          </div>
          
          {/* Intense warning indicators */}
          <div className="flex justify-between mt-6">
            <div className="flex items-center">
              <div className="w-16 h-8 bg-red-600 animate-pulse flex items-center justify-center rounded-sm">
                <span className="text-xs text-white font-bold">DANGER</span>
              </div>
              <Skull className="ml-2 text-red-500 w-6 h-6 animate-pulse" />
            </div>
            <div className="flex items-center">
              <Zap className="mr-2 text-yellow-500 w-6 h-6 animate-pulse" />
              <div className="w-16 h-8 bg-yellow-600 animate-pulse flex items-center justify-center rounded-sm">
                <span className="text-xs text-black font-bold">WARNING</span>
              </div>
            </div>
          </div>
          
          {/* Emergency alert bar */}
          <div className="mt-6 w-full h-10 bg-red-800/70 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 border-t border-b border-red-600 opacity-50"></div>
            <div className="whitespace-nowrap text-white font-mono animate-marquee">
              EMERGENCY ALERT ★ ZOMBIE OUTBREAK IN PROGRESS ★ ALL PLANT PERSONNEL REPORT TO DEFENSIVE POSITIONS ★ THIS IS NOT A DRILL ★ REPEAT: THIS IS NOT A DRILL
            </div>
          </div>
        </div>
        
        {/* Dialogue 1 Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'dialogue1' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/80 border-2 border-green-900 rounded-xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
            {/* Digital scan lines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0"
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(32, 128, 32, 0.2) 50%)',
                backgroundSize: '4px 4px'
              }}
            ></div>
            
            <div className="flex items-start relative z-10">
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
            
            {/* Connection static */}
            <div className="absolute right-3 top-3 flex items-center">
              <div className="w-1 h-3 bg-green-500 rounded-sm mx-px animate-pulse"></div>
              <div className="w-1 h-5 bg-green-500 rounded-sm mx-px animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-7 bg-green-500 rounded-sm mx-px animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-4 bg-green-500 rounded-sm mx-px animate-pulse" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Dialogue 2 Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'dialogue2' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/80 border-2 border-red-900 rounded-xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
            {/* Digital noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
              }}
            ></div>
            
            <div className="flex items-start relative z-10">
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
            
            {/* Evil presence indicators */}
            <div className="absolute right-3 top-3 flex items-center">
              <div className="w-6 h-6 rounded-full border border-red-600 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-red-800 animate-pulse" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Finale Phase */}
        <div className={`transition-all duration-1000 delay-300 ${phase === 'finale' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16 absolute'}`}>
          <div className="bg-black/80 border-2 border-yellow-900 rounded-xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
            {/* Battle map grid */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(251, 191, 36, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(251, 191, 36, 0.2) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            ></div>
            
            <div className="flex items-start relative z-10">
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
            
            {/* Strategic indicators */}
            <div className="absolute right-3 top-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className={`transition-all duration-1000 text-center mt-8 ${skipEnabled ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={handleSkip}
            className="relative bg-red-700 hover:bg-red-800 px-8 py-4 rounded-lg text-white font-bold flex items-center mx-auto transition-colors border-2 border-red-500 animate-pulse overflow-hidden"
            style={{animationDuration: '2s'}}
          >
            {/* Button internal glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 animate-pulse"></div>
            
            <Play className="w-5 h-5 mr-2" />
            <span className="relative z-10">
              {phase === 'finale' ? 'DEPLOY PLANTS NOW!' : 'SKIP BRIEFING'}
            </span>
            
            {/* Warning corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinematicIntro;
