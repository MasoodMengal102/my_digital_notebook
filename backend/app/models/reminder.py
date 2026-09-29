from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="", nullable=True)
    reminder_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    reminder_time = Column(String(20), nullable=False)  # HH:MM
    repeat_option = Column(String(30), default="Does not repeat")  # Does not repeat, Daily, Weekly, Monthly, Custom
    priority = Column(String(20), default="Medium")  # Low, Medium, High
    category = Column(String(50), default="General")
    is_completed = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="reminders")
