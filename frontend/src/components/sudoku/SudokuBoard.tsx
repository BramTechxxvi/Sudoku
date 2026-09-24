import { memo } from 'react';
import type { CellCoord, GivenCells, NotesGrid, SudokuBoard as SudokuBoardType } from '../../types/sudoku';
import { SudokuCell } from './SudokuCell';

interface SudokuBoardProps {
  board: SudokuBoardType;
  givenCells: GivenCells;
  selectedCell: CellCoord | null;
  invalidCell: CellCoord | null;
  hintCell: CellCoord | null;
  notes: NotesGrid;
  onSelectCell: (coord: CellCoord) => void;
  loading: boolean;
}

function SudokuBoardInner({
  board,
  givenCells,
  selectedCell,
  invalidCell,
  hintCell,
  notes,
  onSelectCell,
  loading,
}: SudokuBoardProps) {
  // The number in the selected cell — used to highlight all matching digits
  const highlightNumber =
    selectedCell !== null ? board[selectedCell.row][selectedCell.col] : 0;

  if (loading) {
    return <BoardSkeleton />;
  }

  return (
    <div
      className="sudoku-board-container mx-auto"
      role="grid"
      aria-label="Sudoku board"
    >
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full">
        {board.map((row, rowIdx) =>
          row.map((_val, colIdx) => (
            <SudokuCell
              key={`${rowIdx}-${colIdx}`}
              row={rowIdx}
              col={colIdx}
              value={board[rowIdx][colIdx]}
              givenCells={givenCells}
              selectedCell={selectedCell}
              invalidCell={invalidCell}
              hintCell={hintCell}
              notes={notes}
              highlightNumber={highlightNumber}
              onSelect={onSelectCell}
            />
          )),
        )}
      </div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────

function BoardSkeleton() {
  return (
    <div
      className="sudoku-board-container mx-auto animate-skeleton"
      aria-label="Loading puzzle…"
      aria-busy="true"
    >
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full border-2 border-slate-300 rounded-sm">
        {Array.from({ length: 81 }).map((_, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;
          const borderTop =
            row === 0 ? '' : row % 3 === 0 ? 'border-t-2 border-t-slate-300' : 'border-t border-t-slate-100';
          const borderLeft =
            col === 0 ? '' : col % 3 === 0 ? 'border-l-2 border-l-slate-300' : 'border-l border-l-slate-100';
          return (
            <div
              key={i}
              className={['bg-slate-100 rounded-[1px]', borderTop, borderLeft].join(' ')}
            />
          );
        })}
      </div>
    </div>
  );
}

export const SudokuBoard = memo(SudokuBoardInner);
