
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
  
  return (
    <div 
      className={`sun-resource ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
      onClick={handleClick}
    >
      {/* Improved sun graphic with rays */}
      <div className="relative w-full h-full">
        {/* Main sun circle */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
          <div className="w-[75%] h-[75%] bg-yellow-300 rounded-full flex items-center justify-center">
            <div className="w-[60%] h-[60%] bg-yellow-200 rounded-full"></div>
          </div>
        </div>
        
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-[25%] h-[10%] bg-yellow-300 rounded-full origin-center animate-pulse"
            style={{ 
              left: '50%', 
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(90%)` 
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SunResource;
