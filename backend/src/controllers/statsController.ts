import { Response } from 'express';
import { DailyLog } from '../models/DailyLog.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { calculateStreakAndStats } from '../utils/streakCalculator.js';

export const getStreakStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const categories = await Category.find({ userId: req.user.userId, active: true });
    const logs = await DailyLog.find({ userId: req.user.userId });

    const { stats, heatmap } = calculateStreakAndStats(logs, categories, user.streakThreshold);

    res.status(200).json({
      streak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      totalDaysLogged: stats.totalDaysLogged,
      overallCompletionRate: stats.overallCompletionRate,
      streakThreshold: user.streakThreshold,
      heatmap,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error calculating streak stats' });
  }
};

export const getStatsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const period = (req.query.period as string) || 'month'; // 'week' (7 days) or 'month' (30 days)
    const days = period === 'week' ? 7 : 30;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const activeCategories = await Category.find({ userId: req.user.userId, active: true });
    const logs = await DailyLog.find({
      userId: req.user.userId,
      date: { $gte: startDateStr },
    });

    const totalDaysInPeriod = Math.min(days, Math.max(1, logs.length));

    // Calculate completion rates per category
    const categoryStatsMap = new Map<
      string,
      {
        id: string;
        name: string;
        icon: string;
        type: string;
        unit: string;
        targetValue: number;
        completedCount: number;
        totalLoggedDays: number;
        totalValueLogged: number;
        completionRate: number;
      }
    >();

    activeCategories.forEach((cat) => {
      categoryStatsMap.set(cat._id.toString(), {
        id: cat._id.toString(),
        name: cat.name,
        icon: cat.icon,
        type: cat.type,
        unit: cat.unit || '',
        targetValue: cat.targetValue || 1,
        completedCount: 0,
        totalLoggedDays: logs.length,
        totalValueLogged: 0,
        completionRate: 0,
      });
    });

    logs.forEach((log) => {
      log.entries.forEach((entry) => {
        const catId = entry.categoryId.toString();
        const stat = categoryStatsMap.get(catId);
        if (stat) {
          if (entry.completed) {
            stat.completedCount += 1;
          }
          stat.totalValueLogged += entry.value || 0;
        }
      });
    });

    const categoryBreakdown = Array.from(categoryStatsMap.values()).map((stat) => {
      const rate = logs.length > 0 ? Math.round((stat.completedCount / logs.length) * 100) : 0;
      return {
        ...stat,
        completionRate: rate,
      };
    });

    // Sort to find best and worst category
    const sorted = [...categoryBreakdown].sort((a, b) => b.completionRate - a.completionRate);
    const bestCategory = sorted[0] || null;
    const worstCategory = sorted.length > 1 ? sorted[sorted.length - 1] : null;

    // Daily breakdown graph data for period
    const dailyGraphData: Array<{ date: string; completionPercentage: number; completedCount: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];

      const log = logs.find((l) => l.date === dStr);
      let count = 0;
      if (log) {
        log.entries.forEach((e) => {
          if (categoryStatsMap.has(e.categoryId.toString()) && e.completed) {
            count++;
          }
        });
      }

      const totalCats = activeCategories.length || 1;
      dailyGraphData.push({
        date: dStr,
        completionPercentage: log ? Math.round((count / totalCats) * 100) : 0,
        completedCount: count,
      });
    }

    res.status(200).json({
      period,
      daysEvaluated: days,
      totalLogsInPeriod: logs.length,
      categoryBreakdown,
      bestCategory,
      worstCategory,
      dailyGraphData,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching stats summary' });
  }
};
