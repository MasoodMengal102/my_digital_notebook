import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Pin,
  Archive,
  Trash2,
  Tag,
  Save,
  Check,
  Loader2,
  Folder,
  SlidersHorizontal,
  FileText,
  Copy,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  'All',
  'Computer Science',
  'Database',
  'Machine Learning',
  'Mathematics',
  'Programming',
  'Personal',
  'Other'
];

export default function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const noteIdParam = searchParams.get('id');
  const isNewParam = searchParams.get('new');

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Note being viewed/edited
  const [activeNote, setActiveNote] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const autosaveTimerRef = useRef(null);

  // Load Categories & Notes
  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(['All', ...cats]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await api.getNotes({
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        tag: selectedTag || undefined,
        is_archived: showArchived
      });
      setNotes(data);

      // Select active note
      if (noteIdParam) {
        const found = data.find((n) => n.id === parseInt(noteIdParam));
        if (found) setActiveNote(found);
        else if (data.length > 0) setActiveNote(data[0]);
      } else if (!activeNote && data.length > 0) {
        setActiveNote(data[0]);
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadNotes();
  }, [selectedCategory, searchQuery, selectedTag, showArchived]);

  // Handle URL param new note
  useEffect(() => {
    if (isNewParam === 'true') {
      handleCreateNewNote();
      setSearchParams({});
    }
  }, [isNewParam]);

  // Autosave when activeNote content/title changes
  const handleNoteChange = (fields) => {
    if (!activeNote) return;
    const updated = { ...activeNote, ...fields };
    setActiveNote(updated);
    setSaveStatus('unsaved');

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const res = await api.updateNote(updated.id, fields);
        setSaveStatus('saved');
        setNotes((prev) => prev.map((n) => (n.id === res.id ? res : n)));
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    }, 800); // 800ms debounce
  };

  const handleCreateNewNote = async () => {
    try {
      setSaveStatus('saving');
      const newNote = await api.createNote({
        title: 'Untitled Lecture Note',
        content: '',
        category: selectedCategory !== 'All' ? selectedCategory : 'Computer Science',
        tags: '',
        is_pinned: false,
        is_archived: false
      });
      setNotes((prev) => [newNote, ...prev]);
      setActiveNote(newNote);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.deleteNote(id);
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (activeNote?.id === id) {
        setActiveNote(remaining[0] || null);
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleTogglePin = async () => {
    if (!activeNote) return;
    try {
      const updated = await api.updateNote(activeNote.id, { is_pinned: !activeNote.is_pinned });
      setActiveNote(updated);
      setNotes((prev) =>
        prev
          .map((n) => (n.id === updated.id ? updated : n))
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArchive = async () => {
    if (!activeNote) return;
    try {
      const updated = await api.updateNote(activeNote.id, { is_archived: !activeNote.is_archived });
      setNotes((prev) => prev.filter((n) => n.id !== updated.id));
      setActiveNote(notes.filter((n) => n.id !== updated.id)[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(`${activeNote.title}\n\n${activeNote.content}`);
    alert('Note copied to clipboard!');
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-200">
      {/* Left Column: Notes List & Filter Panel */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden shrink-0">
        {/* Header & Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-crystal-600" />
              Digital Notes
            </h1>
            <button
              onClick={handleCreateNewNote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-crystal-600 hover:bg-crystal-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in notes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-crystal-500"
            />
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-crystal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Archive Toggle Filter */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">{notes.length} notes found</span>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-1 font-medium transition-colors ${
                showArchived ? 'text-crystal-600 dark:text-crystal-400' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              {showArchived ? 'Showing Archived' : 'Show Archived'}
            </button>
          </div>
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-crystal-600" />
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No notes found. Click "+ New Note" to write one!
            </div>
          ) : (
            notes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-crystal-50 dark:bg-crystal-950/40 border border-crystal-200 dark:border-crystal-900/50 shadow-sm'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-bold line-clamp-1 ${
                      isSelected ? 'text-crystal-700 dark:text-crystal-300' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.is_pinned && (
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {note.content || 'Empty note...'}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {note.category}
                    </span>
                    <span>
                      {new Date(note.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Full Comfortable Lecture Note Editor */}
      <div className="flex-1 flex flex-col glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        {activeNote ? (
          <>
            {/* Editor Action Toolbar */}
            <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                {/* Category Dropdown */}
                <select
                  value={activeNote.category}
                  onChange={(e) => handleNoteChange({ category: e.target.value })}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none focus:ring-1 focus:ring-crystal-500"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Autosave Status Indicator */}
                <div className="flex items-center gap-1.5 text-xs">
                  {saveStatus === 'saving' && (
                    <span className="text-amber-500 flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </span>
                  )}
                  {saveStatus === 'saved' && (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Autosaved
                    </span>
                  )}
                  {saveStatus === 'unsaved' && (
                    <span className="text-slate-400">Unsaved changes</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePin}
                  className={`p-2 rounded-xl transition-colors ${
                    activeNote.is_pinned
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Pin Note to Top"
                >
                  <Pin className={`w-4 h-4 ${activeNote.is_pinned ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleCopyNote}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy Note Text"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToggleArchive}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={activeNote.is_archived ? 'Unarchive' : 'Archive Note'}
                >
                  <Archive className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Title Input */}
            <div className="px-6 pt-5">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleNoteChange({ title: e.target.value })}
                placeholder="Lecture Title..."
                className="w-full text-2xl font-black bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />

              {/* Tags Input */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={activeNote.tags || ''}
                  onChange={(e) => handleNoteChange({ tags: e.target.value })}
                  placeholder="Tags (comma separated e.g. lecture, sql, exam)"
                  className="w-full text-xs text-slate-600 dark:text-slate-300 bg-transparent placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Note Long Content Textarea */}
            <div className="flex-1 p-6 flex flex-col">
              <textarea
                value={activeNote.content}
                onChange={(e) => handleNoteChange({ content: e.target.value })}
                placeholder="Write your detailed lecture notes, study summaries, bullet points, and code here..."
                className="w-full flex-1 bg-transparent resize-none border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none text-sm leading-relaxed font-sans"
              />
            </div>

            {/* Editor Bottom Info Bar */}
            <div className="px-6 py-2 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-4">
                <span>{activeNote.content.split(/\s+/).filter(Boolean).length} words</span>
                <span>{activeNote.content.length} characters</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last saved {new Date(activeNote.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <FileText className="w-12 h-12 mb-3 opacity-30 text-crystal-600" />
            <p className="text-base font-medium text-slate-600 dark:text-slate-300">No note selected</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Choose a note from the left or create a brand new one</p>
            <button
              onClick={handleCreateNewNote}
              className="px-4 py-2 bg-crystal-600 hover:bg-crystal-700 text-white rounded-xl font-semibold text-xs shadow-md transition-colors"
            >
              + Create New Lecture Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
