# Crystal Notebook

> **“Write. Plan. Remember. Achieve.”**

A student productivity and digital note-taking platform combining a **digital notebook + student planner + reminder/task manager**.

Built with **React.js**, **Tailwind CSS**, **FastAPI (Python)**, and **SQLAlchemy ORM** (supporting **PostgreSQL** and local **SQLite**).

---

## 🌟 Key Features

* **Digital Notes System**:
  - Comfortable note editor for long lecture notes
  - Real-time autosave with status indicator
  - Subject categories (*Computer Science, Database, Machine Learning, Mathematics, Programming, Personal, Other*)
  - Tag filtering, Pin/Favorite notes, Archive notes, Full-text note search
* **Student Dashboard**:
  - Dynamic personalized greeting: *"Good Evening, Ahmed! Here's what you have planned for today."*
  - Key Statistics (*Total Notes, Pending Tasks, Today's Classes, Upcoming Reminders*)
  - Today's chronological schedule of classes and study sessions
  - Upcoming reminders with priority badges
  - Today's tasks with smooth animated completion
  - Exam countdown banner (*e.g., Machine Learning Midterm — 5 Days Remaining*)
* **Student Class Timetable**:
  - Full weekly timetable grid (Monday – Sunday)
  - Subject name, teacher name, room, start time, end time, category, and custom color accents
  - Dashboard automatically calculates today's classes
* **Task & To-Do System**:
  - Filter tabs: *All, Due Today, Upcoming, Overdue, Completed*
  - Priority levels (*Low, Medium, High*)
  - Overdue warning badges and animated checkboxes
* **Smart Reminder System**:
  - Exact date & time alerts with repeat options (*Daily, Weekly, Monthly, Does not repeat*)
  - In-app notification bell with unread badges
  - Browser push notifications support with permission handling
* **Student Planner & Exam Tracker**:
  - **Exam Tracker**: Exam subject, date, time, room, prep status (*Not Started, In Progress, Reviewing, Ready*), and real-time days remaining countdown
  - **Assignment Tracker**: Title, subject, deadline, status (*Pending, In Progress, Submitted*), and priority
  - **Study Planner**: Scheduled study and revision blocks (*e.g., 7:00 PM – 8:30 PM Machine Learning Revision*)
* **Interactive Calendar**:
  - Monthly, Weekly, and Daily views
  - Color-coded badges for classes, exams, tasks, assignments, and study sessions
  - Click any date to quickly add events; click event to inspect details
* **Global Search**:
  - Instant Ctrl+K / Cmd+K search across Notes, Tasks, Classes, Reminders, and Exams
* **Profile & Settings**:
  - Name, avatar, timezone, and password updates
  - Theme mode: Light, Dark, or System
  - Notification preferences and lead time settings

---

## 🚀 Quick Start Guide

### Demo Credentials
An initial demo student account with realistic courses, notes, timetable, and exams is pre-seeded out of the box:
- **Email:** `demo@crystalnotebook.com`
- **Password:** `password123`
*(A 1-click "Demo Login" button is also provided on the login page)*

---

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

---

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will be available at:
- **API URL:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

#### Database Configuration
By default, the backend runs locally with **SQLite** (`sqlite:///./crystal_notebook.db`) for immediate zero-friction setup.
To use **PostgreSQL**, simply create a `.env` file in the `backend/` directory or set the environment variable:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/crystal_notebook
SECRET_KEY=your-production-secret-key-here
```

---

### 2. Frontend Setup (React + Vite + Tailwind CSS)

```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📂 Project Architecture

```
crystal-notebook/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT tokens & auth dependencies
│   │   ├── models/        # SQLAlchemy ORM models (User, Note, Task, Reminder, Schedule, Planner)
│   │   ├── routers/       # REST endpoints (auth, notes, tasks, reminders, classes, events, search, stats)
│   │   ├── schemas/       # Pydantic validation schemas
│   │   ├── services/      # Auto-seeding realistic sample data
│   │   ├── config.py      # Environment settings
│   │   ├── database.py    # DB engine & session
│   │   └── main.py        # FastAPI entrypoint & CORS middleware
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Example environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/    # SearchModal, NotificationCenter, QuickAdd
│   │   ├── context/       # AuthContext & Theme provider
│   │   ├── layouts/       # DashboardLayout with glassmorphic sidebar
│   │   ├── pages/         # Landing, Auth, Dashboard, Notes, Tasks, Classes, Reminders, Calendar, Planner, Settings
│   │   ├── services/      # api.js fetch client with JWT interceptor
│   │   ├── App.jsx        # Routing & Protected routes
│   │   ├── main.jsx       # React mount
│   │   └── index.css      # Tailwind & Glassmorphism design system
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js     # Proxy configuration to FastAPI
│
└── README.md
```

---

## 🔒 Security & Data Integrity

- **Password Hashing:** Passwords hashed with bcrypt before storing.
- **JWT Authorization:** Secure Bearer tokens with expiration.
- **Tenant Isolation:** Every protected route ensures queries strictly filter on `current_user.id`.
- **Validation:** Pydantic models validate input strings, formats, and email standards.
