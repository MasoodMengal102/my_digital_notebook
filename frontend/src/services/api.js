// Centralized API client for Crystal Notebook backend
const rawApiUrl = import.meta.env.VITE_API_URL;
let BASE_URL = '/api';

if (rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl.trim() !== '') {
  const trimmed = rawApiUrl.trim().replace(/\/+$/, '');
  BASE_URL = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function getAuthHeader() {
  const token = localStorage.getItem('crystal_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('crystal_token');
        localStorage.removeItem('crystal_user');
        window.dispatchEvent(new Event('auth-expired'));
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText || `Request failed with status ${response.status}` };
      }

      let errorMsg = 'Network request failed';
      if (typeof errorData.detail === 'string') {
        errorMsg = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMsg = errorData.detail.map((e) => e.msg || e.detail || JSON.stringify(e)).join(', ');
      } else if (errorData.message) {
        errorMsg = errorData.message;
      } else if (response.statusText) {
        errorMsg = response.statusText;
      }

      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please check your network connection or try again shortly.');
    }
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Notes
  getNotes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.tag) query.append('tag', params.tag);
    if (params.is_pinned !== undefined) query.append('is_pinned', params.is_pinned);
    if (params.is_archived !== undefined) query.append('is_archived', params.is_archived);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);
    return request(`/notes?${query.toString()}`);
  },
  getNote: (id) => request(`/notes/${id}`),
  createNote: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (id, data) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  getCategories: () => request('/notes/categories'),
  createCategory: (data) => request('/notes/categories', { method: 'POST', body: JSON.stringify(data) }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.view) query.append('view', params.view);
    if (params.priority) query.append('priority', params.priority);
    if (params.category) query.append('category', params.category);
    return request(`/tasks?${query.toString()}`);
  },
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleTask: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Reminders
  getReminders: (statusFilter) => {
    const q = statusFilter ? `?status_filter=${statusFilter}` : '';
    return request(`/reminders${q}`);
  },
  createReminder: (data) => request('/reminders', { method: 'POST', body: JSON.stringify(data) }),
  updateReminder: (id, data) => request(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleReminder: (id) => request(`/reminders/${id}/toggle`, { method: 'PATCH' }),
  deleteReminder: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),

  // Classes
  getClasses: (day) => {
    const q = day ? `?day=${day}` : '';
    return request(`/classes${q}`);
  },
  getTodayClasses: () => request('/classes/today'),
  createClass: (data) => request('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id, data) => request(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id) => request(`/classes/${id}`, { method: 'DELETE' }),

  // Calendar Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams();
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.event_type) query.append('event_type', params.event_type);
    return request(`/events?${query.toString()}`);
  },
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Student Planner (Exams, Assignments, Study Sessions)
  getExams: () => request('/planner/exams'),
  createExam: (data) => request('/planner/exams', { method: 'POST', body: JSON.stringify(data) }),
  updateExam: (id, data) => request(`/planner/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExam: (id) => request(`/planner/exams/${id}`, { method: 'DELETE' }),

  getAssignments: () => request('/planner/assignments'),
  createAssignment: (data) => request('/planner/assignments', { method: 'POST', body: JSON.stringify(data) }),
  updateAssignment: (id, data) => request(`/planner/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAssignment: (id) => request(`/planner/assignments/${id}`, { method: 'DELETE' }),

  getStudySessions: () => request('/planner/study-sessions'),
  createStudySession: (data) => request('/planner/study-sessions', { method: 'POST', body: JSON.stringify(data) }),
  updateStudySession: (id, data) => request(`/planner/study-sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleStudySession: (id) => request(`/planner/study-sessions/${id}/toggle`, { method: 'PATCH' }),
  deleteStudySession: (id) => request(`/planner/study-sessions/${id}`, { method: 'DELETE' }),

  // Search & Dashboard Stats
  globalSearch: (q) => request(`/search?q=${encodeURIComponent(q)}`),
  getDashboardStats: () => request('/stats/dashboard'),

  // Settings & Notifications
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  updateProfile: (data) => request('/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getNotifications: () => request('/settings/notifications'),
  markNotificationRead: (id) => request(`/settings/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/settings/notifications/mark-all-read', { method: 'POST' }),
};
