// ── Core domain types ──────────────────────────────────────────────────────

export type SudokuBoard = number[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellCoord {
  row: number;
  col: number;
}

export interface Hint {
  row: number;
  col: number;
  number: number;
}

// ── API response shapes (match backend contract exactly) ───────────────────

export interface NewGameResponse {
  difficulty: Difficulty;
  puzzle: SudokuBoard;
}

export interface MoveResponse {
  valid: boolean;
  board: SudokuBoard;
}

export interface CheckResponse {
  valid: boolean;
  complete: boolean;
}

export interface HintResponse {
  hint: Hint | null;
}

export interface SolveResponse {
  solved: boolean;
  board: SudokuBoard;
}

// ── UI state types ─────────────────────────────────────────────────────────

/** A 9×9 grid of sets — each cell holds candidate note numbers */
export type NotesGrid = Set<number>[][];

/** Which cells are "given" (provided by the puzzle, immutable) */
export type GivenCells = boolean[][];

export type CellState =
  | 'given'        // original puzzle clue — immutable
  | 'user'         // value entered by the player
  | 'hint'         // value filled in via hint
  | 'solved'       // value filled by the solve endpoint
  | 'empty';       // no value

export interface StatusMessage {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// ── Persisted game snapshot (localStorage) ────────────────────────────────

export interface PersistedGame {
  board: SudokuBoard;
  initialBoard: SudokuBoard;
  givenCells: GivenCells;
  difficulty: Difficulty;
  elapsedTime: number;
  mistakes: number;
  hintsUsed: number;
  /** Notes serialised as number[][] per cell (Set is not JSON-serialisable) */
  notes: number[][][];
  savedAt: number; // Unix ms
}

// ── Game hook state shape ─────────────────────────────────────────────────

export interface GameState {
  board: SudokuBoard;
  initialBoard: SudokuBoard;
  givenCells: GivenCells;
  difficulty: Difficulty;
  selectedCell: CellCoord | null;
  mistakes: number;
  hintsUsed: number;
  notesMode: boolean;
  notes: NotesGrid;
  history: SudokuBoard[];
  loading: boolean;
  hintLoading: boolean;
  solveLoading: boolean;
  error: string | null;
  isComplete: boolean;
  isSolved: boolean;       // revealed via /solve
  gameStarted: boolean;
  timerRunning: boolean;
  invalidCell: CellCoord | null;   // cell to animate as invalid
  hintCell: CellCoord | null;      // cell to animate as hint
  statusMessages: StatusMessage[];
}
