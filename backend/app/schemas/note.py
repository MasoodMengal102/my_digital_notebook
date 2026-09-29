from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = ""
    category: str = "General"
    tags: str = ""
    is_pinned: bool = False
    is_archived: bool = False
    color: str = "#ffffff"

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None
    color: Optional[str] = None

class NoteOut(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    color: str = "#6366f1"

class CategoryOut(CategoryCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
