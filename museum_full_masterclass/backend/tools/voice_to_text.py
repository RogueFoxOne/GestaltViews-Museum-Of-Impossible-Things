"""voice_to_text.py (shim)
This module provides a simple interface for voice-to-text with fallbacks.
It attempts to use the `speech_recognition` package if available, otherwise a helpful
offline stub is provided and instructions are logged for the developer.
API:
  - transcribe_wav_bytes(wav_bytes) -> str
"""
import io, wave, os, logging
try:
    import speech_recognition as sr
    SR_AVAILABLE = True
except Exception:
    SR_AVAILABLE = False
def transcribe_wav_bytes(wav_bytes):
    if SR_AVAILABLE:
        r = sr.Recognizer()
        with io.BytesIO(wav_bytes) as bio:
            with wave.open(bio, 'rb') as wf:
                # speech_recognition expects a file-like object; write to temp file
                tmp = '/tmp/symbio_temp.wav'
                with open(tmp, 'wb') as t:
                    t.write(wav_bytes)
                with sr.AudioFile(tmp) as source:
                    audio = r.record(source)
                    return r.recognize_google(audio)
    else:
        logging.warning("speech_recognition not installed. Returning placeholder text. See README for install instructions.")
        return "[VOICE-TO-TEXT PLACEHOLDER] Please install 'speechrecognition' and an audio backend or enable a cloud STT provider."
