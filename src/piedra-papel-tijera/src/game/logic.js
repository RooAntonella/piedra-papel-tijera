export function getComputerPlay() {
    const plays = ["piedra", "papel", "tijera"];
    const randomIndex = Math.floor(Math.random() * plays.length);
    return plays[randomIndex];
}

export function getWinner(myPlay, computerPlay) {
    const ganePiedra = myPlay === "piedra" && computerPlay === "tijera";
    const ganePapel = myPlay === "papel" && computerPlay === "piedra";
    const ganeTijera = myPlay === "tijera" && computerPlay === "papel";

    const gane = ganePiedra || ganePapel || ganeTijera;

    if (myPlay === computerPlay) return "empate";
    return gane ? "ganaste" : "perdiste";
}