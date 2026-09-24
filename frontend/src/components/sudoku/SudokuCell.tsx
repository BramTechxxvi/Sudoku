import { memo } from 'react';
import type { CellCoord, GivenCells, NotesGrid } from '../../types/sudoku';
import { isPeer } from '../../utils/board';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  givenCells: GivenCells;
  selectedCell: CellCoord | null;
  invalidCell: CellCoord | null;
  hintCell: CellCoord | null;
  notes: NotesGrid;
  highlightNumber: number; // the value in the selected cell (for same-number highlight)
  onSelect: (coord: CellCoord) => void;
}

function SudokuCellInner({
  row,
  col,
  value,
  givenCells,
  selectedCell,
  invalidCell,
  hintCell,
  notes,
  highlightNumber,
  onSelect,
}: SudokuCellProps) {
  const isGiven = givenCells[row][col];
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isInvalid = invalidCell?.row === row && invalidCell?.col === col;
  const isHint = hintCell?.row === row && hintCell?.col === col;
  const cellNotes = notes[row][col];
  const hasNotes = cellNotes.size > 0 && value === 0;

  // Peer highlight: same row / col / box as selected
  const isPeerCell =
    selectedCell !== null &&
    !isSelected &&
    isPeer(selectedCell.row, selectedCell.col, row, col);

  // Same-number highlight
  const isSameNumber =
    !isSelected &&
    highlightNumber > 0 &&
    value === highlightNumber;

  // ── Border logic: thicker borders create visible 3×3 box separators ──────
  // Top border
  const borderTop =
    row === 0
      ? 'border-t-2 border-t-slate-700'
      : row % 3 === 0
      ? 'border-t-2 border-t-slate-500'
      : 'border-t border-t-slate-200';
  // Left border
  const borderLeft =
    col === 0
      ? 'border-l-2 border-l-slate-700'
      : col % 3 === 0
      ? 'border-l-2 border-l-slate-500'
      : 'border-l border-l-slate-200';
  // Right border (only rightmost column)
  const borderRight = col === 8 ? 'border-r-2 border-r-slate-700' : '';
  // Bottom border (only bottom row)
  const borderBottom = row === 8 ? 'border-b-2 border-b-slate-700' : '';

  // ── Background ────────────────────────────────────────────────────────────
  let bg = 'bg-white';
  if (isSelected) {
    bg = 'bg-blue-100';
  } else if (isHint) {
    bg = 'animate-hint-pulse';
  } else if (isSameNumber) {
    bg = 'bg-blue-50';
  } else if (isPeerCell) {
    bg = 'bg-slate-50';
  }

  // ── Text color ────────────────────────────────────────────────────────────
  let textColor = 'text-slate-800';
  if (isGiven) {
    textColor = 'text-slate-900';
  } else if (isHint) {
    textColor = 'text-amber-600';
  } else if (value > 0) {
    textColor = 'text-blue-600';
  }

  // ── Font weight ───────────────────────────────────────────────────────────
  const fontWeight = isGiven ? 'font-semibold' : 'font-medium';

  // ── Invalid animation ─────────────────────────────────────────────────────
  const shakeClass = isInvalid ? 'animate-shake bg-red-100' : '';

  // ── Aria label ────────────────────────────────────────────────────────────
  const ariaLabel = (() => {
    const pos = `Row ${row + 1}, Column ${col + 1}`;
    if (value > 0) return `${pos}, value ${value}${isGiven ? ', given' : ''}`;
    if (hasNotes) return `${pos}, notes ${Array.from(cellNotes).join(' ')}`;
    return `${pos}, empty`;
  })();

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      aria-readonly={isGiven}
      onClick={() => onSelect({ row, col })}
      className={[
        // Layout
        'relative flex items-center justify-center',
        'w-full h-full select-none',
        // Border
        borderTop,
        borderLeft,
        borderRight,
        borderBottom,
        // Background
        bg,
        shakeClass,
        // Cursor
        isGiven ? 'cursor-default' : 'cursor-pointer',
        // Focus ring (keyboard navigation)
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
        // Hover for editable cells
        !isGiven && !isSelected ? 'hover:bg-blue-50' : '',
        'transition-colors duration-100',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value > 0 ? (
        <span
          className={[
            'text-[clamp(14px,3.5vw,22px)] leading-none',
            fontWeight,
            textColor,
          ].join(' ')}
        >
          {value}
        </span>
      ) : hasNotes ? (
        // 3×3 mini-grid of candidate notes
        <span className="grid grid-cols-3 grid-rows-3 w-full h-full p-[2px] gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className={[
                'flex items-center justify-center',
                'text-[clamp(7px,1.2vw,10px)] leading-none',
                cellNotes.has(n) ? 'text-blue-500 font-medium' : 'text-transparent',
              ].join(' ')}
            >
              {n}
            </span>
          ))}
        </span>
      ) : null}

      {/* Selected cell ring overlay */}
      {isSelected && (
        <span
          className="pointer-events-none absolute inset-0 ring-2 ring-blue-500 ring-inset"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export const SudokuCell = memo(SudokuCellInner);
