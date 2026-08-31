import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { StreakStats } from '../types';
import { apiClient } from '../api/apiClient';
import { User, Lock, Flame, Shield, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [streakThreshold, setStreakThreshold] = useState<number>(user?.streakThreshold || 100);
  const [stats, setStats] = useState<StreakStats | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/stats/streak');
      setStats(res.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setUpdatingProfile(true);

    try {
      const res = await apiClient.put('/auth/profile', {
        name,
        streakThreshold,
      });
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setUpdatingPassword(true);

    try {
      await apiClient.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Error changing password' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-winter-bg text-winter-text pb-16">
      <Navbar currentStreak={stats?.streak || 0} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            ATHLETE PROFILE & SETTINGS
          </h1>
          <p className="text-xs text-winter-muted mt-1 uppercase tracking-wider font-bold">
            MANAGE ACCOUNT PARAMETERS & DISCIPLINE STREAK THRESHOLDS
          </p>
        </div>

        {/* Member Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              MEMBER SINCE
            </span>
            <div className="text-xl font-display font-bold text-white mt-1">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              TOTAL DAYS LOGGED
            </span>
            <div className="text-2xl font-display font-black text-winter-orange mt-1">
              {stats?.totalDaysLogged || 0} DAYS
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <span className="text-xs font-bold uppercase tracking-wider text-winter-muted block mb-1">
              LONGEST STREAK RECORD
            </span>
            <div className="text-2xl font-display font-black text-amber-400 mt-1">
              {stats?.longestStreak || 0} DAYS
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-winter-border space-y-6">
          <h2 className="text-xl font-display font-black text-white uppercase flex items-center gap-2">
            <User className="w-5 h-5 text-winter-orange" />
            <span>ACCOUNT DETAILS</span>
          </h2>

          {profileMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-winter-card border border-winter-border text-white text-sm outline-none focus:border-winter-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-sm outline-none cursor-not-allowed"
              />
            </div>

            {/* Streak Threshold Config */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-winter-orange">
                  STREAK QUALIFYING THRESHOLD
                </label>
                <span className="font-display font-black text-sm text-white">{streakThreshold}%</span>
              </div>
              <p className="text-xs text-winter-muted mb-3">
                Minimum percentage of active daily categories required for a day to count towards your unbroken streak. Default is 100%.
              </p>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={streakThreshold}
                onChange={(e) => setStreakThreshold(parseInt(e.target.value))}
                className="w-full accent-winter-orange cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-fire"
            >
              {updatingProfile ? 'SAVING...' : 'UPDATE PROFILE'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-winter-border space-y-6">
          <h2 className="text-xl font-display font-black text-white uppercase flex items-center gap-2">
            <Lock className="w-5 h-5 text-winter-ice" />
            <span>CHANGE SECURITY PASSWORD</span>
          </h2>

          {passwordMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                CURRENT PASSWORD
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-winter-card border border-winter-border text-white text-sm outline-none focus:border-winter-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                NEW PASSWORD
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 chars, 1 uppercase, 1 number"
                className="w-full px-4 py-3 rounded-xl bg-winter-card border border-winter-border text-white text-sm outline-none focus:border-winter-orange"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="px-6 py-3 rounded-xl bg-winter-card hover:bg-winter-cardHover border border-winter-border text-white font-display font-bold text-xs uppercase tracking-wider"
            >
              {updatingPassword ? 'CHANGING...' : 'CHANGE PASSWORD'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
