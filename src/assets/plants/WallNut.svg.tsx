import React from 'react';

const WallNut: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Base nut shadow */}
    <ellipse cx="50" cy="65" rx="37" ry="30" fill="#6D4C41" />
    
    {/* Nut body with gradient */}
    <ellipse cx="50" cy="50" rx="35" ry="40" fill="#8D6E63" />
    <ellipse cx="50" cy="50" rx="30" ry="35" fill="#A1887F" />
    
    {/* Texture lines */}
    <path d="M30 30 Q50 20 70 30" fill="none" stroke="#6D4C41" strokeWidth="1.5" opacity="0.7" />
    <path d="M30 40 Q50 35 70 40" fill="none" stroke="#6D4C41" strokeWidth="1" opacity="0.5" />
    <path d="M35 60 Q50 70 65 60" fill="none" stroke="#6D4C41" strokeWidth="1.5" opacity="0.5" />
    <path d="M30 75 Q50 80 70 75" fill="none" stroke="#6D4C41" strokeWidth="1" opacity="0.6" />
    
    {/* Highlight */}
    <ellipse cx="40" cy="30" rx="12" ry="8" fill="white" opacity="0.15" />
    
    {/* Eyebrows */}
    <path d="M35 35 Q40 32 45 35" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <path d="M55 35 Q60 32 65 35" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    
    {/* Eyes */}
    <g>
      <ellipse cx="40" cy="42" rx="6" ry="8" fill="white" />
      <ellipse cx="40" cy="43" rx="3" ry="4" fill="#5D4037" />
      <circle cx="39" cy="42" r="1" fill="white" />
    </g>
    
    <g>
      <ellipse cx="60" cy="42" rx="6" ry="8" fill="white" />
      <ellipse cx="60" cy="43" rx="3" ry="4" fill="#5D4037" />
      <circle cx="59" cy="42" r="1" fill="white" />
    </g>
    
    {/* Mouth */}
    <path 
      d="M40,60 Q50,70 60,60" 
      fill="none" 
      stroke="#5D4037" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
  </svg>
);

export default WallNut;