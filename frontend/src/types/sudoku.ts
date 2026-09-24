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

export type NotesGrid = Set<number>[][];

export type GivenCells = boolean[][];

export type CellState =
  | 'given'        
  | 'user'         
  | 'hint'         
  | 'solved'       
  | 'empty';       

export interface StatusMessage {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}


export interface PersistedGame {
  board: SudokuBoard;
  initialBoard: SudokuBoard;
  givenCells: GivenCells;
  difficulty: Difficulty;
  elapsedTime: number;
  mistakes: number;
  hintsUsed: number;
  notes: number[][][];
  savedAt: number;
}


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
  isSolved: boolean;       
  gameStarted: boolean;
  timerRunning: boolean;
  invalidCell: CellCoord | null;   
  hintCell: CellCoord | null;      
  statusMessages: StatusMessage[];
}
