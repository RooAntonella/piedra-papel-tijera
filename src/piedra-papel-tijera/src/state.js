const state = {
    data: {
        currentPage: "inicio",

        currentGame: {
            myPlay: null,
            computerPlay: null,
        },

        history: {
            myScore: 0,
            computerScore: 0,
        },
    },

    listeners: [],
    gameStatus: "idle",
    getState() {
        return this.data;
    },

    setState(newState) {
        this.data = {
            ...this.data,
            ...newState,
        };

        for (const cb of this.listeners) {
            cb();
        }

        console.log("El estado cambió:", this.data);
    },

    subscribe(callback) {
        this.listeners.push(callback);
    },
};

export { state };