import React from 'react';

const SunflowerSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Stem */}
    <path d="M50 90 L50 65" stroke="#3D8C40" strokeWidth="6" />
    <path d="M50 75 L45 85" stroke="#3D8C40" strokeWidth="3" />
    <path d="M50 80 L55 90" stroke="#3D8C40" strokeWidth="3" />
    
    {/* Petals - Large sunflower pattern */}
    <path d="M50 15 L55 35 L45 35 Z" fill="#FFD54F" />
    <path d="M70 20 L65 40 L55 30 Z" fill="#FFD54F" />
    <path d="M85 35 L65 45 L65 35 Z" fill="#FFD54F" />
    <path d="M85 55 L65 55 L65 45 Z" fill="#FFD54F" />
    <path d="M75 75 L55 65 L65 55 Z" fill="#FFD54F" />
    <path d="M50 85 L45 65 L55 65 Z" fill="#FFD54F" />
    <path d="M25 75 L45 65 L35 55 Z" fill="#FFD54F" />
    <path d="M15 55 L35 55 L35 45 Z" fill="#FFD54F" />
    <path d="M15 35 L35 45 L35 35 Z" fill="#FFD54F" />
    <path d="M30 20 L35 40 L45 30 Z" fill="#FFD54F" />
    
    {/* Center of flower */}
    <circle cx="50" cy="50" r="18" fill="#795548" />
    <circle cx="50" cy="50" r="15" fill="#8D6E63" />
    
    {/* Seed pattern in center */}
    <circle cx="50" cy="50" r="2" fill="#5D4037" />
    <circle cx="57" cy="50" r="2" fill="#5D4037" />
    <circle cx="43" cy="50" r="2" fill="#5D4037" />
    <circle cx="50" cy="57" r="2" fill="#5D4037" />
    <circle cx="50" cy="43" r="2" fill="#5D4037" />
    <circle cx="55" cy="55" r="2" fill="#5D4037" />
    <circle cx="45" cy="45" r="2" fill="#5D4037" />
    <circle cx="55" cy="45" r="2" fill="#5D4037" />
    <circle cx="45" cy="55" r="2" fill="#5D4037" />
    
    {/* Happy face */}
    <circle cx="45" cy="48" r="2.5" fill="#FFEB3B" />
    <circle cx="55" cy="48" r="2.5" fill="#FFEB3B" />
    <path d="M45 55 Q50 58 55 55" stroke="#FFEB3B" strokeWidth="1.5" fill="none" />
  </svg>
);

export default SunflowerSVG;