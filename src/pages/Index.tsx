
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Bug, Sun, Play, Trophy, Target } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Auto-generate sun particles
    const interval = setInterval(() => {
      createRandomSun();
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  
  const createRandomSun = () => {
    const sunContainer = document.getElementById('sun-container');
    if (!sunContainer) return;
    
    const sun = document.createElement('div');
    const size = Math.random() * 30 + 20;
    const left = Math.random() * 80 + 10;
    
    sun.className = 'absolute bg-sun/80 rounded-full animate-float';
    sun.style.width = `${size}px`;
    sun.style.height = `${size}px`;
    sun.style.left = `${left}%`;
    sun.style.bottom = '-50px';
    sun.style.animationDuration = `${Math.random() * 3 + 3}s`;
    
    sunContainer.appendChild(sun);
    
    setTimeout(() => {
      sun.remove();
    }, 6000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-garden-light/30 to-garden/20 overflow-hidden">
      {/* Background Elements */}
      <div id="sun-container" className="fixed inset-0 pointer-events-none overflow-hidden" />
      
      <div className="absolute top-0 left-0 w-64 h-64 bg-garden-light/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-garden/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      {/* Content Container */}
      <div className={`glass rounded-2xl p-10 w-full max-w-lg text-center z-10 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex justify-center items-center mb-6">
          <Leaf className="text-garden h-12 w-12 mr-3 animate-float" />
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-garden-dark to-garden bg-clip-text text-transparent">
            Flora Fight Frenzy
          </h1>
          <Bug className="text-enemy h-10 w-10 ml-3 animate-wiggle" />
        </div>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto animate-fadeIn">
          Defend your garden from the adorable but relentless critter invasion by strategically planting your botanical defenders.
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link 
            to="/game" 
            className="flex items-center justify-center text-white bg-gradient-to-r from-garden to-garden-dark hover:from-garden-dark hover:to-garden py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Game
          </Link>
          <Link 
            to="/levels" 
            className="flex items-center justify-center text-garden-dark bg-yellow-200 hover:bg-yellow-300 py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 border-2 border-yellow-400"
          >
            <Sun className="mr-2 h-5 w-5" />
            Level Select
          </Link>
          <Link 
            to="/achievements" 
            className="flex items-center justify-center text-white bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-orange-600 hover:to-yellow-600 py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 border-2 border-orange-500"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Achievements
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center justify-center text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-900 hover:to-gray-700 py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 border-2 border-gray-800"
          >
            <Target className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
      
      {/* Animated Icons */}
      <div className="fixed bottom-8 left-8 animate-float" style={{ animationDelay: '0.5s' }}>
        <Leaf className="h-16 w-16 text-garden-light opacity-40" />
      </div>
      <div className="fixed top-12 right-12 animate-float" style={{ animationDelay: '1s' }}>
        <Sun className="h-14 w-14 text-sun opacity-60" />
      </div>
      <div className="fixed bottom-20 right-16 animate-float" style={{ animationDelay: '1.5s' }}>
        <Bug className="h-10 w-10 text-enemy opacity-40" />
      </div>
    </div>
  );
};

export default Index;
