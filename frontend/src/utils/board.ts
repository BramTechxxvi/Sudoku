import type { GivenCells, NotesGrid, SudokuBoard } from '../types/sudoku';



export function copyBoard(board: SudokuBoard): SudokuBoard {
  return board.map((row) => [...row]);
}

export function buildGivenCells(puzzle: SudokuBoard): GivenCells {
  return puzzle.map((row) => row.map((value) => value !== 0));
}

export function createEmptyNotes(): NotesGrid {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>()),
  );
}

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
      if (ri === row && ci === col) return new Set<number>();

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


export function isPeer(row: number, col: number, r: number, c: number): boolean {
  if (r === row && c === col) return false; 
  const sameRow = r === row;
  const sameCol = c === col;
  const sameBox =
    Math.floor(r / 3) === Math.floor(row / 3) &&
    Math.floor(c / 3) === Math.floor(col / 3);
  return sameRow || sameCol || sameBox;
}



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



export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}


export function difficultyLabel(d: string): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}
