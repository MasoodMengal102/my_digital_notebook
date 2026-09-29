import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Tag,
  GraduationCap,
  CheckSquare,
  Bell,
  X,
  Loader2,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';

const EVENT_TYPES = [
  'General',
  'Class',
  'Assignment',
  'Exam',
  'Project',
  'Meeting',
  'Personal',
  'Study'
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Event modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('General');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [color, setColor] = useState('#6366f1');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evts, cls, tsk, exm] = await Promise.all([
        api.getEvents(),
        api.getClasses(),
        api.getTasks(),
        api.getExams()
      ]);
      setEvents(evts);
      setClasses(cls);
      setTasks(tsk);
      setExams(exm);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const openAddOnDate = (dateStr) => {
    setSelectedEvent(null);
    setSelectedDate(dateStr);
    setTitle('');
    setDescription('');
    setEventType('General');
    setStartTime('10:00');
    setEndTime('11:00');
    setLocation('');
    setPriority('Medium');
    setColor('#6366f1');
    setModalOpen(true);
  };

  const openViewEvent = (event) => {
    setSelectedEvent(event);
    setSelectedDate(event.start_date);
    setTitle(event.title);
    setDescription(event.description || '');
    setEventType(event.event_type);
    setStartTime(event.start_time || '09:00');
    setEndTime(event.end_time || '10:00');
    setLocation(event.location || '');
    setPriority(event.priority);
    setColor(event.color || '#6366f1');
    setModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        event_type: eventType,
        start_date: selectedDate,
        end_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        location,
        priority,
        color,
        reminder_set: true
      };

      if (selectedEvent) {
        const updated = await api.updateEvent(selectedEvent.id, payload);
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
      } else {
        const created = await api.createEvent(payload);
        setEvents((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Month grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Monday as first day adjustment
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to collect items for a specific date
  const getItemsForDate = (dateStr, dayOfWeekName) => {
    const list = [];

    // Custom calendar events
    events.filter((e) => e.start_date === dateStr).forEach((e) => {
      list.push({ ...e, kind: 'event' });
    });

    // Exams
    exams.filter((ex) => ex.exam_date === dateStr).forEach((ex) => {
      list.push({
        id: `exam-${ex.id}`,
        title: `Exam: ${ex.subject}`,
        start_time: ex.exam_time || '09:00',
        color: '#dc2626',
        kind: 'exam',
        details: ex
      });
    });

    // Tasks due
    tasks.filter((t) => t.due_date === dateStr && !t.is_completed).forEach((t) => {
      list.push({
        id: `task-${t.id}`,
        title: `Task: ${t.title}`,
        start_time: t.due_time || '18:00',
        color: '#10b981',
        kind: 'task',
        details: t
      });
    });

    // Recurring classes on that day of week
    if (dayOfWeekName) {
      classes.filter((c) => c.day_of_week.toLowerCase() === dayOfWeekName.toLowerCase()).forEach((c) => {
        list.push({
          id: `class-${c.id}`,
          title: `Class: ${c.subject_name}`,
          start_time: c.start_time,
          end_time: c.end_time,
          color: c.color || '#4f46e5',
          kind: 'class',
          details: c
        });
      });
    }

    return list.sort((a, b) => (a.start_time || '00:00').localeCompare(b.start_time || '00:00'));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-crystal-600" />
            Interactive Calendar & Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unified view of classes, deadlines, exams, assignments, and study sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center text-xs font-semibold">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  viewMode === v
                    ? 'bg-white dark:bg-slate-900 text-crystal-600 dark:text-crystal-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => openAddOnDate(todayStr)}
            className="px-4 py-2 bg-crystal-600 hover:bg-crystal-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-crystal-600/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Navigation Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold text-slate-900 dark:text-white ml-2">
            {monthNames[month]} {year}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Classes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Exams
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Tasks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Events
            </span>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Today
          </button>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-center text-xs font-bold text-slate-500 py-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900/20 min-h-[550px]">
            {/* Empty offset days */}
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/40 dark:bg-slate-950/40 min-h-[100px] p-2 opacity-50" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
              const isToday = dateStr === todayStr;
              const dayItems = getItemsForDate(dateStr, dayName);

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => openAddOnDate(dateStr)}
                  className={`min-h-[110px] p-2 transition-colors flex flex-col group cursor-pointer hover:bg-crystal-50/30 dark:hover:bg-slate-800/40 ${
                    isToday ? 'bg-crystal-50/50 dark:bg-crystal-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isToday
                          ? 'bg-crystal-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddOnDate(dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-crystal-600 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Events list */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-24 no-scrollbar">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.kind === 'event') openViewEvent(item);
                        }}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 transition-transform hover:scale-[1.02]"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          borderLeft: `2.5px solid ${item.color}`
                        }}
                        title={`${item.title} (${item.start_time || ''})`}
                      >
                        <span className="font-mono text-[9px] opacity-75 shrink-0">{item.start_time}</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week / Day View Details */}
      {viewMode !== 'month' && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base">
              {viewMode === 'day' ? `Schedule for ${currentDate.toDateString()}` : `Week of ${currentDate.toDateString()}`}
            </h3>
            <button
              onClick={() => openAddOnDate(currentDate.toISOString().split('T')[0])}
              className="px-3 py-1.5 bg-crystal-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          {/* Chronological list of items */}
          <div className="space-y-3">
            {getItemsForDate(
              currentDate.toISOString().split('T')[0],
              currentDate.toLocaleDateString('en-US', { weekday: 'long' })
            ).length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No scheduled activities for this date.
              </div>
            ) : (
              getItemsForDate(
                currentDate.toISOString().split('T')[0],
                currentDate.toLocaleDateString('en-US', { weekday: 'long' })
              ).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-1.5 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <span className="text-xs text-slate-400">
                        {item.start_time} {item.end_time ? `— ${item.end_time}` : ''} • {item.kind.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedEvent ? 'Event Details' : 'Add Calendar Event'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Machine Learning Study Group, Advisor Meeting"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Room
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Library Room 4, Zoom link, Lab"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
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
                    className="px-5 py-2 rounded-xl bg-crystal-600 hover:bg-crystal-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {selectedEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
