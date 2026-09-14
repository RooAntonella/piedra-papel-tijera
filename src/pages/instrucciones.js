import { Button } from "../components/button.js";
import { HandsFooter } from "../components/handsFooter.js";
import { state } from "../state.js";
import { navigateTo } from "../router.js";
import { GameHeader } from "../components/gameHeader.js";

export function renderInstrucciones(root) {
    const div = document.createElement("div");
    div.className = "page instrucciones-page";
    div.appendChild(GameHeader());
    const currentState = state.getState();

    const title = document.createElement("h2");
    title.textContent =
        "Presioná jugar y elegí piedra, papel o tijera antes de que termine la cuenta.";

    const players = document.createElement("p");
    players.textContent =
        `${currentState.userName} vs ${currentState.opponentName}`;

    const button = Button(
        "¡Jugar!",
        async () => {
            try {
                await state.setReady();
                navigateTo("esperando");
            } catch (error) {
                console.error(error);
                alert("No se pudo marcar como listo");
            }
        }
    );

    div.appendChild(players);
    div.appendChild(title);
    div.appendChild(button);
    div.appendChild(HandsFooter());

    root.appendChild(div);
}