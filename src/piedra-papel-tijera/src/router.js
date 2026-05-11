import { renderInicio } from "./pages/inicio.js";
import { renderInstrucciones } from "./pages/instrucciones.js";
import { renderJuego } from "./pages/juego.js";
import { renderResultado } from "./pages/resultado.js";
import { state } from "./state.js";

export function navigateTo(page) {
    state.setState({
        currentPage: page,
    });
}

export function render() {
    const root = document.querySelector("#app");
    root.innerHTML = "";

    const currentPage = state.getState().currentPage;

    if (currentPage === "inicio") {
        renderInicio(root);
    } else if (currentPage === "instrucciones") {
        renderInstrucciones(root);
    } else if (currentPage === "juego") {
        renderJuego(root);
    } else if (currentPage === "resultado") {
        renderResultado(root);
    }
}

state.subscribe(() => {
    render();
});