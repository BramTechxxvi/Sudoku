from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


BOARD = [
    [5, 3, 0, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],

    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],

    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
]

BASE_URL = "/api/v1/sudoku"

def test_new_game_returns_generated_puzzle():
    response = client.get(f"{BASE_URL}/new", params={"difficulty": "easy"})
    assert response.status_code == 200
    
    data = response.json()
    assert data["difficulty"] == "easy"
    assert "puzzle" in data
    
    assert len(data["puzzle"]) == 9
    for row in data["puzzle"]:
        assert len(row) == 9
        
        
        
def test_new_game_rejects_invalid_difficulty():
    response = client.get(f"{BASE_URL}/new", params={"difficulty": "insame"})
    assert response.status_code == 422
    
    

def test_make_valid_move():
    response = client.post(
        f"{BASE_URL}/move", 
        json={"board": BOARD, "row": 0, "col": 2, "number": 4})
    
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["board"][0][2] == 4 
    
    

def test_check_incomplete_board():
    response = client.post(
        f"{BASE_URL}/check", 
        json={"board": BOARD})
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["valid"] is True
    assert data["complete"] is False
    
    
    
def test_hint_returns_hint():
    response = client.post(
        f"{BASE_URL}/hint",
        json={ "board": BOARD, }
    )
    assert response.status_code == 200
    data = response.json()
    
    assert data["hint"] == {
        "row": 0,
        "col": 2,
        "number": 4

    }
    
    
    
def test_solve_returns_solved_board():
    response = client.post(
        f"{BASE_URL}/solve",
        json= { "board": BOARD, }
    )
    assert response.status_code == 200
    
    data = response.json()
    assert data["solved"] is True
    assert data["board"][0][2] == 4
    
    
    
    
def test_move_rejects_row_above_eight():
    response = client.post(
        f"{BASE_URL}/move",
        json={
            "board": BOARD,
            "row": 9,
            "col": 2,
            "number": 4,
        }
    )

    assert response.status_code == 422



def test_move_rejects_negative_column():
    response = client.post(
        f"{BASE_URL}/move",
        json={
            "board": BOARD,
            "row": 0,
            "col": -1,
            "number": 4,
        }
    )

    assert response.status_code == 422


def test_move_rejects_number_above_nine():
    response = client.post(
        f"{BASE_URL}/move",
        json={
            "board": BOARD,
            "row": 0,
            "col": 2,
            "number": 10,
        }
    )

    assert response.status_code == 422
    
    
    
def test_check_rejects_board_with_less_than_nine_rows():
    invalid_board = BOARD[:8]

    response = client.post(
        f"{BASE_URL}/check",
        json={
            "board": invalid_board
        }
    )

    assert response.status_code == 422


def test_check_rejects_board_with_less_than_nine_columns():
    invalid_board = [
        row[:] for row in BOARD
    ]

    invalid_board[0] = invalid_board[0][:8]

    response = client.post(
        f"{BASE_URL}/check",
        json={
            "board": invalid_board
        }
    )

    assert response.status_code == 422
    
    

def test_check_rejects_board_with_less_than_nine_rows():
    invalid_board = BOARD[:8]

    response = client.post(
        f"{BASE_URL}/check",
        json={
            "board": invalid_board
        }
    )

    assert response.status_code == 422


def test_check_rejects_board_with_less_than_nine_columns():
    invalid_board = [
        row[:] for row in BOARD
    ]

    invalid_board[0] = invalid_board[0][:8]

    response = client.post(
        f"{BASE_URL}/check",
        json={
            "board": invalid_board
        }
    )

    assert response.status_code == 422