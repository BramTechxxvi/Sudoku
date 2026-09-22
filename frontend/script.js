const API_BASE_URL =
    "http://127.0.0.1:8000/api/v1/sudoku";


let currentBoard = [];

let givenCells = [];


const boardEl =
    document.getElementById("board");

const messageEl =
    document.getElementById("message");

const difficultyEl =
    document.getElementById("difficulty");

const newGameBtn =
    document.getElementById("new-game-btn");

const hintBtn =
    document.getElementById("hint-btn");

const solveBtn =
    document.getElementById("solve-btn");




function buildGrid() {

    boardEl.innerHTML = "";

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const input =
                document.createElement("input");

            input.className = "cell";

            input.type = "text";

            input.inputMode = "numeric";

            input.maxLength = 1;

            input.dataset.row = row;

            input.dataset.col = col;


        
            if (row === 2 || row === 5) {
                input.classList.add(
                    "row-thick-bottom"
                );
            }


          
            if (col === 2 || col === 5) {
                input.classList.add(
                    "col-thick-right"
                );
            }


            input.addEventListener(
                "input",
                onCellInput
            );


            boardEl.appendChild(input);
        }
    }
}



function renderBoard() {

    const cells =
        document.querySelectorAll(".cell");


    cells.forEach((cell) => {

        const row =
            Number(cell.dataset.row);

        const col =
            Number(cell.dataset.col);


        const value =
            currentBoard[row][col];


        cell.value =
            value === 0
                ? ""
                : value;


        cell.classList.remove(
            "given",
            "invalid",
            "user-input"
        );


        if (givenCells[row][col]) {

            cell.classList.add("given");

            cell.disabled = true;

        } else {

            cell.disabled = false;


            if (value !== 0) {
                cell.classList.add(
                    "user-input"
                );
            }
        }
    });
}



async function apiNewGame(difficulty) {

    const response = await fetch(
        `${API_BASE_URL}/new?difficulty=${difficulty}`
    );


    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "New game error:",
            errorData
        );

        throw new Error(
            "Failed to generate puzzle"
        );
    }


    return response.json();
}



async function apiPlayMove(
    board,
    row,
    col,
    number
) {

    const response = await fetch(
        `${API_BASE_URL}/move`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                board,
                row,
                col,
                number
            })
        }
    );


    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "Move error:",
            errorData
        );

        throw new Error(
            "Failed to make move"
        );
    }


    return response.json();
}



async function apiCheckBoard(board) {

    const response = await fetch(
        `${API_BASE_URL}/check`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                board
            })
        }
    );


    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "Check board error:",
            errorData
        );

        throw new Error(
            "Failed to check board"
        );
    }


    return response.json();
}



async function apiHint(board) {

    const response = await fetch(
        `${API_BASE_URL}/hint`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                board
            })
        }
    );


    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "Hint error:",
            errorData
        );

        throw new Error(
            "Failed to get hint"
        );
    }


    return response.json();
}



async function apiSolve(board) {

    const response = await fetch(
        `${API_BASE_URL}/solve`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                board
            })
        }
    );


    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "Solve error:",
            errorData
        );

        throw new Error(
            "Failed to solve puzzle"
        );
    }


    return response.json();
}





async function onCellInput(event) {

    const cell = event.target;


    const row =
        Number(cell.dataset.row);

    const col =
        Number(cell.dataset.col);


    let value =
        cell.value.replace(
            /[^1-9]/g,
            ""
        );


    cell.value = value;


    const number =
        value === ""
            ? 0
            : Number(value);


    cell.classList.remove(
        "invalid"
    );


    try {

        const result =
            await apiPlayMove(
                currentBoard,
                row,
                col,
                number
            );


        if (!result.valid) {

            cell.classList.add(
                "invalid"
            );


            messageEl.textContent =
                "Invalid move";

            messageEl.style.color =
                "#c0392b";


            currentBoard =
                result.board;


            return;
        }


        currentBoard =
            result.board;


        messageEl.textContent = "";


        renderBoard();


        await checkWin();

    } catch (error) {

        console.error(error);


        messageEl.textContent =
            "Could not validate move.";

        messageEl.style.color =
            "#c0392b";
    }
}





async function checkWin() {

    try {

        const result =
            await apiCheckBoard(
                currentBoard
            );


        if (
            result.valid &&
            result.complete
        ) {

            messageEl.textContent =
                "🎉 Sudoku solved!";

            messageEl.style.color =
                "green";

        }

    } catch (error) {

        console.error(error);

    }
}



async function newGame() {

    const difficulty =
        difficultyEl.value;


    messageEl.textContent =
        "Loading puzzle...";

    messageEl.style.color =
        "black";


    newGameBtn.disabled = true;


    try {

        const data =
            await apiNewGame(
                difficulty
            );


        currentBoard =
            data.puzzle;


        givenCells =
            currentBoard.map(
                (row) =>
                    row.map(
                        (value) =>
                            value !== 0
                    )
            );


        messageEl.textContent = "";


        renderBoard();

    } catch (error) {

        console.error(error);


        messageEl.textContent =
            "Could not load puzzle.";

        messageEl.style.color =
            "#c0392b";

    } finally {

        newGameBtn.disabled = false;

    }
}




async function useHint() {

    try {

        const data =
            await apiHint(
                currentBoard
            );


        if (!data.hint) {

            messageEl.textContent =
                "No hint available.";

            messageEl.style.color =
                "#c0392b";

            return;
        }


        const {
            row,
            col,
            number
        } = data.hint;


        currentBoard[row][col] =
            number;


        messageEl.textContent =
            `Hint: row ${row + 1}, column ${col + 1} = ${number}`;

        messageEl.style.color =
            "#2b6cb0";


        renderBoard();


        await checkWin();

    } catch (error) {

        console.error(error);


        messageEl.textContent =
            "Could not get hint.";

        messageEl.style.color =
            "#c0392b";
    }
}





async function solvePuzzle() {

    messageEl.textContent =
        "Solving...";

    messageEl.style.color =
        "black";


    try {

        const data =
            await apiSolve(
                currentBoard
            );


        if (!data.solved) {

            messageEl.textContent =
                "This board could not be solved.";

            messageEl.style.color =
                "#c0392b";

            return;
        }


        currentBoard =
            data.board;


        renderBoard();


        messageEl.textContent =
            "Puzzle solved for you.";

        messageEl.style.color =
            "#2b6cb0";

    } catch (error) {

        console.error(error);


        messageEl.textContent =
            "Could not solve puzzle.";

        messageEl.style.color =
            "#c0392b";
    }
}



newGameBtn.addEventListener(
    "click",
    newGame
);


hintBtn.addEventListener(
    "click",
    useHint
);


solveBtn.addEventListener(
    "click",
    solvePuzzle
);





buildGrid();

newGame();