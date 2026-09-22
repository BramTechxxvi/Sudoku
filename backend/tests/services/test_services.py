import pytest
from app.services.sudoku_engine import (
    is_valid_move, find_empty_cell, is_board_valid, solve_board, 
    count_solutions, generate_complete_board, create_puzzle, 
    generate_puzzle, make_move, is_complete
)


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
    
    
def test_invalid_move_returns_false_when_number_exists_on_same_row():
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
    result = is_valid_move(board, row=0, col=2, number=5)
    assert result is False
    
    
def test_invalid_move_returns_false_when_number_exists_on_same_column():
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
    result = is_valid_move(board, row=2, col=0, number=6)
    assert result is False
    
    
def test_invalid_move_returns_false_when_number_exists_in_same_box():
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
    result = is_valid_move(board, row=7, col=6, number=8)
    assert result is False
    

def test_find_empty_cell_returns_first_empty_position():
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
    result = find_empty_cell(board)
    assert result == (0, 2)
    
    
def test_find_empty_cell_returns_None_when_board_is_full():
    board = [
        [5,3,4, 6,7,8, 9,1,2],
        [6,7,2, 1,9,5, 3,4,8],
        [1,9,8, 3,4,2, 5,6,7],

        [8,5,9, 7,6,1, 4,2,3],
        [4,2,6, 8,5,3, 7,9,1],
        [7,1,3, 9,2,4, 8,5,6],

        [9,6,1, 5,3,7, 2,8,4],
        [2,8,7, 4,1,9, 6,3,5],
        [3,4,5, 2,8,6, 1,7,9],
    ]
    result = find_empty_cell(board)
    assert result is None
    

def test_is_board_valid_returns_false_for_duplicate_in_a_row():
    board = [
        [5,5,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],

        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],

        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
    result = is_board_valid(board)
    assert result is False
    
    
def test_is_board_valid_returns_true_for_partial_board():
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
    assert is_board_valid(board) is True
    

def test_is_board_valid_returns_false_for_duplicate_in_a_column():
     board = [
        [5,3,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [5,9,8, 0,0,0, 0,6,0],

        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],

        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
     assert is_board_valid(board) is False
     
    
def test_is_board_valid_returns_false_for_duplicate_in_a_box():
    board = [
        [5,3,0, 0,7,0, 0,0,0],
        [6,8,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],

        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],

        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
    assert is_board_valid(board) is False
    
    
def test_solve_board_returns_false_for_unsolvable_board():
    board = [
        [5,5,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],

        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],

        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
    assert solve_board(board) is False
    
    
def test_solve_board_returns_false_for_invalid_board():
    board = [
        [5,5,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],

        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],

        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
    result = solve_board(board)
    assert result is False
    

def test_count_solutions_returns_one_for_completed_valid_board():
    board = [
        [5,3,4, 6,7,8, 9,1,2],
        [6,7,2, 1,9,5, 3,4,8],
        [1,9,8, 3,4,2, 5,6,7],

        [8,5,9, 7,6,1, 4,2,3],
        [4,2,6, 8,5,3, 7,9,1],
        [7,1,3, 9,2,4, 8,5,6],

        [9,6,1, 5,3,7, 2,8,4],
        [2,8,7, 4,1,9, 6,3,5],
        [3,4,5, 2,8,6, 1,7,9],
    ]
    result = count_solutions(board)
    assert result == 1


def test_count_solutions_returns_zero_for_invalid_board():
    board = [
        [5,5,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],

        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],

        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ]
    
    assert count_solutions(board) == 0
    
    
    
def test_generate_complete_board_returns_9_by_9_board():
    board = generate_complete_board()
    assert len(board) == 9
    
    for row in board:
        assert len(row) == 9
        
        
    
def test_generate_board_contains_no_empty_cells():
    board = generate_complete_board()
    
    for row in board:
        assert 0 not in row
        
        

def test_generate_complete_board_returns_valid_sudoku():
    board = generate_complete_board()
    assert is_board_valid(board) is True
    
    
    
    
def test_create_puzzle_creates_empty_cells():
    complete_board = generate_complete_board()
    puzzle = create_puzzle(complete_board, difficulty="easy")
    empty_cells = sum(row.count(0) for row in puzzle)
    assert empty_cells > 0
    
    
    
    
def test_create_puzzle_does_not_modify_original_board():
    complete_board = generate_complete_board()
    original_board = [
        row[:] for row in complete_board
    ]
    create_puzzle(complete_board, difficulty="easy")
    assert complete_board == original_board
    
    
    
def test_create_puzzle_has_unique_solution():
    complete_board = generate_complete_board()
    puzzle = create_puzzle(complete_board, difficulty="easy")
    assert count_solutions(puzzle) ==1
    
    
    
def test_create_puzzle_rjects_invalid_difficulty():
    complete_board = generate_complete_board()
    with pytest.raises(ValueError):
        create_puzzle(complete_board, difficulty="insane")
        


def test_count_solutions_stops_at_limit():
    board = [
        [5, 3, 4, 0, 0, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 0, 0],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],

        [8, 5, 9, 0, 0, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],

        [9, 6, 1, 5, 3, 7, 2, 0, 0],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]
    result = count_solutions(board, limit=2)
    assert result == 2
    
    
def test_generate_puzzle_returns_playable_puzzle():
    puzzle = generate_puzzle("easy")
    empty_cells=sum(row.count(0) for row in puzzle)
    
    assert empty_cells > 0
    assert is_board_valid(puzzle) is True
    assert count_solutions(puzzle) == 1
    
    
    
def test_generat_puzzle_raises_error_for_invalid_difficuty():
    with pytest.raises(ValueError):
        generate_puzzle("IMpossible")
        
        
        
def test_make_move_places_number_when_move_is_called():
    board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],

        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],

        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]
    result = make_move(board, row=0, col=2, number=4)
    assert result is True
    assert board[0][2] == 4
    
    

def test_make_move_returns_false_and_does_change_board_wwhen_move_is_invalid():
    board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],

        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],

        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]
    result = make_move(board, row=0, col=2, number=5)
    assert result is False
    assert board[0][2] == 0
    


def test_make_move_allows_cell_to_be_cleared():
    board = [
        [5, 3, 4, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],

        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],

        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]
    result = make_move(board, row=0 , col=2 , number=0)
    assert result is True
    assert board[0][2] == 0
    
    
    
def test_is_complete_returns_true_for_a_completed_valid_board():
    board = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],

        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],

        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]
    result = is_complete(board)
    assert result is True
    
    

def test_is_complete_returns_false_when_board_has_empty_cells():
    board = [
        [5, 3, 4, 0, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],

        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],

        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]
    assert is_complete(board) is False
    


def test_is_complete_false_for_full_invalid_board():
    pass
