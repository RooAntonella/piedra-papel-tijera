import { navigateTo } from "../router.js";
import { state } from "../state.js";
import { getComputerPlay, getWinner } from "../game/logic.js";
import { Move } from "../components/Move.js";

export function renderJuego(root) {
    const div = document.createElement("div");
    div.className = "page";

    const title = document.createElement("h2");
    title.textContent = "Elegí tu jugada";

    const countdown = document.createElement("h1");
    countdown.className = "countdown";

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
                    computerPlay: computerPlay,
                },
                history: newHistory,
                currentPage: "resultado",
            };

            // limpiar pantalla
            div.innerHTML = "";
            div.appendChild(countdown);

            startCountdown(countdown, () => {
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

function startCountdown(element, callback) {
    let count = 3;
    element.textContent = count;

    const interval = setInterval(() => {
        count--;
        element.textContent = count;

        if (count === 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}