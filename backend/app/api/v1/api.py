from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, rss, ai

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(rss.router, prefix="/rss", tags=["rss"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
