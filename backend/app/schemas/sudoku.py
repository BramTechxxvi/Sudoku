from pydantic import BaseModel


class BoardRequest(BaseModel):
    board: list[list[int]]
    
    
    
class MoveRequest(BaseModel):
    board: list[list[int]]
    row: int
    col: int
    number: int
    
    
class HintRequest(BaseModel):
    row: int
    col: int
    number: int