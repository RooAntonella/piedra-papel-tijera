import { state } from "../state.js";

export function GameHeader() {
    const currentState = state.getState();

    const header = document.createElement("div");
    header.className = "game-header";

    const players = document.createElement("div");
    players.className = "game-header__players";

    const me = document.createElement("p");
    me.className = "game-header__me";
    me.textContent =
        `${currentState.userName}: ${currentState.score.me}`;

    const opponent = document.createElement("p");
    opponent.className = "game-header__opponent";
    opponent.textContent = currentState.opponentName
        ? `${currentState.opponentName}: ${currentState.score.opponent}`
        : "Esperando rival...";

    players.appendChild(me);
    players.appendChild(opponent);

    const room = document.createElement("div");
    room.className = "game-header__room";

    const roomTitle = document.createElement("strong");
    roomTitle.textContent = "Sala";

    const roomCode = document.createElement("span");
    roomCode.textContent = currentState.roomCode;

    room.appendChild(roomTitle);
    room.appendChild(roomCode);

    header.appendChild(players);
    header.appendChild(room);

    return header;
}