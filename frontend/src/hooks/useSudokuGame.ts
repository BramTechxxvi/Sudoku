import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  checkBoard,
  createNewGame,
  getHint,
  playMove,
  solveBoard,
} from '../services/sudokuApi';
import type {
  CellCoord,
  Difficulty,
  GameState,
  StatusMessage,
  SudokuBoard,
} from '../types/sudoku';
import {
  buildGivenCells,
  clearNotesForCell,
  copyBoard,
  createEmptyNotes,
  toggleNote,
} from '../utils/board';
import { clearGame, loadGame, saveGame } from '../utils/storage';




type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; board: SudokuBoard; difficulty: Difficulty }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SELECT_CELL'; coord: CellCoord | null }
  | { type: 'MOVE_VALID'; board: SudokuBoard; row: number; col: number; number: number }
  | { type: 'MOVE_INVALID'; row: number; col: number }
  | { type: 'CLEAR_INVALID' }
  | { type: 'BOARD_COMPLETE' }
  | { type: 'HINT_LOADING' }
  | { type: 'HINT_SUCCESS'; row: number; col: number; number: number; board: SudokuBoard }
  | { type: 'HINT_NONE' }
  | { type: 'HINT_ERROR' }
  | { type: 'CLEAR_HINT_CELL' }
  | { type: 'SOLVE_LOADING' }
  | { type: 'SOLVE_SUCCESS'; board: SudokuBoard }
  | { type: 'SOLVE_FAIL' }
  | { type: 'UNDO' }
  | { type: 'TOGGLE_NOTES' }
  | { type: 'TOGGLE_NOTE_CELL'; row: number; col: number; n: number }
  | { type: 'ADD_STATUS'; message: Omit<StatusMessage, 'id'>; id: number }
  | { type: 'REMOVE_STATUS'; id: number }
  | { type: 'RESTORE_SAVED'; partial: Partial<GameState> };



function emptyBoard(): SudokuBoard {
  return Array.from({ length: 9 }, () => Array(9).fill(0) as number[]);
}

const INITIAL_STATE: GameState = {
  board: emptyBoard(),
  initialBoard: emptyBoard(),
  givenCells: Array.from({ length: 9 }, () => Array(9).fill(false) as boolean[]),
  difficulty: 'medium',
  selectedCell: null,
  mistakes: 0,
  hintsUsed: 0,
  notesMode: false,
  notes: createEmptyNotes(),
  history: [],
  loading: false,
  hintLoading: false,
  solveLoading: false,
  error: null,
  isComplete: false,
  isSolved: false,
  gameStarted: false,
  timerRunning: false,
  invalidCell: null,
  hintCell: null,
  statusMessages: [],
};

let _statusId = 0;


function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: true,
        error: null,
        gameStarted: false,
        timerRunning: false,
        isComplete: false,
        isSolved: false,
      };

    case 'LOAD_SUCCESS': {
      const givenCells = buildGivenCells(action.board);
      return {
        ...INITIAL_STATE,
        board: action.board,
        initialBoard: copyBoard(action.board),
        givenCells,
        difficulty: action.difficulty,
        notes: createEmptyNotes(),
        history: [],
        loading: false,
        gameStarted: true,
        timerRunning: true,
        statusMessages: [],
      };
    }

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error, timerRunning: false };

    case 'SELECT_CELL':
      return { ...state, selectedCell: action.coord };

    case 'MOVE_VALID': {
      const clearedNotes =
        action.number !== 0
          ? clearNotesForCell(state.notes, action.row, action.col, action.number)
          : state.notes;
      return {
        ...state,
        board: action.board,
        notes: clearedNotes,
        history: [...state.history, copyBoard(state.board)],
        invalidCell: null,
      };
    }

    case 'MOVE_INVALID':
      return {
        ...state,
        mistakes: state.mistakes + 1,
        invalidCell: { row: action.row, col: action.col },
      };

    case 'CLEAR_INVALID':
      return { ...state, invalidCell: null };

    case 'BOARD_COMPLETE':
      return { ...state, isComplete: true, timerRunning: false, selectedCell: null };

    case 'HINT_LOADING':
      return { ...state, hintLoading: true };

    case 'HINT_SUCCESS': {
      const clearedNotes = clearNotesForCell(state.notes, action.row, action.col, action.number);
      return {
        ...state,
        board: action.board,
        notes: clearedNotes,
        history: [...state.history, copyBoard(state.board)],
        hintsUsed: state.hintsUsed + 1,
        hintLoading: false,
        hintCell: { row: action.row, col: action.col },
      };
    }

    case 'HINT_NONE':
      return { ...state, hintLoading: false };

    case 'HINT_ERROR':
      return { ...state, hintLoading: false };

    case 'CLEAR_HINT_CELL':
      return { ...state, hintCell: null };

    case 'SOLVE_LOADING':
      return { ...state, solveLoading: true };

    case 'SOLVE_SUCCESS':
      return {
        ...state,
        board: action.board,
        solveLoading: false,
        isSolved: true,
        timerRunning: false,
        selectedCell: null,
        notes: createEmptyNotes(),
        history: [],
      };

    case 'SOLVE_FAIL':
      return { ...state, solveLoading: false };

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return { ...state, board: prev, history: state.history.slice(0, -1) };
    }

    case 'TOGGLE_NOTES':
      return { ...state, notesMode: !state.notesMode };

    case 'TOGGLE_NOTE_CELL': {
      const updated = toggleNote(state.notes, action.row, action.col, action.n);
      return { ...state, notes: updated };
    }

    case 'ADD_STATUS':
      return {
        ...state,
        statusMessages: [...state.statusMessages, { ...action.message, id: action.id }],
      };

    case 'REMOVE_STATUS':
      return {
        ...state,
        statusMessages: state.statusMessages.filter((m) => m.id !== action.id),
      };

    case 'RESTORE_SAVED':
      return { ...state, ...action.partial };

    default:
      return state;
  }
}


export interface UseSudokuGameReturn {
  state: GameState;
  elapsed: number;
  startNewGame: (difficulty: Difficulty) => Promise<void>;
  selectCell: (coord: CellCoord | null) => void;
  enterNumber: (n: number) => Promise<void>;
  eraseCell: () => Promise<void>;
  requestHint: () => Promise<void>;
  requestSolve: () => Promise<void>;
  undo: () => void;
  toggleNotes: () => void;
  dismissStatus: (id: number) => void;
}


export function useSudokuGame(): UseSudokuGameReturn {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [elapsed, setElapsed] = useState(0);

  const stateRef = useRef(state);
  stateRef.current = state;

  const elapsedRef = useRef(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (initialSeconds = 0) => {
      stopTimer();
      elapsedRef.current = initialSeconds;
      setElapsed(initialSeconds);
      timerIntervalRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
      }, 1000);
    },
    [stopTimer],
  );

  useEffect(() => {
    if (!state.timerRunning) stopTimer();
  }, [state.timerRunning, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);


  const addStatus = useCallback(
    (text: string, type: StatusMessage['type'], duration = 3500) => {
      const id = ++_statusId;
      dispatch({ type: 'ADD_STATUS', message: { text, type }, id });
      setTimeout(() => dispatch({ type: 'REMOVE_STATUS', id }), duration);
    },
    [],
  );


  useEffect(() => {
    const s = stateRef.current;
    if (!s.gameStarted || s.isComplete || s.isSolved) return;
    saveGame({
      board: s.board,
      initialBoard: s.initialBoard,
      givenCells: s.givenCells,
      difficulty: s.difficulty,
      elapsedTime: elapsedRef.current,
      mistakes: s.mistakes,
      hintsUsed: s.hintsUsed,
      notes: s.notes,
    });
  }, [state.board, state.mistakes, state.hintsUsed, state.notes]);


  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const saved = loadGame();
    if (saved) {
      const givenCells = buildGivenCells(saved.initialBoard);
      dispatch({
        type: 'RESTORE_SAVED',
        partial: {
          board: saved.board,
          initialBoard: saved.initialBoard,
          givenCells,
          difficulty: saved.difficulty,
          mistakes: saved.mistakes,
          hintsUsed: saved.hintsUsed,
          notes: saved.notes,
          history: [],
          loading: false,
          gameStarted: true,
          timerRunning: true,
          isComplete: false,
          isSolved: false,
          selectedCell: null,
          statusMessages: [],
        },
      });
      startTimer(saved.elapsedTime);
    } else {
      void startNewGame('medium');
    }
  }, []);


  const startNewGame = useCallback(
    async (difficulty: Difficulty) => {
      dispatch({ type: 'LOAD_START' });
      stopTimer();
      clearGame();
      try {
        const res = await createNewGame(difficulty);
        dispatch({ type: 'LOAD_SUCCESS', board: res.puzzle, difficulty: res.difficulty });
        startTimer(0);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load a new game.';
        dispatch({ type: 'LOAD_ERROR', error: msg });
        addStatus(msg, 'error', 6000);
      }
    },
    [addStatus, startTimer, stopTimer],
  );


  const selectCell = useCallback((coord: CellCoord | null) => {
    dispatch({ type: 'SELECT_CELL', coord });
  }, []);


  const enterNumber = useCallback(
    async (n: number) => {
      const { selectedCell, board, givenCells, notesMode, isComplete, isSolved } =
        stateRef.current;
      if (!selectedCell || isComplete || isSolved) return;
      const { row, col } = selectedCell;
      if (givenCells[row]?.[col]) return;

      if (notesMode) {
        dispatch({ type: 'TOGGLE_NOTE_CELL', row, col, n });
        return;
      }

      try {
        const res = await playMove(board, row, col, n);
        if (res.valid) {
          dispatch({ type: 'MOVE_VALID', board: res.board, row, col, number: n });
          // Check completion
          const checkRes = await checkBoard(res.board);
          if (checkRes.complete) {
            dispatch({ type: 'BOARD_COMPLETE' });
            clearGame();
          }
        } else {
          dispatch({ type: 'MOVE_INVALID', row, col });
          addStatus('Invalid move.', 'error', 2000);
          setTimeout(() => dispatch({ type: 'CLEAR_INVALID' }), 400);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to submit move.';
        addStatus(msg, 'error', 5000);
      }
    },
    [addStatus],
  );


  const eraseCell = useCallback(async () => {
    const { selectedCell, board, givenCells, isComplete, isSolved } = stateRef.current;
    if (!selectedCell || isComplete || isSolved) return;
    const { row, col } = selectedCell;
    if (givenCells[row]?.[col]) return;
    if (board[row][col] === 0) return;

    try {
      const res = await playMove(board, row, col, 0);
      if (res.valid) {
        dispatch({ type: 'MOVE_VALID', board: res.board, row, col, number: 0 });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to erase cell.';
      addStatus(msg, 'error', 5000);
    }
  }, [addStatus]);


  const requestHint = useCallback(async () => {
    const { board, hintLoading, isComplete, isSolved } = stateRef.current;
    if (hintLoading || isComplete || isSolved) return;

    dispatch({ type: 'HINT_LOADING' });
    try {
      const res = await getHint(board);
      if (res.hint) {
        const { row, col, number } = res.hint;
        const moveRes = await playMove(board, row, col, number);
        dispatch({ type: 'HINT_SUCCESS', row, col, number, board: moveRes.board });
        addStatus('Hint applied.', 'success', 2500);
        setTimeout(() => dispatch({ type: 'CLEAR_HINT_CELL' }), 1800);
        const checkRes = await checkBoard(moveRes.board);
        if (checkRes.complete) {
          dispatch({ type: 'BOARD_COMPLETE' });
          clearGame();
        }
      } else {
        dispatch({ type: 'HINT_NONE' });
        addStatus('No hint available right now.', 'info', 3000);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to get hint.';
      dispatch({ type: 'HINT_ERROR' });
      addStatus(msg, 'error', 5000);
    }
  }, [addStatus]);


  const requestSolve = useCallback(async () => {
    const { board, solveLoading } = stateRef.current;
    if (solveLoading) return;

    dispatch({ type: 'SOLVE_LOADING' });
    try {
      const res = await solveBoard(board);
      if (res.solved) {
        dispatch({ type: 'SOLVE_SUCCESS', board: res.board });
        clearGame();
        addStatus('Puzzle solved.', 'info', 4000);
      } else {
        dispatch({ type: 'SOLVE_FAIL' });
        addStatus('Unable to solve the current board.', 'warning', 4000);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to solve.';
      dispatch({ type: 'SOLVE_FAIL' });
      addStatus(msg, 'error', 5000);
    }
  }, [addStatus]);


  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);


  const toggleNotes = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTES' });
  }, []);


  const dismissStatus = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_STATUS', id });
  }, []);

  return {
    state,
    elapsed,
    startNewGame,
    selectCell,
    enterNumber,
    eraseCell,
    requestHint,
    requestSolve,
    undo,
    toggleNotes,
    dismissStatus,
  };
}
