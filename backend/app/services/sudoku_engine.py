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



def count_solutions(board: list[list[int]])-> int:
    pass