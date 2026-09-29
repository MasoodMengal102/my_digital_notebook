from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class UserSetting(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    email_notifications = Column(Boolean, default=True)
    in_app_notifications = Column(Boolean, default=True)
    sound_enabled = Column(Boolean, default=True)
    reminder_lead_minutes = Column(Integer, default=15)
    calendar_start_day = Column(String(20), default="Monday")

    owner = relationship("User", back_populates="settings")
