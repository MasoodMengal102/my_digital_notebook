import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Bell,
  Clock,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Award
} from 'lucide-react';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-crystal-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 glass-nav px-6 lg:px-12 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-crystal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-crystal-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-crystal-700 via-crystal-600 to-indigo-600 dark:from-crystal-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Crystal Notebook
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-crystal-600 dark:hover:text-crystal-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-crystal-600 dark:hover:text-crystal-400 transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-crystal-600 dark:hover:text-crystal-400 transition-colors">For Students</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-crystal-600 dark:hover:text-crystal-400 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-semibold bg-crystal-600 hover:bg-crystal-700 text-white rounded-xl shadow-md shadow-crystal-600/25 transition-all hover:scale-[1.02]"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-12 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Glow pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crystal-50 dark:bg-crystal-950/60 border border-crystal-200 dark:border-crystal-800 text-crystal-700 dark:text-crystal-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          The Modern Digital Workspace for Students
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-tight sm:leading-none">
          Your Notes. Your Schedule.{' '}
          <span className="bg-gradient-to-r from-crystal-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Productivity.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Crystal Notebook helps students organize notes, classes, tasks and daily activities in one simple place.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-crystal-600 to-indigo-600 hover:from-crystal-700 hover:to-indigo-700 text-white font-semibold text-base shadow-xl shadow-crystal-600/25 flex items-center justify-center gap-2 group transition-all"
          >
            Start Writing for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-panel text-slate-800 dark:text-slate-100 font-semibold text-base hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
          >
            Explore Ahmed's Demo
          </Link>
        </div>

        {/* App Mockup Preview Card */}
        <div className="mt-14 w-full rounded-2xl p-2 bg-gradient-to-b from-crystal-300/40 via-indigo-300/20 to-transparent dark:from-crystal-700/20 dark:via-indigo-900/10 shadow-2xl">
          <div className="rounded-xl overflow-hidden glass-panel border border-slate-200/80 dark:border-slate-800 text-left">
            {/* Window bar */}
            <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs text-slate-400 font-mono ml-2">app.crystalnotebook.com/dashboard</span>
            </div>

            {/* Mockup Dashboard Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Today's Class Timetable</span>
                    <span className="text-xs text-crystal-600 dark:text-crystal-400 font-medium">Monday</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Database Systems</p>
                          <p className="text-[11px] text-slate-500">Lab 302 • Dr. Sarah Jenkins</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-300">08:00 – 09:30 AM</span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Machine Learning</p>
                          <p className="text-[11px] text-slate-500">Room 405 • Prof. David Chen</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-300">10:00 – 11:30 AM</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Active Digital Notes</span>
                    <span className="text-xs text-slate-400">Autosaved</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                      Database Systems — Relational Normalization (1NF to BCNF)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      Decomposing tables to eliminate data redundancy and anomalies (Insertion, Update, Deletion)...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">Database</span>
                      <span className="text-[10px] text-slate-400">#bcnf #sql #lecture</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right preview column */}
              <div className="space-y-4">
                {/* Exam Countdown */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
                    <GraduationCap className="w-4 h-4" />
                    Upcoming Exam
                  </div>
                  <h4 className="text-base font-bold mt-2">Machine Learning Midterm</h4>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black">5</span>
                      <span className="text-xs text-indigo-100 ml-1">Days Remaining</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold">
                      In Progress
                    </span>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <span className="font-bold text-sm text-slate-900 dark:text-white block mb-3">Today's To-Dos</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Complete DBMS Assignment</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Read Chapter 4 ML Book</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <span className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 inline-block" />
                      <span>Machine Learning Revision (7:00 PM)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built Specifically for Student Routines
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-base">
            Everything you need across university semesters, all seamlessly connected in one intuitive interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Digital Lecture Notes</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Markdown-supported lecture notes with automatic saving, color coding, subject categorization, and tag filtering.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Class Timetable</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Weekly class timetable with automatic synchronization. The dashboard always shows today's classes chronologically.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Reminders</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Set exact date and time alerts for assignments, meetings, and classes with daily, weekly, or custom repeat rules.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Exam & Assignment Tracker</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time countdown to exam day, preparation status indicators, and organized assignment deadlines.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Task & To-Do Manager</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Priority levels (Low, Medium, High), overdue tracking, and smooth animated completion checkboxes.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Interactive Calendar</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Monthly, weekly, and daily views combining your classes, study sessions, exams, and daily tasks in one view.
            </p>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How Crystal Notebook Works</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Three simple steps to taking complete control of your semester.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-crystal-600 text-white font-bold flex items-center justify-center mb-4">1</span>
              <h3 className="font-bold text-base mb-2">Set Up Your Classes</h3>
              <p className="text-sm text-slate-500">Input your weekly courses, room numbers, and professors once. Your daily schedule updates automatically.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-4">2</span>
              <h3 className="font-bold text-base mb-2">Write Notes with Autosave</h3>
              <p className="text-sm text-slate-500">Take lecture notes in markdown without fear of data loss. Every keystroke is saved securely to the database.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mb-4">3</span>
              <h3 className="font-bold text-base mb-2">Track Exams & Deadlines</h3>
              <p className="text-sm text-slate-500">Get timely alerts and countdown widgets so you walk into exams prepared and never miss assignment cutoffs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Comprehensive Footer */}
      <Footer />
    </div>
  );
}
