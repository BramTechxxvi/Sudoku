from fastapi import APIRouter

from app.services.sudoku_engine import (
    generate_puzzle
)

router = APIRouter(
    prefix="api/v1/sudoku",
    tags=["Sudoku"],
)


@router.get("/new")
def create_new_game(difficulty: str="easy"):
    puzzle = generate_puzzle(difficulty)
    return {
        "dificulty": difficulty,
        "puzzle": puzzle
    }