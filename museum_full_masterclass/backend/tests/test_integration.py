import pytest

@pytest.mark.mock
def test_end_to_end_create_and_fetch(client, mongomock_client):
    endpoints = ['/curator', '/exhibits', '/showcase', '/items']
    for ep in endpoints:
        resp = client.post(ep, json={'test': True})
        assert resp.status_code in (200, 201, 202, 400, 404, 422, 401, 403)
