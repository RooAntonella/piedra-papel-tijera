import { renderInicio } from "./pages/inicio.js";
import { renderInstrucciones } from "./pages/instrucciones.js";
import { renderJuego } from "./pages/juego.js";
import { renderResultado } from "./pages/resultado.js";
import { renderMenu } from "./pages/menu.js";
import { renderIngresarSala } from "./pages/ingresarSala.js";
import { renderEsperando } from "./pages/esperando.js";

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

    } else if (currentPage === "menu") {
        renderMenu(root);

    } else if (currentPage === "ingresarSala") {
        renderIngresarSala(root);

    } else if (currentPage === "esperando") {
        renderEsperando(root);

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