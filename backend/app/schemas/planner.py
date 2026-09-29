from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Calendar Events
class CalendarEventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = ""
    event_type: str = "General"  # Class, Assignment, Exam, Project, Meeting, Personal, Study
    start_date: str = Field(..., description="YYYY-MM-DD")
    end_date: Optional[str] = None
    start_time: Optional[str] = None  # HH:MM
    end_time: Optional[str] = None    # HH:MM
    location: Optional[str] = ""
    priority: str = "Medium"
    color: str = "#6366f1"
    reminder_set: bool = False

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    priority: Optional[str] = None
    color: Optional[str] = None
    reminder_set: Optional[bool] = None

class CalendarEventOut(CalendarEventBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Exams
class ExamBase(BaseModel):
    subject: str = Field(..., min_length=1, max_length=150)
    exam_date: str = Field(..., description="YYYY-MM-DD")
    exam_time: Optional[str] = "09:00"
    room: Optional[str] = ""
    prep_status: str = "In Progress"  # Not Started, In Progress, Ready, Reviewing
    notes: Optional[str] = ""

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseModel):
    subject: Optional[str] = None
    exam_date: Optional[str] = None
    exam_time: Optional[str] = None
    room: Optional[str] = None
    prep_status: Optional[str] = None
    notes: Optional[str] = None

class ExamOut(ExamBase):
    id: int
    user_id: int
    created_at: datetime
    days_remaining: Optional[int] = None

    class Config:
        from_attributes = True

# Assignments
class AssignmentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    subject: str = Field(..., min_length=1, max_length=150)
    deadline: str = Field(..., description="YYYY-MM-DD")
    description: Optional[str] = ""
    status: str = "Pending"  # Pending, In Progress, Submitted
    priority: str = "Medium"

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    deadline: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class AssignmentOut(AssignmentBase):
    id: int
    user_id: int
    created_at: datetime
    days_remaining: Optional[int] = None

    class Config:
        from_attributes = True

# Study Sessions
class StudySessionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    subject: str = Field(..., min_length=1, max_length=150)
    session_date: str = Field(..., description="YYYY-MM-DD")
    start_time: str = Field(..., description="HH:MM")
    end_time: str = Field(..., description="HH:MM")
    notes: Optional[str] = ""
    is_completed: bool = False

class StudySessionCreate(StudySessionBase):
    pass

class StudySessionUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    session_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notes: Optional[str] = None
    is_completed: Optional[bool] = None

class StudySessionOut(StudySessionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
