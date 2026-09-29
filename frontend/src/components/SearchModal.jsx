import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, CheckSquare, Bell, Calendar, Clock, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-crystal-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, tasks, classes, reminders, exams..."
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {loading && <Loader2 className="w-4 h-4 text-crystal-500 animate-spin shrink-0" />}
          {query && !loading && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">ESC</kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query && (
            <div className="text-center py-10 text-slate-400 text-sm">
              Type to search across notes, classes, to-dos, reminders and exams.
            </div>
          )}

          {query && results && results.total_matches === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              No results found for "<span className="text-slate-600 dark:text-slate-200 font-medium">{query}</span>"
            </div>
          )}

          {results && results.total_matches > 0 && (
            <>
              {/* Notes */}
              {results.results.notes.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    Notes ({results.results.notes.length})
                  </div>
                  <div className="space-y-1">
                    {results.results.notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleSelect(`/notes?id=${note.id}`)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 group-hover:text-crystal-600 dark:group-hover:text-crystal-400">
                            {note.title}
                          </p>
                          <span className="text-xs text-slate-400">{note.category}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-crystal-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.results.tasks.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                    Tasks ({results.results.tasks.length})
                  </div>
                  <div className="space-y-1">
                    {results.results.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleSelect('/tasks')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                            task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-sm ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {task.title}
                          </span>
                        </div>
                        {task.due_date && <span className="text-xs text-slate-400">{task.due_date}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {results.results.classes.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Class Timetable ({results.results.classes.length})
                  </div>
                  <div className="space-y-1">
                    {results.results.classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => handleSelect('/classes')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{cls.subject_name}</p>
                          <span className="text-xs text-slate-400">{cls.day_of_week} • {cls.start_time} • {cls.room}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-crystal-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reminders & Exams */}
              {results.results.reminders.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    Reminders ({results.results.reminders.length})
                  </div>
                  <div className="space-y-1">
                    {results.results.reminders.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect('/reminders')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                      >
                        <span className="text-sm text-slate-800 dark:text-slate-100">{r.title}</span>
                        <span className="text-xs text-slate-400">{r.reminder_date} at {r.reminder_time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.results.exams.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                    Exams ({results.results.exams.length})
                  </div>
                  <div className="space-y-1">
                    {results.results.exams.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => handleSelect('/planner')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{ex.subject}</p>
                          <span className="text-xs text-slate-400">Date: {ex.exam_date} • Room: {ex.room}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-crystal-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
