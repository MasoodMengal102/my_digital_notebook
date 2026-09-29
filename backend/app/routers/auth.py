from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.user import User
from app.models.settings import UserSetting
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserOut
)
from app.auth.jwt import get_password_hash, verify_password, create_access_token
from app.auth.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # 1. Normalize fields
    clean_email = user_in.email.strip().lower()
    clean_name = user_in.full_name.strip()

    # 2. Check password match
    if user_in.password != user_in.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # 3. Check for existing user by email
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address is already registered. Please log in."
        )
        
    # 4. Hash password securely
    try:
        hashed_pwd = get_password_hash(user_in.password)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Security error hashing credentials: {str(e)}"
        )

    # 5. Create user record
    new_user = User(
        full_name=clean_name,
        email=clean_email,
        hashed_password=hashed_pwd,
        timezone="UTC",
        theme="light",
        is_active=True
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address is already registered."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during registration: {str(e)}"
        )
    
    # 6. Initialize default user settings
    try:
        user_setting = UserSetting(user_id=new_user.id)
        db.add(user_setting)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Non-critical: default settings initialization skipped: {e}")
    
    # 7. Generate JWT access token
    access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
    
    user_out = UserOut.model_validate(new_user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_out
    }

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    clean_email = credentials.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user account has been deactivated."
        )
        
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_out = UserOut.model_validate(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_out
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user:
        return {"message": "If an account with that email exists, reset instructions have been dispatched."}
    
    demo_reset_token = f"reset_{user.id}_demo_code"
    return {
        "message": "Reset instructions generated successfully.",
        "demo_reset_token": demo_reset_token
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    if req.new_password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
        
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
        
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password has been successfully updated. You can now log in with your new password."}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)
