import type {
  CheckResponse,
  Difficulty,
  HintResponse,
  MoveResponse,
  NewGameResponse,
  SolveResponse,
  SudokuBoard,
} from '../types/sudoku';

// ── Base URL validation ────────────────────────────────────────────────────

const API_BASE_URL: string = (() => {
  const url = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!url) {
    throw new Error(
      'VITE_API_BASE_URL is not set. ' +
        'Copy .env.example to .env and set VITE_API_BASE_URL.',
    );
  }
  return url.replace(/\/$/, ''); // strip trailing slash
})();

// ── FastAPI 422 detail shape ───────────────────────────────────────────────

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface FastApiErrorBody {
  detail?: string | ValidationError[];
}

// ── Reusable request helper ────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers ?? {}),
      },
    });
  } catch (networkErr) {
    console.error('[sudokuApi] Network error:', networkErr);
    throw new Error(
      'Unable to reach the game server. Please check your connection and try again.',
    );
  }

  // Parse body regardless of status so we can extract error detail
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // Body is not JSON (e.g. 502 HTML error page)
    console.error('[sudokuApi] Non-JSON response:', response.status, response.statusText);
    throw new Error(
      `Server returned an unexpected response (${response.status}). Please try again.`,
    );
  }

  if (!response.ok) {
    // Handle FastAPI 422 Unprocessable Entity
    if (response.status === 422) {
      const errorBody = body as FastApiErrorBody;
      const detail = errorBody?.detail;
      if (Array.isArray(detail)) {
        const messages = detail.map((e) => e.msg).join('; ');
        const err = new Error(`Validation error: ${messages}`);
        console.error('[sudokuApi] 422 Validation error:', detail);
        throw err;
      }
    }

    const errorBody = body as FastApiErrorBody;
    const message =
      typeof errorBody?.detail === 'string'
        ? errorBody.detail
        : `Server error (${response.status}). Please try again.`;

    console.error('[sudokuApi] HTTP error:', response.status, message);
    throw new Error(message);
  }

  return body as T;
}

// ── API functions ──────────────────────────────────────────────────────────

/** GET /new?difficulty={difficulty} */
export async function createNewGame(difficulty: Difficulty): Promise<NewGameResponse> {
  return request<NewGameResponse>(`/new?difficulty=${difficulty}`, {
    method: 'GET',
  });
}

/**
 * POST /move
 * number can be 0 (clear cell) through 9
 */
export async function playMove(
  board: SudokuBoard,
  row: number,
  col: number,
  number: number,
): Promise<MoveResponse> {
  return request<MoveResponse>('/move', {
    method: 'POST',
    body: JSON.stringify({ board, row, col, number }),
  });
}

/** POST /check */
export async function checkBoard(board: SudokuBoard): Promise<CheckResponse> {
  return request<CheckResponse>('/check', {
    method: 'POST',
    body: JSON.stringify({ board }),
  });
}

/** POST /hint */
export async function getHint(board: SudokuBoard): Promise<HintResponse> {
  return request<HintResponse>('/hint', {
    method: 'POST',
    body: JSON.stringify({ board }),
  });
}

/** POST /solve */
export async function solveBoard(board: SudokuBoard): Promise<SolveResponse> {
  return request<SolveResponse>('/solve', {
    method: 'POST',
    body: JSON.stringify({ board }),
  });
}
