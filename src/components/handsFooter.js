import { Move } from "./move.js";

export function HandsFooter() {
    const container = document.createElement("div");
    container.className = "hands-footer";

    const scissors = Move("tijera");
    const rock = Move("piedra");
    const paper = Move("papel");

    container.appendChild(scissors);
    container.appendChild(rock);
    container.appendChild(paper);

    return container;
}