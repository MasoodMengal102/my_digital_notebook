from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Dict, Any, List

from app.database import get_db
from app.models.user import User
from app.models.note import Note
from app.models.task import Task
from app.models.reminder import Reminder
from app.models.schedule import ClassSchedule
from app.models.planner import CalendarEvent, Exam, Assignment
from app.auth.deps import get_current_user

router = APIRouter(prefix="/search", tags=["Global Search"])

@router.get("")
def global_search(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    search_term = f"%{q.lower()}%"
    
    # 1. Notes
    notes = db.query(Note).filter(
        Note.user_id == current_user.id,
        or_(
            Note.title.ilike(search_term),
            Note.content.ilike(search_term),
            Note.tags.ilike(search_term),
            Note.category.ilike(search_term)
        )
    ).limit(10).all()
    
    # 2. Tasks
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        or_(
            Task.title.ilike(search_term),
            Task.description.ilike(search_term),
            Task.category.ilike(search_term)
        )
    ).limit(10).all()
    
    # 3. Classes
    classes = db.query(ClassSchedule).filter(
        ClassSchedule.user_id == current_user.id,
        or_(
            ClassSchedule.subject_name.ilike(search_term),
            ClassSchedule.teacher_name.ilike(search_term),
            ClassSchedule.room.ilike(search_term)
        )
    ).limit(10).all()
    
    # 4. Reminders
    reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        or_(
            Reminder.title.ilike(search_term),
            Reminder.description.ilike(search_term)
        )
    ).limit(10).all()
    
    # 5. Events
    events = db.query(CalendarEvent).filter(
        CalendarEvent.user_id == current_user.id,
        or_(
            CalendarEvent.title.ilike(search_term),
            CalendarEvent.description.ilike(search_term),
            CalendarEvent.location.ilike(search_term)
        )
    ).limit(10).all()
    
    # 6. Exams & Assignments
    exams = db.query(Exam).filter(
        Exam.user_id == current_user.id,
        or_(
            Exam.subject.ilike(search_term),
            Exam.notes.ilike(search_term)
        )
    ).limit(5).all()
    
    assignments = db.query(Assignment).filter(
        Assignment.user_id == current_user.id,
        or_(
            Assignment.title.ilike(search_term),
            Assignment.subject.ilike(search_term)
        )
    ).limit(5).all()

    return {
        "query": q,
        "results": {
            "notes": [{"id": n.id, "title": n.title, "category": n.category, "updated_at": n.updated_at.isoformat()} for n in notes],
            "tasks": [{"id": t.id, "title": t.title, "due_date": t.due_date, "priority": t.priority, "is_completed": t.is_completed} for t in tasks],
            "classes": [{"id": c.id, "subject_name": c.subject_name, "day_of_week": c.day_of_week, "start_time": c.start_time, "room": c.room} for c in classes],
            "reminders": [{"id": r.id, "title": r.title, "reminder_date": r.reminder_date, "reminder_time": r.reminder_time, "priority": r.priority} for r in reminders],
            "events": [{"id": e.id, "title": e.title, "start_date": e.start_date, "start_time": e.start_time, "event_type": e.event_type} for e in events],
            "exams": [{"id": ex.id, "subject": ex.subject, "exam_date": ex.exam_date, "room": ex.room} for ex in exams],
            "assignments": [{"id": a.id, "title": a.title, "subject": a.subject, "deadline": a.deadline, "status": a.status} for a in assignments]
        },
        "total_matches": len(notes) + len(tasks) + len(classes) + len(reminders) + len(events) + len(exams) + len(assignments)
    }
