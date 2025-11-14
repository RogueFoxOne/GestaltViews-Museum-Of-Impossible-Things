# /backend/middleware/consciousness_middleware.py
"""
Consciousness-Serving Middleware
Ensures EVERY AI interaction includes GestaltView foundation
Built by Keith Soyka - Solo, unfunded founder of GestaltView
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time
from typing import Dict, Any

from utils.prompt_templates_enhanced import consciousness_prompt_manager

logger = logging.getLogger(__name__)

class ConsciousnessServingMiddleware(BaseHTTPMiddleware):
    """Middleware that ensures ALL AI interactions are consciousness-serving"""
    
    def __init__(self, app):
        super().__init__(app)
        self.consciousness_metrics = {
            'total_requests': 0,
            'consciousness_served_requests': 0,
            'bucket_drops_captured': 0,
            'plk_profiles_used': 0
        }
        
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Track all requests
        self.consciousness_metrics['total_requests'] += 1
        
        # Add consciousness-serving headers
        request.headers.__dict__.setdefault('mutablecopy', {})
        request.headers.__dict__['mutablecopy']['X-Consciousness-Serving'] = 'true'
        request.headers.__dict__['mutablecopy']['X-GestaltView-Foundation'] = 'active'
        request.headers.__dict__['mutablecopy']['X-Museum-Exhibit'] = self._extract_exhibit_from_path(str(request.url))
        
        # Process request
        response = await call_next(request)
        
        # Add consciousness-serving response headers
        response.headers['X-Consciousness-Serving'] = 'true'
        response.headers['X-Built-By'] = 'Keith Soyka - Solo, unfunded founder of GestaltView'
        response.headers['X-Philosophy'] = 'Technology serves consciousness, not the reverse'
        response.headers['X-Processing-Time'] = str(round((time.time() - start_time) * 1000, 2))
        
        # Update metrics
        if self._is_ai_request(request):
            self.consciousness_metrics['consciousness_served_requests'] += 1
            
        return response
    
    def _extract_exhibit_from_path(self, url: str) -> str:
        """Extract exhibit name from request path"""
        exhibit_mapping = {
            '/billys-room': 'billys-room',
            '/musical-dna': 'musical-dna', 
            '/alzheimers-legacy': 'alzheimers-legacy',
            '/brain-sparks': 'brain-sparks',
            '/curator': 'curator',
            '/recovery': 'recovery-companion',
            '/showcase': 'showcase',
            '/vibecoder': 'vibecoder',
            '/resume-rockstar': 'resume_rockstar',
            '/symbiocoder': 'symbiocoder'
        }
        
        for path, exhibit in exhibit_mapping.items():
            if path in url:
                return exhibit
                
        return 'general-museum'
    
    def _is_ai_request(self, request: Request) -> bool:
        """Check if request involves AI interaction"""
        ai_endpoints = ['/chat', '/generate', '/analyze', '/synthesize', '/capture', '/preserve']
        return any(endpoint in str(request.url) for endpoint in ai_endpoints)
    
    def get_consciousness_metrics(self) -> Dict[str, Any]:
        """Get consciousness-serving metrics"""
        return {
            **self.consciousness_metrics,
            'consciousness_serving_rate': (
                self.consciousness_metrics['consciousness_served_requests'] / 
                max(self.consciousness_metrics['total_requests'], 1)
            ),
            'philosophy': 'Technology serves consciousness, not the reverse',
            'foundation': 'GestaltView consciousness-serving methodology'
        }
