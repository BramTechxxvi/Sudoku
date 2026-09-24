# Sudoku Frontend

A polished, responsive Sudoku game built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. All puzzle logic (generation, validation, hints, solve) is handled by a separate **FastAPI** backend.

---

## Requirements

- Node.js 18+
- A running instance of the [Sudoku FastAPI backend](../README.md)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then open `.env` and set `VITE_API_BASE_URL` to point at your backend:

```env
# Local development
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1/sudoku

# Production
# VITE_API_BASE_URL=https://my-sudoku-api.onrender.com/api/v1/sudoku
```

This is the **only** value you need to change when deploying to a different environment.

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Build for production

```bash
npm run build
```

Output is placed in `dist/`. Serve it with any static file host (Nginx, Caddy, Vercel, Netlify, etc.).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Full base URL of the FastAPI Sudoku API, e.g. `http://127.0.0.1:8000/api/v1/sudoku` |

---

## CORS

The FastAPI backend must allow requests from the frontend origin.

In development the frontend runs on `http://localhost:5173`. Add that origin (or `*` for local dev) to FastAPI's `CORSMiddleware` configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or your production domain
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Features

- Automatic puzzle generation on load (medium difficulty)
- Easy / Medium / Hard difficulty selection
- Full keyboard support (arrows, 1–9, Backspace, N for notes, H for hint)
- Notes / pencil mode with 3×3 candidate mini-grid per cell
- Hint button (calls backend `/hint`)
- Solve with confirmation (calls backend `/solve`)
- Undo history (client-side)
- Move validation feedback (red shake on invalid move)
- Completion detection with stats modal
- Timer, mistake counter, hints used counter
- Game auto-saved to `localStorage` — resumes on reload
- Responsive layout: works on 320 px phones through 1440 px desktops

---

## Project structure

```
src/
├── components/
│   └── sudoku/
│       ├── SudokuBoard.tsx
│       ├── SudokuCell.tsx
│       ├── NumberPad.tsx
│       ├── GameControls.tsx
│       ├── GameHeader.tsx
│       ├── GameStatus.tsx
│       ├── DifficultySelector.tsx
│       ├── CompletionModal.tsx
│       └── ConfirmDialog.tsx
├── hooks/
│   ├── useSudokuGame.ts    ← all game state & API orchestration
│   ├── useTimer.ts
│   └── useKeyboardControls.ts
├── pages/
│   └── GamePage.tsx
├── services/
│   └── sudokuApi.ts        ← all fetch calls, single source of truth
├── types/
│   └── sudoku.ts
├── utils/
│   ├── board.ts
│   └── storage.ts
├── App.tsx
├── main.tsx
└── index.css
```
