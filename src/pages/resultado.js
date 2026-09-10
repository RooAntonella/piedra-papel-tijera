import { state } from "../state.js";
import { Button } from "../components/button.js";
import "../styles.css";

export function renderResultado(root) {
    const div =
        document.createElement("div");

    div.className =
        "page resultado-page";

    const currentState =
        state.getState();

    const result =
        currentState.result;

    const score =
        currentState.score;

    const title =
        document.createElement("h1");

    if (result === "ganaste") {
        title.textContent =
            "¡Ganaste!";

        div.classList.add(
            "resultado-ganaste"
        );
    } else if (
        result === "perdiste"
    ) {
        title.textContent =
            "Perdiste";

        div.classList.add(
            "resultado-perdiste"
        );
    } else {
        title.textContent =
            "¡Empate!";

        div.classList.add(
            "resultado-empate"
        );
    }

    const star =
        document.createElement("img");

    star.className =
        "result-star";

    if (result === "ganaste") {
        star.src =
            "./assets/ganaste.png";
    } else if (
        result === "perdiste"
    ) {
        star.src =
            "./assets/perdiste.png";
    } else {
        star.src =
            "./assets/empate.png";
    }

    const scoreBox =
        document.createElement("div");

    scoreBox.className = "score";

    scoreBox.innerHTML = `
        <h3>Score</h3>
        <p>${currentState.userName}: ${score.me}</p>
        <p>${currentState.opponentName}: ${score.opponent}</p>
    `;

    const playAgainButton =
        Button(
            "Volver a jugar",
            async () => {
                try {
                    await state.resetRound();
                } catch (error) {
                    console.error(error);

                    alert(
                        "No se pudo reiniciar la ronda"
                    );
                }
            }
        );

    div.appendChild(title);
    div.appendChild(star);
    div.appendChild(scoreBox);
    div.appendChild(playAgainButton);

    root.appendChild(div);
}