import { navigateTo } from "../router.js";
import { Button } from "../components/button.js";
import { state } from "../state.js";
import { HandsFooter } from "../components/handsFooter.js";

export function renderInicio(root) {
    const div = document.createElement("div");
    div.className = "page";

    const title = document.createElement("h1");
    title.textContent = "Piedra Papel o Tijera";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Tu nombre";

    const button = Button("Continuar", async () => {
        const name = input.value.trim();

        if (!name) {
            alert("Ingresá tu nombre");
            return;
        }

        try {
            await state.createUser(name);

            navigateTo("menu");
        } catch (error) {
            console.error(error);
            alert("No se pudo crear el usuario");
        }
    });

    div.appendChild(title);
    div.appendChild(input);
    div.appendChild(button);
    div.appendChild(HandsFooter());
    root.appendChild(div);
}