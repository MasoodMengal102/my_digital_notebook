from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.schedule import ClassSchedule
from app.schemas.schedule import ClassScheduleCreate, ClassScheduleUpdate, ClassScheduleOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/classes", tags=["Classes"])

DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

@router.get("", response_model=List[ClassScheduleOut])
def get_classes(
    day: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ClassSchedule).filter(ClassSchedule.user_id == current_user.id)
    if day and day.lower() != "all":
        query = query.filter(ClassSchedule.day_of_week.ilike(day))
        
    classes = query.all()
    # Sort by day of week index, then by start_time
    def day_sort_key(c):
        try:
            day_idx = DAYS_ORDER.index(c.day_of_week.capitalize())
        except ValueError:
            day_idx = 99
        return (day_idx, c.start_time)
        
    return sorted(classes, key=day_sort_key)

@router.get("/today", response_model=List[ClassScheduleOut])
def get_today_classes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_day = datetime.now().strftime("%A")  # e.g. "Monday"
    classes = db.query(ClassSchedule).filter(
        ClassSchedule.user_id == current_user.id,
        ClassSchedule.day_of_week.ilike(current_day)
    ).order_by(ClassSchedule.start_time.asc()).all()
    return classes

@router.post("", response_model=ClassScheduleOut, status_code=status.HTTP_201_CREATED)
def create_class(
    class_in: ClassScheduleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_class = ClassSchedule(
        user_id=current_user.id,
        subject_name=class_in.subject_name,
        teacher_name=class_in.teacher_name,
        room=class_in.room,
        day_of_week=class_in.day_of_week.capitalize(),
        start_time=class_in.start_time,
        end_time=class_in.end_time,
        color=class_in.color,
        category=class_in.category
    )
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.put("/{id}", response_model=ClassScheduleOut)
def update_class(
    id: int,
    class_in: ClassScheduleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(ClassSchedule).filter(ClassSchedule.id == id, ClassSchedule.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Class not found")
        
    update_data = class_in.model_dump(exclude_unset=True)
    if "day_of_week" in update_data and update_data["day_of_week"]:
        update_data["day_of_week"] = update_data["day_of_week"].capitalize()
        
    for field, value in update_data.items():
        setattr(item, field, value)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{id}")
def delete_class(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(ClassSchedule).filter(ClassSchedule.id == id, ClassSchedule.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Class not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Class schedule deleted successfully"}
