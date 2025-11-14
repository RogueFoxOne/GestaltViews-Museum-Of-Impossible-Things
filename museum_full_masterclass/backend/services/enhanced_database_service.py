# services/enhanced_database_service.py
"""
Enhanced Database Service with Consciousness-Serving Storage
Extends your original DatabaseService with consciousness metrics
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Dict, Any
import os
from datetime import datetime
import logging

# Import your original for base functionality
from .DatabaseService import DatabaseService as OriginalDatabaseService

logger = logging.getLogger(__name__)

class EnhancedDatabaseService(OriginalDatabaseService):
    """Enhanced database service with consciousness-serving capabilities"""
    
    def __init__(self, mongo_url: str, db_name: str):
        super().__init__(mongo_url, db_name)
        
        # Additional collections for consciousness-serving features
        self.consciousness_metrics = self.db.consciousness_metrics
        self.plk_profiles = self.db.plk_profiles
        self.bucket_drops = self.db.bucket_drops
        self.session_data = self.db.session_data
        
        logger.info("🧠 Enhanced Database Service with consciousness-serving storage initialized")
    
    async def store_consciousness_metrics(
        self, 
        exhibit_name: str, 
        metrics: Dict[str, Any], 
        session_id: Optional[str] = None
    ):
        """Store consciousness-serving metrics"""
        
        document = {
            'exhibit_name': exhibit_name,
            'metrics': metrics,
            'session_id': session_id,
            'timestamp': datetime.utcnow(),
            'consciousness_serving': True
        }
        
        try:
            await self.consciousness_metrics.insert_one(document)
            logger.debug(f"Stored consciousness metrics for {exhibit_name}")
        except Exception as e:
            logger.error(f"Failed to store consciousness metrics: {e}")
    
    async def store_plk_profile(
        self, 
        user_id: str, 
        plk_data: Dict[str, Any]
    ):
        """Store Personal Language Key profile"""
        
        document = {
            'user_id': user_id,
            'plk_data': plk_data,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        try:
            await self.plk_profiles.replace_one(
                {'user_id': user_id}, 
                document, 
                upsert=True
            )
            logger.debug(f"Stored PLK profile for user {user_id}")
        except Exception as e:
            logger.error(f"Failed to store PLK profile: {e}")
    
    async def capture_bucket_drop(
        self, 
        content: str, 
        exhibit_name: str, 
        session_id: Optional[str] = None
    ):
        """Capture precious bucket drop insights"""
        
        document = {
            'content': content,
            'exhibit_name': exhibit_name,
            'session_id': session_id,
            'timestamp': datetime.utcnow(),
            'bucket_drop': True,  # Sacred designation
            'consciousness_spark': True
        }
        
        try:
            result = await self.bucket_drops.insert_one(document)
            logger.info(f"🪣 Bucket drop captured! ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Failed to capture bucket drop: {e}")
            return None
    
    async def get_consciousness_analytics(
        self, 
        exhibit_name: Optional[str] = None,
        days_back: int = 30
    ) -> Dict[str, Any]:
        """Get consciousness-serving analytics"""
        
        try:
            from_date = datetime.utcnow() - timedelta(days=days_back)
            
            pipeline = [
                {'$match': {
                    'timestamp': {'$gte': from_date},
                    **({'exhibit_name': exhibit_name} if exhibit_name else {})
                }},
                {'$group': {
                    '_id': '$exhibit_name',
                    'interaction_count': {'$sum': 1},
                    'avg_consciousness_score': {'$avg': '$metrics.consciousness_score'},
                    'total_bucket_drops': {'$sum': {'$cond': [{'$eq': ['$bucket_drop', True]}, 1, 0]}}
                }}
            ]
            
            results = await self.consciousness_metrics.aggregate(pipeline).to_list(None)
            
            return {
                'analytics': results,
                'period_days': days_back,
                'consciousness_serving': True
            }
        except Exception as e:
            logger.error(f"Failed to get consciousness analytics: {e}")
            return {'error': str(e)}

# Enhanced exhibit model with consciousness fields
class EnhancedExhibit(BaseModel):
    """Enhanced exhibit model with consciousness-serving fields"""
    
    # Original fields from your exhibit-5.py
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
    
    # NEW: Consciousness-serving fields
    consciousness_features: Optional[List[str]] = []
    plk_compatibility: Optional[str] = "high"  # how well it works with PLK
    neurodivergent_optimization: Optional[List[str]] = []
    bucket_drop_support: Optional[bool] = True
    exhibit_personality: Optional[str] = None
    consciousness_score: Optional[float] = None
    
    class Config:
        populate_by_name = True
