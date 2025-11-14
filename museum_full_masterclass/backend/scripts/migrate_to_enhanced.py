# scripts/migrate_to_enhanced.py
"""
Migration script to transition from legacy to enhanced architecture
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any

# Import both old and new services
from services.DatabaseService import DatabaseService as OldDatabaseService
from services.enhanced_database_service import EnhancedDatabaseService
from services.AICuratorService import AICuratorService as OldAICurator
from services.enhanced_ai_curator import EnhancedAICuratorService

logger = logging.getLogger(__name__)

async def migrate_exhibits_to_enhanced():
    """Migrate existing exhibits to enhanced format with consciousness fields"""
    
    old_db = OldDatabaseService("mongodb://localhost:27017", "museum_portfolio")
    new_db = EnhancedDatabaseService("mongodb://localhost:27017", "museum_enhanced")
    
    try:
        # Get existing exhibits
        old_exhibits = await old_db.get_all_exhibits()
        
        enhanced_exhibits = []
        for exhibit in old_exhibits:
            # Add consciousness-serving fields
            enhanced_exhibit = {
                **exhibit,
                'consciousness_features': [
                    'GestaltView foundation integration',
                    'Personal Language Key compatibility',
                    'Neurodivergent communication support'
                ],
                'plk_compatibility': 'high',
                'neurodivergent_optimization': [
                    'ADHD-friendly interface',
                    'Bucket drop support',
                    'Energy level adaptation'
                ],
                'bucket_drop_support': True,
                'exhibit_personality': determine_exhibit_personality(exhibit['title']),
                'consciousness_score': 0.85,  # Default high consciousness score
                'updated_at': datetime.utcnow()
            }
            enhanced_exhibits.append(enhanced_exhibit)
        
        # Store enhanced exhibits
        await new_db.seed_exhibits(enhanced_exhibits)
        
        logger.info(f"✅ Migrated {len(enhanced_exhibits)} exhibits to enhanced format")
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
    finally:
        await old_db.close()
        await new_db.close()

def determine_exhibit_personality(title: str) -> str:
    """Determine consciousness-serving personality for exhibit"""
    
    title_lower = title.lower()
    
    if 'vibe' in title_lower or 'code' in title_lower:
        return 'metaphorical_code_translator'
    elif 'resume' in title_lower:
        return 'authentic_career_amplifier'
    elif 'symbio' in title_lower:
        return 'symbiotic_development_partner'
    elif 'adhd' in title_lower:
        return 'neurodivergent_excellence_catalyst'
    else:
        return 'consciousness_serving_companion'

async def test_enhanced_services():
    """Test enhanced services functionality"""
    
    # Test enhanced database
    db = EnhancedDatabaseService("mongodb://localhost:27017", "museum_enhanced")
    
    # Test consciousness metrics storage
    await db.store_consciousness_metrics(
        exhibit_name="vibecoder",
        metrics={
            'consciousness_score': 0.89,
            'plk_resonance': 0.92,
            'bucket_drops_captured': 3
        },
        session_id="test_session_123"
    )
    
    # Test bucket drop capture
    bucket_drop_id = await db.capture_bucket_drop(
        content="This is a test bucket drop - a lightning bolt insight!",
        exhibit_name="brain-sparks",
        session_id="test_session_123"
    )
    
    logger.info(f"✅ Test bucket drop captured: {bucket_drop_id}")
    
    # Test enhanced AI curator
    curator = EnhancedAICuratorService(use_ai=True)
    
    greeting = await curator.generate_consciousness_greeting({
        'first_visit': True,
        'interests': ['consciousness', 'neurodivergent technology']
    })
    
    logger.info(f"✅ Enhanced curator greeting: {greeting}")
    
    await db.close()

if __name__ == "__main__":
    import asyncio
    
    logging.basicConfig(level=logging.INFO)
    
    async def main():
        logger.info("🚀 Starting migration to enhanced consciousness-serving architecture")
        
        await migrate_exhibits_to_enhanced()
        await test_enhanced_services()
        
        logger.info("✅ Migration completed successfully")
    
    asyncio.run(main())
