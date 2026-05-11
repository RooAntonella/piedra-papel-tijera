import { navigateTo } from "../router";
import { Button } from "../components/button.js";

export function renderInstrucciones(root) {
    const div = document.createElement("div");
    div.className = "page";
    const title = document.createElement("h2");
    title.textContent = "Instrucciones";

    const text = document.createElement("p");
    text.textContent = "Elegí piedra, papel o tijera para jugar.";


    const button = Button("Jugar", () => {
        navigateTo("juego");
    });
    button.addEventListener("click", () => {
        navigateTo("juego");
    });

    div.appendChild(title);
    div.appendChild(text);
    div.appendChild(button);

    root.appendChild(div);
}