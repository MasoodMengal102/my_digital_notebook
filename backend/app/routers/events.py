from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.planner import CalendarEvent
from app.schemas.planner import CalendarEventCreate, CalendarEventUpdate, CalendarEventOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/events", tags=["Calendar Events"])

@router.get("", response_model=List[CalendarEventOut])
def get_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    event_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(CalendarEvent).filter(CalendarEvent.user_id == current_user.id)
    
    if start_date:
        query = query.filter(CalendarEvent.start_date >= start_date)
    if end_date:
        query = query.filter(CalendarEvent.start_date <= end_date)
    if event_type and event_type.lower() != "all":
        query = query.filter(CalendarEvent.event_type.ilike(event_type))
        
    return query.order_by(CalendarEvent.start_date.asc(), CalendarEvent.start_time.asc().nullslast()).all()

@router.post("", response_model=CalendarEventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: CalendarEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = CalendarEvent(
        user_id=current_user.id,
        title=event_in.title,
        description=event_in.description,
        event_type=event_in.event_type,
        start_date=event_in.start_date,
        end_date=event_in.end_date,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        location=event_in.location,
        priority=event_in.priority,
        color=event_in.color,
        reminder_set=event_in.reminder_set
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.put("/{id}", response_model=CalendarEventOut)
def update_event(
    id: int,
    event_in: CalendarEventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(CalendarEvent).filter(CalendarEvent.id == id, CalendarEvent.user_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
        
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{id}")
def delete_event(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(CalendarEvent).filter(CalendarEvent.id == id, CalendarEvent.user_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}
