from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReminderBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = ""
    reminder_date: str = Field(..., description="YYYY-MM-DD")
    reminder_time: str = Field(..., description="HH:MM")
    repeat_option: str = "Does not repeat"
    priority: str = "Medium"
    category: str = "General"
    is_completed: bool = False
    is_active: bool = True

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    reminder_date: Optional[str] = None
    reminder_time: Optional[str] = None
    repeat_option: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    is_completed: Optional[bool] = None
    is_active: Optional[bool] = None

class ReminderOut(ReminderBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
