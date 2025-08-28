import React from 'react';

const LawnMower: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Main body */}
    <rect x="20" y="50" width="50" height="30" fill="#424242" rx="5" />
    
    {/* Engine top */}
    <rect x="30" y="35" width="30" height="15" fill="#616161" rx="2" />
    
    {/* Handle */}
    <path d="M65,50 L85,30" stroke="#616161" strokeWidth="5" />
    <circle cx="85" cy="30" r="5" fill="#616161" />
    
    {/* Wheels */}
    <circle cx="30" cy="80" r="10" fill="#212121" />
    <circle cx="30" cy="80" r="5" fill="#424242" />
    <circle cx="70" cy="80" r="10" fill="#212121" />
    <circle cx="70" cy="80" r="5" fill="#424242" />
    
    {/* Blade housing */}
    <rect x="10" y="55" width="20" height="20" fill="#757575" rx="3" />
  </svg>
);

export default LawnMower;