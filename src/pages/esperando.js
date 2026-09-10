import { state } from "../state.js";
import { Button } from "../components/button.js";
import { navigateTo } from "../router.js";

export function renderEsperando(root) {
    const div = document.createElement("div");
    div.className = "page";

    const currentState = state.getState();
    const game = currentState.currentGame;

    const title = document.createElement("h2");

    const codeText = document.createElement("p");
    codeText.textContent = "Código de sala:";

    const code = document.createElement("h1");
    code.textContent = currentState.roomCode;

    div.appendChild(codeText);
    div.appendChild(code);

    // Todavía no entró el segundo jugador
    if (!currentState.opponentId) {
        title.textContent = "Esperando oponente...";

        div.prepend(title);
        root.appendChild(div);
        return;
    }

    // Ya están los dos jugadores
    title.textContent = `${currentState.userName} vs ${currentState.opponentName}`;

    const myStatus = document.createElement("p");
    myStatus.textContent = game.myReady
        ? "Vos: listo ✅"
        : "Vos: esperando";

    const opponentStatus = document.createElement("p");
    opponentStatus.textContent = game.opponentReady
        ? `${currentState.opponentName}: listo ✅`
        : `${currentState.opponentName}: esperando`;

    div.appendChild(myStatus);
    div.appendChild(opponentStatus);

    // Si todavía no marqué "listo"
    if (!game.myReady) {
        const readyButton = Button("Estoy listo", async () => {
            try {
                await state.setReady();
            } catch (error) {
                console.error(error);
                alert("No se pudo marcar como listo");
            }
        });

        div.appendChild(readyButton);
    }

    // Cuando los dos están listos
    if (game.myReady && game.opponentReady) {
        const readyText = document.createElement("h2");
        readyText.textContent = "¡Los dos están listos!";

        const playButton = Button("¡Jugar!", () => {
            navigateTo("juego");
        });

        div.appendChild(readyText);
        div.appendChild(playButton);
    }

    div.prepend(title);
    root.appendChild(div);
}