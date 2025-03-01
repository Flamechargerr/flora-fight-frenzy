
import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

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
      <Sun className="text-yellow-500 w-10 h-10" />
    </div>
  );
};

export default SunResource;
