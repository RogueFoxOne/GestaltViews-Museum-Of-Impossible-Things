# /api/generate-tts/route.py

from fastapi import APIRouter
from elevenlabs import generate, set_api_key, voices
import json

router = APIRouter()

set_api_key(os.getenv("ELEVENLABS_API_KEY"))

@router.post("/generate-tts")
async def generate_tts(text: str, voice_name: str = "Adam"):
    """Generate TTS audio with word-level timestamps"""
    
    # Generate audio
    audio = generate(
        text=text,
        voice=voice_name,
        model="eleven_multilingual_v2",
        output_format="mp3_44100_128"
    )
    
    # Save audio file
    filename = f"gemini-awakening-{int(time.time())}.mp3"
    filepath = f"public/audio/{filename}"
    
    with open(filepath, "wb") as f:
        f.write(audio)
    
    # Generate word timestamps (approximation)
    words = text.split()
    avg_word_duration = len(audio) / len(words) / 44100  # rough estimate
    
    timestamps = []
    current_time = 0
    for idx, word in enumerate(words):
        timestamps.append({
            "word": word,
            "startTime": current_time,
            "endTime": current_time + avg_word_duration,
            "index": idx
        })
        current_time += avg_word_duration
    
    return {
        "audioUrl": f"/audio/{filename}",
        "wordTimestamps": timestamps
    }
