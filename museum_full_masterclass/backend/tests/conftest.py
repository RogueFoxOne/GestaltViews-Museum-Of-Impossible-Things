import os
import importlib
import asyncio

import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# attempt to load .env from project root
load_dotenv(dotenv_path=os.path.join(os.getcwd(), '.env'), override=False)

def _import_app():
    # Try common import paths to find the FastAPI app object
    candidates = [
        ('backend.app', 'app'),
        ('app', 'app'),
        ('backend.server', 'app'),
        ('server', 'app'),
    ]
    for module_name, attr in candidates:
        try:
            m = importlib.import_module(module_name)
            if hasattr(m, attr):
                return getattr(m, attr)
        except Exception:
            continue
    raise RuntimeError('Could not import FastAPI `app`. Tried: %s' % ','.join([c[0] for c in candidates]))

@pytest.fixture(scope='session')
def anyio_backend():
    return 'asyncio'

@pytest.fixture(scope='session')
def app():
    return _import_app()

@pytest.fixture(scope='session')
def client(app):
    return TestClient(app)

@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

# Mongomock fixture for mocking MongoDB interactions; tests that require live DB should use the marker @pytest.mark.live
@pytest.fixture
def mongomock_client(monkeypatch):
    try:
        import mongomock
    except Exception:
        pytest.skip('mongomock not installed')
    client = mongomock.MongoClient()
    # attempt to patch common DatabaseService patterns
    patched = False
    try:
        from backend.services import DatabaseService
        if hasattr(DatabaseService, 'client'):
            DatabaseService.client = client
            patched = True
        if hasattr(DatabaseService, 'get_client'):
            monkeypatch.setattr(DatabaseService, 'get_client', lambda *a, **k: client)
            patched = True
    except Exception:
        try:
            import DatabaseService as DS
            if hasattr(DS, 'client'):
                DS.client = client
                patched = True
            if hasattr(DS, 'get_client'):
                monkeypatch.setattr(DS, 'get_client', lambda *a, **k: client)
                patched = True
        except Exception:
            pass
    if not patched:
        return client
    return client

@pytest.fixture
def sample_document():
    return {'_id': 'test', 'name': 'testdoc', 'value': 42}
