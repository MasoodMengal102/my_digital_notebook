import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bell,
  Plus,
  Calendar,
  Clock,
  Repeat,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function RemindersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isNewParam = searchParams.get('new');

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'completed', 'all'
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [repeatOption, setRepeatOption] = useState('Does not repeat');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await api.getReminders(statusFilter !== 'all' ? statusFilter : undefined);
      setReminders(data);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [statusFilter]);

  useEffect(() => {
    if (isNewParam === 'true') {
      openCreateModal();
      setSearchParams({});
    }
  }, [isNewParam]);

  const openCreateModal = () => {
    setEditingReminder(null);
    setTitle('');
    setDescription('');
    setReminderDate(new Date().toISOString().split('T')[0]);
    setReminderTime('10:00');
    setRepeatOption('Does not repeat');
    setPriority('Medium');
    setCategory('Academic');
    setModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingReminder(r);
    setTitle(r.title);
    setDescription(r.description || '');
    setReminderDate(r.reminder_date);
    setReminderTime(r.reminder_time);
    setRepeatOption(r.repeat_option);
    setPriority(r.priority);
    setCategory(r.category);
    setModalOpen(true);
  };

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        reminder_date: reminderDate,
        reminder_time: reminderTime,
        repeat_option: repeatOption,
        priority,
        category,
        is_completed: false,
        is_active: true
      };

      if (editingReminder) {
        const updated = await api.updateReminder(editingReminder.id, payload);
        setReminders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await api.createReminder(payload);
        setReminders((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save reminder error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleReminder(id);
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_completed: updated.is_completed } : r)));
    } catch (err) {
      console.error('Toggle reminder error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await api.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Delete reminder error:', err);
    }
  };

  const requestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        new Notification('Crystal Notebook', {
          body: 'Reminders enabled! You will be alerted before your classes & tasks.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-500" />
            Smart Reminder System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Never miss lectures, assignments, teacher meetings, or revisions with precise date & time alerts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {permission !== 'granted' && (
            <button
              onClick={requestPermission}
              className="px-3.5 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Enable Push Notifications
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            New Reminder
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active Reminders
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
            statusFilter === 'completed'
              ? 'bg-amber-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-amber-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All
        </button>
      </div>

      {/* Reminder Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          Loading reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 text-slate-400">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-500" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No reminders here</p>
          <p className="text-xs text-slate-400 mt-1">Add class notifications or assignment alarms to stay on track</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-3xl glass-panel border transition-all flex flex-col justify-between ${
                r.is_completed
                  ? 'border-slate-200/50 dark:border-slate-800/50 opacity-60'
                  : 'border-slate-200/80 dark:border-slate-800 hover:shadow-card hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      r.priority === 'High'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        : r.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                    }`}
                  >
                    {r.priority} Priority
                  </span>
                  <span className="text-[11px] text-slate-400">{r.category}</span>
                </div>

                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(r.id)}
                    className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      r.is_completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-amber-500'
                    }`}
                  >
                    {r.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <h3 className={`text-base font-bold transition-all ${
                      r.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {r.title}
                    </h3>
                    {r.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{r.reminder_date}</span>
                    <span className="font-mono text-xs">at {r.reminder_time}</span>
                  </div>
                  {r.repeat_option && r.repeat_option !== 'Does not repeat' && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <Repeat className="w-3 h-3" />
                      <span>{r.repeat_option}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(r)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Attend Machine Learning class, Submit DBMS assignment"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Room 405 with Prof. Chen. Bring neural net notes."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Repeat
                  </label>
                  <select
                    value={repeatOption}
                    onChange={(e) => setRepeatOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Does not repeat">Does not repeat</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Classes, Study, FYP..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingReminder ? 'Update Reminder' : 'Set Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
