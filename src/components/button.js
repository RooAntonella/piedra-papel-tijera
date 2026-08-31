export function Button(text, onClick) {
    const btn = document.createElement("button");

    btn.textContent = text;

    btn.style.backgroundColor = "#3b82f6";
    btn.style.color = "white";
    btn.style.padding = "10px 20px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", onClick);

    return btn;
}