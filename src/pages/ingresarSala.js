import { navigateTo } from "../router.js";
import { Button } from "../components/button.js";
import { HandsFooter } from "../components/handsFooter.js";
import { state } from "../state.js";

export function renderIngresarSala(root) {
    const div = document.createElement("div");
    div.className = "page";

    const title = document.createElement("h1");
    title.textContent = "Piedra Papel o Tijera";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Código";

    const button = Button("Ingresar a la sala", async () => {
        const code = input.value.trim().toUpperCase();

        if (!code) {
            alert("Ingresá el código de la sala");
            return;
        }

        try {
            await state.joinRoom(code);
            navigateTo("esperando");
        } catch (error) {
            console.error(error);
            alert("No se pudo entrar a la sala");
        }
    });

    div.appendChild(title);
    div.appendChild(input);
    div.appendChild(button);
    div.appendChild(HandsFooter());

    root.appendChild(div);
}