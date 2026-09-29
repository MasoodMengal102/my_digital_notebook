from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional
from datetime import datetime
import re

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    timezone: str = "UTC"
    theme: str = "light"
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=6, max_length=128)
    confirm_password: str = Field(..., min_length=6, max_length=128)

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        # Standard email RFC pattern
        email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(email_regex, v):
            raise ValueError("Please provide a valid email address (e.g. name@university.edu)")
        return v

    @model_validator(mode='after')
    def verify_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def clean_email(cls, v: str) -> str:
        return v.strip().lower()

class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator('email')
    @classmethod
    def clean_email(cls, v: str) -> str:
        return v.strip().lower()

class ResetPasswordRequest(BaseModel):
    email: str
    reset_token: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)

    @field_validator('email')
    @classmethod
    def clean_email(cls, v: str) -> str:
        return v.strip().lower()

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    timezone: Optional[str] = None
    theme: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
