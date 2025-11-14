from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Exhibit(BaseModel):
    id: str
    slug: str
    title: str
    subtitle: str
    description: str
    longDescription: str = Field(alias="long_description")
    features: List[str]
    technologies: List[str]
    thumbnail: str
    year: str
    category: str
    color: str
    curator_note: str = Field(alias="curatorNote")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "vibecoder",
                "slug": "vibecoder-v2",
                "title": "VibeCoder v2.0",
                "subtitle": "The Metaphor Translation Chamber",
                "description": "Where chaos becomes code...",
                "long_description": "Full description...",
                "features": ["AI-Powered Chat", "Voice Input"],
                "technologies": ["React", "FastAPI"],
                "thumbnail": "https://example.com/image.jpg",
                "year": "2024",
                "category": "AI Interface",
                "color": "from-teal-500 to-green-500",
                "curator_note": "A groundbreaking interface..."
            }
        }


class ExhibitResponse(BaseModel):
    exhibits: List[Exhibit]


class CuratorGreeting(BaseModel):
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
