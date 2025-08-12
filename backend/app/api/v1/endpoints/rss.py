from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import httpx
import asyncio
from typing import List, Optional
import json
import time

router = APIRouter()

class RSSProxyRequest(BaseModel):
    url: str

class RSSProxyResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None

# Rate limiting configuration
RATE_LIMIT_DELAY = 1.0  # seconds between requests
last_request_time = 0

async def rate_limit():
    global last_request_time
    current_time = time.time()
    time_since_last = current_time - last_request_time
    if time_since_last < RATE_LIMIT_DELAY:
        await asyncio.sleep(RATE_LIMIT_DELAY - time_since_last)
    last_request_time = time.time()

@router.post("/proxy", response_model=RSSProxyResponse)
async def proxy_rss_feed(request: RSSProxyRequest):
    """Proxy RSS feed requests to avoid CORS issues"""
    try:
        await rate_limit()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(request.url)
            response.raise_for_status()
            
            # Try to parse as JSON first
            try:
                data = response.json()
            except json.JSONDecodeError:
                # If not JSON, try to parse as XML/RSS
                data = {
                    "items": [],
                    "title": "RSS Feed",
                    "description": "Feed content",
                    "raw_content": response.text[:1000]  # Limit raw content
                }
            
            return RSSProxyResponse(success=True, data=data)
            
    except httpx.HTTPStatusError as e:
        return RSSProxyResponse(
            success=False, 
            error=f"HTTP {e.response.status_code}: {e.response.status_text}"
        )
    except Exception as e:
        return RSSProxyResponse(
            success=False, 
            error=f"Request failed: {str(e)}"
        )

@router.get("/trending")
async def get_trending_feeds():
    """Get trending RSS feeds"""
    # TODO: Implement real trending feeds
    return {"success": True, "data": []}

@router.get("/category/{category}")
async def get_feeds_by_category(category: str):
    """Get RSS feeds by category"""
    # TODO: Implement real category feeds
    return {"success": True, "data": []}
