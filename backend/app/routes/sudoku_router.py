from fastapi import APIRouter, HTTPException

from app.services.sudoku_engine import (
    generate_puzzle, make_move, is_board_valid, 
    is_complete, get_hint, solve_board
)
from app.schemas.sudoku import (
    BoardRequest, CheckResponse, Difficulty, MoveRequest, 
    HintResponse, MoveResponse, NewGameResponse, SolveResponse
)




router = APIRouter(
    prefix="/api/v1/sudoku",
    tags=["Sudoku"],
)


@router.get("/new", response_model=NewGameResponse)
def create_new_game(difficulty: Difficulty="easy"):
    puzzle = generate_puzzle(difficulty)
    return {
        "difficulty": difficulty,
        "puzzle": puzzle
    }
   

@router.post("/move", response_model=MoveResponse)
def play_move(request: MoveRequest):
    board = [
        row[:] for row in request.board
    ]
    valid = make_move(
        board, request.row, request.col, request.number
    )
    return { "valid": valid, "board": board}



@router.post("/check", response_model=CheckResponse)
def check_board(req: BoardRequest):
    valid = is_board_valid(req.board)
    complete = False
    
    if valid:
        complete = is_complete(req.board)
        
    return {
        "valid": valid,
        "complete": complete
    }


@router.post("/hint", response_model=HintResponse)
def hint(req: BoardRequest):
    result = get_hint(req.board)
    if result is None:
        return { "hint": None }
    
    row, col, number = result
    return {
        "hint": {
            "row": row,
            "col": col,
            "number": number
        }
    }



@router.post("/solve", response_model=SolveResponse)
def solve(req: BoardRequest):
    board = [ row[:] for row in req.board ]
    solved = solve_board(board)
    
    return {
        "solved": solved,
        "board": board
    }