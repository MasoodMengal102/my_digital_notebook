from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.note import Note, NoteCategory
from app.schemas.note import NoteCreate, NoteUpdate, NoteOut, CategoryCreate, CategoryOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("", response_model=List[NoteOut])
def get_notes(
    search: Optional[str] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    is_pinned: Optional[bool] = None,
    is_archived: bool = False,
    sort_by: str = "updated_at",
    order: str = "desc",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Note).filter(Note.user_id == current_user.id, Note.is_archived == is_archived)
    
    if search:
        search_filter = f"%{search.lower()}%"
        query = query.filter(
            or_(
                Note.title.ilike(search_filter),
                Note.content.ilike(search_filter),
                Note.tags.ilike(search_filter)
            )
        )
        
    if category and category.lower() != "all":
        query = query.filter(Note.category.ilike(category))
        
    if tag:
        query = query.filter(Note.tags.ilike(f"%{tag}%"))
        
    if is_pinned is not None:
        query = query.filter(Note.is_pinned == is_pinned)
        
    # Sort order
    sort_column = getattr(Note, sort_by, Note.updated_at)
    if order.lower() == "asc":
        query = query.order_by(Note.is_pinned.desc(), asc(sort_column))
    else:
        query = query.order_by(Note.is_pinned.desc(), desc(sort_column))
        
    return query.all()

@router.post("", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = Note(
        user_id=current_user.id,
        title=note_in.title,
        content=note_in.content,
        category=note_in.category,
        tags=note_in.tags,
        is_pinned=note_in.is_pinned,
        is_archived=note_in.is_archived,
        color=note_in.color
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/categories", response_model=List[str])
def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    default_categories = [
        "Computer Science",
        "Database",
        "Machine Learning",
        "Mathematics",
        "Programming",
        "Personal",
        "Other"
    ]
    custom_cats = db.query(NoteCategory.name).filter(NoteCategory.user_id == current_user.id).all()
    user_cats = [c[0] for c in custom_cats]
    
    # Also get categories used in notes
    notes_cats = db.query(Note.category).filter(Note.user_id == current_user.id).distinct().all()
    notes_cats_list = [c[0] for c in notes_cats if c[0]]
    
    all_unique = sorted(list(set(default_categories + user_cats + notes_cats_list)))
    return all_unique

@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(NoteCategory).filter(
        NoteCategory.user_id == current_user.id,
        NoteCategory.name.ilike(cat_in.name)
    ).first()
    if existing:
        return existing
    
    category = NoteCategory(
        user_id=current_user.id,
        name=cat_in.name,
        color=cat_in.color
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.get("/{id}", response_model=NoteOut)
def get_note(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{id}", response_model=NoteOut)
def update_note(
    id: int,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    update_data = note_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)
        
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{id}")
def delete_note(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}
