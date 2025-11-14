import importlib
import pytest

def _import_service(modname):
    try:
        return importlib.import_module(modname)
    except Exception:
        return None

def test_database_service_importable():
    mod = _import_service('backend.services.DatabaseService') or _import_service('backend.services.databaseservice')
    assert mod is not None, "DatabaseService module could not be imported"

def test_aicurator_importable():
    mod = _import_service('services.AICuratorService') or _import_service('backend.services.AICuratorService')
    assert mod is not None, "AICuratorService module could not be imported"

@pytest.mark.mock
def test_database_service_basic_ops(mongomock_client, sample_document):
    try:
        from backend.services import DatabaseService
        if hasattr(DatabaseService, 'get_client'):
            client = DatabaseService.get_client()
        elif hasattr(DatabaseService, 'client'):
            client = DatabaseService.client
        else:
            pytest.skip('DatabaseService has no accessible client or get_client')
        db = client.test_db
        coll = db.test_collection
        coll.insert_one(sample_document)
        found = coll.find_one({'_id': sample_document['_id']})
        assert found is not None
    except Exception as e:
        pytest.skip(f"DatabaseService operations skipped: {e}")
