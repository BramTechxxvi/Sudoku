import random


def is_valid_move(board, row: int, col: int, number: int) -> bool:
    if number in board[row]:
        return False
    
    for current_row in range(9):
        if board[current_row][col] == number:
            return False
    
    box_start_row = (row // 3) * 3
    box_start_col = (col // 3) * 3
    
    for current_row in range(box_start_row, box_start_row+3):
        for current_col in range(box_start_col, box_start_col+3):
            if board[current_row][current_col] == number:
                return False
            
    return True


def find_empty_cell(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                return row, col
    
    return None




def is_board_valid(board: list[list[int]]) -> bool:
    for row in range(9):
        for col in range(9):
            number = board[row][col]
            if number == 0:
                continue
            
            board[row][col] = 0

            if not is_valid_move(board, row, col, number):
             
                board[row][col] = number
                return False

          
            board[row][col] = number

    return True



def solve_board(board: list[list[int]]) -> bool:
    if not is_board_valid(board):
        return False
    return _solve_board(board)



def _solve_board(board: list[list[int]]) -> bool:
    empty_cell = find_empty_cell(board)

    if empty_cell is None:
        return True

    row, col = empty_cell

    for number in range(1, 10):
        if is_valid_move(board, row, col, number):
            board[row][col] = number
            
            if _solve_board(board):
                return True
            board[row][col] = 0
    return False



def count_solutions(board: list[list[int]], limit: int | None = None)-> int:
    if not is_board_valid(board):
        return 0
    
    return _count_solutions(board, limit)


def _count_solutions(board: list[list[int]], limit: int | None = None) -> int:
    empty_cell = find_empty_cell(board)
    if empty_cell is None:
        return 1
    
    row, col = empty_cell
    solutions_count = 0
    
    for number in range(1,10):
        if is_valid_move(board, row, col, number):
            board[row][col] = number
            remaining_limit = None
            
            if limit is not None:
                remaining_limit = limit - solutions_count
        
            solutions_count += _count_solutions(board, remaining_limit)
            board[row][col] = 0
            
            if(limit is not None and solutions_count >= limit):
                return solutions_count
        
    return solutions_count



def generate_complete_board()-> list[list[int]]:
    board = [
        [0 for _ in range(9)]
        for _ in range(9)
    ]
    _fill_board_randomly(board)
    return board


def _fill_board_randomly(board: list[list[int]]):
    empty_cell = find_empty_cell(board)
    
    if empty_cell is None:
        return True
    
    row, col = empty_cell
    numbers = list(range(1,10))
    random.shuffle(numbers)
    
    for number in numbers:
        if is_valid_move(board, row, col, number):
            board[row][col] = number
            
            if _fill_board_randomly(board):
                return True
            
            board[row][col] = 0
            
    return False

    

def create_puzzle(board: list[list[int]], difficulty: str) -> list[list[int]]:
    cells_to_remove = {
        "easy": 35,
        "medium": 45,
        "hard": 50,
    }
    if difficulty not in cells_to_remove:
        raise ValueError(f"Invalid difficulty: {difficulty}")
    
    puzzle = [row[:] for row in board]
    target = cells_to_remove[difficulty]

    cells = [(row, col) for row in range(9) for col in range(9)]
    random.shuffle(cells)

    removed = 0

    for row, col in cells:
        if removed >= target:
            break

        original_number = puzzle[row][col]

        puzzle[row][col] = 0

        if count_solutions(puzzle, limit=2) == 1:
            removed += 1
        else:
            puzzle[row][col] = original_number

    return puzzle



def generate_puzzle(difficulty: str) -> list[list[int]]:
    settings = get_difficulty_settings(difficulty)

    board = generate_complete_board()

    puzzle = create_puzzle(
        board,
        settings["cells_to_remove"]
    )

    return puzzle



def make_move(board: list[list[int]], row: int, col: int, number: int) -> bool:
    if number == 0:
        board[row][col] = 0
        return True

    if is_valid_move(board, row, col, number):
        board[row][col] = number
        return True

    return False

