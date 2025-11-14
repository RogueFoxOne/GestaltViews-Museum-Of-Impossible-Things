"""stt_adapter.py
Adapter layer that supports:
  - Cloud providers via HTTP (AssemblyAI, Deepgram, OpenAI) using API keys in env
  - Local Whisper (via whisper package or subprocess to whisper.cpp)
Usage:
  from stt_adapter import transcribe_file_bytes
  text = transcribe_file_bytes(audio_bytes, provider='auto'|'assemblyai'|'openai'|'whisper_local')
"""
import os
import io
import tempfile
import subprocess
import logging
from abc import ABC, abstractmethod
from typing import Optional

# Setup logger
logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Base Transcriber Interface ---
class Transcriber(ABC):
    """Abstract base class for transcription providers."""
    
    @abstractmethod
    def transcribe(self, audio_bytes: bytes) -> str:
        """Transcribes audio bytes and returns the text."""
        pass

# --- Provider-Specific Implementations ---

class OpenAITranscriber(Transcriber):
    """Transcribes using OpenAI's API."""
    def __init__(self, api_key: str):
        import requests
        self.api_key = api_key
        self.requests = requests

    def transcribe(self, audio_bytes: bytes) -> str:
        files = {'file': ('audio.wav', audio_bytes)}
        headers = {'Authorization': f'Bearer {self.api_key}'}
        try:
            r = self.requests.post('https://api.openai.com/v1/audio/transcriptions', headers=headers, files=files, data={"model": "whisper-1"})
            r.raise_for_status()
            return r.json().get('text', '')
        except self.requests.RequestException as e:
            logger.error(f"OpenAI transcription error: {e}")
            raise ConnectionError("Failed to connect to OpenAI API") from e

class WhisperLocalTranscriber(Transcriber):
    """Transcribes using the local Whisper package or whisper.cpp CLI."""
    def transcribe(self, audio_bytes: bytes) -> str:
        # 1. Try whisper package first
        try:
            import whisper
            import numpy as np
            
            model = whisper.load_model(os.getenv('WHISPER_MODEL', 'base'))
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tf:
                tf.write(audio_bytes)
                tf.seek(0)
                result = model.transcribe(tf.name)
                return result.get('text', '')
        except ImportError:
            logger.warning("Whisper package not found, falling back to CLI.")
        except Exception as e:
            logger.warning(f"Whisper package failed: {e}, falling back to CLI.")

        # 2. Fallback to whisper.cpp CLI
        try:
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tf:
                tf.write(audio_bytes)
                tf.seek(0)
                # Use --language auto and --output-txt to get clean text output
                command = ['whisper', tf.name, '--model', os.getenv('WHISPER_MODEL', 'base'), '-l', 'auto', '-otxt']
                subprocess.run(command, check=True, capture_output=True, text=True)
                
                # The output file will be named tf.name + ".txt"
                with open(f"{tf.name}.txt", 'r', encoding='utf-8') as out_file:
                    return out_file.read().strip()
        except (FileNotFoundError, subprocess.CalledProcessError) as e:
            raise RuntimeError(f"Local whisper execution failed. Ensure 'whisper' is in your PATH. Error: {e}")

class PlaceholderTranscriber(Transcriber):
    """A fallback that returns a placeholder message."""
    def transcribe(self, audio_bytes: bytes) -> str:
        logger.warning("No STT providers configured. Returning placeholder.")
        return "[VOICE-TO-TEXT PLACEHOLDER] Please configure a speech-to-text provider."

# --- Factory and Main Function ---

def get_transcriber(provider: str) -> Transcriber:
    """Factory function to get the appropriate transcriber instance."""
    if provider is None:
        provider = 'auto'
    provider = provider.lower()
    
    if provider == 'auto':
        if key := os.getenv('OPENAI_API_KEY'):
            return OpenAITranscriber(key)
        # Add other cloud providers here with elif
        # ...
        else:
            return WhisperLocalTranscriber()

    if provider == 'openai':
        if key := os.getenv('OPENAI_API_KEY'):
            return OpenAITranscriber(key)
        raise ValueError("OPENAI_API_KEY not set for OpenAI provider.")
    
    if provider == 'whisper_local':
        return WhisperLocalTranscriber()
        
    # Default fallback
    return PlaceholderTranscriber()

def transcribe_file_bytes(b: bytes, provider: str = 'auto', **kwargs) -> str:
    """
    High-level function to transcribe audio bytes using a specified provider.
    
    Args:
        b: The audio data in bytes.
        provider: 'auto', 'openai', or 'whisper_local'.
    
    Returns:
        The transcribed text as a string.
    """
    try:
        transcriber = get_transcriber(provider)
        return transcriber.transcribe(b)
    except (RuntimeError, ValueError, ConnectionError) as e:
        logger.error(f"Transcription failed for provider '{provider}': {e}")
        return "[TRANSCRIPTION ERROR] See logs for details."
