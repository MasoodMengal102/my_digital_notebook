from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models.user import User
from app.models.planner import Exam, Assignment, StudySession
from app.schemas.planner import (
    ExamCreate, ExamUpdate, ExamOut,
    AssignmentCreate, AssignmentUpdate, AssignmentOut,
    StudySessionCreate, StudySessionUpdate, StudySessionOut
)
from app.auth.deps import get_current_user

router = APIRouter(prefix="/planner", tags=["Student Planner"])

def calculate_days(date_str: str) -> Optional[int]:
    try:
        target = datetime.strptime(date_str, "%Y-%m-%d").date()
        today = date.today()
        return (target - today).days
    except Exception:
        return None

# EXAMS
@router.get("/exams", response_model=List[ExamOut])
def get_exams(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exams = db.query(Exam).filter(Exam.user_id == current_user.id).order_by(Exam.exam_date.asc()).all()
    res = []
    for exam in exams:
        d = ExamOut.model_validate(exam)
        d.days_remaining = calculate_days(exam.exam_date)
        res.append(d)
    return res

@router.post("/exams", response_model=ExamOut, status_code=status.HTTP_201_CREATED)
def create_exam(exam_in: ExamCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exam = Exam(
        user_id=current_user.id,
        subject=exam_in.subject,
        exam_date=exam_in.exam_date,
        exam_time=exam_in.exam_time,
        room=exam_in.room,
        prep_status=exam_in.prep_status,
        notes=exam_in.notes
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    res = ExamOut.model_validate(exam)
    res.days_remaining = calculate_days(exam.exam_date)
    return res

@router.put("/exams/{id}", response_model=ExamOut)
def update_exam(id: int, exam_in: ExamUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == id, Exam.user_id == current_user.id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
        
    for field, val in exam_in.model_dump(exclude_unset=True).items():
        setattr(exam, field, val)
        
    db.commit()
    db.refresh(exam)
    res = ExamOut.model_validate(exam)
    res.days_remaining = calculate_days(exam.exam_date)
    return res

@router.delete("/exams/{id}")
def delete_exam(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == id, Exam.user_id == current_user.id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
    return {"message": "Exam deleted successfully"}

# ASSIGNMENTS
@router.get("/assignments", response_model=List[AssignmentOut])
def get_assignments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignments = db.query(Assignment).filter(Assignment.user_id == current_user.id).order_by(Assignment.deadline.asc()).all()
    res = []
    for a in assignments:
        d = AssignmentOut.model_validate(a)
        d.days_remaining = calculate_days(a.deadline)
        res.append(d)
    return res

@router.post("/assignments", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(a_in: AssignmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = Assignment(
        user_id=current_user.id,
        title=a_in.title,
        subject=a_in.subject,
        deadline=a_in.deadline,
        description=a_in.description,
        status=a_in.status,
        priority=a_in.priority
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    res = AssignmentOut.model_validate(assignment)
    res.days_remaining = calculate_days(assignment.deadline)
    return res

@router.put("/assignments/{id}", response_model=AssignmentOut)
def update_assignment(id: int, a_in: AssignmentUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == id, Assignment.user_id == current_user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    for field, val in a_in.model_dump(exclude_unset=True).items():
        setattr(assignment, field, val)
        
    db.commit()
    db.refresh(assignment)
    res = AssignmentOut.model_validate(assignment)
    res.days_remaining = calculate_days(assignment.deadline)
    return res

@router.delete("/assignments/{id}")
def delete_assignment(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == id, Assignment.user_id == current_user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}

# STUDY SESSIONS
@router.get("/study-sessions", response_model=List[StudySessionOut])
def get_study_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(StudySession).filter(StudySession.user_id == current_user.id).order_by(StudySession.session_date.asc(), StudySession.start_time.asc()).all()
    return sessions

@router.post("/study-sessions", response_model=StudySessionOut, status_code=status.HTTP_201_CREATED)
def create_study_session(s_in: StudySessionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = StudySession(
        user_id=current_user.id,
        title=s_in.title,
        subject=s_in.subject,
        session_date=s_in.session_date,
        start_time=s_in.start_time,
        end_time=s_in.end_time,
        notes=s_in.notes,
        is_completed=s_in.is_completed
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.put("/study-sessions/{id}", response_model=StudySessionOut)
def update_study_session(id: int, s_in: StudySessionUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == id, StudySession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
        
    for field, val in s_in.model_dump(exclude_unset=True).items():
        setattr(session, field, val)
        
    db.commit()
    db.refresh(session)
    return session

@router.patch("/study-sessions/{id}/toggle", response_model=StudySessionOut)
def toggle_study_session(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == id, StudySession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
        
    session.is_completed = not session.is_completed
    db.commit()
    db.refresh(session)
    return session

@router.delete("/study-sessions/{id}")
def delete_study_session(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == id, StudySession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    db.delete(session)
    db.commit()
    return {"message": "Study session deleted successfully"}
