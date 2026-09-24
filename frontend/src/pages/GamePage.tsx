import { useCallback, useState } from 'react';
import { CompletionModal } from '../components/sudoku/CompletionModal';
import { ConfirmDialog } from '../components/sudoku/ConfirmDialog';
import { DifficultySelector } from '../components/sudoku/DifficultySelector';
import { GameControls } from '../components/sudoku/GameControls';
import { GameHeader } from '../components/sudoku/GameHeader';
import { GameStatus } from '../components/sudoku/GameStatus';
import { NumberPad } from '../components/sudoku/NumberPad';
import { SudokuBoard } from '../components/sudoku/SudokuBoard';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useSudokuGame } from '../hooks/useSudokuGame';
import type { Difficulty } from '../types/sudoku';





type DialogKind = 'newGame' | 'solve' | null;

interface DialogState {
  kind: DialogKind;
  pendingDifficulty?: Difficulty;
}


export function GamePage() {
  const {
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
  } = useSudokuGame();

  const [dialog, setDialog] = useState<DialogState>({ kind: null });
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const {
    board,
    givenCells,
    selectedCell,
    invalidCell,
    hintCell,
    notes,
    notesMode,
    difficulty,
    mistakes,
    hintsUsed,
    loading,
    hintLoading,
    solveLoading,
    isComplete,
    isSolved,
    gameStarted,
    history,
    statusMessages,
  } = state;


  const handleNewGameRequest = useCallback(
    (d: Difficulty) => {
      setSelectedDifficulty(d);
      if (gameStarted && !isComplete && !isSolved) {
        setDialog({ kind: 'newGame', pendingDifficulty: d });
      } else {
        void startNewGame(d);
      }
    },
    [gameStarted, isComplete, isSolved, startNewGame],
  );

  const handleConfirmNewGame = useCallback(() => {
    setDialog({ kind: null });
    void startNewGame(dialog.pendingDifficulty ?? selectedDifficulty);
  }, [dialog.pendingDifficulty, selectedDifficulty, startNewGame]);

  const handleSolveRequest = useCallback(() => {
    setDialog({ kind: 'solve' });
  }, []);

  const handleConfirmSolve = useCallback(() => {
    setDialog({ kind: null });
    void requestSolve();
  }, [requestSolve]);

  const handleCancelDialog = useCallback(() => {
    setDialog({ kind: null });
  }, []);


  const handleCompletionNewGame = useCallback(() => {
    void startNewGame(difficulty);
  }, [startNewGame, difficulty]);

  const handlePlayAgain = useCallback(() => {
    void startNewGame(difficulty);
  }, [startNewGame, difficulty]);


  const handleEscape = useCallback(() => {
    if (dialog.kind !== null) {
      setDialog({ kind: null });
      return;
    }
    selectCell(null);
  }, [dialog.kind, selectCell]);


  useKeyboardControls({
    selectedCell,
    givenCells,
    gameStarted,
    isComplete,
    isSolved,
    onSelectCell: selectCell,
    onEnterNumber: (n) => void enterNumber(n),
    onErase: () => void eraseCell(),
    onToggleNotes: toggleNotes,
    onHint: () => void requestHint(),
    onEscape: handleEscape,
  });


  const controlsDisabled = loading || isComplete || isSolved;
  const canUndo = history.length > 0;


  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <header className="py-6 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sudoku</h1>
        <p className="mt-1 text-sm text-slate-400 font-medium tracking-wide">
          Focus. Think. Solve.
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-10 gap-4">
        <div
          className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-slate-100
                     flex flex-col gap-5 p-6"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <DifficultySelector
              current={selectedDifficulty}
              onChange={handleNewGameRequest}
              disabled={loading || solveLoading}
            />
            <button
              type="button"
              onClick={() => handleNewGameRequest(selectedDifficulty)}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200
                         bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300
                         transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              New Game
            </button>
          </div>

          <GameHeader
            difficulty={difficulty}
            elapsed={elapsed}
            mistakes={mistakes}
            loading={loading}
          />

          <SudokuBoard
            board={board}
            givenCells={givenCells}
            selectedCell={selectedCell}
            invalidCell={invalidCell}
            hintCell={hintCell}
            notes={notes}
            onSelectCell={selectCell}
            loading={loading}
          />

          {loading && (
            <p className="text-center text-sm text-slate-400 -mt-2" aria-live="polite">
              Generating puzzle…
            </p>
          )}

          {isSolved && !isComplete && (
            <p className="text-center text-sm text-slate-500 font-medium">
              Puzzle solved.
            </p>
          )}

          <NumberPad
            board={board}
            onNumber={(n) => void enterNumber(n)}
            disabled={controlsDisabled || !selectedCell || (selectedCell !== null && givenCells[selectedCell.row]?.[selectedCell.col])}
          />

          <GameControls
            notesMode={notesMode}
            canUndo={canUndo}
            hintLoading={hintLoading}
            solveLoading={solveLoading}
            disabled={controlsDisabled}
            onUndo={undo}
            onErase={() => void eraseCell()}
            onToggleNotes={toggleNotes}
            onHint={() => void requestHint()}
            onSolve={handleSolveRequest}
          />

          <GameStatus messages={statusMessages} onDismiss={dismissStatus} />

          <p className="text-xs text-slate-300 text-center leading-relaxed">
            Arrows to navigate&nbsp;&nbsp;·&nbsp;&nbsp;N for notes&nbsp;&nbsp;·&nbsp;&nbsp;H for hint&nbsp;&nbsp;·&nbsp;&nbsp;Backspace to erase
          </p>
        </div>
      </main>


      {isComplete && (
        <CompletionModal
          difficulty={difficulty}
          elapsed={elapsed}
          mistakes={mistakes}
          hintsUsed={hintsUsed}
          onNewGame={handleCompletionNewGame}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {dialog.kind === 'newGame' && (
        <ConfirmDialog
          title="Start a new game?"
          message="Your current progress will be lost."
          confirmLabel="Start New Game"
          cancelLabel="Keep Playing"
          onConfirm={handleConfirmNewGame}
          onCancel={handleCancelDialog}
        />
      )}

      {dialog.kind === 'solve' && (
        <ConfirmDialog
          title="Reveal the solution?"
          message="This will show the complete answer and end the current game."
          confirmLabel="Reveal Solution"
          cancelLabel="Cancel"
          confirmDanger
          onConfirm={handleConfirmSolve}
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}
