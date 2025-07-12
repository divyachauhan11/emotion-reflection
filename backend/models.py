from pydantic import BaseModel, Field
from typing import Optional

class EmotionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="User's emotional reflection text")

class EmotionResponse(BaseModel):
    emotion: str = Field(..., description="Detected emotion")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    message: Optional[str] = Field(None, description="Optional supportive message")