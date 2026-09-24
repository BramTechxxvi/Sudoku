import type { NotesGrid, PersistedGame } from '../types/sudoku';





const STORAGE_KEY = 'sudoku_game_v1';

function serialiseNotes(notes: NotesGrid): number[][][] {
  return notes.map((row) => row.map((cell) => Array.from(cell)));
}

function deserialiseNotes(raw: number[][][]): NotesGrid {
  return raw.map((row) => row.map((cell) => new Set(cell)));
}

export function saveGame(game: Omit<PersistedGame, 'savedAt' | 'notes'> & { notes: NotesGrid }): void {
  try {
    const payload: PersistedGame = {
      ...game,
      notes: serialiseNotes(game.notes) as unknown as number[][][],
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[storage] Could not save game:', err);
  }
}


export interface LoadedGame extends Omit<PersistedGame, 'notes'> {
  notes: NotesGrid;
}

export function loadGame(): LoadedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedGame;

    if (
      !Array.isArray(parsed.board) ||
      !Array.isArray(parsed.initialBoard) ||
      !Array.isArray(parsed.givenCells) ||
      !parsed.difficulty ||
      typeof parsed.elapsedTime !== 'number'
    ) {
      console.warn('[storage] Saved game has invalid shape, discarding.');
      clearGame();
      return null;
    }

    if (
      parsed.board.length !== 9 ||
      parsed.board.some((r) => !Array.isArray(r) || r.length !== 9)
    ) {
      console.warn('[storage] Saved board is malformed, discarding.');
      clearGame();
      return null;
    }

    return {
      ...parsed,
      notes: deserialiseNotes(parsed.notes as unknown as number[][][]),
    };
  } catch (err) {
    console.warn('[storage] Could not load game:', err);
    clearGame();
    return null;
  }
}


export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
