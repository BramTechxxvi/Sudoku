import type { GivenCells, NotesGrid, SudokuBoard } from '../types/sudoku';

// ── Board copying (never mutate React state directly) ─────────────────────

export function copyBoard(board: SudokuBoard): SudokuBoard {
  return board.map((row) => [...row]);
}

// ── Given-cells map ───────────────────────────────────────────────────────

/**
 * Build a 9×9 boolean grid where true = original puzzle clue (non-zero).
 * These cells are immutable for the lifetime of the game.
 */
export function buildGivenCells(puzzle: SudokuBoard): GivenCells {
  return puzzle.map((row) => row.map((value) => value !== 0));
}

// ── Empty notes grid ──────────────────────────────────────────────────────

export function createEmptyNotes(): NotesGrid {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>()),
  );
}

// ── Notes toggle ──────────────────────────────────────────────────────────

export function toggleNote(notes: NotesGrid, row: number, col: number, n: number): NotesGrid {
  const next = notes.map((r, ri) =>
    r.map((cell, ci) => {
      if (ri === row && ci === col) {
        const updated = new Set(cell);
        if (updated.has(n)) {
          updated.delete(n);
        } else {
          updated.add(n);
        }
        return updated;
      }
      return cell;
    }),
  );
  return next;
}

/**
 * Clear notes for a specific cell (called when a number is confirmed).
 * Also clears the same number from notes in the same row, column, and box.
 */
export function clearNotesForCell(
  notes: NotesGrid,
  row: number,
  col: number,
  confirmedNumber: number,
): NotesGrid {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  return notes.map((r, ri) =>
    r.map((cell, ci) => {
      // Clear entire cell where the number was placed
      if (ri === row && ci === col) return new Set<number>();

      // Clear the same candidate from same row / col / box peers
      const sameRow = ri === row;
      const sameCol = ci === col;
      const sameBox =
        ri >= boxRow && ri < boxRow + 3 && ci >= boxCol && ci < boxCol + 3;

      if ((sameRow || sameCol || sameBox) && cell.has(confirmedNumber)) {
        const updated = new Set(cell);
        updated.delete(confirmedNumber);
        return updated;
      }

      return cell;
    }),
  );
}

// ── Highlight helpers ─────────────────────────────────────────────────────

/** Returns true if (r, c) is in the same row, column, or 3×3 box as (row, col) */
export function isPeer(row: number, col: number, r: number, c: number): boolean {
  if (r === row && c === col) return false; // the cell itself is not its own peer here
  const sameRow = r === row;
  const sameCol = c === col;
  const sameBox =
    Math.floor(r / 3) === Math.floor(row / 3) &&
    Math.floor(c / 3) === Math.floor(col / 3);
  return sameRow || sameCol || sameBox;
}

// ── Number count ──────────────────────────────────────────────────────────

/**
 * Count how many times each digit 1–9 appears on the board.
 * Returns a map of digit → count.
 */
export function countDigits(board: SudokuBoard): Map<number, number> {
  const counts = new Map<number, number>();
  for (let d = 1; d <= 9; d++) counts.set(d, 0);
  for (const row of board) {
    for (const val of row) {
      if (val > 0) counts.set(val, (counts.get(val) ?? 0) + 1);
    }
  }
  return counts;
}

// ── Timer formatting ──────────────────────────────────────────────────────

/**
 * Format elapsed seconds as MM:SS or H:MM:SS
 */
export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

// ── Difficulty label ──────────────────────────────────────────────────────

export function difficultyLabel(d: string): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}
