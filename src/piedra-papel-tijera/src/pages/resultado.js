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


    if (result === "ganaste") {
        div.style.backgroundColor = "#6CBF84";
    } else if (result === "perdiste") {
        div.style.backgroundColor = "#D96C6C";
    } else {
        div.style.backgroundColor = "#F2F2F2";
    }

    // estrella
    const star = document.createElement("img");

    if (result === "ganaste") {
        star.src = "/assets/ganaste.png";
    } else if (result === "perdiste") {
        star.src = "/assets/perdiste.png";
    } else {
        star.src = "/assets/empate.png";
    }

    star.style.width = "300px";

    //  score
    const score = document.createElement("div");
    score.className = "score";
    score.innerHTML = `
    <h3>Score</h3>
    <p>Vos: ${history.myScore}</p>
    <p>Máquina: ${history.computerScore}</p>
  `;

    //  botón
    const btn = document.createElement("button");
    btn.textContent = "Volver a jugar";
    btn.className = "volverajugar";
    btn.addEventListener("click", () => {
        navigateTo("inicio");
    });

    // manos
    const myMove = Move(currentGame.myPlay);
    const computerMove = Move(currentGame.computerPlay);

    // posición manos//abajo
    myMove.style.position = "absolute";
    myMove.style.bottom = "0px";
    myMove.style.left = "50%";
    myMove.style.transform = "translateX(-50%)";

    //arriba
    computerMove.style.position = "absolute";
    computerMove.style.top = 0;
    computerMove.style.left = "50%";
    computerMove.style.transform = "translateX(-50%) rotate(180deg)";

    myMove.firstChild.style.width = "200px";
    computerMove.firstChild.style.width = "200px";

    //  orden en pantalla
    div.appendChild(star);
    div.appendChild(score);
    div.appendChild(btn);
    div.appendChild(computerMove);
    div.appendChild(myMove);

    root.appendChild(div);
}
