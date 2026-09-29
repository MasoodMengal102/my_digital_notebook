from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models.user import User
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskOut])
def get_tasks(
    view: str = "all",  # today, upcoming, completed, overdue, all
    priority: Optional[str] = None,
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Task).filter(Task.user_id == current_user.id)
    today_str = date.today().isoformat()
    
    if view == "today":
        query = query.filter(Task.due_date == today_str, Task.is_completed == False)
    elif view == "upcoming":
        query = query.filter(Task.due_date > today_str, Task.is_completed == False)
    elif view == "completed":
        query = query.filter(Task.is_completed == True)
    elif view == "overdue":
        query = query.filter(Task.due_date < today_str, Task.is_completed == False)
        
    if priority and priority.lower() != "all":
        query = query.filter(Task.priority.ilike(priority))
        
    if category and category.lower() != "all":
        query = query.filter(Task.category.ilike(category))
        
    # Sort order: incomplete first, then by due_date ascending
    return query.order_by(Task.is_completed.asc(), Task.due_date.asc().nullslast(), Task.priority.desc()).all()

@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = Task(
        user_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        due_time=task_in.due_time,
        priority=task_in.priority,
        category=task_in.category,
        is_completed=task_in.is_completed,
        completed_at=datetime.utcnow() if task_in.is_completed else None
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{id}", response_model=TaskOut)
def update_task(
    id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    update_data = task_in.model_dump(exclude_unset=True)
    if "is_completed" in update_data:
        if update_data["is_completed"] and not task.is_completed:
            task.completed_at = datetime.utcnow()
        elif not update_data["is_completed"]:
            task.completed_at = None
            
    for field, value in update_data.items():
        setattr(task, field, value)
        
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{id}/toggle", response_model=TaskOut)
def toggle_task(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.is_completed = not task.is_completed
    task.completed_at = datetime.utcnow() if task.is_completed else None
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{id}")
def delete_task(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
