import { state } from "../state.js";
import { Button } from "../components/button.js";
import { HandsFooter } from "../components/handsFooter.js";
import { GameHeader } from "../components/gameHeader.js";
import { navigateTo } from "../router.js";

export function renderEsperando(root) {
    const div = document.createElement("div");
    div.className = "page";

    const currentState = state.getState();
    const game = currentState.currentGame;

    div.appendChild(GameHeader());

    // Todavía no entró el segundo jugador
    if (!currentState.opponentId) {
        const title = document.createElement("h2");
        title.textContent = "Esperando oponente...";

        const codeText = document.createElement("p");
        codeText.textContent = "Compartí el código:";

        const code = document.createElement("div");
        code.className = "room-code";
        code.textContent = currentState.roomCode;

        div.appendChild(title);
        div.appendChild(codeText);
        div.appendChild(code);
        div.appendChild(HandsFooter());

        root.appendChild(div);
        return;
    }

    // Ya están los dos jugadores
    const title = document.createElement("h2");
    title.textContent =
        `${currentState.userName} vs ${currentState.opponentName}`;

    div.appendChild(title);

    // Todavía no marqué listo
    if (!game.myReady) {
        const text = document.createElement("p");
        text.textContent =
            "¡Tu oponente ya está en la sala!";

        const instructionsButton = Button(
            "Continuar",
            () => {
                navigateTo("instrucciones");
            }
        );

        div.appendChild(text);
        div.appendChild(instructionsButton);
        div.appendChild(HandsFooter());

        root.appendChild(div);
        return;
    }

    // Yo listo, esperando al rival
    if (!game.opponentReady) {
        const myStatus = document.createElement("p");
        myStatus.textContent = "Vos: listo ✅";

        const opponentStatus = document.createElement("p");
        opponentStatus.textContent =
            `${currentState.opponentName}: esperando`;

        div.appendChild(myStatus);
        div.appendChild(opponentStatus);
        div.appendChild(HandsFooter());

        root.appendChild(div);
        return;
    }

    const readyText = document.createElement("h2");
    readyText.textContent = "¡Los dos están listos!";

    div.appendChild(readyText);
    div.appendChild(HandsFooter());

    root.appendChild(div);
}