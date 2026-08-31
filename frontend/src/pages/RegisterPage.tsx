import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain at least one uppercase letter and one number.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error registering account');
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
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-winter-orange to-winter-red shadow-fire flex items-center justify-center">
              <Flame className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wide mt-4">
            START YOUR ARC
          </h2>
          <p className="text-xs text-winter-muted mt-1 uppercase tracking-widest font-bold">
            JOIN THE WINTER ARC MOVEMENT
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1.5">
              FULL NAME
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-winter-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Aurelius"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-winter-card border border-winter-border focus:border-winter-orange focus:ring-1 focus:ring-winter-orange text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1.5">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-winter-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars, 1 upper, 1 number"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-winter-card border border-winter-border focus:border-winter-orange focus:ring-1 focus:ring-winter-orange text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-winter-card/50 border border-winter-border text-[11px] text-winter-muted space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-winter-orange shrink-0" />
              <span>Includes 8 preset Winter Arc categories ready to track</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red hover:opacity-95 text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-fire transition-transform active:scale-98 disabled:opacity-50 mt-2"
          >
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER & START ARC'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-winter-muted">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link to="/login" className="text-winter-orange font-bold hover:underline">
            LOG IN
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
