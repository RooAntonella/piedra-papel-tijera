import { navigateTo } from "../router.js";
import { state } from "../state.js";
import { Move } from "../components/Move.js";
import { getWinner } from "../game/logic.js";
import "../styles.css";

export function renderResultado(root) {
    const div = document.createElement("div");
    div.className = "page";

    const currentState = state.getState();
    const currentGame = currentState.currentGame;
    const history = currentState.history;

    const result = getWinner(
        currentGame.myPlay,
        currentGame.computerPlay
    );

    // 🎨 fondo según resultado
    if (result === "ganaste") {
        div.style.backgroundColor = "#6CBF84";
    } else if (result === "perdiste") {
        div.style.backgroundColor = "#D96C6C";
    } else {
        div.style.backgroundColor = "#F2F2F2";
    }

    // ⭐ estrella
    const star = document.createElement("img");

    if (result === "ganaste") {
        star.src = "./assets/ganaste.png";
    } else if (result === "perdiste") {
        star.src = "./assets/perdiste.png";
    } else {
        star.src = "./assets/empate.png";
    }

    star.style.width = "300px";
    star.style.position = "relative";
    star.style.zIndex = "2";

    // 📦 score
    const score = document.createElement("div");
    score.className = "score";

    score.innerHTML = `
        <h3>Score</h3>
        <p>Vos: ${history.myScore}</p>
        <p>Máquina: ${history.computerScore}</p>
    `;

    score.style.position = "relative";
    score.style.zIndex = "2";

    // 🔘 botón
    const btn = document.createElement("button");
    btn.textContent = "Volver a jugar";
    btn.className = "volverajugar";

    btn.style.position = "relative";
    btn.style.zIndex = "2";

    btn.addEventListener("click", () => {
        navigateTo("inicio");
    });

    // ✊ manos
    const myMove = Move(currentGame.myPlay);
    const computerMove = Move(currentGame.computerPlay);

    // tamaño manos resultado
    myMove.firstChild.style.width = "200px";
    computerMove.firstChild.style.width = "200px";

    // mano jugador
    myMove.style.position = "absolute";
    myMove.style.bottom = "0";
    myMove.style.left = "50%";
    myMove.style.transform = "translateX(-50%)";
    myMove.style.zIndex = "1";

    // mano computadora
    computerMove.style.position = "absolute";
    computerMove.style.top = "0";
    computerMove.style.left = "50%";
    computerMove.style.transform =
        "translateX(-50%) rotate(180deg)";
    computerMove.style.zIndex = "1";

    // 📐 render
    div.appendChild(star);
    div.appendChild(score);
    div.appendChild(btn);
    div.appendChild(computerMove);
    div.appendChild(myMove);

    root.appendChild(div);
}