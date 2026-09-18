let currentBoard = [];
let givenCells = [];
let solutionBoard = []; 

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

async function onCellInput(e) {
    const cell = e.target;
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    let val = cell.value.replace(/[^1-9]/g, ""); // only allow digits 1-9
    cell.value = val;

    const num = val === "" ? 0 : parseInt(val);
    currentBoard[r][c] = num;
    cell.classList.remove("invalid");

    if (num !== 0) {
        const res = await fetch("/check-cell", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: currentBoard, row: r, col: c, num: num })
        });
        const data = await res.json();
        if (!data.valid) {
            cell.classList.add("invalid");
        }
    }

    checkWin();
}

function checkWin() {
    const isFull = currentBoard.every(row => row.every(v => v !== 0));
    const hasInvalid = document.querySelector(".cell.invalid");
    if (isFull && !hasInvalid) {
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

    const res = await fetch(`/new-game?difficulty=${difficulty}`);
    const data = await res.json();

    currentBoard = data.puzzle;
    solutionBoard = data.solution;
    givenCells = currentBoard.map(row => row.map(v => v !== 0));

    messageEl.textContent = "";
    renderBoard();
}

function solvePuzzle() {
    currentBoard = solutionBoard.map(row => row.slice());
    renderBoard();
    messageEl.textContent = "Solved for you.";
    messageEl.style.color = "hsl(211, 61%, 43%)";
}

document.getElementById("new-game-btn").addEventListener("click", newGame);
document.getElementById("solve-btn").addEventListener("click", solvePuzzle);

buildGrid();
newGame();
