from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_new_game_returns_generated_puzzle():
    response = client.get("/api/v1/sudoku/new", params={"difficulty": "easy"})
    assert response.status_code == 200
    data = response.json()
    assert data["difficulty"] == "easy"
    assert "puzzle" in data
    assert len(data["puzzle"]) == 9
    
    for row in data["puzzle"]:
        assert len(row) == 9