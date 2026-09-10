import { ref, onValue } from "firebase/database";
import { rtdb } from "./firebase.js";

const state = {
    data: {
        currentPage: "inicio",

        // Jugador actual
        userId: null,
        userName: "",

        // Room actual
        roomId: null,
        roomCode: "",

        // Rival
        opponentId: null,
        opponentName: "",

        // Datos que llegan desde Realtime Database
        rtdbData: {},

        // Estado de la partida actual
        currentGame: {
            myPlay: null,
            opponentPlay: null,
            myReady: false,
            opponentReady: false,
        },

        // Score persistente del room
        score: {
            me: 0,
            opponent: 0,
        },

        // Resultado desde la perspectiva de este jugador
        result: null,
    },

    // Suscriptores del state
    listeners: [],

    // Nos permite cerrar el listener anterior de Firebase
    roomUnsubscribe: null,

    // Evita resolver dos veces una misma ronda
    resolvingRound: false,

    getState() {
        return this.data;
    },

    async createUser(name) {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
            }),
        });

        if (!response.ok) {
            throw new Error("No se pudo crear el usuario");
        }

        const data = await response.json();

        this.setState({
            userId: data.id,
            userName: data.name,
        });

        return data;
    },

    async createRoom() {
        const currentState = this.getState();

        const response = await fetch("/api/rooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: currentState.userId,
            }),
        });

        if (!response.ok) {
            throw new Error("No se pudo crear el room");
        }

        const data = await response.json();

        this.setState({
            roomId: data.roomId,
            roomCode: data.code,
        });

        this.listenRoom();

        return data;
    },

    async joinRoom(code) {
        const currentState = this.getState();

        const response = await fetch(
            `/api/rooms/${code}/players`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentState.userId,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo entrar al room");
        }

        const data = await response.json();

        this.setState({
            roomId: data.roomId,
            roomCode: data.code,
        });

        this.listenRoom();

        return data;
    },

    async setReady() {
        const currentState = this.getState();

        const response = await fetch(
            `/api/rooms/${currentState.roomId}/game/${currentState.userId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    start: true,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo marcar al jugador como listo"
            );
        }
    },

    async setChoice(choice) {
        const currentState = this.getState();

        const response = await fetch(
            `/api/rooms/${currentState.roomId}/game/${currentState.userId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    choice,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo guardar la jugada"
            );
        }
    },

    async resolveRound() {
        if (this.resolvingRound) {
            return;
        }

        this.resolvingRound = true;

        try {
            const currentState = this.getState();

            const response = await fetch(
                `/api/rooms/${currentState.roomId}/results`,
                {
                    method: "POST",
                }
            );

            if (
                !response.ok &&
                response.status !== 409
            ) {
                throw new Error(
                    "No se pudo resolver la partida"
                );
            }

            return await response.json();
        } finally {
            this.resolvingRound = false;
        }
    },

    async resetRound() {
        const currentState = this.getState();

        const response = await fetch(
            `/api/rooms/${currentState.roomId}/reset`,
            {
                method: "POST",
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo reiniciar la ronda"
            );
        }

        return await response.json();
    },

    listenRoom() {
        const currentState = this.getState();
        const roomId = currentState.roomId;

        if (!roomId) {
            return;
        }

        // Si ya escuchábamos un room,
        // cerramos ese listener antes de crear otro
        if (this.roomUnsubscribe) {
            this.roomUnsubscribe();
        }

        const roomRef = ref(
            rtdb,
            `rooms/${roomId}`
        );

        this.roomUnsubscribe = onValue(
            roomRef,
            async (snapshot) => {
                const roomValue =
                    snapshot.val() || {};

                const value =
                    roomValue.currentGame || {};

                const playerIds =
                    Object.keys(value);

                // El rival es el jugador cuyo id
                // es distinto del nuestro
                const opponentId =
                    playerIds.find(
                        (id) =>
                            id !== this.data.userId
                    );

                const opponent = opponentId
                    ? value[opponentId]
                    : null;

                const me =
                    value[this.data.userId];

                let result =
                    this.data.result;

                let score =
                    this.data.score;

                let currentPage =
                    this.data.currentPage;

                // Si el backend ya resolvió la ronda
                if (
                    roomValue.roundResolved &&
                    roomValue.lastResult
                ) {
                    const winnerId =
                        roomValue.lastResult
                            .winnerId;

                    if (!winnerId) {
                        result = "empate";
                    } else if (
                        winnerId ===
                        this.data.userId
                    ) {
                        result = "ganaste";
                    } else {
                        result = "perdiste";
                    }

                    // Pedimos el score persistente
                    // guardado en Firestore
                    try {
                        const response =
                            await fetch(
                                `/api/rooms/${roomId}`
                            );

                        if (response.ok) {
                            const roomData =
                                await response.json();

                            const players =
                                roomData.players ||
                                {};

                            score = {
                                me:
                                    players[
                                        this.data
                                            .userId
                                    ]?.score || 0,

                                opponent:
                                    players[
                                        opponentId
                                    ]?.score || 0,
                            };
                        }
                    } catch (error) {
                        console.error(
                            "Error obteniendo score:",
                            error
                        );
                    }

                    // Si estoy en la pantalla del juego,
                    // paso automáticamente al resultado
                    if (
                        this.data.currentPage ===
                        "juego"
                    ) {
                        currentPage =
                            "resultado";
                    }
                }

                // Si una ronda fue reiniciada,
                // ambos vuelven a la pantalla de espera
                if (
                    !roomValue.roundResolved &&
                    this.data.currentPage ===
                    "resultado"
                ) {
                    result = null;
                    currentPage = "esperando";
                }

                this.setState({
                    rtdbData: value,

                    opponentId:
                        opponentId || null,

                    opponentName:
                        opponent?.name || "",

                    currentGame: {
                        ...this.data.currentGame,

                        myReady:
                            me?.start || false,

                        opponentReady:
                            opponent?.start ||
                            false,

                        myPlay:
                            me?.choice || null,

                        opponentPlay:
                            opponent?.choice ||
                            null,
                    },

                    result,
                    score,
                    currentPage,
                });

                const bothPlayed =
                    me?.choice &&
                    opponent?.choice;

                // Si los dos jugaron y todavía
                // nadie resolvió la ronda
                if (
                    bothPlayed &&
                    !roomValue.roundResolved
                ) {
                    // Elegimos siempre al mismo
                    // navegador para resolver
                    const resolverId =
                        [...playerIds].sort()[0];

                    if (
                        this.data.userId ===
                        resolverId
                    ) {
                        this.resolveRound().catch(
                            (error) => {
                                console.error(
                                    error
                                );
                            }
                        );
                    }
                }
            }
        );
    },

    setState(newState) {
        this.data = {
            ...this.data,
            ...newState,
        };

        for (const cb of this.listeners) {
            cb();
        }

        console.log(
            "El estado cambió:",
            this.data
        );
    },

    subscribe(callback) {
        this.listeners.push(callback);
    },
};

export { state };