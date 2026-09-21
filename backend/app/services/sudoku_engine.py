def is_valid_move(board, row: int, col: int, number: int) -> bool:
    if number in board[row]:
        return False
    
    for current_row in range(9):
        if board[current_row][col] == number:
            return False
        
    # if number in board[row][col]:
    #     pass
    return True