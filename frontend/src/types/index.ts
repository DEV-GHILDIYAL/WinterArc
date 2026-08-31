export interface User {
  id: string;
  name: string;
  email: string;
  streakThreshold: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  type: 'boolean' | 'numeric';
  targetValue?: number;
  unit?: string;
  active: boolean;
  order: number;
}

export interface LogEntry {
  categoryId: string;
  value: number;
  completed: boolean;
}

export interface DailyLog {
  _id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
  note?: string;
  createdAt: string;
}

export interface StreakStats {
  streak: number;
  longestStreak: number;
  totalDaysLogged: number;
  overallCompletionRate: number;
  streakThreshold: number;
  heatmap: DayHeatmapItem[];
}

export interface DayHeatmapItem {
  date: string;
  completionRate: number;
  totalCategories: number;
  completedCategories: number;
  qualifiesStreak: boolean;
  hasLog: boolean;
}

export interface CategoryStat {
  id: string;
  name: string;
  icon: string;
  type: 'boolean' | 'numeric';
  unit: string;
  targetValue: number;
  completedCount: number;
  totalLoggedDays: number;
  totalValueLogged: number;
  completionRate: number;
}

export interface StatsSummary {
  period: 'week' | 'month';
  daysEvaluated: number;
  totalLogsInPeriod: number;
  categoryBreakdown: CategoryStat[];
  bestCategory: CategoryStat | null;
  worstCategory: CategoryStat | null;
  dailyGraphData: Array<{
    date: string;
    completionPercentage: number;
    completedCount: number;
  }>;
}
