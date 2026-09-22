from fastapi import APIRouter, HTTPException

from app.services.sudoku_engine import (
    generate_puzzle
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