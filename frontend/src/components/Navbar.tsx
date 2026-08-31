import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, LayoutDashboard, BarChart3, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { StreakFlame } from './StreakFlame';

interface NavbarProps {
  currentStreak?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStreak = 0 }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Check-In', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Progress', path: '/progress', icon: BarChart3 },
    { label: 'Categories', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-winter-bg/85 backdrop-blur-md border-b border-winter-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-winter-orange to-winter-red shadow-fire group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-wider text-white group-hover:text-winter-orange transition-colors">
                WINTER<span className="text-winter-ice">ARC</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-winter-muted font-bold -mt-1">
                DISCIPLINE LOG
              </span>
            </div>
          </Link>

          {/* Navigation Links for Authenticated Users */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-6">
              <nav className="hidden md:flex items-center gap-1 bg-winter-card/80 p-1.5 rounded-xl border border-winter-border">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-winter-orange to-winter-red text-white shadow-sm'
                          : 'text-winter-muted hover:text-white hover:bg-winter-cardHover'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Streak Quick Indicator */}
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-winter-border">
                <Link to="/progress" className="hover:opacity-90 transition-opacity">
                  <StreakFlame streak={currentStreak} size="sm" />
                </Link>

                {/* User Dropdown / Logout */}
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2.5 rounded-xl bg-winter-card hover:bg-red-500/20 border border-winter-border hover:border-red-500/50 text-winter-muted hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-winter-text hover:text-white transition-colors"
              >
                LOG IN
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red hover:opacity-95 text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-fire transition-all duration-200 hover:scale-105"
              >
                JOIN THE ARC
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation bar at bottom of header */}
        {user && (
          <nav className="flex md:hidden items-center justify-around py-2 border-t border-winter-border/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-winter-orange' : 'text-winter-muted hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
