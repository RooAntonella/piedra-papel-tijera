import { navigateTo } from "../router.js";
import { state } from "../state.js";
import { getComputerPlay, getWinner } from "../game/logic.js";
import { Move } from "../components/Move.js";

export function renderJuego(root) {
    const div = document.createElement("div");
    div.className = "page";

    const title = document.createElement("h2");
    title.textContent = "Elegí tu jugada";

    const movesContainer = document.createElement("div");
    movesContainer.className = "moves-bottom";

    const plays = ["piedra", "papel", "tijera"];

    plays.forEach((play) => {
        const move = Move(play, (selectedPlay) => {
            const computerPlay = getComputerPlay();

            const currentState = state.getState();
            const result = getWinner(selectedPlay, computerPlay);

            const currentHistory = currentState.history || {
                myScore: 0,
                computerScore: 0,
            };

            const newHistory = {
                myScore: currentHistory.myScore,
                computerScore: currentHistory.computerScore,
            };

            if (result === "ganaste") {
                newHistory.myScore++;
            } else if (result === "perdiste") {
                newHistory.computerScore++;
            }

            const newState = {
                ...currentState,
                currentGame: {
                    myPlay: selectedPlay,
                    computerPlay,
                },
                history: newHistory,
            };

            showCountdown(div, selectedPlay, computerPlay, () => {
                state.setState(newState);
                navigateTo("resultado");
            });
        });

        movesContainer.appendChild(move);
    });

    div.appendChild(title);
    div.appendChild(movesContainer);

    root.appendChild(div);
}

function showCountdown(div, selectedPlay, computerPlay, callback) {
    div.innerHTML = "";

    const countdown = document.createElement("h1");
    countdown.className = "countdown";
    countdown.textContent = "3";

    div.appendChild(countdown);

    setTimeout(() => {
        countdown.textContent = "2";
    }, 1000);

    setTimeout(() => {
        showPlays(div, selectedPlay, computerPlay);
    }, 2000);

    setTimeout(() => {
        callback();
    }, 3000);
}

function showPlays(div, selectedPlay, computerPlay) {
    div.innerHTML = "";

    const myMove = Move(selectedPlay);
    const computerMove = Move(computerPlay);

    myMove.classList.add("final-my-move");
    computerMove.classList.add("final-computer-move");

    div.appendChild(computerMove);
    div.appendChild(myMove);
}