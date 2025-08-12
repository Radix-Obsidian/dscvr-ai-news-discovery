from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User, UserUpdate, User as UserResponse
import json

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get current user information."""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Update current user information."""
    # Update only provided fields
    update_data = user_data.dict(exclude_unset=True)
    
    # Handle interests as JSON string
    if "interests" in update_data and update_data["interests"] is not None:
        update_data["interests"] = json.dumps(update_data["interests"])
    
    # Handle reading preferences as JSON string
    if "reading_preferences" in update_data and update_data["reading_preferences"] is not None:
        update_data["reading_preferences"] = json.dumps(update_data["reading_preferences"])
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/me/interests")
def get_user_interests(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get current user interests."""
    if current_user.interests:
        try:
            return json.loads(current_user.interests)
        except json.JSONDecodeError:
            return []
    return []

@router.put("/me/interests")
def update_user_interests(
    interests: List[str],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Update current user interests."""
    current_user.interests = json.dumps(interests)
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Interests updated successfully", "interests": interests}

@router.get("/me/preferences")
def get_user_preferences(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get current user reading preferences."""
    if current_user.reading_preferences:
        try:
            return json.loads(current_user.reading_preferences)
        except json.JSONDecodeError:
            return {}
    return {}

@router.put("/me/preferences")
def update_user_preferences(
    preferences: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Update current user reading preferences."""
    current_user.reading_preferences = json.dumps(preferences)
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Preferences updated successfully", "preferences": preferences}
