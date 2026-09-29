from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    timezone = Column(String(50), default="UTC")
    theme = Column(String(20), default="system")  # light, dark, system
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notes = relationship("Note", back_populates="owner", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="owner", cascade="all, delete-orphan")
    classes = relationship("ClassSchedule", back_populates="owner", cascade="all, delete-orphan")
    events = relationship("CalendarEvent", back_populates="owner", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="owner", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="owner", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="owner", cascade="all, delete-orphan")
    settings = relationship("UserSetting", back_populates="owner", uselist=False, cascade="all, delete-orphan")
