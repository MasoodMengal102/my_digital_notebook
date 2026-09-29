import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
  Bell,
  GraduationCap,
  Settings,
  LogOut,
  Search,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchModal from '../components/SearchModal';
import NotificationCenter from '../components/NotificationCenter';
import Footer from '../components/Footer';

export default function DashboardLayout() {
  const { user, logout, theme, changeTheme } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Notes', path: '/notes', icon: BookOpen },
    { name: 'Tasks & To-Dos', path: '/tasks', icon: CheckSquare },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Class Schedule', path: '/classes', icon: Clock },
    { name: 'Reminders', path: '/reminders', icon: Bell },
    { name: 'Student Planner', path: '/planner', icon: GraduationCap },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Glassmorphic Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/80">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-crystal-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-crystal-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-crystal-700 via-crystal-600 to-indigo-600 dark:from-crystal-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Crystal Notebook
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                  Student Edition
                </span>
              </div>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-crystal-600 text-white shadow-md shadow-crystal-600/25 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-crystal-100 dark:bg-crystal-900/50 border border-crystal-200 dark:border-crystal-800 flex items-center justify-center font-bold text-crystal-700 dark:text-crystal-300 text-sm overflow-hidden shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                user?.full_name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user?.full_name || 'Student'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 glass-nav px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs sm:text-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all w-44 sm:w-72"
            >
              <Search className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate">Search notebook...</span>
              <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickAddOpen(!quickAddOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-crystal-600 hover:bg-crystal-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-crystal-600/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {quickAddOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs sm:text-sm"
                  onClick={() => setQuickAddOpen(false)}
                >
                  <button
                    onClick={() => navigate('/notes?new=true')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    New Lecture Note
                  </button>
                  <button
                    onClick={() => navigate('/tasks?new=true')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    New To-Do Task
                  </button>
                  <button
                    onClick={() => navigate('/reminders?new=true')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Bell className="w-4 h-4 text-amber-500" />
                    New Reminder
                  </button>
                  <button
                    onClick={() => navigate('/classes?new=true')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Clock className="w-4 h-4 text-indigo-500" />
                    New Class Timetable
                  </button>
                </div>
              )}
            </div>

            {/* In-app Notification Center */}
            <NotificationCenter />

            {/* Theme Toggle Button */}
            <button
              onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Global Professional Footer */}
        <Footer />
      </div>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
