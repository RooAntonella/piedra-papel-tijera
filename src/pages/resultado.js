import { navigateTo } from "../router.js";
import { state } from "../state.js";
import { getWinner } from "../game/logic.js";
import "../styles.css";

export function renderResultado(root) {
    const div = document.createElement("div");
    div.className = "page resultado-page";

    const currentState = state.getState();
    const currentGame = currentState.currentGame;
    const history = currentState.history;

    const result = getWinner(
        currentGame.myPlay,
        currentGame.computerPlay
    );

    if (result === "ganaste") {
        div.classList.add("resultado-ganaste");
    } else if (result === "perdiste") {
        div.classList.add("resultado-perdiste");
    } else {
        div.classList.add("resultado-empate");
    }

    const star = document.createElement("img");
    star.className = "result-star";

    if (result === "ganaste") {
        star.src = "./assets/ganaste.png";
    } else if (result === "perdiste") {
        star.src = "./assets/perdiste.png";
    } else {
        star.src = "./assets/empate.png";
    }

    const score = document.createElement("div");
    score.className = "score";

    score.innerHTML = `
        <h3>Score</h3>
        <p>Vos: ${history.myScore}</p>
        <p>Máquina: ${history.computerScore}</p>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Volver a jugar";
    btn.className = "volverajugar";

    btn.addEventListener("click", () => {
        navigateTo("inicio");
    });

    div.appendChild(star);
    div.appendChild(score);
    div.appendChild(btn);

    root.appendChild(div);
}