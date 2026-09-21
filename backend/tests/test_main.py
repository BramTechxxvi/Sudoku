from fastapi.testclient import TestClient
from app.main import app
from app.services.sudoku_engine import is_valid_move

client = TestClient(app)

def test_health_check_returns_healthy_status():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }
    
def test_valid_move_true_when_number_does_not_break_any_rule():
    board = [
        [5,3,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],
        
        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],
        
        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
    result = is_valid_move(board, row=0, col=2, number=4)
    assert result is True
    
# def test_invalid_move_returns_false_when_number_exists_on_same_row():
#     board = [
#         [5,3,0, 0,7,0, 0,0,0],
#         [6,0,0, 1,9,5, 0,0,0],
#         [0,9,8, 0,0,0, 0,6,0],
        
#         [8,0,0, 0,6,0, 0,0,3],
#         [4,0,0, 8,0,3, 0,0,1],
#         [7,0,0, 0,2,0, 0,0,6],
        
#         [0,6,0, 0,0,0, 2,8,0],
#         [0,0,0, 4,1,9, 0,0,5],
#         [0,0,0, 0,8,0, 0,7,9],
#     ]
#     result = is_valid_move(board, row=0, col=2, number=5)
#     assert result is False