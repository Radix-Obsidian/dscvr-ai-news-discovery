import os
import httpx
from typing import Optional, Dict, Any
import json

class AIService:
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama2")
        
    async def generate_summary(self, content: str, max_length: int = 200) -> Optional[str]:
        """Generate AI summary of article content"""
        try:
            prompt = f"""
            Please provide a concise summary of the following article content in {max_length} characters or less:
            
            {content[:2000]}  # Limit content length for API
            
            Summary:
            """
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                            "top_p": 0.9,
                            "max_tokens": 300
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    summary = result.get("response", "").strip()
                    return summary if summary else None
                else:
                    print(f"Ollama API error: {response.status_code}")
                    return None
                    
        except Exception as e:
            print(f"AI summary generation failed: {e}")
            return None
    
    async def analyze_sentiment(self, content: str) -> Optional[str]:
        """Analyze sentiment of content"""
        try:
            prompt = f"""
            Analyze the sentiment of the following text and respond with only one word: positive, negative, or neutral.
            
            Text: {content[:500]}
            
            Sentiment:
            """
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.3,
                            "max_tokens": 10
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    sentiment = result.get("response", "").strip().lower()
                    if sentiment in ["positive", "negative", "neutral"]:
                        return sentiment
                    return "neutral"
                else:
                    return "neutral"
                    
        except Exception as e:
            print(f"Sentiment analysis failed: {e}")
            return "neutral"
    
    async def extract_keywords(self, content: str) -> list[str]:
        """Extract keywords from content"""
        try:
            prompt = f"""
            Extract 5-8 key topics or keywords from the following text. Return only the keywords separated by commas:
            
            {content[:1000]}
            
            Keywords:
            """
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.5,
                            "max_tokens": 100
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    keywords_text = result.get("response", "").strip()
                    keywords = [kw.strip() for kw in keywords_text.split(",") if kw.strip()]
                    return keywords[:8]  # Limit to 8 keywords
                else:
                    return []
                    
        except Exception as e:
            print(f"Keyword extraction failed: {e}")
            return []
    
    async def generate_follow_up_questions(self, content: str) -> list[str]:
        """Generate follow-up questions about the content"""
        try:
            prompt = f"""
            Generate 3-5 thoughtful follow-up questions about the following article content:
            
            {content[:1500]}
            
            Questions:
            """
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                            "max_tokens": 200
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    questions_text = result.get("response", "").strip()
                    # Split by newlines and clean up
                    questions = [q.strip().lstrip("1234567890.- ") for q in questions_text.split("\n") if q.strip()]
                    return questions[:5]  # Limit to 5 questions
                else:
                    return []
                    
        except Exception as e:
            print(f"Follow-up questions generation failed: {e}")
            return []

# Global AI service instance
ai_service = AIService()
