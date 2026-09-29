import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  FileCheck2,
  BookOpen,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState('exams'); // 'exams', 'assignments', 'study'
  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('09:00');
  const [examRoom, setExamRoom] = useState('');
  const [prepStatus, setPrepStatus] = useState('In Progress');
  const [examNotes, setExamNotes] = useState('');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState(null);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignStatus, setAssignStatus] = useState('Pending');
  const [assignPriority, setAssignPriority] = useState('Medium');

  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [studyTitle, setStudyTitle] = useState('');
  const [studySubject, setStudySubject] = useState('');
  const [studyDate, setStudyDate] = useState('');
  const [studyStart, setStudyStart] = useState('19:00');
  const [studyEnd, setStudyEnd] = useState('20:30');
  const [studyNotes, setStudyNotes] = useState('');

  const [saving, setSaving] = useState(false);

  const fetchPlannerData = async () => {
    setLoading(true);
    try {
      const [ex, as, st] = await Promise.all([
        api.getExams(),
        api.getAssignments(),
        api.getStudySessions()
      ]);
      setExams(ex);
      setAssignments(as);
      setStudySessions(st);
    } catch (err) {
      console.error('Failed to load planner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannerData();
  }, []);

  // EXAMS HANDLERS
  const openExamModal = (item = null) => {
    setEditingExam(item);
    setExamSubject(item ? item.subject : '');
    setExamDate(item ? item.exam_date : new Date().toISOString().split('T')[0]);
    setExamTime(item ? item.exam_time || '09:00' : '09:00');
    setExamRoom(item ? item.room || '' : '');
    setPrepStatus(item ? item.prep_status : 'In Progress');
    setExamNotes(item ? item.notes || '' : '');
    setExamModalOpen(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        subject: examSubject,
        exam_date: examDate,
        exam_time: examTime,
        room: examRoom,
        prep_status: prepStatus,
        notes: examNotes
      };
      if (editingExam) {
        const updated = await api.updateExam(editingExam.id, payload);
        setExams((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await api.createExam(payload);
        setExams((prev) => [...prev, created]);
      }
      setExamModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm('Delete exam tracker?')) return;
    try {
      await api.deleteExam(id);
      setExams((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ASSIGNMENTS HANDLERS
  const openAssignModal = (item = null) => {
    setEditingAssign(item);
    setAssignTitle(item ? item.title : '');
    setAssignSubject(item ? item.subject : '');
    setAssignDeadline(item ? item.deadline : new Date().toISOString().split('T')[0]);
    setAssignDesc(item ? item.description || '' : '');
    setAssignStatus(item ? item.status : 'Pending');
    setAssignPriority(item ? item.priority : 'Medium');
    setAssignModalOpen(true);
  };

  const handleSaveAssign = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: assignTitle,
        subject: assignSubject,
        deadline: assignDeadline,
        description: assignDesc,
        status: assignStatus,
        priority: assignPriority
      };
      if (editingAssign) {
        const updated = await api.updateAssignment(editingAssign.id, payload);
        setAssignments((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await api.createAssignment(payload);
        setAssignments((prev) => [...prev, created]);
      }
      setAssignModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssign = async (id) => {
    if (!window.confirm('Delete assignment?')) return;
    try {
      await api.deleteAssignment(id);
      setAssignments((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // STUDY SESSIONS HANDLERS
  const openStudyModal = (item = null) => {
    setEditingStudy(item);
    setStudyTitle(item ? item.title : '');
    setStudySubject(item ? item.subject : '');
    setStudyDate(item ? item.session_date : new Date().toISOString().split('T')[0]);
    setStudyStart(item ? item.start_time : '19:00');
    setStudyEnd(item ? item.end_time : '20:30');
    setStudyNotes(item ? item.notes || '' : '');
    setStudyModalOpen(true);
  };

  const handleSaveStudy = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: studyTitle,
        subject: studySubject,
        session_date: studyDate,
        start_time: studyStart,
        end_time: studyEnd,
        notes: studyNotes,
        is_completed: false
      };
      if (editingStudy) {
        const updated = await api.updateStudySession(editingStudy.id, payload);
        setStudySessions((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await api.createStudySession(payload);
        setStudySessions((prev) => [...prev, created]);
      }
      setStudyModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStudy = async (id) => {
    try {
      const updated = await api.toggleStudySession(id);
      setStudySessions((prev) => prev.map((s) => (s.id === id ? { ...s, is_completed: updated.is_completed } : s)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudy = async (id) => {
    if (!window.confirm('Delete study session?')) return;
    try {
      await api.deleteStudySession(id);
      setStudySessions((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            Student Academic Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exam countdown trackers, assignment deadlines, and dedicated revision sessions
          </p>
        </div>

        {/* New Item Button based on tab */}
        <div>
          {activeTab === 'exams' && (
            <button
              onClick={() => openExamModal()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Add Exam
            </button>
          )}
          {activeTab === 'assignments' && (
            <button
              onClick={() => openAssignModal()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Add Assignment
            </button>
          )}
          {activeTab === 'study' && (
            <button
              onClick={() => openStudyModal()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Schedule Study Session
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'exams'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Exam Tracker ({exams.length})
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Assignment Tracker ({assignments.length})
        </button>

        <button
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'study'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Study Planner ({studySessions.length})
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          Loading planner items...
        </div>
      ) : (
        <>
          {/* TAB 1: EXAM TRACKER */}
          {activeTab === 'exams' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 text-slate-400">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No upcoming exams recorded</p>
                  <p className="text-xs text-slate-400 mt-1">Add exam dates to track countdowns & room numbers</p>
                </div>
              ) : (
                exams.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-glass-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Countdown Badge Banner */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">
                          {ex.prep_status}
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                            {ex.days_remaining !== null ? ex.days_remaining : '--'}
                          </span>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase -mt-1">
                            Days Remaining
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {ex.subject}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-purple-500" />
                          <span>Date: {ex.exam_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          <span>Time: {ex.exam_time || '09:00'}</span>
                        </div>
                        {ex.room && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-purple-500" />
                            <span>Room: {ex.room}</span>
                          </div>
                        )}
                      </div>

                      {ex.notes && (
                        <p className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {ex.notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openExamModal(ex)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(ex.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ASSIGNMENT TRACKER */}
          {activeTab === 'assignments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 text-slate-400">
                  <FileCheck2 className="w-10 h-10 mx-auto mb-3 opacity-30 text-blue-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No assignments tracked</p>
                  <p className="text-xs text-slate-400 mt-1">Add assignment deadlines to keep up with coursework</p>
                </div>
              ) : (
                assignments.map((as) => (
                  <div
                    key={as.id}
                    className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-glass-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                          {as.status}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          as.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {as.priority}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {as.title}
                      </h3>
                      <p className="text-xs text-crystal-600 dark:text-crystal-400 font-medium mt-0.5">
                        {as.subject}
                      </p>

                      <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>Deadline: {as.deadline}</span>
                        {as.days_remaining !== null && (
                          <span className={`ml-auto font-bold text-xs ${as.days_remaining <= 2 ? 'text-red-600' : 'text-slate-600'}`}>
                            {as.days_remaining >= 0 ? `${as.days_remaining}d left` : 'Overdue'}
                          </span>
                        )}
                      </div>

                      {as.description && (
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {as.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openAssignModal(as)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssign(as.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: STUDY PLANNER */}
          {activeTab === 'study' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studySessions.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 text-slate-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30 text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No scheduled study sessions</p>
                  <p className="text-xs text-slate-400 mt-1">Example: 7:00 PM – 8:30 PM Machine Learning Revision</p>
                </div>
              ) : (
                studySessions.map((st) => (
                  <div
                    key={st.id}
                    className={`p-6 rounded-3xl glass-panel border transition-all flex flex-col justify-between ${
                      st.is_completed
                        ? 'border-slate-200/50 opacity-60'
                        : 'border-slate-200/80 dark:border-slate-800 hover:shadow-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                          Study Session
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          {st.start_time} — {st.end_time}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleStudy(st.id)}
                          className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            st.is_completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-emerald-500'
                          }`}
                        >
                          {st.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                          <h3 className={`text-base font-bold ${st.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {st.title}
                          </h3>
                          <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                            {st.subject}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Date: {st.session_date}</span>
                      </div>

                      {st.notes && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                          {st.notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openStudyModal(st)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudy(st.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL 1: EXAM MODAL */}
      {examModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingExam ? 'Edit Exam Tracker' : 'Add Exam to Tracker'}
              </h2>
              <button onClick={() => setExamModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Exam Subject *</label>
                <input
                  type="text"
                  required
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  placeholder="e.g. Machine Learning Midterm"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Exam Time</label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={examRoom}
                    onChange={(e) => setExamRoom(e.target.value)}
                    placeholder="e.g. Auditorium A"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Preparation Status</label>
                  <select
                    value={prepStatus}
                    onChange={(e) => setPrepStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Exam Notes & Chapters</label>
                <textarea
                  rows={2}
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  placeholder="Chapters 1-5, Cost functions, Gradient Descent..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setExamModalOpen(false)} className="px-4 py-2 text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold">
                  {saving ? 'Saving...' : 'Save Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGNMENT MODAL */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold">
                {editingAssign ? 'Edit Assignment' : 'Add Assignment'}
              </h2>
              <button onClick={() => setAssignModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Relational Algebra Problem Set"
                  className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value)}
                    placeholder="e.g. Database Systems"
                    className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Deadline Date *</label>
                  <input
                    type="date"
                    required
                    value={assignDeadline}
                    onChange={(e) => setAssignDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={assignStatus}
                    onChange={(e) => setAssignStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Priority</label>
                  <select
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  placeholder="Details, portal links, requirements..."
                  className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setAssignModalOpen(false)} className="px-4 py-2 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                  {saving ? 'Saving...' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STUDY SESSION MODAL */}
      {studyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h2 className="text-lg font-bold">
                {editingStudy ? 'Edit Study Session' : 'Schedule Study Session'}
              </h2>
              <button onClick={() => setStudyModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  placeholder="e.g. Machine Learning Revision"
                  className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  placeholder="e.g. Machine Learning"
                  className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={studyDate}
                    onChange={(e) => setStudyDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={studyStart}
                    onChange={(e) => setStudyStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={studyEnd}
                    onChange={(e) => setStudyEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Study Goals / Focus Areas</label>
                <textarea
                  rows={2}
                  value={studyNotes}
                  onChange={(e) => setStudyNotes(e.target.value)}
                  placeholder="Review backpropagation math and regularization techniques..."
                  className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setStudyModalOpen(false)} className="px-4 py-2 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
                  {saving ? 'Saving...' : 'Save Study Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
