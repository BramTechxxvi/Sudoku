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
    board: SudokuBoard
    
    
    
class MoveRequest(BoardRequest):
    row: int = Field(ge=0,le=8)
    col: int = Field(ge=0,le=8)
    number: int = Field(ge=0, le=9)



class NewGameResponse(BaseModel):
    difficulty: Difficulty
    puzzle: SudokuBoard
    
    
    
class MoveResponse(BaseModel):
    valid: bool
    board: SudokuBoard
    
    
    
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
    board: SudokuBoard