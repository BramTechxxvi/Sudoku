import { useEffect } from 'react';
import type { CellCoord, GivenCells } from '../types/sudoku';

interface UseKeyboardControlsOptions {
  selectedCell: CellCoord | null;
  givenCells: GivenCells;
  gameStarted: boolean;
  isComplete: boolean;
  isSolved: boolean;
  onSelectCell: (coord: CellCoord) => void;
  onEnterNumber: (n: number) => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  onEscape: () => void;
}

/**
 * Attaches global keydown listeners for keyboard-driven Sudoku play.
 *
 * 1–9        → enter number in selected cell
 * 0 / Backspace / Delete → erase selected cell
 * Arrow keys → move selection
 * N          → toggle notes mode
 * H          → request hint
 * Escape     → clear selection / close modal
 */
export function useKeyboardControls({
  selectedCell,
  givenCells,
  gameStarted,
  isComplete,
  isSolved,
  onSelectCell,
  onEnterNumber,
  onErase,
  onToggleNotes,
  onHint,
  onEscape,
}: UseKeyboardControlsOptions): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is inside an input/textarea/select/button
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (!gameStarted) return;

      const { key } = e;

      // ── Escape ─────────────────────────────────────────────────────
      if (key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }

      // ── Notes toggle ───────────────────────────────────────────────
      if (key === 'n' || key === 'N') {
        e.preventDefault();
        onToggleNotes();
        return;
      }

      // ── Hint ───────────────────────────────────────────────────────
      if (key === 'h' || key === 'H') {
        if (!isComplete && !isSolved) {
          e.preventDefault();
          onHint();
        }
        return;
      }

      // ── Arrow navigation ───────────────────────────────────────────
      if (
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight'
      ) {
        e.preventDefault();
        const current = selectedCell ?? { row: 0, col: 0 };
        let { row, col } = current;

        if (key === 'ArrowUp')    row = Math.max(0, row - 1);
        if (key === 'ArrowDown')  row = Math.min(8, row + 1);
        if (key === 'ArrowLeft')  col = Math.max(0, col - 1);
        if (key === 'ArrowRight') col = Math.min(8, col + 1);

        onSelectCell({ row, col });
        return;
      }

      // ── Number entry or erase ──────────────────────────────────────
      if (!selectedCell) return;
      const { row, col } = selectedCell;
      if (givenCells[row]?.[col]) return; // immutable given cell

      if (isComplete || isSolved) return;

      if (key === 'Backspace' || key === 'Delete' || key === '0') {
        e.preventDefault();
        onErase();
        return;
      }

      const digit = parseInt(key, 10);
      if (!isNaN(digit) && digit >= 1 && digit <= 9) {
        e.preventDefault();
        onEnterNumber(digit);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedCell,
    givenCells,
    gameStarted,
    isComplete,
    isSolved,
    onSelectCell,
    onEnterNumber,
    onErase,
    onToggleNotes,
    onHint,
    onEscape,
  ]);
}
