import { navigateTo } from "../router.js";
import { GameHeader } from "../components/gameHeader.js";
let timers = [];

export function renderCountdown(root) {
    timers.forEach((timer) => {
        clearTimeout(timer);
    });

    timers = [];

    const div = document.createElement("div");
    div.className = "page countdown-page";
    div.appendChild(GameHeader());
    const title = document.createElement("h2");
    title.textContent = "Preparados...";

    const number = document.createElement("h1");
    number.className = "countdown";
    number.textContent = "3";

    div.appendChild(title);
    div.appendChild(number);

    root.appendChild(div);

    timers.push(
        setTimeout(() => {
            number.textContent = "2";
        }, 1000)
    );

    timers.push(
        setTimeout(() => {
            number.textContent = "1";
        }, 2000)
    );

    timers.push(
        setTimeout(() => {
            number.textContent = "¡YA!";
        }, 3000)
    );

    timers.push(
        setTimeout(() => {
            navigateTo("juego");
        }, 3500)
    );
}