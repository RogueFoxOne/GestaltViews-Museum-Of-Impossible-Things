"""GestaltView.integrations.vibe_voice_adapter
Adapter for Vibe Voice - text-to-speech and voice cloning helpers.
Functions:
  - synthesize(text, voice=None) -> bytes (audio WAV/MP3)
"""
import os, logging, tempfile, subprocess
try:
    import requests
except Exception:
    requests = None
def synthesize(text, voice=None):
    # Prefer cloud Vibe Voice API if credentials present
    api_key = os.getenv('VIBE_API_KEY')
    api_url = os.getenv('VIBE_API_URL')
    if api_key and api_url and requests:
        headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
        r = requests.post(api_url + '/synthesize', headers=headers, json={'text': text, 'voice': voice})
        if r.status_code >= 400:
            raise RuntimeError('Vibe API error: %s' % r.text)
        return r.content
    # Fallback: try a local TTS CLI (e.g., `vibe` or `tts` command)
    try:
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tf:
            subprocess.check_output(['vibe','speak', '--output', tf.name, '--voice', voice or 'v1', '--text', text])
            with open(tf.name,'rb') as f:
                return f.read()
    except Exception as e:
        logging.warning('Local Vibe CLI not available or failed: %s', e)
    raise RuntimeError('No Vibe Voice integration available. Set VIBE_API_KEY/VIBE_API_URL or install vibe CLI.')
