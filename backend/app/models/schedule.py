from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ClassSchedule(Base):
    __tablename__ = "class_schedules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject_name = Column(String(150), nullable=False)
    teacher_name = Column(String(100), default="", nullable=True)
    room = Column(String(50), default="", nullable=True)
    day_of_week = Column(String(20), nullable=False)  # Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    start_time = Column(String(10), nullable=False)  # 09:00
    end_time = Column(String(10), nullable=False)    # 10:00
    color = Column(String(30), default="#4f46e5")    # Hex or Tailwind color
    category = Column(String(50), default="Lecture")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="classes")
