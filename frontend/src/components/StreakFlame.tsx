import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakFlameProps {
  streak: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const StreakFlame: React.FC<StreakFlameProps> = ({ streak, showText = true, size = 'md' }) => {
  const getFlameLevel = () => {
    if (streak >= 30) return { color: 'text-winter-ice drop-shadow-[0_0_15px_rgba(0,217,255,0.8)]', bg: 'from-blue-600 to-cyan-400', label: 'INFERNO' };
    if (streak >= 14) return { color: 'text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]', bg: 'from-orange-500 to-red-600', label: 'BLAZING' };
    if (streak >= 7) return { color: 'text-winter-orange drop-shadow-[0_0_10px_rgba(255,107,53,0.7)]', bg: 'from-winter-orange to-winter-red', label: 'ON FIRE' };
    if (streak >= 1) return { color: 'text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]', bg: 'from-orange-400 to-amber-500', label: 'EMBER' };
    return { color: 'text-slate-600', bg: 'from-slate-700 to-slate-800', label: 'DORMANT' };
  };

  const level = getFlameLevel();

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const fontSizes = {
    sm: 'text-xs font-bold',
    md: 'text-sm font-extrabold',
    lg: 'text-lg font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <motion.div
        animate={streak > 0 ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className={`relative flex items-center justify-center`}
      >
        <Flame className={`${iconSizes[size]} ${level.color} transition-all duration-300`} />
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={`${fontSizes[size]} text-white font-display`}>{streak}</span>
            <span className="text-xs uppercase font-extrabold text-winter-orange tracking-wider">
              {streak === 1 ? 'DAY STREAK' : 'DAYS STREAK'}
            </span>
          </div>
          {streak >= 7 && (
            <span className="text-[10px] uppercase tracking-widest font-black text-winter-ice -mt-1">
              {level.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
