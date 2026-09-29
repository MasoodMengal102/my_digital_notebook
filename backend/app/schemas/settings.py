from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSettingBase(BaseModel):
    email_notifications: bool = True
    in_app_notifications: bool = True
    sound_enabled: bool = True
    reminder_lead_minutes: int = 15
    calendar_start_day: str = "Monday"

class UserSettingUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    in_app_notifications: Optional[bool] = None
    sound_enabled: Optional[bool] = None
    reminder_lead_minutes: Optional[int] = None
    calendar_start_day: Optional[str] = None

class UserSettingOut(UserSettingBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
