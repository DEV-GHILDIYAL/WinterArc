import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Zap, BarChart3, ArrowRight, CheckCircle2, Trophy, Target } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-winter-bg text-winter-text overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-winter-orange/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-winter-ice/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-winter-orange to-winter-red shadow-fire flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-black text-2xl tracking-wider text-white">
            WINTER<span className="text-winter-ice">ARC</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-bold uppercase tracking-wider text-winter-muted hover:text-white transition-colors"
          >
            LOG IN
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-fire hover:scale-105 transition-transform"
          >
            START ARC NOW
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-winter-card border border-winter-orange/30 text-winter-orange text-xs font-extrabold tracking-widest uppercase mb-6 shadow-sm">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>NO EXCUSES. NO DISTRACTIONS.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase leading-[1.1]">
            OUTWORK EVERYONE <br />
            <span className="text-gradient-fire">THIS WINTER ARC.</span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-winter-muted font-normal leading-relaxed">
            The intense, high-discipline performance tracker designed to hold you accountable across your workout, study, sleep, reading, and custom daily habits.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-fire hover:scale-105 transition-transform flex items-center justify-center gap-3"
            >
              <span>CLAIM YOUR ARC</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-winter-card hover:bg-winter-cardHover border border-winter-border text-white font-display font-bold text-sm uppercase tracking-wider transition-colors"
            >
              SIGN IN TO TRACK
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <div className="w-12 h-12 rounded-xl bg-winter-orange/20 border border-winter-orange/40 flex items-center justify-center text-winter-orange mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white uppercase mb-2">
              FAST DAILY CHECK-IN
            </h3>
            <p className="text-sm text-winter-muted leading-relaxed">
              Log workout, study hours, diet, reading pages, and custom habits in seconds. Zero friction design built for high daily consistency.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <div className="w-12 h-12 rounded-xl bg-winter-red/20 border border-winter-red/40 flex items-center justify-center text-winter-red mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white uppercase mb-2">
              STREAK FLAME INTENSITY
            </h3>
            <p className="text-sm text-winter-muted leading-relaxed">
              Watch your streak flame level evolve from Ember to Blazing Inferno as you maintain your threshold every single day.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-winter-border">
            <div className="w-12 h-12 rounded-xl bg-winter-ice/20 border border-winter-ice/40 flex items-center justify-center text-winter-ice mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white uppercase mb-2">
              90-DAY HEATMAP & ANALYTICS
            </h3>
            <p className="text-sm text-winter-muted leading-relaxed">
              GitHub-contributions style heatmaps, weekly & monthly category completion graphs, and performance insights.
            </p>
          </div>
        </div>
      </section>

      {/* Preset Categories Showcase */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase mb-4">
          PRE-CONFIGURED FOR DISCIPLINE
        </h2>
        <p className="text-sm text-winter-muted max-w-xl mx-auto mb-8">
          Includes 8 built-in Winter Arc preset categories plus full customization for your personal goals.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            '🏋️ Workout',
            '📚 Deep Study (4h)',
            '🥗 Clean Eating',
            '💤 Sleep 7+ Hrs',
            '📖 Book Reading',
            '🧊 Cold Shower',
            '📵 No Doomscroll',
            '💻 Skill Building',
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-xl bg-winter-card border border-winter-border text-xs font-bold text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-winter-border py-8 text-center text-xs text-winter-muted">
        <p>© 2026 WINTERARC DISCIPLINE TRACKER. EXECUTE DAILY.</p>
      </footer>
    </div>
  );
};
