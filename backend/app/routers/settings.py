from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.settings import UserSetting
from app.models.notification import Notification
from app.schemas.settings import UserSettingUpdate, UserSettingOut, NotificationOut
from app.schemas.auth import UserUpdate, UserOut
from app.auth.jwt import get_password_hash, verify_password
from app.auth.deps import get_current_user

router = APIRouter(prefix="/settings", tags=["User Settings & Notifications"])

@router.get("", response_model=UserSettingOut)
def get_user_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    setting = db.query(UserSetting).filter(UserSetting.user_id == current_user.id).first()
    if not setting:
        setting = UserSetting(user_id=current_user.id)
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.put("", response_model=UserSettingOut)
def update_user_settings(
    update_in: UserSettingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    setting = db.query(UserSetting).filter(UserSetting.user_id == current_user.id).first()
    if not setting:
        setting = UserSetting(user_id=current_user.id)
        db.add(setting)
        
    for field, val in update_in.model_dump(exclude_unset=True).items():
        setattr(setting, field, val)
        
    db.commit()
    db.refresh(setting)
    return setting

@router.put("/profile", response_model=UserOut)
def update_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.avatar_url is not None:
        current_user.avatar_url = user_in.avatar_url
    if user_in.timezone is not None:
        current_user.timezone = user_in.timezone
    if user_in.theme is not None:
        current_user.theme = user_in.theme
        
    if user_in.new_password:
        if not user_in.current_password or not verify_password(user_in.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is required and must match")
        current_user.hashed_password = get_password_hash(user_in.new_password)
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/notifications", response_model=List[NotificationOut])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notes = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(20).all()
    return notes

@router.patch("/notifications/{id}/read", response_model=NotificationOut)
def mark_notification_read(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Notification).filter(Notification.id == id, Notification.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    note.is_read = True
    db.commit()
    db.refresh(note)
    return note

@router.post("/notifications/mark-all-read")
def mark_all_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
