from app.schemas.auth import (
    UserRegister, UserLogin, ForgotPasswordRequest, ResetPasswordRequest, TokenResponse, UserOut, UserUpdate
)
from app.schemas.note import NoteCreate, NoteUpdate, NoteOut, CategoryCreate, CategoryOut
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderOut
from app.schemas.schedule import ClassScheduleCreate, ClassScheduleUpdate, ClassScheduleOut
from app.schemas.planner import (
    CalendarEventCreate, CalendarEventUpdate, CalendarEventOut,
    ExamCreate, ExamUpdate, ExamOut,
    AssignmentCreate, AssignmentUpdate, AssignmentOut,
    StudySessionCreate, StudySessionUpdate, StudySessionOut
)
from app.schemas.settings import UserSettingUpdate, UserSettingOut, NotificationOut

__all__ = [
    "UserRegister",
    "UserLogin",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "TokenResponse",
    "UserOut",
    "UserUpdate",
    "NoteCreate",
    "NoteUpdate",
    "NoteOut",
    "CategoryCreate",
    "CategoryOut",
    "TaskCreate",
    "TaskUpdate",
    "TaskOut",
    "ReminderCreate",
    "ReminderUpdate",
    "ReminderOut",
    "ClassScheduleCreate",
    "ClassScheduleUpdate",
    "ClassScheduleOut",
    "CalendarEventCreate",
    "CalendarEventUpdate",
    "CalendarEventOut",
    "ExamCreate",
    "ExamUpdate",
    "ExamOut",
    "AssignmentCreate",
    "AssignmentUpdate",
    "AssignmentOut",
    "StudySessionCreate",
    "StudySessionUpdate",
    "StudySessionOut",
    "UserSettingUpdate",
    "UserSettingOut",
    "NotificationOut"
]
