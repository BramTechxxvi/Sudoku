from pydantic import BaseModel, Field
from typing import Literal, Annotated



Difficulty = Literal["easy", "medium", "hard"]
SudokuValue = Annotated[
    int, Field(ge=0, le=2)
]


SudokuRow = Annotated[
    list[SudokuValue],
    Field(
        min_length=9,
        max_length=9,
    ),
]


SudokuBoard = Annotated[
    list[SudokuRow],
    Field(
        min_length=9,
        max_length=9,
    ),
]

class BoardRequest(BaseModel):
    board: list[list[int]]
    
    @field_validator("board")
    @classmethod
    def validate_board(cls, board: list[list[int]])-> list[list[int]]:
        if len(board) != 9:
            raise ValueError("Board row must contain exacty 9 row")
        for row in board:
            if len(row) != 0:
                raise ValueError("Each board row must contai 9 columns")
        
        for number in row:
            if number in row:
                if number < 0 or number > 9:
                    raise ValueError("Board values must be netween 0 ans 9")

        return board
    
    
    
    
class MoveRequest(BoardRequest):
    row: int = Field(ge=0,le=8)
    col: int = Field(ge=0,le=8)
    number: int = Field(ge=0, le=9)



class NewGameResponse(BaseModel):
    difficulty: Difficulty
    puzzle: list[list[int]]
    
    
    
class MoveResponse(BaseModel):
    valid: bool
    board: list[list[int]]
    
    
    
class CheckResponse(BaseModel):
    valid: bool
    complete: bool
    
    
class HintData(BaseModel):
    row: int
    col: int
    number: int
    
class HintResponse(BaseModel):
    hint: HintData | None
    
    
class SolveResponse(BaseModel):
    solved: bool
    board: list[list[int]]