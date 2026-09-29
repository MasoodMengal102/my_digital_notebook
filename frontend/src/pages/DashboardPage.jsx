import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckSquare,
  Clock,
  Bell,
  GraduationCap,
  Calendar as CalendarIcon,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.getDashboardStats();
      setData(res);
      setTasks(res.today_tasks || []);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updated = await api.toggleTask(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: updated.is_completed } : t))
      );
      // Refresh stats count
      api.getDashboardStats().then((res) => {
        setData((prev) => ({ ...prev, stats: res.stats }));
      });
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleToggleReminder = async (reminderId) => {
    try {
      await api.toggleReminder(reminderId);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    total_notes: 0,
    pending_tasks: 0,
    today_classes: 0,
    upcoming_reminders: 0
  };

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Student';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-crystal-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-crystal-600/15">
        {/* Subtle geometric circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Student Academic Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {firstName}! 👋
            </h1>
            <p className="mt-1 text-sm sm:text-base text-crystal-100 max-w-xl">
              Here’s what you have planned for today. Stay focused and achieve your goals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/notes?new=true')}
              className="px-4 py-2.5 rounded-xl bg-white text-crystal-700 hover:bg-crystal-50 font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Quick Note
            </button>
            <button
              onClick={() => navigate('/tasks?new=true')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Notes */}
        <Link
          to="/notes"
          className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-glass-hover hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Notes</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.total_notes}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
            Organized in subjects <ChevronRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Pending Tasks */}
        <Link
          to="/tasks"
          className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-glass-hover hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.pending_tasks}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            To-do list active <ChevronRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Today's Classes */}
        <Link
          to="/classes"
          className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-glass-hover hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Classes</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.today_classes}
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 mt-1">
            View full timetable <ChevronRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Upcoming Reminders */}
        <Link
          to="/reminders"
          className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-glass-hover hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming Reminders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.upcoming_reminders}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-1">
            Active alerts set <ChevronRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Exam Countdown Widget Banner (if exams exist) */}
      {data?.exam_countdowns && data.exam_countdowns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.exam_countdowns.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {exam.subject}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {exam.prep_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Room: {exam.room || 'TBA'} • Date: {exam.exam_date} ({exam.exam_time || '09:00'})
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-400">
                  {exam.days_remaining !== null ? exam.days_remaining : '--'}
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Days Remaining
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Schedule & Today's Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule (Chronological) */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Schedule</h2>
                  <p className="text-xs text-slate-400">Classes and activities arranged chronologically</p>
                </div>
              </div>
              <Link
                to="/classes"
                className="text-xs font-semibold text-crystal-600 dark:text-crystal-400 hover:underline flex items-center gap-1"
              >
                Full Timetable <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {(!data?.today_schedule || data.today_schedule.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No classes or sessions scheduled for today. Enjoy your free time or add a study session!
              </div>
            ) : (
              <div className="space-y-3">
                {data.today_schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-1.5 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: item.color || '#4f46e5' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {item.start_time} — {item.end_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Tasks</h2>
                  <p className="text-xs text-slate-400">Mark completed with smooth interactive check</p>
                </div>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-semibold text-crystal-600 dark:text-crystal-400 hover:underline flex items-center gap-1"
              >
                All Tasks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {tasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                All caught up for today! No pending tasks due today.
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-center justify-between ${
                      task.is_completed
                        ? 'border-slate-100 dark:border-slate-800/60 opacity-60'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.is_completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                        }`}
                      >
                        {task.is_completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </button>
                      <div>
                        <span
                          className={`text-sm font-medium transition-all ${
                            task.is_completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.due_time && (
                          <span className="block text-[11px] text-slate-400">
                            Due at {task.due_time}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                          : task.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Reminders & Recent Notes */}
        <div className="space-y-8">
          {/* Upcoming Reminders */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Reminders</h2>
                </div>
              </div>
              <Link
                to="/reminders"
                className="text-xs font-semibold text-crystal-600 dark:text-crystal-400 hover:underline"
              >
                Manage
              </Link>
            </div>

            {(!data?.upcoming_reminders || data.upcoming_reminders.length === 0) ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No upcoming reminders.
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcoming_reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleReminder(rem.id)}
                          className="mt-0.5 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-crystal-500 transition-colors shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {rem.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {rem.reminder_date} at {rem.reminder_time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                          rem.priority === 'High'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {rem.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notes */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Notes</h2>
                </div>
              </div>
              <Link
                to="/notes"
                className="text-xs font-semibold text-crystal-600 dark:text-crystal-400 hover:underline"
              >
                All Notes
              </Link>
            </div>

            {(!data?.recent_notes || data.recent_notes.length === 0) ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No notes created yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.recent_notes.map((note) => (
                  <Link
                    key={note.id}
                    to={`/notes?id=${note.id}`}
                    className="block p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-crystal-400 dark:hover:border-crystal-500 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-crystal-50 text-crystal-700 dark:bg-crystal-950/60 dark:text-crystal-300 font-medium">
                        {note.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(note.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-crystal-600 dark:group-hover:text-crystal-400 line-clamp-1 transition-colors">
                      {note.title}
                    </h4>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
