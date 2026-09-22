from fastapi import APIRouter, HTTPException

from app.services.sudoku_engine import (
    generate_puzzle, make_move, is_board_valid, 
    is_complete, get_hint, solve_board
)
from app.schemas.sudoku import (
    BoardRequest, MoveRequest, HintResponse
)




router = APIRouter(
    prefix="/api/v1/sudoku",
    tags=["Sudoku"],
)


@router.get("/new")
def create_new_game(difficulty: str="easy"):
    try:
        puzzle = generate_puzzle(difficulty)
        return {
            "difficulty": difficulty,
            "puzzle": puzzle
        }
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
        

@router.post("/move")
def play_move(request: MoveRequest):
    board = [
        row[:] for row in request.board
    ]
    valid = make_move(
        board, request.row, request.col, request.number
    )
    return { "valid": valid, "board": board}



# @router.post("/check")



# @router.post("/hint")



# @router.post("/solve")