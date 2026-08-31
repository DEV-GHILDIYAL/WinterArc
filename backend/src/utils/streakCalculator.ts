import { IDailyLog } from '../models/DailyLog.js';
import { ICategory } from '../models/Category.js';

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  overallCompletionRate: number; // percentage
}

export interface DayHeatmapItem {
  date: string;
  completionRate: number; // 0 - 100
  totalCategories: number;
  completedCategories: number;
  qualifiesStreak: boolean;
  hasLog: boolean;
}

export const calculateStreakAndStats = (
  logs: IDailyLog[],
  activeCategories: ICategory[],
  streakThresholdPercent: number = 100
): { stats: StreakStats; heatmap: DayHeatmapItem[] } => {
  const activeCatIds = new Set(activeCategories.map((c) => c._id.toString()));
  const totalActive = activeCatIds.size;

  // Create a map of date string (YYYY-MM-DD) -> IDailyLog
  const logMap = new Map<string, IDailyLog>();
  logs.forEach((log) => {
    logMap.set(log.date, log);
  });

  // Build heatmap for last 90 days
  const today = new Date();
  const heatmap: DayHeatmapItem[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const log = logMap.get(dateStr);
    if (!log || totalActive === 0) {
      heatmap.push({
        date: dateStr,
        completionRate: 0,
        totalCategories: totalActive,
        completedCategories: 0,
        qualifiesStreak: false,
        hasLog: false,
      });
      continue;
    }

    // Calculate completed count for active categories
    let completedCount = 0;
    log.entries.forEach((entry) => {
      if (activeCatIds.has(entry.categoryId.toString()) && entry.completed) {
        completedCount++;
      }
    });

    const completionRate = Math.round((completedCount / (totalActive || 1)) * 100);
    const qualifiesStreak = completionRate >= streakThresholdPercent;

    heatmap.push({
      date: dateStr,
      completionRate,
      totalCategories: totalActive,
      completedCategories: completedCount,
      qualifiesStreak,
      hasLog: true,
    });
  }

  // Calculate streaks using qualifying dates
  // Sort logs or check consecutive dates
  const qualifyingDatesSet = new Set<string>();
  heatmap.forEach((item) => {
    if (item.qualifiesStreak) {
      qualifyingDatesSet.add(item.date);
    }
  });

  // Also include older logs if they exist outside the 90 day window
  logs.forEach((log) => {
    let completedCount = 0;
    log.entries.forEach((entry) => {
      if (activeCatIds.has(entry.categoryId.toString()) && entry.completed) {
        completedCount++;
      }
    });
    const rate = Math.round((completedCount / (totalActive || 1)) * 100);
    if (rate >= streakThresholdPercent) {
      qualifyingDatesSet.add(log.date);
    }
  });

  // Calculate current streak
  let currentStreak = 0;
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Start checking from today; if today isn't logged/qualified yet, check starting from yesterday
  let checkDate = new Date(today);
  if (!qualifyingDatesSet.has(todayStr)) {
    // If today hasn't qualified, check if yesterday qualified. If so, start counting from yesterday.
    if (qualifyingDatesSet.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      checkDate = today; // Current streak is 0
    }
  }

  let curr = new Date(checkDate);
  while (true) {
    const dStr = curr.toISOString().split('T')[0];
    if (qualifyingDatesSet.has(dStr)) {
      currentStreak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across all logs
  const sortedDates = Array.from(qualifyingDatesSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  // Overall completion rate
  const totalLogs = logs.length;
  let totalCompletions = 0;
  let totalPossible = totalLogs * totalActive;

  logs.forEach((log) => {
    log.entries.forEach((entry) => {
      if (activeCatIds.has(entry.categoryId.toString()) && entry.completed) {
        totalCompletions++;
      }
    });
  });

  const overallCompletionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

  return {
    stats: {
      currentStreak,
      longestStreak,
      totalDaysLogged: totalLogs,
      overallCompletionRate,
    },
    heatmap,
  };
};
