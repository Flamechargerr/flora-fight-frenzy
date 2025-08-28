import React from 'react';

const Sun: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="30" fill="#FFC107" />
    <circle cx="50" cy="50" r="20" fill="#FFEB3B" />
    
    {/* Sun rays */}
    <path d="M50,10 L50,0 M50,100 L50,90 M10,50 L0,50 M100,50 L90,50" stroke="#FFC107" strokeWidth="5" />
    <path d="M25,25 L15,15 M75,25 L85,15 M25,75 L15,85 M75,75 L85,85" stroke="#FFC107" strokeWidth="5" />
  </svg>
);

export default Sun;