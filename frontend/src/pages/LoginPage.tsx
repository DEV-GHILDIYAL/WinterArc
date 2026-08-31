import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-winter-bg text-winter-text flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-winter-orange/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-winter-border shadow-card relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-winter-orange to-winter-red shadow-fire flex items-center justify-center">
              <Flame className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wide mt-4">
            WELCOME BACK
          </h2>
          <p className="text-xs text-winter-muted mt-1 uppercase tracking-widest font-bold">
            ENTER YOUR WINTER ARC DISCIPLINE ZONE
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-2">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-winter-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@winterarc.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-winter-card border border-winter-border focus:border-winter-orange focus:ring-1 focus:ring-winter-orange text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-winter-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-winter-card border border-winter-border focus:border-winter-orange focus:ring-1 focus:ring-winter-orange text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red hover:opacity-95 text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-fire transition-transform active:scale-98 disabled:opacity-50 mt-2"
          >
            {loading ? 'AUTHENTICATING...' : 'LOG IN TO ARC'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-winter-muted">
          DON'T HAVE AN ACCOUNT?{' '}
          <Link to="/register" className="text-winter-orange font-bold hover:underline">
            SIGN UP
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
