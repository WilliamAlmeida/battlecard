import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { achievementsService } from '../services/achievementsService';
import { soundService } from '../services/soundService';

export const AchievementNotification: React.FC = () => {
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = achievementsService.onUnlock((unlocked) => {
      setAchievement(unlocked);
      setVisible(true);
      soundService.playAchievement();
      
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => setAchievement(null), 500);
      }, 4000);
    });

    return unsubscribe;
  }, []);

  if (!achievement) return null;

  return (
    <div 
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-[100]
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
      `}
    >
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-500 px-8 py-4 rounded-2xl shadow-2xl border-4 border-white flex items-center gap-4 animate-pulse">
        <div className="text-5xl">{achievement.icon}</div>
        <div>
          <div className="text-sm font-bold text-black/60 uppercase tracking-widest">Conquista Desbloqueada!</div>
          <div className="text-2xl font-black text-black">{achievement.name}</div>
          <div className="text-sm text-black/80">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
};
