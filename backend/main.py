from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import random
import re
from models import EmotionRequest, EmotionResponse

app = FastAPI(
    title="Emotion Reflection API",
    description="A simple API for emotion analysis",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock emotion analysis data
EMOTION_PATTERNS = {
    "anxious": {
        "keywords": ["nervous", "worried", "anxious", "scared", "afraid", "stress", "panic"],
        "messages": [
            "It's natural to feel anxious about new experiences.",
            "Remember that anxiety often comes before growth.",
            "Take deep breaths and trust in your abilities."
        ]
    },
    "excited": {
        "keywords": ["excited", "thrilled", "happy", "amazing", "wonderful", "great", "fantastic"],
        "messages": [
            "Your excitement is contagious!",
            "It's wonderful to feel this positive energy.",
            "Channel this excitement into positive action."
        ]
    },
    "sad": {
        "keywords": ["sad", "upset", "disappointed", "down", "depressed", "hurt", "lonely"],
        "messages": [
            "It's okay to feel sad sometimes.",
            "These feelings are valid and temporary.",
            "Consider reaching out to someone you trust."
        ]
    },
    "confident": {
        "keywords": ["confident", "ready", "prepared", "strong", "capable", "determined"],
        "messages": [
            "Your confidence is inspiring!",
            "Trust in your preparation and abilities.",
            "You've got this!"
        ]
    },
    "overwhelmed": {
        "keywords": ["overwhelmed", "too much", "can't handle", "exhausted", "tired", "burned out"],
        "messages": [
            "It's important to take breaks when feeling overwhelmed.",
            "Consider breaking tasks into smaller, manageable pieces.",
            "Remember that it's okay to ask for help."
        ]
    },
    "neutral": {
        "keywords": [],
        "messages": [
            "Thank you for sharing your reflection.",
            "Every emotion is valid and worth exploring.",
            "Take time to sit with these feelings."
        ]
    }
}

def analyze_emotion(text: str) -> tuple[str, float, str]:
    """
    Mock emotion analysis based on keyword matching
    Returns: (emotion, confidence, message)
    """
    text_lower = text.lower()
    
    # Find matching emotions
    matches = []
    for emotion, data in EMOTION_PATTERNS.items():
        if emotion == "neutral":
            continue
        
        keyword_matches = sum(1 for keyword in data["keywords"] if keyword in text_lower)
        if keyword_matches > 0:
            matches.append((emotion, keyword_matches, data["messages"]))
    
    if not matches:
        # Default to neutral
        emotion = "neutral"
        confidence = round(random.uniform(0.6, 0.8), 2)
        message = random.choice(EMOTION_PATTERNS["neutral"]["messages"])
    else:
        # Select emotion with most keyword matches
        matches.sort(key=lambda x: x[1], reverse=True)
        emotion = matches[0][0]
        # Higher confidence for more matches
        base_confidence = 0.7 + (matches[0][1] * 0.05)
        confidence = round(min(base_confidence + random.uniform(-0.1, 0.1), 0.95), 2)
        message = random.choice(matches[0][2])
    
    return emotion.title(), confidence, message

@app.get("/")
async def root():
    return {"message": "Emotion Reflection API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

@app.post("/analyze", response_model=EmotionResponse)
async def analyze_text_emotion(request: EmotionRequest):
    """
    Analyze emotion from text input
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Simulate processing time
        import time
        time.sleep(0.5)
        
        emotion, confidence, message = analyze_emotion(request.text)
        
        return EmotionResponse(
            emotion=emotion,
            confidence=confidence,
            message=message
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)