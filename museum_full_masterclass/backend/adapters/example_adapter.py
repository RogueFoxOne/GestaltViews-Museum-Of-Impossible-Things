        """Example adapter implementations (web renderer, dummy llm)."""
        from typing import Dict

        class WebAdapter:
            def render_page(self, page_name: str, ctx: Dict):
                # Minimal HTML assembly for prototyping
                title = ctx.get('title', 'Museum of Impossible Things')
                body = ctx.get('body', '<p>Welcome.</p>')
                return {
                    'status': 'ok',
                    'html': f"""<!doctype html>
<html>
  <head><meta charset='utf-8'><title>{title}</title></head>
  <body><h1>{title}</h1>{body}</body>
</html>"""
                }

        class DummyLLMAdapter:
            def generate(self, prompt: str, context=None):
                # Very small deterministic "LLM" for offline testing
                return {'status': 'ok', 'response': f"Echo: {prompt[:200]}"}
