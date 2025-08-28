import React from 'react';

const BasicZombieSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="40" r="30" fill="#4a6741" />
    <circle cx="40" cy="35" r="5" fill="white" />
    <circle cx="40" cy="35" r="2" fill="black" />
    <circle cx="60" cy="35" r="5" fill="white" />
    <circle cx="60" cy="35" r="2" fill="black" />
    <rect x="45" y="55" width="10" height="5" fill="#7a3b3b" />
    <rect x="40" y="70" width="20" height="30" fill="#4a6741" />
  </svg>
);

export default BasicZombieSVG;