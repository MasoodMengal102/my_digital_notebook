# Crystal Notebook

> **“Write. Plan. Remember. Achieve.”**

A modern student productivity and digital note-taking platform combining a **digital notebook + student planner + reminder/task manager**.

Built with **React.js**, **Vite**, **Tailwind CSS**, **FastAPI (Python)**, and **SQLAlchemy ORM** (supporting **PostgreSQL** in production and **SQLite** in local development). Fully production-ready and optimized for deployment on **Render**.

---

## 🌟 Key Features

* **Digital Notes System**:
  - Note editor for long lecture notes and code blocks
  - Real-time autosave with status indicator
  - Subject categories (*Computer Science, Database, Machine Learning, Mathematics, Programming, Personal, Other*)
  - Tag filtering, Pin/Favorite notes, Archive notes, Full-text note search
* **Student Dashboard**:
  - Dynamic personalized greeting: *"Good Evening, Ahmed! Here's what you have planned for today."*
  - Key Statistics (*Total Notes, Pending Tasks, Today's Classes, Upcoming Reminders*)
  - Chronological schedule of classes, study sessions, and events for the day
  - Upcoming reminders with priority badges
  - Tasks with smooth completion animations
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
* **Student Planner & Exam Tracker**:
  - **Exam Tracker**: Subject, date, time, room, prep status (*Not Started, In Progress, Reviewing, Ready*), and real-time days remaining countdown
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

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript, Tailwind CSS, Lucide React, React Router 6
- **Backend**: Python 3.11+, FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic v2, python-jose (JWT), bcrypt
- **Database**:
  - Development: SQLite (zero configuration)
  - Production: PostgreSQL (Render Managed Database)
- **Deployment Platform**: Render (Web Service + Static Site + Managed PostgreSQL)

---

## 📂 Project Structure

```
Crystal_note.book/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT authentication & route dependencies
│   │   ├── models/        # SQLAlchemy ORM models (12 tables)
│   │   ├── routers/       # REST endpoints (auth, notes, tasks, reminders, classes, events, planner, search, stats, settings)
│   │   ├── schemas/       # Pydantic validation schemas
│   │   ├── services/      # Auto-seeding initial demo data
│   │   ├── config.py      # App settings & CORS resolution
│   │   ├── database.py    # PostgreSQL connection pool & URL normalizer
│   │   └── main.py        # FastAPI entry point & /health check
│   ├── requirements.txt   # Production Python dependencies
│   └── .env.example       # Backend environment variables template
│
├── frontend/
│   ├── public/
│   │   └── _redirects     # SPA routing rewrite rule for Render Static Sites
│   ├── src/
│   │   ├── components/    # Navigation, Modals, Footer, Notification center
│   │   ├── context/       # AuthContext & Theme provider
│   │   ├── layouts/       # DashboardLayout with glassmorphic sidebar
│   │   ├── pages/         # Landing, Auth, Dashboard, Notes, Tasks, Classes, Reminders, Calendar, Planner, Settings
│   │   ├── services/      # Centralized api.js client (reads VITE_API_URL)
│   │   ├── App.jsx        # React Router routes
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Tailwind & glassmorphism theme
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example       # Frontend environment variables template
│
├── .env.example           # Master environment variables template
├── .gitignore             # Production gitignore
├── render.yaml            # Render Blueprint deployment specification
└── README.md              # Documentation & deployment guide
```

---

## 💻 Local Development Setup

### Demo Account
The database automatically seeds an initial demo student account on first launch:
- **Email:** `demo@crystalnotebook.com`
- **Password:** `password123`
*(A 1-click demo login button is also provided on the login page).*

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URLs:
- API Root: `http://127.0.0.1:8000`
- Health Check: `http://127.0.0.1:8000/health`
- Swagger UI Docs: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🚢 Render Production Deployment Guide

You can deploy Crystal Notebook to Render using either **Method A (Render Blueprint - Recommended)** or **Method B (Manual Dashboard Setup)**.

### Method A: 1-Click Deployment with Render Blueprint (`render.yaml`)

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will read `render.yaml` and automatically configure:
   - **PostgreSQL Database** (`crystal-notebook-db`)
   - **FastAPI Web Service** (`crystal-notebook-api`)
   - **React Static Site** (`crystal-notebook-web`)
5. Click **Apply**. Render will provision and link all services automatically!

---

### Method B: Manual Step-by-Step Render Deployment

#### Step 1: Create a PostgreSQL Database on Render

1. On the Render Dashboard, click **New +** -> **PostgreSQL**.
2. Configure settings:
   - **Name**: `crystal-notebook-db`
   - **Database**: `crystal_notebook`
   - **User**: `crystal_user`
   - **Region**: Choose closest to your users (e.g., Oregon / Frankfurt)
   - **Plan**: `Free`
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g., `postgres://crystal_user:...@dpg-xxx-a/crystal_notebook`).

---

#### Step 2: Deploy the Backend (FastAPI Web Service)

1. On the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `crystal-notebook-api`
   - **Region**: Same region as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
4. Expand **Advanced** and set **Health Check Path** to:
   - `/health`
5. Add the following **Environment Variables**:

| Variable Name | Value | Purpose |
|---|---|---|
| `DATABASE_URL` | `<Your Render PostgreSQL Connection String>` | Connects to PostgreSQL |
| `JWT_SECRET_KEY` | `<A secure 32+ character random string>` | Signs JWT authentication tokens |
| `FRONTEND_URL` | `https://crystal-notebook.onrender.com` | Allows frontend origin in CORS |
| `PYTHON_VERSION` | `3.11.9` | Ensures clean Python runtime |

*(Note: Generate a random key for `JWT_SECRET_KEY` using `openssl rand -hex 32` or Python `secrets.token_hex(32)`).*

6. Click **Create Web Service**. Wait for the build to finish.
7. Note down your backend URL: `https://crystal-notebook-api.onrender.com`.

---

#### Step 3: Deploy the Frontend (React Static Site)

1. On the Render Dashboard, click **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `crystal-notebook-web`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. Configure SPA Rewrite Rule:
   Under **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Action**: `Rewrite`
   - **Destination**: `/index.html`
   *(Also automatically handled by `frontend/public/_redirects`).*
5. Add the following **Environment Variable**:

| Variable Name | Value | Purpose |
|---|---|---|
| `VITE_API_URL` | `https://crystal-notebook-api.onrender.com` | Points frontend requests to backend API |

6. Click **Create Static Site**.
7. Once deployed, copy your frontend URL (e.g., `https://crystal-notebook-web.onrender.com`).
8. Go back to your Backend Web Service, update `FRONTEND_URL` with your actual frontend URL if different, and save.

---

## 🧪 Production Verification Checklist

Run these commands locally to verify production readiness before deployment:

### 1. Test Frontend Production Build
```bash
cd frontend
npm ci
npm run build
```
Output must generate `dist/` with `index.html` and `dist/_redirects`.

### 2. Test Backend Startup with Production Command
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Verify Health Check
```bash
curl http://127.0.0.1:8000/health
# Expected response: {"status": "ok"}
```

---

## 🔒 Security & Architecture Highlights

- **PostgreSQL URL Normalization**: Automatically converts Render's `postgres://` connection strings to `postgresql://` required by SQLAlchemy 2.0.
- **Connection Pool Recycling**: Uses `pool_pre_ping=True` and `pool_recycle=300` to prevent stale database connections on cloud PaaS.
- **Password Hashing**: Direct `bcrypt` hashing with auto-salting and 72-byte truncation safety.
- **JWT Authorization**: RFC-compliant HMAC-SHA256 signed Bearer tokens with timezone-aware expiration.
- **Strict User Isolation**: Every database query verifies `model.user_id == current_user.id`. Changing IDs in URLs safely returns 404.
- **CORS Protection**: Allows credentials while restricting origins to configured production frontend domain and regex matching `https://*.onrender.com`.
- **Safe Error Responses**: 500 exceptions print full tracebacks in Render backend logs for debugging, but return clean, uninformative error JSON to clients without leaking system details or database strings.
- **Client-Side Routing**: SPA routes (`/login`, `/register`, `/dashboard`, `/notes`, etc.) resolve seamlessly via `public/_redirects` on Render Static Sites.

---

## ❓ Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Registration returns 500 | Database connection issue or unhandled bcrypt exception | Verify `DATABASE_URL` is set properly. The backend automatically normalizes `postgres://` to `postgresql://`. |
| Direct link to `/notes` gives 404 | Missing static site rewrite rule | Ensure `frontend/public/_redirects` is deployed or configure `/* -> /index.html` rewrite in Render static site settings. |
| CORS error in browser console | Frontend URL does not match backend CORS origin | Set `FRONTEND_URL` in backend environment variables to match your Render static site URL (e.g. `https://crystal-notebook-web.onrender.com`). |
| Backend cold start delay | Render free tier Web Services spin down when idle for 15 minutes | The first request after idle may take 30-50s to wake up. Render provides `/health` to keep the service warm if using external pingers. |

---

## 📄 License
MIT License. Built for students worldwide.
