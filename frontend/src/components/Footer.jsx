import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Phone,
  ArrowUp,
  BookOpen,
  Calendar,
  Clock,
  CheckSquare,
  GraduationCap,
  Bell,
  Heart
} from 'lucide-react';

export default function Footer({ variant = 'default' }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl transition-colors duration-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-crystal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-crystal-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-crystal-700 via-crystal-600 to-indigo-600 dark:from-crystal-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Crystal Notebook
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                  Write. Plan. Remember. Achieve.
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The modern digital workspace and productivity platform built specifically for students. Organize your lecture notes, timetable, assignments, exams, and daily study routines from one intuitive dashboard.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Academic Workspace Online</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Navigation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-600 dark:text-slate-400 hover:text-crystal-600 dark:hover:text-crystal-400 flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-crystal-500" />
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/notes"
                  className="text-slate-600 dark:text-slate-400 hover:text-crystal-600 dark:hover:text-crystal-400 flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  Digital Lecture Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/classes"
                  className="text-slate-600 dark:text-slate-400 hover:text-crystal-600 dark:hover:text-crystal-400 flex items-center gap-2 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Class Schedule & Timetable
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className="text-slate-600 dark:text-slate-400 hover:text-crystal-600 dark:hover:text-crystal-400 flex items-center gap-2 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  Tasks & To-Do Lists
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className="text-slate-600 dark:text-slate-400 hover:text-crystal-600 dark:hover:text-crystal-400 flex items-center gap-2 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                  Interactive Calendar
                </Link>
              </li>
              <li>
                <Link
                  to="/planner"
                  className="text-slate-600 dark:text-slate-400 hover:text-crystal-600 dark:hover:text-crystal-400 flex items-center gap-2 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                  Exam & Assignment Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Features & Capabilities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Student Features
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crystal-500 inline-block" />
                Real-Time Note Autosave
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crystal-500 inline-block" />
                Subject & Category Organization
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crystal-500 inline-block" />
                Exam Countdown Alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crystal-500 inline-block" />
                Weekly Class Timetable
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crystal-500 inline-block" />
                Smart Reminders with Push Alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crystal-500 inline-block" />
                Study Revision Scheduler
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us (Required Details) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-crystal-600 dark:text-crystal-400" />
              Contact Us
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Have questions, feedback, or need student assistance? Connect with our team directly:
            </p>

            <div className="space-y-3 pt-1">
              {/* Email Link */}
              <a
                href="mailto:warnamengal643@gmail.com"
                className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-crystal-400 dark:hover:border-crystal-500 transition-all flex items-center gap-3"
                title="Send email"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Email Address</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-crystal-600 dark:group-hover:text-crystal-400 truncate block transition-colors">
                    warnamengal643@gmail.com
                  </span>
                </div>
              </a>

              {/* Phone Link */}
              <a
                href="tel:03363176118"
                className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex items-center gap-3"
                title="Call phone number"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Phone Support</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block transition-colors">
                    03363176118
                  </span>
                </div>
              </a>

              {/* WhatsApp Link */}
              <a
                href="https://wa.me/923461810286"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex items-center gap-3"
                title="Chat on WhatsApp"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* Dedicated SVG WhatsApp Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.85-.38-4.09-1.11l-.29-.17-3.12.82.83-3.04-.19-.3a8.217 8.217 0 0 1-1.26-4.44c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">WhatsApp Chat</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block transition-colors">
                    03461810286
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Strip */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-1">
            <span>© 2026 Crystal Notebook. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Empowering university and college productivity worldwide.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
