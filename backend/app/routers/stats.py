from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import Dict, Any

from app.database import get_db
from app.models.user import User
from app.models.note import Note
from app.models.task import Task
from app.models.reminder import Reminder
from app.models.schedule import ClassSchedule
from app.models.planner import CalendarEvent, Exam, StudySession
from app.schemas.note import NoteOut
from app.schemas.task import TaskOut
from app.schemas.reminder import ReminderOut
from app.schemas.schedule import ClassScheduleOut
from app.schemas.planner import ExamOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/stats", tags=["Dashboard Statistics"])

@router.get("/dashboard")
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    today = date.today()
    today_str = today.isoformat()
    current_day = datetime.now().strftime("%A")
    
    # 1. Total Notes
    total_notes = db.query(Note).filter(Note.user_id == current_user.id, Note.is_archived == False).count()
    
    # 2. Pending Tasks
    pending_tasks_count = db.query(Task).filter(Task.user_id == current_user.id, Task.is_completed == False).count()
    
    # 3. Today's Classes count
    today_classes_query = db.query(ClassSchedule).filter(
        ClassSchedule.user_id == current_user.id,
        ClassSchedule.day_of_week.ilike(current_day)
    ).order_by(ClassSchedule.start_time.asc()).all()
    today_classes_count = len(today_classes_query)
    
    # 4. Upcoming Reminders count (pending and >= today)
    upcoming_reminders_count = db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.is_completed == False,
        Reminder.is_active == True,
        Reminder.reminder_date >= today_str
    ).count()
    
    # 5. Today's Chronological Schedule (Combined classes, study sessions, and events)
    schedule_items = []
    for c in today_classes_query:
        schedule_items.append({
            "type": "class",
            "title": c.subject_name,
            "subtitle": f"{c.room} • {c.teacher_name}" if c.room or c.teacher_name else "Class",
            "start_time": c.start_time,
            "end_time": c.end_time,
            "color": c.color or "#4f46e5",
            "category": c.category
        })
        
    today_sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.session_date == today_str
    ).all()
    for s in today_sessions:
        schedule_items.append({
            "type": "study",
            "title": s.title,
            "subtitle": s.subject,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "color": "#10b981",
            "category": "Study Session"
        })
        
    today_events = db.query(CalendarEvent).filter(
        CalendarEvent.user_id == current_user.id,
        CalendarEvent.start_date == today_str
    ).all()
    for e in today_events:
        schedule_items.append({
            "type": "event",
            "title": e.title,
            "subtitle": e.location or e.event_type,
            "start_time": e.start_time or "00:00",
            "end_time": e.end_time or "23:59",
            "color": e.color or "#f59e0b",
            "category": e.event_type
        })
        
    schedule_items.sort(key=lambda x: x["start_time"])
    
    # 6. Upcoming Reminders list
    upcoming_reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.is_completed == False,
        Reminder.is_active == True,
        Reminder.reminder_date >= today_str
    ).order_by(Reminder.reminder_date.asc(), Reminder.reminder_time.asc()).limit(5).all()
    
    # 7. Recent Notes (up to 4)
    recent_notes = db.query(Note).filter(
        Note.user_id == current_user.id,
        Note.is_archived == False
    ).order_by(Note.updated_at.desc()).limit(4).all()
    
    # 8. Today's Tasks
    today_tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.due_date == today_str
    ).order_by(Task.is_completed.asc(), Task.priority.desc()).limit(6).all()
    
    # 9. Upcoming Exam countdowns
    exams = db.query(Exam).filter(
        Exam.user_id == current_user.id,
        Exam.exam_date >= today_str
    ).order_by(Exam.exam_date.asc()).limit(3).all()
    
    exam_countdowns = []
    for ex in exams:
        try:
            ex_date = datetime.strptime(ex.exam_date, "%Y-%m-%d").date()
            diff = (ex_date - today).days
        except Exception:
            diff = 0
        exam_countdowns.append({
            "id": ex.id,
            "subject": ex.subject,
            "exam_date": ex.exam_date,
            "exam_time": ex.exam_time,
            "room": ex.room,
            "prep_status": ex.prep_status,
            "days_remaining": diff
        })

    return {
        "stats": {
            "total_notes": total_notes,
            "pending_tasks": pending_tasks_count,
            "today_classes": today_classes_count,
            "upcoming_reminders": upcoming_reminders_count
        },
        "today_schedule": schedule_items,
        "upcoming_reminders": [ReminderOut.model_validate(r) for r in upcoming_reminders],
        "recent_notes": [NoteOut.model_validate(n) for n in recent_notes],
        "today_tasks": [TaskOut.model_validate(t) for t in today_tasks],
        "exam_countdowns": exam_countdowns
    }
