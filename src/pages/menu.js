import { navigateTo } from "../router.js";
import { Button } from "../components/button.js";
import { state } from "../state.js";

export function renderMenu(root) {
    const div = document.createElement("div");
    div.className = "page";

    const title = document.createElement("h1");
    title.textContent = "Piedra Papel o Tijera";

    const nuevoJuego = Button("Nuevo juego", async () => {
        try {
            await state.createRoom();
            navigateTo("esperando");
        } catch (error) {
            console.error(error);
            alert("No se pudo crear la sala");
        }
    });

    const ingresarSala = Button("Ingresar a una sala", () => {
        navigateTo("ingresarSala");
    });

    div.appendChild(title);
    div.appendChild(nuevoJuego);
    div.appendChild(ingresarSala);

    root.appendChild(div);
}