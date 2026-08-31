import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { IconMapper, AVAILABLE_ICONS } from '../components/IconMapper';
import { Category } from '../types';
import { apiClient } from '../api/apiClient';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight, Check, X, Shield, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CategorySettingsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Category Form State
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('Flame');
  const [newType, setNewType] = useState<'boolean' | 'numeric'>('boolean');
  const [newTargetValue, setNewTargetValue] = useState<number>(1);
  const [newUnit, setNewUnit] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/categories?includeInactive=true');
      setCategories(res.data.categories || []);
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const res = await apiClient.put(`/categories/${cat._id}`, {
        active: !cat.active,
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? res.data.category : c))
      );
    } catch (e) {
      console.error('Error toggling category active:', e);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error('Error deleting category:', e);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await apiClient.post('/categories', {
        name: newName,
        icon: newIcon,
        type: newType,
        targetValue: newType === 'numeric' ? newTargetValue : 1,
        unit: newType === 'numeric' ? newUnit : '',
        active: true,
      });

      setCategories((prev) => [...prev, res.data.category]);
      setShowAddModal(false);
      setNewName('');
      setNewUnit('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-winter-bg text-winter-text pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              CATEGORY MANAGEMENT
            </h1>
            <p className="text-xs text-winter-muted mt-1 uppercase tracking-wider font-bold">
              TOGGLE PRESETS OR ADD CUSTOM HABITS FOR YOUR WINTER ARC
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red hover:opacity-95 text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-fire flex items-center justify-center gap-2 transition-transform active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ADD CUSTOM CATEGORY</span>
          </button>
        </div>

        {/* Category List */}
        {loading ? (
          <div className="py-16 text-center text-winter-muted text-sm uppercase tracking-widest animate-pulse font-bold">
            LOADING CATEGORIES...
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                  cat.active
                    ? 'border-winter-border bg-winter-card/80'
                    : 'border-slate-800/80 bg-slate-950/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                      cat.active
                        ? 'bg-winter-card border-winter-orange text-winter-orange shadow-fire'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    <IconMapper name={cat.icon} className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      {cat.name}
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-winter-muted">
                        {cat.type}
                      </span>
                    </h3>
                    <span className="text-xs text-winter-muted">
                      {cat.type === 'numeric'
                        ? `Target: ${cat.targetValue || 1} ${cat.unit}`
                        : 'Daily Boolean Check-in'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle Active Button */}
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                      cat.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {cat.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-2 rounded-lg bg-winter-card hover:bg-red-500/20 text-winter-muted hover:text-red-400 border border-winter-border transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Category Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-winter-border shadow-card relative"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-black text-white uppercase">
                    NEW CUSTOM CATEGORY
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-lg hover:bg-winter-card text-winter-muted hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                      CATEGORY NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Ice Bath / Heavy Squats"
                      className="w-full px-4 py-3 rounded-xl bg-winter-card border border-winter-border text-white text-sm outline-none focus:border-winter-orange"
                    />
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-2">
                      SELECT ICON
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-winter-card rounded-xl border border-winter-border">
                      {AVAILABLE_ICONS.map((iconName) => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setNewIcon(iconName)}
                          className={`p-2.5 rounded-lg border transition-all ${
                            newIcon === iconName
                              ? 'bg-winter-orange text-white border-winter-orange shadow-fire'
                              : 'bg-slate-900 text-winter-muted border-slate-800 hover:text-white'
                          }`}
                        >
                          <IconMapper name={iconName} className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                      COMPLETION TYPE
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewType('boolean')}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase ${
                          newType === 'boolean'
                            ? 'bg-winter-orange text-white border-winter-orange'
                            : 'bg-winter-card border-winter-border text-winter-muted'
                        }`}
                      >
                        Boolean (Done / Undone)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewType('numeric')}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase ${
                          newType === 'numeric'
                            ? 'bg-winter-orange text-white border-winter-orange'
                            : 'bg-winter-card border-winter-border text-winter-muted'
                        }`}
                      >
                        Numeric Target
                      </button>
                    </div>
                  </div>

                  {/* Numeric specific fields */}
                  {newType === 'numeric' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                          TARGET VALUE
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={newTargetValue}
                          onChange={(e) => setNewTargetValue(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-3 rounded-xl bg-winter-card border border-winter-border text-white text-sm outline-none focus:border-winter-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-winter-muted mb-1">
                          UNIT (e.g. hrs, pages)
                        </label>
                        <input
                          type="text"
                          required
                          value={newUnit}
                          onChange={(e) => setNewUnit(e.target.value)}
                          placeholder="hrs"
                          className="w-full px-4 py-3 rounded-xl bg-winter-card border border-winter-border text-white text-sm outline-none focus:border-winter-orange"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-5 py-3 rounded-xl bg-winter-card text-winter-muted hover:text-white text-xs font-bold uppercase"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-winter-orange to-winter-red text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-fire"
                    >
                      {saving ? 'SAVING...' : 'CREATE CATEGORY'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
