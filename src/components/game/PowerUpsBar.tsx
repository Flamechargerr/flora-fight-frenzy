import React, { useState } from 'react';

const powerUps = [
  { id: 'plant-food', name: 'Plant Food', icon: '🌱', cooldown: 10 },
  { id: 'freeze', name: 'Freeze', icon: '❄️', cooldown: 15 },
  { id: 'sun-boost', name: 'Sun Boost', icon: '☀️', cooldown: 20 },
];

const PowerUpsBar: React.FC = () => {
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});

  const handleActivate = (id: string, cooldown: number) => {
    if (cooldowns[id]) return;
    setCooldowns((prev) => ({ ...prev, [id]: cooldown }));
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const next = { ...prev, [id]: prev[id] - 1 };
        if (next[id] <= 0) {
          clearInterval(interval);
          delete next[id];
        }
        return next;
      });
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-6 bg-black/30 rounded-2xl px-8 py-3 shadow-lg border border-green-700 backdrop-blur">
      {powerUps.map((p) => (
        <button
          key={p.id}
          className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-green-200 hover:bg-green-300 transition-all duration-200 shadow-md border-2 border-green-700 ${cooldowns[p.id] ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          onClick={() => handleActivate(p.id, p.cooldown)}
          disabled={!!cooldowns[p.id]}
        >
          <span className="text-3xl mb-1 animate-bounce-slow">{p.icon}</span>
          <span className="text-xs font-bold text-green-900">{p.name}</span>
          {cooldowns[p.id] && (
            <span className="absolute -top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              {cooldowns[p.id]}s
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default PowerUpsBar; 