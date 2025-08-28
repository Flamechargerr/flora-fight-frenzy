import React from 'react';

const Flower2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="15" fill="#E91E63" />
    <circle cx="50" cy="50" r="8" fill="#FFC107" />
    
    <path 
      d="M50,20 Q60,35 50,50 Q40,35 50,20 Z" 
      fill="#9C27B0" 
    />
    <path 
      d="M80,50 Q65,60 50,50 Q65,40 80,50 Z" 
      fill="#9C27B0" 
      transform="rotate(0 50 50)"
    />
    <path 
      d="M50,80 Q40,65 50,50 Q60,65 50,80 Z" 
      fill="#9C27B0" 
      transform="rotate(0 50 50)"
    />
    <path 
      d="M20,50 Q35,40 50,50 Q35,60 20,50 Z" 
      fill="#9C27B0" 
      transform="rotate(0 50 50)"
    />
  </svg>
);

export default Flower2;