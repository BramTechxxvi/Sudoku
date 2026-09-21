from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_chkeck_retrns_healthy_status(self):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }