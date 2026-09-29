from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="", nullable=True)
    event_type = Column(String(50), default="General")  # Class, Assignment, Exam, Project, Meeting, Personal, Study
    start_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    end_date = Column(String(20), nullable=True)    # YYYY-MM-DD
    start_time = Column(String(10), nullable=True)  # HH:MM
    end_time = Column(String(10), nullable=True)    # HH:MM
    location = Column(String(100), default="", nullable=True)
    priority = Column(String(20), default="Medium")
    color = Column(String(30), default="#6366f1")
    reminder_set = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="events")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(150), nullable=False)
    exam_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    exam_time = Column(String(10), default="09:00", nullable=True)
    room = Column(String(50), default="", nullable=True)
    prep_status = Column(String(50), default="In Progress")  # Not Started, In Progress, Ready, Reviewing
    notes = Column(Text, default="", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="exams")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    subject = Column(String(150), nullable=False)
    deadline = Column(String(20), nullable=False)  # YYYY-MM-DD
    description = Column(Text, default="", nullable=True)
    status = Column(String(50), default="Pending")  # Pending, In Progress, Submitted
    priority = Column(String(20), default="Medium")  # Low, Medium, High
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="assignments")

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    subject = Column(String(150), nullable=False)
    session_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(10), nullable=False)    # 19:00
    end_time = Column(String(10), nullable=False)      # 20:30
    notes = Column(Text, default="", nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="study_sessions")
