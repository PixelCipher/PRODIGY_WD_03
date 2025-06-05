const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");
const friendModeBtn = document.getElementById("friendModeBtn");
const aiModeBtn = document.getElementById("aiModeBtn");
const gameContainer = document.querySelector(".container");
const gameModeSelection = document.querySelector(".game-mode");

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let againstAI = false;

friendModeBtn.addEventListener("click", () => startGame(false));
aiModeBtn.addEventListener("click", () => startGame(true));

function startGame(isAI){
    againstAI = isAI;
    gameModeSelection.classList.add("fade-out");
    setTimeout(() => {
        gameModeSelection.style.display = "none";
        gameContainer.style.display = "block";
        gameContainer.classList.remove("fade-out");
        initializeGame();
    }, 500);
}


function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("data-index");

    if(options[cellIndex] != "" || !running || (againstAI && currentPlayer !== "X")){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if(running && againstAI){
        setTimeout(aiMove, 500);
    }
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let condition of winConditions){
        const [a, b, c] = condition;
        if(options[a] && options[a] === options[b] && options[a] === options[c]){
            document.querySelector(`.cell[data-index='${a}']`).classList.add("win");
            document.querySelector(`.cell[data-index='${b}']`).classList.add("win");
            document.querySelector(`.cell[data-index='${c}']`).classList.add("win");
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function aiMove(){
    if(!running) return;

    let availableCells = options.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    if(availableCells.length === 0) return;

    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    let cell = document.querySelector(`.cell[data-index='${randomIndex}']`);

    updateCell(cell, randomIndex);
    checkWinner();
}

function restartGame(){
    options = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.classList.remove("x", "o", "win");
    });
    currentPlayer = "X";
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
    gameContainer.classList.add("fade-out");
    setTimeout(() => {
        gameContainer.style.display = "none";
        gameModeSelection.style.display = "block";
        gameModeSelection.classList.remove("fade-out");
        options = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => {
            cell.classList.remove("x", "o", "win");
        });
        currentPlayer = "X";
        running = false;
    }, 500);
});
