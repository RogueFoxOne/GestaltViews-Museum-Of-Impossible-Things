from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix='/exhibits/musical-dna')

MONGO_URI = os.getenv('MONGO_URI') or 'mongodb://localhost:27017/museum'
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()

class Track(BaseModel):
    track_id: str
    tempo: float = None
    danceability: float = None
    energy: float = None
    valence: float = None
    key: int = None

class MusicalDNAIn(BaseModel):
    user_id: str
    source: str
    tracks: list[Track]

@router.post('/ingest')
async def ingest_dna(payload: MusicalDNAIn):
    doc = payload.dict()
    doc['created_at'] = datetime.utcnow()
    res = await db.musical_dna.insert_one(doc)
    return {'inserted_id': str(res.inserted_id)}
