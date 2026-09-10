import { state } from "../state.js";
import { Move } from "../components/move.js";

export function renderJuego(root) {
    const div = document.createElement("div");
    div.className = "page";

    const currentState = state.getState();
    const game = currentState.currentGame;

    const title = document.createElement("h2");

    // Todavía no elegí
    if (!game.myPlay) {
        title.textContent = "Elegí tu jugada";

        const movesContainer = document.createElement("div");
        movesContainer.className = "moves-bottom";

        const plays = ["piedra", "papel", "tijera"];

        plays.forEach((play) => {
            const move = Move(play, async (selectedPlay) => {
                try {
                    await state.setChoice(selectedPlay);
                } catch (error) {
                    console.error(error);
                    alert("No se pudo guardar la jugada");
                }
            });

            movesContainer.appendChild(move);
        });

        div.appendChild(title);
        div.appendChild(movesContainer);

        root.appendChild(div);
        return;
    }

    // Yo elegí pero el rival todavía no
    if (!game.opponentPlay) {
        title.textContent =
            `Elegiste ${game.myPlay}. Esperando a ${currentState.opponentName}...`;

        div.appendChild(title);
        root.appendChild(div);
        return;
    }

    // Ambos eligieron
    title.textContent = "¡Los dos jugaron!";

    const myText = document.createElement("p");
    myText.textContent = `Vos: ${game.myPlay}`;

    const opponentText = document.createElement("p");
    opponentText.textContent =
        `${currentState.opponentName}: ${game.opponentPlay}`;

    div.appendChild(title);
    div.appendChild(myText);
    div.appendChild(opponentText);

    root.appendChild(div);
}