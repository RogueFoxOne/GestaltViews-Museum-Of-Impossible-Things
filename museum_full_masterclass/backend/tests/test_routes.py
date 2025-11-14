import pytest

def _get_endpoints(app):
    return [r.path for r in app.routes]

def test_app_starts(app):
    assert app is not None

def test_has_routes(app):
    paths = _get_endpoints(app)
    assert isinstance(paths, list)
    assert any(p.startswith('/') for p in paths), "No routes found on the FastAPI app"

@pytest.mark.mock
def test_example_route_mock(client, mongomock_client):
    resp = client.get('/')
    assert resp.status_code in (200, 404, 307, 302, 401, 403)
