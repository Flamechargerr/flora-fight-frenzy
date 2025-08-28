import React from 'react';

const GrassBG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" fill="#8BC34A" />
    <path 
      d="M0,0 L100,0 L100,100 L0,100 Z" 
      fill="#8BC34A"
      stroke="#7CB342"
      strokeWidth="2"
      strokeDasharray="5,5"
    />
  </svg>
);

export default GrassBG;