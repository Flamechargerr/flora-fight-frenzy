import React from 'react';

const PeashooterSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Plant stem */}
    <path d="M50 90 L50 70" stroke="#3D8C40" strokeWidth="6" />
    <path d="M50 70 L45 80" stroke="#3D8C40" strokeWidth="3" />
    <path d="M50 75 L55 85" stroke="#3D8C40" strokeWidth="3" />
    
    {/* Main head */}
    <circle cx="50" cy="45" r="25" fill="#66BB6A" />
    <circle cx="50" cy="45" r="22" fill="#81C784" />
    
    {/* Shooting tube */}
    <path d="M50 45 L80 45" stroke="#66BB6A" strokeWidth="10" strokeLinecap="round" />
    <circle cx="80" cy="45" r="8" fill="#4CAF50" />
    <circle cx="80" cy="45" r="5" fill="#2E7D32" />
    
    {/* Eyes */}
    <circle cx="40" cy="38" r="5" fill="white" />
    <circle cx="40" cy="38" r="3" fill="black" />
    <circle cx="55" cy="38" r="5" fill="white" />
    <circle cx="55" cy="38" r="3" fill="black" />
    
    {/* Mouth */}
    <path d="M42 52 Q50 58 58 52" stroke="#2E7D32" strokeWidth="2" fill="none" />
    
    {/* Leaves */}
    <path d="M50 70 Q60 65 65 75" stroke="#3D8C40" strokeWidth="4" fill="#66BB6A" />
    <path d="M50 65 Q40 60 35 70" stroke="#3D8C40" strokeWidth="4" fill="#66BB6A" />
  </svg>
);

export default PeashooterSVG;