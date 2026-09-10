import { navigateTo } from "../router.js";
import { Button } from "../components/button.js";
import { state } from "../state.js";

export function renderIngresarSala(root) {
    const div = document.createElement("div");
    div.className = "page";

    const title = document.createElement("h2");
    title.textContent = "Ingresar a una sala";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Código de sala";

    const button = Button("Entrar", async () => {
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

    root.appendChild(div);
}