from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class DatabaseService:
    def __init__(self, mongo_url: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        self.exhibits_collection = self.db.exhibits

    async def get_all_exhibits(self) -> List[dict]:
        """Get all exhibits from database"""
        try:
            cursor = self.exhibits_collection.find({})
            exhibits = await cursor.to_list(length=100)
            # Convert ObjectId to string for JSON serialization
            for exhibit in exhibits:
                if '_id' in exhibit:
                    exhibit['_id'] = str(exhibit['_id'])
            return exhibits
        except Exception as e:
            logger.error(f"Error fetching exhibits: {e}")
            return []

    async def get_exhibit_by_slug(self, slug: str) -> Optional[dict]:
        """Get single exhibit by slug"""
        try:
            exhibit = await self.exhibits_collection.find_one({"slug": slug})
            if exhibit and '_id' in exhibit:
                exhibit['_id'] = str(exhibit['_id'])
            return exhibit
        except Exception as e:
            logger.error(f"Error fetching exhibit {slug}: {e}")
            return None

    async def create_exhibit(self, exhibit_data: dict) -> dict:
        """Create new exhibit"""
        try:
            exhibit_data['created_at'] = datetime.utcnow()
            exhibit_data['updated_at'] = datetime.utcnow()
            result = await self.exhibits_collection.insert_one(exhibit_data)
            exhibit_data['_id'] = str(result.inserted_id)
            return exhibit_data
        except Exception as e:
            logger.error(f"Error creating exhibit: {e}")
            raise

    async def seed_exhibits(self, exhibits: List[dict]):
        """Seed database with initial exhibit data"""
        try:
            # Clear existing exhibits
            await self.exhibits_collection.delete_many({})
            
            # Insert new exhibits
            for exhibit in exhibits:
                exhibit['created_at'] = datetime.utcnow()
                exhibit['updated_at'] = datetime.utcnow()
            
            if exhibits:
                await self.exhibits_collection.insert_many(exhibits)
                logger.info(f"Seeded {len(exhibits)} exhibits")
        except Exception as e:
            logger.error(f"Error seeding exhibits: {e}")
            raise

    async def close(self):
        """Close database connection"""
        self.client.close()
