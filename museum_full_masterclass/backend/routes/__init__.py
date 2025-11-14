# backend/routes/__init__.py
# Museum of Impossible Things - Routes Package
# Central export file for all FastAPI routers

from .showcase_routes import router as showcase_router
# CORRECTED: Imports 'router' and aliases it correctly to 'billys_room_router'
from .billys_room_routes import router as billys_room_router
from .musical_dna_routes import router as musical_dna_router
from .alzheimers_legacy_routes import router as alzheimers_legacy_router
from .brain_sparks_routes import router as brain_sparks_router
from .curator_routes import router as curator_router
from .exhibits_routes import router as exhibits_router
from .adhd_power_up_routes import router as adhd_power_up_router
from .spotify_routes import router as spotify_router

__all__ = [
    "showcase_router",
    # CORRECTED: Exports the correct alias
    "billys_room_router",
    "musical_dna_router",
    "alzheimers_legacy_router",
    "brain_sparks_router",
    "curator_router",
    "exhibits_router",
    "adhd_power_up_router",
    "spotify_router",
]
