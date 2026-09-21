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