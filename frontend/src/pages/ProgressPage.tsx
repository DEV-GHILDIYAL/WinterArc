import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { StreakFlame } from '../components/StreakFlame';
import { IconMapper } from '../components/IconMapper';
import { StreakStats, StatsSummary, DailyLog } from '../types';
import { apiClient } from '../api/apiClient';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Flame, Trophy, AlertTriangle, Calendar as CalendarIcon, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProgressPage: React.FC = () => {
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [statsSummary, setStatsSummary] = useState<StatsSummary | null>(null);
  const [selectedDayLog, setSelectedDayLog] = useState<{ date: string; log: DailyLog | null } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProgressData();
  }, [period]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const [streakRes, summaryRes] = await Promise.all([
        apiClient.get('/stats/streak'),
        apiClient.get(`/stats/summary?period=${period}`),
      ]);
      setStreakStats(streakRes.data);
      setStatsSummary(summaryRes.data);
    } catch (err) {
      console.error('Error loading progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHeatmapDate = async (dateStr: string) => {
    try {
      const res = await apiClient.get(`/logs/${dateStr}`);
      setSelectedDayLog({
        date: dateStr,
        log: res.data.log,
      });
    } catch (e) {
      console.error('Error loading log date:', e);
    }
  };

  return (
    <div className="min-h-screen bg-winter-bg text-winter-text pb-16">
      <Navbar currentStreak={streakStats?.streak || 0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              PERFORMANCE & ANALYTICS
            </h1>
            <p className="text-xs text-winter-muted mt-1 uppercase tracking-wider font-bold">
              TRACK YOUR STREAKS, CONSISTENCY, AND CATEGORY PERFORMANCE
            </p>
          </div>

          {/* Period Toggle */}
          <div className="flex items-center gap-2 bg-winter-card p-1.5 rounded-2xl border border-winter-border shrink-0">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                period === 'week'
                  ? 'bg-gradient-to-r from-winter-orange to-winter-red text-white shadow-fire'
                  : 'text-winter-muted hover:text-white'
              }`}
            >
              LAST 7 DAYS
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                period === 'month'
                  ? 'bg-gradient-to-r from-winter-orange to-winter-red text-white shadow-fire'
                  : 'text-winter-muted hover:text-white'
              }`}
            >
              LAST 30 DAYS
            </button>
          </div>
        </div>

        {/* Top Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-winter-border flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
                CURRENT STREAK
              </span>
              <StreakFlame streak={streakStats?.streak || 0} size="lg" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              LONGEST STREAK
            </span>
            <div className="text-3xl font-display font-black text-amber-400 mt-1">
              {streakStats?.longestStreak || 0} DAYS
            </div>
            <div className="text-[11px] text-winter-muted mt-1">Personal Best</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              OVERALL CONSISTENCY
            </span>
            <div className="text-3xl font-display font-black text-winter-ice mt-1">
              {streakStats?.overallCompletionRate || 0}%
            </div>
            <div className="text-[11px] text-winter-muted mt-1">
              Threshold: {streakStats?.streakThreshold}% completion
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              TOTAL LOGGED DAYS
            </span>
            <div className="text-3xl font-display font-black text-white mt-1">
              {streakStats?.totalDaysLogged || 0}
            </div>
            <div className="text-[11px] text-winter-muted mt-1">Days on the Winter Arc</div>
          </div>
        </div>

        {/* 90-Day Calendar Heatmap */}
        {streakStats && (
          <CalendarHeatmap
            heatmap={streakStats.heatmap}
            onSelectDate={handleSelectHeatmapDate}
            selectedDate={selectedDayLog?.date}
          />
        )}

        {/* Heatmap Day Detail Drawer/Card if selected */}
        {selectedDayLog && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl border border-winter-orange/40"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-winter-orange" />
                <h3 className="font-display font-bold text-white uppercase text-base">
                  LOG DETAILS FOR {selectedDayLog.date}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayLog(null)}
                className="text-xs text-winter-muted hover:text-white uppercase font-bold"
              >
                CLOSE
              </button>
            </div>

            {selectedDayLog.log ? (
              <div className="space-y-3">
                <div className="text-xs text-winter-muted">
                  Note: {selectedDayLog.log.note || 'No reflection logged for this date.'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {selectedDayLog.log.entries.map((e, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        e.completed
                          ? 'bg-winter-card border-winter-orange/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>Value: {e.value}</span>
                      <span>{e.completed ? '✓ Done' : '✕ Missed'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-winter-muted italic">
                No performance log recorded for this date.
              </div>
            )}
          </motion.div>
        )}

        {/* Insights & Best/Worst performing category */}
        {statsSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Category */}
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  TOP PERFORMING CATEGORY
                </span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5">
                  {statsSummary.bestCategory?.name || 'N/A'}
                </h4>
                <div className="text-xs text-winter-muted mt-1">
                  Completion Rate: {statsSummary.bestCategory?.completionRate || 0}% over evaluation period
                </div>
              </div>
            </div>

            {/* Worst / Needs Work Category */}
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                  NEEDS HIGHER DISCIPLINE
                </span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5">
                  {statsSummary.worstCategory?.name || 'N/A'}
                </h4>
                <div className="text-xs text-winter-muted mt-1">
                  Completion Rate: {statsSummary.worstCategory?.completionRate || 0}% over evaluation period
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytical Charts */}
        {statsSummary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-winter-border">
              <h3 className="text-lg font-display font-bold text-white uppercase mb-1">
                COMPLETION RATE BY CATEGORY ({period.toUpperCase()})
              </h3>
              <p className="text-xs text-winter-muted mb-6">
                Percentage of logged days where category target was achieved.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsSummary.categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#94A3B8"
                      fontSize={10}
                      tickLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12121A', borderColor: '#242436', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Completion Rate']}
                    />
                    <Bar dataKey="completionRate" fill="#FF6B35" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Trend Line Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-winter-border">
              <h3 className="text-lg font-display font-bold text-white uppercase mb-1">
                DAILY PERFORMANCE TREND ({period.toUpperCase()})
              </h3>
              <p className="text-xs text-winter-muted mb-6">
                Daily completion intensity timeline.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsSummary.dailyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#242436" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12121A', borderColor: '#242436', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Daily Completion']}
                    />
                    <Line type="monotone" dataKey="completionPercentage" stroke="#00D9FF" strokeWidth={3} dot={{ fill: '#00D9FF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
