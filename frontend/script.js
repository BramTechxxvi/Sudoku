const API_BASE = "http:localhost:8000/api/v1/sudoku";

let currentBoard = []; 
let givenCells = [];     

const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");

function buildGrid() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.createElement("input");
            input.className = "cell";
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;

            if (r === 2 || r === 5) input.classList.add("row-thick-bottom");

            input.addEventListener("input", onCellInput);
            boardEl.appendChild(input);
        }
    }
}

function renderBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const r = +cell.dataset.row;
        const c = +cell.dataset.col;
        const val = currentBoard[r][c];

        cell.value = val === 0 ? "" : val;
        cell.classList.remove("given", "invalid", "user-input");

        if (givenCells[r][c]) {
            cell.classList.add("given");
            cell.disabled = true;
        } else {
            cell.disabled = false;
            if (val !== 0) cell.classList.add("user-input");
        }
    });
}


async function apiNewGame(difficulty) {
    const res = await fetch(`${API_BASE}/new?difficulty=${difficulty}`);
    return res.json();
}

async function apiPlayMove(board, row, col, number) {
    const res = await fetch(`${API_BASE}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board, row, col, number })
    });
    return res.json(); 
}

async function apiCheckBoard(board) {
    const res = await fetch(`${API_BASE}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board })
    });
    return res.json(); 
}

async function apiHint(board) {
    const res = await fetch(`${API_BASE}/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board })
    });
    return res.json();
}

async function apiSolve(board) {
    const res = await fetch(`${API_BASE}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board })
    });
    return res.json(); 
}

async function onCellInput(e) {
    const cell = e.target;
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    let val = cell.value.replace(/[^1-9]/g, ""); 
    cell.value = val;

    const num = val === "" ? 0 : parseInt(val);
    cell.classList.remove("invalid");

    const { valid, board } = await apiPlayMove(currentBoard, r, c, num);
    currentBoard = board;

    if (num !== 0 && !valid) {
        cell.classList.add("invalid");
    }

    await checkWin();
}

async function checkWin() {
    const { valid, complete } = await apiCheckBoard(currentBoard);
    if (valid && complete) {
        messageEl.textContent = "🎉 Solved!";
        messageEl.style.color = "green";
    } else {
        messageEl.textContent = "";
    }
}

async function newGame() {
    const difficulty = document.getElementById("difficulty").value;
    messageEl.textContent = "Loading...";
    messageEl.style.color = "black";

    const { puzzle } = await apiNewGame(difficulty);

    currentBoard = puzzle;
    givenCells = currentBoard.map(row => row.map(v => v !== 0));

    messageEl.textContent = "";
    renderBoard();
}

async function useHint() {
    const { hint } = await apiHint(currentBoard);
    if (!hint) {
        messageEl.textContent = "No hint available.";
        return;
    }
    const { row, col, number } = hint;
    currentBoard[row][col] = number;
    renderBoard();
    await checkWin();
}

async function solvePuzzle() {
    const { solved, board } = await apiSolve(currentBoard);
    if (!solved) {
        messageEl.textContent = "Couldn't solve this board.";
        messageEl.style.color = "#c0392b";
        return;
    }
    currentBoard = board;
    renderBoard();
    messageEl.textContent = "Solved for you.";
    messageEl.style.color = "#2b6cb0";
}

document.getElementById("new-game-btn").addEventListener("click", newGame);
document.getElementById("solve-btn").addEventListener("click", solvePuzzle);

const hintBtn = document.getElementById("hint-btn");
if (hintBtn) hintBtn.addEventListener("click", useHint);

buildGrid();
newGame();