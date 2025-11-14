"""
═══════════════════════════════════════════════════════════════════
    MUSEUM OF IMPOSSIBLE THINGS - Backend API
    Consciousness-Serving AI Platform (with Sentry.io Monitoring)
    
    Built by Keith Soyka
    "Iteration is Liberation"
    "Scars became code"
═══════════════════════════════════════════════════════════════════
"""

import os
import sys
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

# ═══════════════════════════════════════════════════════════════════
# SENTRY.IO INITIALIZATION (Before everything else)
# ═══════════════════════════════════════════════════════════════════

SENTRY_DSN = os.getenv(
    "SENTRY_DSN",
    "https://384437d447abb3d7eaa88f33b318d4fa@o4510243109208064.ingest.us.sentry.io/4510243156721664"
)
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")

# Initialize Sentry with comprehensive monitoring
sentry_sdk.init(
    dsn=SENTRY_DSN,
    environment=ENVIRONMENT,
    
    # Integrations for FastAPI, Starlette, and Logging
    integrations=[
        FastApiIntegration(transaction_style="endpoint"),
        StarletteIntegration(transaction_style="endpoint"),
        LoggingIntegration(
            level=logging.INFO,        # Capture info and above
            event_level=logging.ERROR  # Send errors as events
        ),
    ],
    
    # Performance Monitoring
    traces_sample_rate=1.0 if ENVIRONMENT == "development" else 0.1,  # 100% dev, 10% prod
    
    # Profiling
    profiles_sample_rate=1.0 if ENVIRONMENT == "development" else 0.1,
    
    # Send PII (Personally Identifiable Information) for better debugging
    send_default_pii=True,
    
    # Additional context
    attach_stacktrace=True,
    
    # Release tracking (use git commit hash in production)
    release=os.getenv("GIT_COMMIT_SHA", "museum-backend@1.0.0"),
    
    # Custom tags for filtering in Sentry dashboard
    before_send=lambda event, hint: add_custom_context(event, hint),
)

def add_custom_context(event, hint):
    """Add custom context to Sentry events"""
    event.setdefault("tags", {})
    event["tags"]["founder"] = "Keith Soyka"
    event["tags"]["project"] = "Museum of Impossible Things"
    event["tags"]["consciousness_serving"] = "true"
    return event

logger = logging.getLogger(__name__)
logger.info("🔍 Sentry.io monitoring initialized")

# ═══════════════════════════════════════════════════════════════════
# ENVIRONMENT CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

PORT = int(os.getenv("PORT", 8000))

# MongoDB Atlas connection
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "museum")

# CORS origins (Vercel + localhost + GitHub Codespaces)
CORS_ORIGINS_STR = os.getenv(
    "CORS_ORIGINS",
    "https://museum-of-impossible-things-portfolio.vercel.app,http://localhost:3000,https://69hv644.github.dev"
)
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_STR.split(",")]

# ═══════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════

class ConsciousnessRequest(BaseModel):
    message: str
    exhibit: Optional[str] = "general"
    context: Optional[Dict[str, Any]] = {}

class SpotifyTokenRequest(BaseModel):
    code: str

# ═══════════════════════════════════════════════════════════════════
# APPLICATION LIFECYCLE (STARTUP/SHUTDOWN)
# ═══════════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages application lifecycle with proper MongoDB connection handling.
    Ensures graceful startup and shutdown with Sentry tracking.
    """
    # ═══ STARTUP ═══
    with sentry_sdk.start_transaction(op="app.startup", name="Museum Startup"):
        logger.info("╔════════════════════════════════════════════════════╗")
        logger.info("║  Museum of Impossible Things - Starting up...     ║")
        logger.info("╚════════════════════════════════════════════════════╝")
        logger.info(f"🌍 Environment: {ENVIRONMENT}")
        logger.info(f"🔌 Port: {PORT}")
        logger.info(f"🔗 CORS Origins: {CORS_ORIGINS}")
        
        try:
            # Validate MongoDB URI
            if not MONGODB_URI:
                raise ValueError("❌ MONGODB_URI environment variable is not set!")
            
            logger.info(f"🔌 Connecting to MongoDB Atlas: {DATABASE_NAME}...")
            
            # Initialize MongoDB client with production-grade settings
            app.mongodb_client = AsyncIOMotorClient(
                MONGODB_URI,
                serverSelectionTimeoutMS=15000,
                connectTimeoutMS=15000,
                socketTimeoutMS=60000,
                maxPoolSize=10,
                minPoolSize=2,
                retryWrites=True,
                w='majority'
            )
            
            app.mongodb = app.mongodb_client[DATABASE_NAME]
            
            # Test the connection with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    await app.mongodb.command("ping")
                    logger.info(f"✅ MongoDB Atlas connected successfully: {DATABASE_NAME}")
                    sentry_sdk.set_context("database", {
                        "status": "connected",
                        "name": DATABASE_NAME,
                        "provider": "MongoDB Atlas"
                    })
                    break
                except Exception as e:
                    if attempt < max_retries - 1:
                        logger.warning(f"⚠️  MongoDB connection attempt {attempt + 1} failed, retrying...")
                    else:
                        sentry_sdk.capture_exception(e)
                        raise
            
            # Log available collections
            try:
                collections = await app.mongodb.list_collection_names()
                logger.info(f"📊 Available collections: {', '.join(collections) if collections else 'None (new database)'}")
            except Exception as e:
                logger.warning(f"⚠️  Could not list collections: {e}")
                sentry_sdk.capture_message("Collection listing failed", level="warning")
            
            logger.info("🚀 Application startup complete!")
            
        except Exception as e:
            logger.error(f"❌ CRITICAL: MongoDB connection failed: {e}")
            sentry_sdk.capture_exception(e)
            raise
    
    yield  # Application is running
    
    # ═══ SHUTDOWN ═══
    logger.info("🛑 Shutting down gracefully...")
    try:
        app.mongodb_client.close()
        logger.info("✅ MongoDB connection closed successfully")
    except Exception as e:
        logger.error(f"⚠️  Error during shutdown: {e}")
        sentry_sdk.capture_exception(e)

# ═══════════════════════════════════════════════════════════════════
# FASTAPI APPLICATION INITIALIZATION
# ═══════════════════════════════════════════════════════════════════

app = FastAPI(
    title="Museum of Impossible Things API",
    description="Consciousness-Serving AI Platform by Keith Soyka",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ═══════════════════════════════════════════════════════════════════
# MIDDLEWARE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    max_age=3600,
)

# Request logging middleware with Sentry breadcrumbs
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests with Sentry breadcrumbs"""
    start_time = datetime.utcnow()
    
    # Add breadcrumb for request tracking
    sentry_sdk.add_breadcrumb(
        category="http",
        message=f"{request.method} {request.url.path}",
        level="info",
        data={
            "method": request.method,
            "url": str(request.url),
            "client": request.client.host if request.client else "Unknown"
        }
    )
    
    logger.info(f"🔵 {request.method} {request.url.path} - Client: {request.client.host if request.client else 'Unknown'}")
    
    try:
        response = await call_next(request)
        
        duration = (datetime.utcnow() - start_time).total_seconds()
        logger.info(f"✅ {request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration:.3f}s")
        
        # Add performance metrics to Sentry
        sentry_sdk.set_measurement("response_time", duration, unit="second")
        
        return response
    except Exception as e:
        logger.error(f"❌ {request.method} {request.url.path} - Error: {str(e)}")
        sentry_sdk.capture_exception(e)
        raise

# ═══════════════════════════════════════════════════════════════════
# HEALTH CHECK ENDPOINT
# ═══════════════════════════════════════════════════════════════════

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint with Sentry tracking"""
    try:
        # Test MongoDB connection
        await app.mongodb.command("ping")
        
        try:
            collections = await app.mongodb.list_collection_names()
            collection_count = len(collections)
        except:
            collection_count = 0
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": ENVIRONMENT,
            "port": PORT,
            "database": {
                "status": "connected",
                "name": DATABASE_NAME,
                "collections": collection_count
            },
            "monitoring": {
                "sentry": "active",
                "traces": "enabled"
            },
            "consciousness_serving": True,
            "founder": "Keith Soyka",
            "motto": "Iteration is Liberation"
        }
    except Exception as e:
        logger.error(f"❌ Health check failed: {e}")
        sentry_sdk.capture_exception(e)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
                "database": {"status": "disconnected"}
            }
        )

# ═══════════════════════════════════════════════════════════════════
# SENTRY DEBUG ENDPOINT (Development Only)
# ═══════════════════════════════════════════════════════════════════

@app.get("/sentry-debug", tags=["System"], include_in_schema=(ENVIRONMENT == "development"))
async def trigger_sentry_error():
    """
    Test endpoint to verify Sentry is working.
    Only available in development environment.
    """
    if ENVIRONMENT == "production":
        raise HTTPException(
            status_code=403,
            detail="Debug endpoint disabled in production"
        )
    
    logger.info("🔍 Triggering test error for Sentry")
    sentry_sdk.capture_message("This is a test message from Museum of Impossible Things", level="info")
    
    # Intentional error for testing
    division_by_zero = 1 / 0

# ═══════════════════════════════════════════════════════════════════
# ROOT ENDPOINT
# ═══════════════════════════════════════════════════════════════════

@app.get("/", tags=["System"])
async def root():
    """Welcome endpoint"""
    return {
        "message": "Museum of Impossible Things API",
        "tagline": "Where the impossible becomes possible through consciousness-serving AI",
        "status": "running",
        "version": "1.0.0",
        "built_by": "Keith Soyka",
        "philosophy": "Scars became code",
        "environment": ENVIRONMENT,
        "monitoring": "Sentry.io",
        "endpoints": {
            "documentation": "/docs",
            "alternative_docs": "/redoc",
            "health_check": "/health",
            "exhibits": "/api/exhibits"
        },
        "consciousness_serving": True
    }

# ═══════════════════════════════════════════════════════════════════
# API ROUTES - EXHIBITS
# ═══════════════════════════════════════════════════════════════════

@app.get("/api/exhibits", tags=["Exhibits"])
async def get_all_exhibits():
    """Fetch all museum exhibits from MongoDB"""
    with sentry_sdk.start_span(op="db.query", description="Fetch all exhibits"):
        try:
            logger.info("📚 Fetching all exhibits...")
            
            exhibits_collection = app.mongodb.exhibits
            exhibits_cursor = exhibits_collection.find().limit(100)
            exhibits = await exhibits_cursor.to_list(length=100)
            
            # Convert ObjectId to string
            for exhibit in exhibits:
                if "_id" in exhibit:
                    exhibit["_id"] = str(exhibit["_id"])
            
            logger.info(f"✅ Retrieved {len(exhibits)} exhibits")
            sentry_sdk.set_tag("exhibits_count", len(exhibits))
            
            return {
                "exhibits": exhibits,
                "count": len(exhibits),
                "consciousness_serving": True,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"❌ Error fetching exhibits: {e}")
            sentry_sdk.capture_exception(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch exhibits: {str(e)}"
            )

@app.get("/api/exhibits/{slug}", tags=["Exhibits"])
async def get_exhibit_by_slug(slug: str):
    """Fetch a single exhibit by slug"""
    with sentry_sdk.start_span(op="db.query", description=f"Fetch exhibit: {slug}"):
        try:
            logger.info(f"🔍 Fetching exhibit: {slug}")
            sentry_sdk.set_tag("exhibit_slug", slug)
            
            exhibits_collection = app.mongodb.exhibits
            exhibit = await exhibits_collection.find_one({"slug": slug})
            
            if not exhibit:
                logger.warning(f"⚠️  Exhibit not found: {slug}")
                sentry_sdk.capture_message(f"Exhibit not found: {slug}", level="warning")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Exhibit '{slug}' not found in the Museum"
                )
            
            if "_id" in exhibit:
                exhibit["_id"] = str(exhibit["_id"])
            
            logger.info(f"✅ Retrieved exhibit: {exhibit.get('title', slug)}")
            
            # Increment view count
            try:
                await exhibits_collection.update_one(
                    {"slug": slug},
                    {
                        "$inc": {"viewCount": 1},
                        "$set": {"lastViewed": datetime.utcnow()}
                    }
                )
            except:
                pass
            
            return exhibit
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error fetching exhibit '{slug}': {e}")
            sentry_sdk.capture_exception(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch exhibit: {str(e)}"
            )

# ═══════════════════════════════════════════════════════════════════
# API ROUTES - CONSCIOUSNESS AI (PLACEHOLDER)
# ═══════════════════════════════════════════════════════════════════

@app.post("/api/consciousness/chat", tags=["Consciousness AI"])
async def consciousness_chat(request: ConsciousnessRequest):
    """Consciousness-serving AI chat endpoint"""
    with sentry_sdk.start_span(op="ai.inference", description="Consciousness chat"):
        try:
            logger.info(f"🧠 Consciousness chat: {request.message[:50]}...")
            sentry_sdk.set_context("consciousness_request", {
                "exhibit": request.exhibit,
                "message_length": len(request.message)
            })
            
            return {
                "response": f"This is a consciousness-serving response to: {request.message}",
                "exhibit": request.exhibit,
                "consciousness_resonance": 0.95,
                "plk_score": 0.92,
                "status": "placeholder",
                "message": "Full AI integration coming soon",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"❌ Chat error: {e}")
            sentry_sdk.capture_exception(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

# ═══════════════════════════════════════════════════════════════════
# API ROUTES - SPOTIFY INTEGRATION
# ═══════════════════════════════════════════════════════════════════

@app.post("/api/spotify/token", tags=["Spotify"])
async def exchange_spotify_token(request: SpotifyTokenRequest):
    """Exchange Spotify authorization code for access token"""
    with sentry_sdk.start_span(op="http.client", description="Spotify token exchange"):
        try:
            import httpx
            from urllib.parse import urlencode
            
            logger.info("🎵 Exchanging Spotify code...")
            
            SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
            SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
            SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
            
            if not all([SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI]):
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Spotify credentials not configured"
                )
            
            auth_data = {
                "grant_type": "authorization_code",
                "code": request.code,
                "redirect_uri": SPOTIFY_REDIRECT_URI,
                "client_id": SPOTIFY_CLIENT_ID,
                "client_secret": SPOTIFY_CLIENT_SECRET
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://accounts.spotify.com/api/token",
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                    data=urlencode(auth_data)
                )
                response.raise_for_status()
                
                logger.info("✅ Spotify token exchange successful")
                return response.json()
                
        except httpx.HTTPStatusError as e:
            error_details = e.response.json()
            logger.error(f"❌ Spotify error: {error_details}")
            sentry_sdk.capture_exception(e)
            raise HTTPException(
                status_code=e.response.status_code,
                detail=error_details.get("error_description", "Spotify auth failed")
            )
        except Exception as e:
            logger.error(f"❌ Spotify error: {e}")
            sentry_sdk.capture_exception(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

# ═══════════════════════════════════════════════════════════════════
# INCLUDE EXHIBIT ROUTERS (OPTIONAL)
# ═══════════════════════════════════════════════════════════════════

try:
    from routes import (
        showcase_router,
        billys_room_router,
        musical_dna_router,
        alzheimers_legacy_router,
        brain_sparks_router,
        curator_router,
        exhibits_router,
        adhd_power_up_router,
        spotify_router,
    )
    
    logger.info("📦 Including exhibit routers...")
    
    app.include_router(spotify_router, prefix="/api/spotify", tags=["Spotify Integration"])
    app.include_router(adhd_power_up_router, prefix="/api/adhd-power-up", tags=["ADHD Power-Up"])
    app.include_router(alzheimers_legacy_router, prefix="/api/alzheimers-legacy", tags=["Alzheimer's Legacy"])
    app.include_router(billys_room_router, prefix="/api/billys-room", tags=["Billy's Room"])
    app.include_router(brain_sparks_router, prefix="/api/brain-sparks", tags=["Brain Sparks"])
    app.include_router(curator_router, prefix="/api/curator", tags=["AI Curator"])
    app.include_router(exhibits_router, prefix="/api/exhibits-extended", tags=["Extended Exhibits"])
    app.include_router(musical_dna_router, prefix="/api/musical-dna", tags=["Musical DNA"])
    app.include_router(showcase_router, prefix="/api/showcase", tags=["Showcase"])
    
    logger.info("✅ All routers registered")
    
except ImportError as e:
    logger.warning(f"⚠️ Routes not imported: {e}")
    sentry_sdk.capture_message("Routes not fully loaded", level="info")

# ═══════════════════════════════════════════════════════════════════
# ERROR HANDLERS
# ═══════════════════════════════════════════════════════════════════

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    """Custom 404 handler"""
    sentry_sdk.capture_message(f"404: {request.url.path}", level="info")
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The impossible thing you're looking for doesn't exist... yet.",
            "path": str(request.url.path),
            "consciousness_serving": False
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception):
    """Custom 500 handler"""
    logger.error(f"❌ Internal error: {exc}")
    sentry_sdk.capture_exception(exc)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "Something impossible happened. We're investigating.",
            "consciousness_serving": False,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# ═══════════════════════════════════════════════════════════════════
# RUN SERVER (LOCAL DEVELOPMENT)
# ═══════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    logger.info(f"🚀 Starting Museum of Impossible Things on port {PORT}...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=(ENVIRONMENT == "development"),
        log_level="info"
    )
