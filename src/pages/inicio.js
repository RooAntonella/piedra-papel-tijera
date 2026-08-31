import { navigateTo } from "../router";

import { Button } from "../components/button.js";

export function renderInicio(root) {
    const div = document.createElement("div");
    div.className = "page";
    const title = document.createElement("h1");
    title.textContent = "Piedra Papel o Tijera";


    const button = Button("Empezar", () => {
        navigateTo("instrucciones");
    });
    div.appendChild(title);
    div.appendChild(button);

    root.appendChild(div);
}

console.log("render inicio");