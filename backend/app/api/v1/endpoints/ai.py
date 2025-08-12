from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.ai_service import ai_service

router = APIRouter()

class SummaryRequest(BaseModel):
    content: str
    max_length: Optional[int] = 200

class SummaryResponse(BaseModel):
    success: bool
    summary: Optional[str] = None
    error: Optional[str] = None

class SentimentRequest(BaseModel):
    content: str

class SentimentResponse(BaseModel):
    success: bool
    sentiment: Optional[str] = None
    error: Optional[str] = None

class KeywordsRequest(BaseModel):
    content: str

class KeywordsResponse(BaseModel):
    success: bool
    keywords: Optional[List[str]] = None
    error: Optional[str] = None

class QuestionsRequest(BaseModel):
    content: str

class QuestionsResponse(BaseModel):
    success: bool
    questions: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """Generate AI summary of article content"""
    try:
        summary = await ai_service.generate_summary(request.content, request.max_length)
        
        if summary:
            return SummaryResponse(success=True, summary=summary)
        else:
            return SummaryResponse(
                success=False, 
                error="Unable to generate summary. Please try again."
            )
            
    except Exception as e:
        return SummaryResponse(
            success=False, 
            error=f"Summary generation failed: {str(e)}"
        )

@router.post("/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment of content"""
    try:
        sentiment = await ai_service.analyze_sentiment(request.content)
        
        if sentiment:
            return SentimentResponse(success=True, sentiment=sentiment)
        else:
            return SentimentResponse(
                success=False, 
                error="Unable to analyze sentiment."
            )
            
    except Exception as e:
        return SentimentResponse(
            success=False, 
            error=f"Sentiment analysis failed: {str(e)}"
        )

@router.post("/keywords", response_model=KeywordsResponse)
async def extract_keywords(request: KeywordsRequest):
    """Extract keywords from content"""
    try:
        keywords = await ai_service.extract_keywords(request.content)
        
        if keywords:
            return KeywordsResponse(success=True, keywords=keywords)
        else:
            return KeywordsResponse(
                success=False, 
                error="Unable to extract keywords."
            )
            
    except Exception as e:
        return KeywordsResponse(
            success=False, 
            error=f"Keyword extraction failed: {str(e)}"
        )

@router.post("/questions", response_model=QuestionsResponse)
async def generate_questions(request: QuestionsRequest):
    """Generate follow-up questions about content"""
    try:
        questions = await ai_service.generate_follow_up_questions(request.content)
        
        if questions:
            return QuestionsResponse(success=True, questions=questions)
        else:
            return QuestionsResponse(
                success=False, 
                error="Unable to generate questions."
            )
            
    except Exception as e:
        return QuestionsResponse(
            success=False, 
            error=f"Question generation failed: {str(e)}"
        )

@router.get("/health")
async def ai_health_check():
    """Check AI service health"""
    try:
        # Test with a simple prompt
        test_summary = await ai_service.generate_summary("This is a test article.", 50)
        return {
            "status": "healthy",
            "service": "ai",
            "test_summary": test_summary is not None
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "ai",
            "error": str(e)
        }
