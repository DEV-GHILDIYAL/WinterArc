import React from 'react';
import { DayHeatmapItem } from '../types';
import { motion } from 'framer-motion';

interface CalendarHeatmapProps {
  heatmap: DayHeatmapItem[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  heatmap,
  selectedDate,
  onSelectDate,
}) => {
  const getCellColor = (item: DayHeatmapItem) => {
    if (!item.hasLog) return 'bg-slate-900/60 border-slate-800 hover:border-slate-700';
    if (item.completionRate === 0) return 'bg-slate-800/80 border-slate-700';
    if (item.completionRate < 50) return 'bg-amber-950/70 border-amber-800/60 text-amber-300';
    if (item.completionRate < 80) return 'bg-orange-800/80 border-orange-600 text-orange-200';
    if (item.completionRate < 100) return 'bg-winter-orange border-amber-400 text-white';
    return 'bg-gradient-to-br from-winter-orange to-winter-red border-red-400 text-white shadow-[0_0_10px_rgba(255,107,53,0.6)]';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-winter-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
            90-DAY CONSISTENCY HEATMAP
          </h3>
          <p className="text-xs text-winter-muted mt-1">
            Visual intensity across your discipline challenge over the last 3 months.
          </p>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-2 text-xs text-winter-muted shrink-0">
          <span>Less</span>
          <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" />
          <div className="w-3.5 h-3.5 rounded bg-amber-950/70 border border-amber-800" />
          <div className="w-3.5 h-3.5 rounded bg-orange-800/80 border border-orange-600" />
          <div className="w-3.5 h-3.5 rounded bg-winter-orange border border-amber-400" />
          <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-winter-orange to-winter-red shadow-sm" />
          <span>100%</span>
        </div>
      </div>

      {/* Grid Layout (approx 13 weeks x 7 days) */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[640px]">
          {heatmap.map((item) => {
            const isSelected = selectedDate === item.date;
            return (
              <motion.button
                key={item.date}
                whileHover={{ scale: 1.25, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate && onSelectDate(item.date)}
                title={`${item.date}: ${item.hasLog ? `${item.completionRate}% (${item.completedCategories}/${item.totalCategories})` : 'No Log'}`}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border transition-all duration-150 relative ${getCellColor(
                  item
                )} ${isSelected ? 'ring-2 ring-winter-ice ring-offset-2 ring-offset-winter-bg z-20 scale-110' : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
