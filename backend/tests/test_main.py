from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_returns_healthy_status():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }
    
def test_valid_move_true_when_numbr_does_not_break_any_rule():
    board = [
        [5,3,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],
        
        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],
        
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]