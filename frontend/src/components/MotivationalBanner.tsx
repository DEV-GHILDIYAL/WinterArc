import React, { useState, useEffect } from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HYPE_QUOTES = [
  "Winter doesn't ask if you're ready.",
  "Outwork your self-doubt.",
  "Execute. No excuses.",
  "Discipline over dopamine.",
  "Suffer the pain of discipline or suffer the pain of regret.",
  "While they sleep, you grind.",
  "Cold weather, cold focus.",
  "You don't get what you wish for. You get what you work for.",
  "The arc is won in silence.",
  "Show up on the days you don't feel like it.",
];

export const MotivationalBanner: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HYPE_QUOTES.length);
    }, 10000); // rotate every 10s
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % HYPE_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-5 sm:p-6 mb-8 border border-winter-orange/30">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-winter-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-winter-ice/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-winter-orange to-winter-red shadow-fire text-white shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1 overflow-hidden">
            <span className="text-[10px] uppercase font-black tracking-widest text-winter-orange">
              DAILY MOTIVATION // WINTER ARC MINDSET
            </span>

            <AnimatePresence mode="wait">
              <motion.h3
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg sm:text-xl font-display font-extrabold text-white tracking-wide uppercase mt-0.5"
              >
                "{HYPE_QUOTES[index]}"
              </motion.h3>
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={handleNext}
          title="Get another quote"
          className="p-2 rounded-lg bg-winter-card hover:bg-winter-cardHover border border-winter-border text-winter-muted hover:text-white transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
