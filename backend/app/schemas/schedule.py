from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ClassScheduleBase(BaseModel):
    subject_name: str = Field(..., min_length=1, max_length=150)
    teacher_name: Optional[str] = ""
    room: Optional[str] = ""
    day_of_week: str = Field(..., description="Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")
    start_time: str = Field(..., description="HH:MM (24-hour e.g. 09:00)")
    end_time: str = Field(..., description="HH:MM (24-hour e.g. 10:00)")
    color: str = "#4f46e5"
    category: str = "Lecture"

class ClassScheduleCreate(ClassScheduleBase):
    pass

class ClassScheduleUpdate(BaseModel):
    subject_name: Optional[str] = None
    teacher_name: Optional[str] = None
    room: Optional[str] = None
    day_of_week: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None

class ClassScheduleOut(ClassScheduleBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
