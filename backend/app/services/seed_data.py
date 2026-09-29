from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from app.models.user import User
from app.models.note import Note, NoteCategory
from app.models.task import Task
from app.models.reminder import Reminder
from app.models.schedule import ClassSchedule
from app.models.planner import CalendarEvent, Exam, Assignment, StudySession
from app.models.notification import Notification
from app.models.settings import UserSetting
from app.auth.jwt import get_password_hash

def seed_database(db: Session):
    # Check if demo user already exists
    demo_email = "demo@crystalnotebook.com"
    existing_user = db.query(User).filter(User.email == demo_email).first()
    if existing_user:
        return existing_user

    today = date.today()
    today_str = today.isoformat()
    tomorrow_str = (today + timedelta(days=1)).isoformat()
    in_3_days_str = (today + timedelta(days=3)).isoformat()
    in_5_days_str = (today + timedelta(days=5)).isoformat()
    yesterday_str = (today - timedelta(days=1)).isoformat()
    current_day = datetime.now().strftime("%A")

    # 1. Create Demo User
    demo_user = User(
        full_name="Ahmed Khan",
        email=demo_email,
        hashed_password=get_password_hash("password123"),
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        timezone="UTC+5",
        theme="light"
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    # 2. User Settings
    settings = UserSetting(
        user_id=demo_user.id,
        email_notifications=True,
        in_app_notifications=True,
        sound_enabled=True,
        reminder_lead_minutes=15,
        calendar_start_day="Monday"
    )
    db.add(settings)

    # 3. Note Categories
    categories = [
        NoteCategory(user_id=demo_user.id, name="Computer Science", color="#3b82f6"),
        NoteCategory(user_id=demo_user.id, name="Database", color="#10b981"),
        NoteCategory(user_id=demo_user.id, name="Machine Learning", color="#8b5cf6"),
        NoteCategory(user_id=demo_user.id, name="Mathematics", color="#f59e0b"),
        NoteCategory(user_id=demo_user.id, name="Programming", color="#06b6d4"),
        NoteCategory(user_id=demo_user.id, name="Personal", color="#ec4899"),
        NoteCategory(user_id=demo_user.id, name="Other", color="#64748b")
    ]
    db.add_all(categories)

    # 4. Realistic Digital Notes
    notes = [
        Note(
            user_id=demo_user.id,
            title="Database Systems — Relational Normalization (1NF to BCNF)",
            content="""# Database Systems — Lecture 07: Normalization

## Overview
Normalization is the systematic approach of decomposing tables to eliminate data redundancy and undesirable anomalies (Insertion, Update, Deletion).

### Key Normal Forms:
1. **First Normal Form (1NF)**:
   - Each column contains atomic (indivisible) values.
   - Each row is unique (primary key exists).
   - No repeating groups or arrays.

2. **Second Normal Form (2NF)**:
   - Must already be in 1NF.
   - All non-key attributes are fully functionally dependent on the entire primary key (No partial dependency).

3. **Third Normal Form (3NF)**:
   - Must be in 2NF.
   - No transitive functional dependencies ($X \\rightarrow Y$ and $Y \\rightarrow Z$).

4. **Boyce-Codd Normal Form (BCNF)**:
   - Stricter version of 3NF.
   - For every functional dependency $X \\rightarrow Y$, $X$ must be a super key.

### Summary Checklist for Exam:
- [x] Review functional dependency closures
- [x] Practice canonical cover algorithms
- [ ] Implement BCNF decomposition proofs
""",
            category="Database",
            tags="database,sql,normalization,bcnf,lecture",
            is_pinned=True,
            is_archived=False,
            color="#ecfdf5"
        ),
        Note(
            user_id=demo_user.id,
            title="Machine Learning — Gradient Descent & Backpropagation",
            content="""# Machine Learning — Gradient Descent

## Cost Function Optimization
Gradient descent iteratively adjusts parameters $\\theta$ to minimize cost $J(\\theta)$:
$$\\theta := \\theta - \\alpha \\nabla J(\\theta)$$

### Types of Gradient Descent:
* **Batch Gradient Descent**: Uses entire dataset per step. Very stable but slow for massive data.
* **Stochastic Gradient Descent (SGD)**: Updates parameters per sample. Fast and jumps out of local minima, but noisy.
* **Mini-batch GD**: Balance between SGD and batch GD (batch sizes: 32, 64, 128).

### Backpropagation Core:
Backprop applies the chain rule of calculus backwards through layers to compute $\\frac{\\partial L}{\\partial W}$.
""",
            category="Machine Learning",
            tags="machine learning,neural networks,calculus,optimization",
            is_pinned=True,
            is_archived=False,
            color="#f5f3ff"
        ),
        Note(
            user_id=demo_user.id,
            title="Data Structures & Algorithms — Graph Traversal Algorithms",
            content="""# Breadth-First Search (BFS) vs Depth-First Search (DFS)

### BFS:
- Queue-based (FIFO)
- Finds shortest path on unweighted graphs
- Time: $O(V + E)$, Space: $O(V)$

### DFS:
- Stack-based (LIFO or recursion)
- Used in topological sorting, cycle detection, strongly connected components
""",
            category="Computer Science",
            tags="algorithms,graphs,bfs,dfs",
            is_pinned=False,
            is_archived=False,
            color="#eff6ff"
        ),
        Note(
            user_id=demo_user.id,
            title="Final Year Project (FYP) Architecture Ideas",
            content="""# FYP Brainstorming

- Distributed cache synchronization using Raft consensus
- Real-time collaborative canvas with CRDTs
- AI-assisted lecture summarizer for low-bandwidth university portals
""",
            category="Programming",
            tags="fyp,ideas,architecture",
            is_pinned=False,
            is_archived=False,
            color="#fdf2f8"
        )
    ]
    db.add_all(notes)

    # 5. Class Schedules (covering today and full week)
    classes = [
        ClassSchedule(
            user_id=demo_user.id,
            subject_name="Database Systems",
            teacher_name="Dr. Sarah Jenkins",
            room="Lab 302",
            day_of_week=current_day,
            start_time="08:00",
            end_time="09:30",
            color="#3b82f6",
            category="Lecture"
        ),
        ClassSchedule(
            user_id=demo_user.id,
            subject_name="Machine Learning",
            teacher_name="Prof. David Chen",
            room="Room 405",
            day_of_week=current_day,
            start_time="10:00",
            end_time="11:30",
            color="#8b5cf6",
            category="Lecture"
        ),
        ClassSchedule(
            user_id=demo_user.id,
            subject_name="Software Engineering Lab",
            teacher_name="Engr. Robert Lee",
            room="CS Lab 2",
            day_of_week=current_day,
            start_time="13:00",
            end_time="15:00",
            color="#10b981",
            category="Laboratory"
        ),
        ClassSchedule(
            user_id=demo_user.id,
            subject_name="Linear Algebra & Calculus",
            teacher_name="Dr. Angela Miller",
            room="Hall B",
            day_of_week="Tuesday" if current_day != "Tuesday" else "Wednesday",
            start_time="09:00",
            end_time="10:30",
            color="#f59e0b",
            category="Lecture"
        ),
        ClassSchedule(
            user_id=demo_user.id,
            subject_name="Computer Networks",
            teacher_name="Prof. Marcus Vance",
            room="Hall A",
            day_of_week="Thursday" if current_day != "Thursday" else "Friday",
            start_time="11:00",
            end_time="12:30",
            color="#06b6d4",
            category="Lecture"
        )
    ]
    db.add_all(classes)

    # 6. Tasks & To-Dos
    tasks = [
        Task(
            user_id=demo_user.id,
            title="Complete DBMS Normalization Assignment",
            description="Decompose relation R into 3NF and verify dependency preservation",
            due_date=today_str,
            due_time="18:00",
            priority="High",
            category="Academic",
            is_completed=False
        ),
        Task(
            user_id=demo_user.id,
            title="Read Chapter 4 of Pattern Recognition & ML",
            description="Focus on linear models for classification and logistic regression",
            due_date=today_str,
            due_time="20:00",
            priority="Medium",
            category="Academic",
            is_completed=False
        ),
        Task(
            user_id=demo_user.id,
            title="Prepare presentation slides for FYP proposal",
            description="Create 10 slides covering problem statement, methodology, and tech stack",
            due_date=tomorrow_str,
            due_time="12:00",
            priority="High",
            category="Projects",
            is_completed=False
        ),
        Task(
            user_id=demo_user.id,
            title="Submit scholarship renewal form",
            description="Attach latest transcript and recommendation letter",
            due_date=in_3_days_str,
            due_time="15:00",
            priority="Medium",
            category="Administrative",
            is_completed=False
        ),
        Task(
            user_id=demo_user.id,
            title="Submit Software Engineering Sprint 1 report",
            description="Submitted via university portal",
            due_date=yesterday_str,
            due_time="17:00",
            priority="High",
            category="Academic",
            is_completed=True,
            completed_at=datetime.utcnow()
        )
    ]
    db.add_all(tasks)

    # 7. Reminders
    reminders = [
        Reminder(
            user_id=demo_user.id,
            title="Attend Machine Learning class",
            description="Room 405 with Prof. Chen. Bring neural net assignments.",
            reminder_date=today_str,
            reminder_time="09:45",
            repeat_option="Weekly",
            priority="High",
            category="Classes",
            is_completed=False
        ),
        Reminder(
            user_id=demo_user.id,
            title="Submit DBMS assignment",
            description="Submit PDF on Blackboard before 6:00 PM deadline.",
            reminder_date=today_str,
            reminder_time="17:30",
            repeat_option="Does not repeat",
            priority="High",
            category="Assignments",
            is_completed=False
        ),
        Reminder(
            user_id=demo_user.id,
            title="Study Python asynchronous programming",
            description="Read asyncio docs and practice event loop coroutines.",
            reminder_date=tomorrow_str,
            reminder_time="19:00",
            repeat_option="Daily",
            priority="Medium",
            category="Study",
            is_completed=False
        ),
        Reminder(
            user_id=demo_user.id,
            title="Call project advisor regarding dataset approval",
            description="Discuss data scraping ethics and size.",
            reminder_date=in_3_days_str,
            reminder_time="14:00",
            repeat_option="Does not repeat",
            priority="Medium",
            category="Meetings",
            is_completed=False
        )
    ]
    db.add_all(reminders)

    # 8. Exams
    exams = [
        Exam(
            user_id=demo_user.id,
            subject="Machine Learning Midterm",
            exam_date=in_5_days_str,
            exam_time="09:00",
            room="Auditorium A",
            prep_status="In Progress",
            notes="Covers Chapters 1-5, Cost functions, Gradient Descent, Decision Trees."
        ),
        Exam(
            user_id=demo_user.id,
            subject="Database Systems Final Exam",
            exam_date=(today + timedelta(days=12)).isoformat(),
            exam_time="14:00",
            room="Exam Hall 3",
            prep_status="Reviewing",
            notes="Comprehensive exam covering ER modeling, SQL, Relational Algebra, and Normalization."
        )
    ]
    db.add_all(exams)

    # 9. Assignments
    assignments = [
        Assignment(
            user_id=demo_user.id,
            title="Relational Algebra & Normalization Problem Set",
            subject="Database Systems",
            deadline=tomorrow_str,
            description="Complete exercises 7.1 to 7.14 from Silberschatz textbook.",
            status="In Progress",
            priority="High"
        ),
        Assignment(
            user_id=demo_user.id,
            title="Implement Convolutional Neural Network from scratch",
            subject="Machine Learning",
            deadline=in_5_days_str,
            description="Python & NumPy only. Include accuracy charts and test set confusion matrix.",
            status="Pending",
            priority="High"
        )
    ]
    db.add_all(assignments)

    # 10. Study Sessions
    study_sessions = [
        StudySession(
            user_id=demo_user.id,
            title="Machine Learning Revision",
            subject="Machine Learning",
            session_date=today_str,
            start_time="19:00",
            end_time="20:30",
            notes="Review backpropagation math and regularization techniques (L1/L2)",
            is_completed=False
        ),
        StudySession(
            user_id=demo_user.id,
            title="SQL Query Optimization Practice",
            subject="Database Systems",
            session_date=tomorrow_str,
            start_time="16:00",
            end_time="17:30",
            notes="Analyze EXPLAIN plans and index usage",
            is_completed=False
        )
    ]
    db.add_all(study_sessions)

    # 11. Notifications
    notifications = [
        Notification(
            user_id=demo_user.id,
            title="🔔 Machine Learning class starts soon",
            message="Your Machine Learning class starts in 15 minutes at Room 405.",
            notification_type="class",
            is_read=False
        ),
        Notification(
            user_id=demo_user.id,
            title="🔔 DBMS assignment due today",
            message="Database Normalization Assignment is due today at 06:00 PM.",
            notification_type="assignment",
            is_read=False
        ),
        Notification(
            user_id=demo_user.id,
            title="Welcome to Crystal Notebook!",
            message="Your digital workspace is ready. Write, Plan, Remember, and Achieve!",
            notification_type="system",
            is_read=True
        )
    ]
    db.add_all(notifications)

    db.commit()
    return demo_user
