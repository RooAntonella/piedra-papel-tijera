export function getWinner(
    myPlay,
    opponentPlay
) {
    const ganePiedra =
        myPlay === "piedra" &&
        opponentPlay === "tijera";

    const ganePapel =
        myPlay === "papel" &&
        opponentPlay === "piedra";

    const ganeTijera =
        myPlay === "tijera" &&
        opponentPlay === "papel";

    const gane =
        ganePiedra ||
        ganePapel ||
        ganeTijera;

    if (myPlay === opponentPlay) {
        return "empate";
    }

    return gane
        ? "ganaste"
        : "perdiste";
}