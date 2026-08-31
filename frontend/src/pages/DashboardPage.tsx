import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MotivationalBanner } from '../components/MotivationalBanner';
import { StreakFlame } from '../components/StreakFlame';
import { IconMapper } from '../components/IconMapper';
import { Category, DailyLog, StreakStats } from '../types';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Save,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [categories, setCategories] = useState<Category[]>([]);
  const [logEntries, setLogEntries] = useState<Record<string, { value: number; completed: boolean }>>({});
  const [note, setNote] = useState<string>('');
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load active categories and current date's log
  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const fetchData = async (dateStr: string) => {
    setLoading(true);
    try {
      // 1. Fetch Categories
      const catRes = await apiClient.get('/categories');
      const activeCats: Category[] = catRes.data.categories || [];
      setCategories(activeCats);

      // 2. Fetch Log for date
      const logRes = await apiClient.get(`/logs/${dateStr}`);
      const log: DailyLog | null = logRes.data.log;

      const initialLogEntries: Record<string, { value: number; completed: boolean }> = {};

      activeCats.forEach((cat) => {
        const existingEntry = log?.entries?.find((e) => e.categoryId.toString() === cat._id.toString());

        if (existingEntry) {
          initialLogEntries[cat._id] = {
            value: existingEntry.value,
            completed: existingEntry.completed,
          };
        } else {
          initialLogEntries[cat._id] = {
            value: 0,
            completed: false,
          };
        }
      });

      setLogEntries(initialLogEntries);
      setNote(log?.note || '');

      // 3. Fetch Streak stats
      const streakRes = await apiClient.get('/stats/streak');
      setStreakStats(streakRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBoolean = (catId: string) => {
    setLogEntries((prev) => {
      const current = prev[catId] || { value: 0, completed: false };
      const nextCompleted = !current.completed;
      return {
        ...prev,
        [catId]: {
          value: nextCompleted ? 1 : 0,
          completed: nextCompleted,
        },
      };
    });
  };

  const handleNumericChange = (catId: string, newValue: number, targetValue: number = 1) => {
    const validVal = Math.max(0, newValue);
    setLogEntries((prev) => ({
      ...prev,
      [catId]: {
        value: validVal,
        completed: validVal >= targetValue,
      },
    }));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B35', '#E63946', '#00D9FF', '#FFFFFF'],
      });
    } catch (e) {
      console.log('Confetti error', e);
    }
  };

  const handleSaveLog = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const entriesPayload = Object.entries(logEntries).map(([catId, data]) => ({
        categoryId: catId,
        value: data.value,
        completed: data.completed,
      }));

      await apiClient.post(`/logs/${selectedDate}`, {
        entries: entriesPayload,
        note,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Refresh streak stats
      const streakRes = await apiClient.get('/stats/streak');
      setStreakStats(streakRes.data);

      // Check if 100% completed
      const totalCats = categories.length;
      const completedCount = entriesPayload.filter((e) => e.completed).length;
      if (totalCats > 0 && completedCount === totalCats) {
        triggerConfetti();
      }
    } catch (err) {
      console.error('Error saving log:', err);
    } finally {
      setSaving(false);
    }
  };

  // Date Navigation
  const changeDateByDays = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Completion Stats Calculation
  const totalCategories = categories.length;
  const completedCount = Object.values(logEntries).filter((e) => e.completed).length;
  const completionPercentage = totalCategories > 0 ? Math.round((completedCount / totalCategories) * 100) : 0;
  const isToday = selectedDate === getTodayString();

  return (
    <div className="min-h-screen bg-winter-bg text-winter-text pb-16">
      <Navbar currentStreak={streakStats?.streak || 0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hype Banner */}
        <MotivationalBanner />

        {/* Dashboard Header & Date Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                DAILY LOG
              </h1>
              <span className="px-3 py-1 rounded-full bg-winter-card border border-winter-border text-winter-ice font-bold text-xs">
                {isToday ? "TODAY" : selectedDate}
              </span>
            </div>
            <p className="text-xs text-winter-muted mt-1 uppercase tracking-wider font-bold">
              LOCK IN YOUR PERFORMANCE. NO EXCUSES.
            </p>
          </div>

          {/* Date Picker Controls */}
          <div className="flex items-center gap-3 bg-winter-card p-1.5 rounded-2xl border border-winter-border">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-2 rounded-xl hover:bg-winter-cardHover text-winter-muted hover:text-white transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3">
              <Calendar className="w-4 h-4 text-winter-orange" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => changeDateByDays(1)}
              disabled={isToday}
              className="p-2 rounded-xl hover:bg-winter-cardHover text-winter-muted hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Progress Bar Card */}
          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-winter-muted">
                DAY COMPLETION
              </span>
              <span className="text-xl font-display font-black text-winter-orange">
                {completionPercentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  completionPercentage === 100
                    ? 'bg-gradient-to-r from-winter-orange to-winter-red shadow-fire'
                    : 'bg-winter-orange'
                }`}
              />
            </div>
            <div className="text-[11px] text-winter-muted mt-2">
              {completedCount} of {totalCategories} categories completed
            </div>
          </div>

          {/* Streak Flame Card */}
          <div className="glass-panel p-6 rounded-2xl border border-winter-border flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
                CURRENT STREAK
              </span>
              <StreakFlame streak={streakStats?.streak || 0} size="lg" />
            </div>
          </div>

          {/* Overall Consistency Card */}
          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              90-DAY CONSISTENCY
            </span>
            <div className="text-3xl font-display font-black text-winter-ice mt-1">
              {streakStats?.overallCompletionRate || 0}%
            </div>
            <div className="text-[11px] text-winter-muted mt-1">
              Total Logged Days: <span className="text-white font-bold">{streakStats?.totalDaysLogged || 0}</span>
            </div>
          </div>
        </div>

        {/* Daily Categories Check-In Grid */}
        {loading ? (
          <div className="py-16 text-center text-winter-muted text-sm uppercase tracking-widest animate-pulse font-bold">
            LOADING CATEGORIES...
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-wide">
              CATEGORIES CHECK-IN
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const entry = logEntries[cat._id] || { value: 0, completed: false };

                return (
                  <motion.div
                    key={cat._id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-5 rounded-2xl transition-all duration-200 border ${
                      entry.completed
                        ? 'bg-winter-card/90 border-winter-orange/60 shadow-[0_0_15px_rgba(255,107,53,0.15)]'
                        : 'bg-winter-card/50 border-winter-border hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Icon + Title */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                            entry.completed
                              ? 'bg-gradient-to-br from-winter-orange to-winter-red text-white border-winter-orange shadow-fire'
                              : 'bg-slate-900 border-slate-800 text-winter-muted'
                          }`}
                        >
                          <IconMapper name={cat.icon} className="w-5 h-5" />
                        </div>

                        <div>
                          <h3 className="font-display font-bold text-white text-base">{cat.name}</h3>
                          <span className="text-xs text-winter-muted">
                            {cat.type === 'numeric'
                              ? `Target: ${cat.targetValue || 1} ${cat.unit || ''}`
                              : 'Daily Boolean Habit'}
                          </span>
                        </div>
                      </div>

                      {/* Interaction Controls */}
                      {cat.type === 'boolean' ? (
                        <button
                          onClick={() => handleToggleBoolean(cat._id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                            entry.completed
                              ? 'bg-gradient-to-r from-winter-orange to-winter-red text-white shadow-fire'
                              : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400'
                          }`}
                        >
                          {entry.completed ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>DONE</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>INCOMPLETE</span>
                            </>
                          )}
                        </button>
                      ) : (
                        /* Numeric Input */
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleNumericChange(cat._id, entry.value - 1, cat.targetValue || 1)
                            }
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <div className="flex items-baseline gap-1 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-lg min-w-[70px] justify-center">
                            <input
                              type="number"
                              min="0"
                              value={entry.value}
                              onChange={(e) =>
                                handleNumericChange(
                                  cat._id,
                                  parseInt(e.target.value) || 0,
                                  cat.targetValue || 1
                                )
                              }
                              className="w-12 bg-transparent text-center font-display font-bold text-white text-sm outline-none"
                            />
                            <span className="text-[10px] text-winter-muted">{cat.unit}</span>
                          </div>

                          <button
                            onClick={() =>
                              handleNumericChange(cat._id, entry.value + 1, cat.targetValue || 1)
                            }
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Reflection Note Field */}
            <div className="glass-panel p-6 rounded-2xl border border-winter-border mt-8">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-winter-orange" />
                <h3 className="font-display font-bold text-white uppercase text-sm">
                  DAILY REFLECTION / MENTAL NOTE
                </h3>
              </div>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Log your mindset, lessons learned, or physical notes today..."
                className="w-full p-4 rounded-xl bg-winter-card border border-winter-border text-white text-sm placeholder:text-slate-600 outline-none focus:border-winter-orange focus:ring-1 focus:ring-winter-orange transition-all"
              />
            </div>

            {/* Save Log Floating CTA */}
            <div className="flex items-center justify-end gap-4 pt-4">
              {saveSuccess && (
                <span className="text-xs font-extrabold uppercase text-winter-success flex items-center gap-1.5 animate-bounce">
                  <Sparkles className="w-4 h-4" /> LOG LOCKED IN SUCCESSFULLY!
                </span>
              )}

              <button
                onClick={handleSaveLog}
                disabled={saving}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-winter-orange to-winter-red hover:opacity-95 text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-fire flex items-center gap-3 transition-transform active:scale-98 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'LOCKING IN...' : 'LOCK IN LOG'}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
