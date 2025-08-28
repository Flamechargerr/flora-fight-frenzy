import React from 'react';

const Flower1: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="20" fill="#FF9800" />
    <circle cx="50" cy="50" r="10" fill="#FFC107" />
    
    <ellipse cx="50" cy="20" rx="10" ry="15" fill="#FF5722" />
    <ellipse cx="80" cy="50" rx="15" ry="10" fill="#FF5722" />
    <ellipse cx="50" cy="80" rx="10" ry="15" fill="#FF5722" />
    <ellipse cx="20" cy="50" rx="15" ry="10" fill="#FF5722" />
    
    <ellipse cx="30" cy="30" rx="10" ry="10" fill="#FF5722" />
    <ellipse cx="70" cy="30" rx="10" ry="10" fill="#FF5722" />
    <ellipse cx="70" cy="70" rx="10" ry="10" fill="#FF5722" />
    <ellipse cx="30" cy="70" rx="10" ry="10" fill="#FF5722" />
  </svg>
);

export default Flower1;