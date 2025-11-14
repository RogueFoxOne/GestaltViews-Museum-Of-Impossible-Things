# backend/routes/spotify_routes.py
import httpx
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from urllib.parse import urlencode
import logging # Import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# These are loaded from your .env file
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

class TokenRequest(BaseModel):
    code: str

@router.post("/token")
async def get_spotify_token(request_body: TokenRequest):
    logger.info("Received request for Spotify token exchange.")
    
    if not all([SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI]):
        logger.error("Spotify credentials (ID, Secret, Redirect URI) are not configured on the server.")
        raise HTTPException(
            status_code=500, 
            detail="Server-side Spotify configuration is incomplete."
        )

    # Log the exact data being sent to Spotify for debugging
    payload = {
        'grant_type': 'authorization_code',
        'code': request_body.code,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET
    }
    logger.info(f"Sending token request to Spotify with redirect_uri: {SPOTIFY_REDIRECT_URI}")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                'https://accounts.spotify.com/api/token',
                headers={'Content-Type': 'application/x-www-form-urlencoded'},
                data=urlencode(payload)
            )
            response.raise_for_status()
            logger.info("Successfully exchanged code for Spotify token.")
            return response.json()
            
        except httpx.HTTPStatusError as e:
            # This will log the specific error message from Spotify
            error_details = e.response.json()
            logger.error(f"Spotify API Error: {error_details}")
            raise HTTPException(
                status_code=e.response.status_code, 
                detail=f"Error from Spotify: {error_details.get('error', 'Unknown Error')}: {error_details.get('error_description', 'Authentication failed.')}"
            )
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")
