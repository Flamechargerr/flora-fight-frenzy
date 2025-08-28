
import { useState, useEffect } from 'react';
import SunSVG from '../assets/sun/Sun.svg?react';

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
      className="sun-resource absolute cursor-pointer select-none"
      style={{
        left: x - 24,
        top: y - 24,
        width: 48,
        height: 48,
        zIndex: 20,
        transition: 'top 0.3s, left 0.3s',
      }}
      onClick={() => onCollect(id)}
    >
      <SunSVG style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default SunResource;
