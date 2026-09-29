from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models.user import User
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])

@router.get("", response_model=List[ReminderOut])
def get_reminders(
    status_filter: Optional[str] = None,  # pending, completed, all
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Reminder).filter(Reminder.user_id == current_user.id)
    if status_filter == "pending":
        query = query.filter(Reminder.is_completed == False, Reminder.is_active == True)
    elif status_filter == "completed":
        query = query.filter(Reminder.is_completed == True)
        
    return query.order_by(Reminder.is_completed.asc(), Reminder.reminder_date.asc(), Reminder.reminder_time.asc()).all()

@router.post("", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
def create_reminder(
    reminder_in: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = Reminder(
        user_id=current_user.id,
        title=reminder_in.title,
        description=reminder_in.description,
        reminder_date=reminder_in.reminder_date,
        reminder_time=reminder_in.reminder_time,
        repeat_option=reminder_in.repeat_option,
        priority=reminder_in.priority,
        category=reminder_in.category,
        is_completed=reminder_in.is_completed,
        is_active=reminder_in.is_active
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder

@router.put("/{id}", response_model=ReminderOut)
def update_reminder(
    id: int,
    reminder_in: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == current_user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    update_data = reminder_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reminder, field, value)
        
    db.commit()
    db.refresh(reminder)
    return reminder

@router.patch("/{id}/toggle", response_model=ReminderOut)
def toggle_reminder(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == current_user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    reminder.is_completed = not reminder.is_completed
    db.commit()
    db.refresh(reminder)
    return reminder

@router.delete("/{id}")
def delete_reminder(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == current_user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    db.delete(reminder)
    db.commit()
    return {"message": "Reminder deleted successfully"}
