export function Move(type, onClick) {
    const div = document.createElement("div");

    const img = document.createElement("img");

    img.src = `./assets/${type}.png`;
    img.style.width = "120px";
    img.style.display = "block";

    div.appendChild(img);

    if (onClick) {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => onClick(type));
    }

    return div;
}