import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Clock,
  Plus,
  MapPin,
  User,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  BookOpen,
  X,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClassesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isNewParam = searchParams.get('new');

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [room, setRoom] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [color, setColor] = useState('#4f46e5');
  const [category, setCategory] = useState('Lecture');
  const [saving, setSaving] = useState(false);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await api.getClasses(selectedDay !== 'All' ? selectedDay : undefined);
      setClasses(data);
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [selectedDay]);

  useEffect(() => {
    if (isNewParam === 'true') {
      openCreateModal();
      setSearchParams({});
    }
  }, [isNewParam]);

  const openCreateModal = () => {
    setEditingClass(null);
    setSubjectName('');
    setTeacherName('');
    setRoom('');
    setDayOfWeek(currentDay && DAYS.includes(currentDay) ? currentDay : 'Monday');
    setStartTime('09:00');
    setEndTime('10:30');
    setColor('#4f46e5');
    setCategory('Lecture');
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingClass(c);
    setSubjectName(c.subject_name);
    setTeacherName(c.teacher_name || '');
    setRoom(c.room || '');
    setDayOfWeek(c.day_of_week);
    setStartTime(c.start_time);
    setEndTime(c.end_time);
    setColor(c.color || '#4f46e5');
    setCategory(c.category || 'Lecture');
    setModalOpen(true);
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        subject_name: subjectName,
        teacher_name: teacherName,
        room,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        color,
        category
      };

      if (editingClass) {
        const updated = await api.updateClass(editingClass.id, payload);
        setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await api.createClass(payload);
        setClasses((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save class error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Remove this class from your timetable?')) return;
    try {
      await api.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Delete class error:', err);
    }
  };

  // Group classes by day
  const classesByDay = DAYS.reduce((acc, day) => {
    acc[day] = classes.filter((c) => c.day_of_week.toLowerCase() === day.toLowerCase());
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-indigo-600" />
            Class Schedule & Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly lecture schedules, laboratories, professors, and room locations
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center gap-2 self-start transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Day Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedDay('All')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors ${
            selectedDay === 'All'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Full Week Timetable
        </button>
        {DAYS.map((day) => {
          const isToday = day.toLowerCase() === currentDay.toLowerCase();
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" title="Today" />
              )}
            </button>
          );
        })}
      </div>

      {/* Timetable Display */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          Loading class schedule...
        </div>
      ) : classes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 text-slate-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30 text-indigo-500" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No classes registered</p>
          <p className="text-xs text-slate-400 mt-1">Click "+ Add Class" to populate your timetable</p>
        </div>
      ) : selectedDay === 'All' ? (
        /* Full Week Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS.map((day) => {
            const dayClasses = classesByDay[day] || [];
            const isToday = day.toLowerCase() === currentDay.toLowerCase();

            return (
              <div
                key={day}
                className={`p-5 rounded-3xl glass-panel border flex flex-col transition-all ${
                  isToday
                    ? 'border-indigo-400 dark:border-indigo-600 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{day}</span>
                    {isToday && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {dayClasses.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No classes scheduled
                    </div>
                  ) : (
                    dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between group"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-1.5 h-12 rounded-full shrink-0 mt-0.5"
                            style={{ backgroundColor: cls.color || '#4f46e5' }}
                          />
                          <div>
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                              {cls.start_time} – {cls.end_time}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                              {cls.subject_name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                              {cls.room && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {cls.room}
                                </span>
                              )}
                              {cls.teacher_name && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" /> {cls.teacher_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(cls)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Day Detailed View */
        <div className="max-w-2xl mx-auto space-y-3">
          {(classesByDay[selectedDay] || []).length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 text-slate-400">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30 text-indigo-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No classes on {selectedDay}
              </p>
            </div>
          ) : (
            (classesByDay[selectedDay] || []).map((cls) => (
              <div
                key={cls.id}
                className="p-5 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-2.5 h-16 rounded-full shrink-0"
                    style={{ backgroundColor: cls.color || '#4f46e5' }}
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                      {cls.start_time} – {cls.end_time} ({cls.category})
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {cls.subject_name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      {cls.room && (
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {cls.room}
                        </span>
                      )}
                      {cls.teacher_name && (
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3.5 h-3.5 text-indigo-500" /> {cls.teacher_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cls)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingClass ? 'Edit Class Schedule' : 'Add Class to Timetable'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Database Systems, Machine Learning..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher / Professor
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Lab 302, Hall A"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 p-0.5 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-mono">{color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                  </select>
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingClass ? 'Update Class' : 'Save to Timetable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
