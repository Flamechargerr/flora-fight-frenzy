
import { useState, useEffect } from 'react';

interface SunResourceProps {
  id: string;
  x: number;
  y: number;
  onCollect: (id: string) => void;
}

const SunResource = ({ id, x, y, onCollect }: SunResourceProps) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);
  
  const handleClick = () => {
    setAnimate(false);
    setTimeout(() => {
      onCollect(id);
    }, 300);
  };

  // Increased collection area with stronger hover effects
  return (
    <div 
      className={`sun-resource ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} cursor-pointer hover:scale-125 hover:brightness-125`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        width: '80px',  // Increased size for easier clicking
        height: '80px', // Increased size for easier clicking
        zIndex: 50,     // Ensure the sun is above all other elements
        position: 'absolute', // Ensure proper positioning
      }}
      onClick={handleClick}
    >
      {/* Enhanced sun graphic with more pronounced rays and glow effect */}
      <div className="relative w-full h-full">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-yellow-300/50 rounded-full blur-lg animate-pulse"></div>
        
        {/* Main sun circle */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center border-2 border-yellow-300">
          <div className="w-[75%] h-[75%] bg-yellow-300 rounded-full flex items-center justify-center">
            <div className="w-[60%] h-[60%] bg-yellow-100 rounded-full"></div>
          </div>
        </div>
        
        {/* Sun rays - more pronounced */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-[40%] h-[12%] bg-yellow-300 rounded-full origin-center animate-pulse"
            style={{ 
              left: '50%', 
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(90%)` 
            }}
          ></div>
        ))}
        
        {/* Additional sparkle effects */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
      </div>
    </div>
  );
};

export default SunResource;
