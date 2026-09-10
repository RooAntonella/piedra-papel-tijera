import express from "express";
import { db, rtdb } from "./firebaseAdmin.js";
import { getWinner } from "./src/game/logic.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
}
async function addPlayerToRealtimeGame(roomId, userId, name) {
    await rtdb
        .ref(`rooms/${roomId}/currentGame/${userId}`)
        .set({
            name,
            choice: null,
            online: true,
            start: false,
        });
}
app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        message: "Backend de Piedra Papel Tijera funcionando",
    });
});

app.get("/api/firestore-test", async (req, res) => {
    try {
        await db.collection("rooms").limit(1).get();

        res.json({
            ok: true,
            message: "Firestore conectado correctamente",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            message: "Error conectando con Firestore",
        });
    }
});
app.get("/api/rtdb-test", async (req, res) => {
    try {
        await rtdb.ref("test").set({
            connected: true,
        });

        res.json({
            ok: true,
            message: "Realtime Database conectada correctamente",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            message: "Error conectando con Realtime Database",
        });
    }
});
app.post("/api/users", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "El nombre es obligatorio",
            });
        }

        const userRef = await db.collection("users").add({
            name,
        });

        res.status(201).json({
            message: "Usuario creado",
            id: userRef.id,
            name,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al crear usuario",
        });
    }
});
app.post("/api/rooms", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "El userId es obligatorio",
            });
        }

        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        const userData = userDoc.data();

        let code;
        let codeExists = true;

        while (codeExists) {
            code = generateRoomCode();

            const existingRoom = await db
                .collection("rooms")
                .where("code", "==", code)
                .limit(1)
                .get();

            codeExists = !existingRoom.empty;
        }

        const roomRef = await db.collection("rooms").add({
            code,
            players: {
                [userId]: {
                    name: userData.name,
                    score: 0,
                },
            },
            createdAt: Date.now(),
        });

        await addPlayerToRealtimeGame(
            roomRef.id,
            userId,
            userData.name
        );
        res.status(201).json({
            message: "Room creado",
            roomId: roomRef.id,
            code,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al crear room",
        });
    }
});
app.post("/api/rooms/:code/players", async (req, res) => {
    try {
        const { code } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "El userId es obligatorio",
            });
        }


        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        const roomSnapshot = await db
            .collection("rooms")
            .where("code", "==", code)
            .limit(1)
            .get();

        if (roomSnapshot.empty) {
            return res.status(404).json({
                message: "Room no encontrado",
            });
        }

        const roomDoc = roomSnapshot.docs[0];
        const roomData = roomDoc.data();

        const players = roomData.players || {};

        if (!players[userId] && Object.keys(players).length >= 2) {
            return res.status(400).json({
                message: "El room está completo",
            });
        }

        const userData = userDoc.data();

        await db.collection("rooms").doc(roomDoc.id).update({
            [`players.${userId}`]: {
                name: userData.name,
                score: 0,
            },
        });
        await addPlayerToRealtimeGame(
            roomDoc.id,
            userId,
            userData.name
        );

        res.json({
            message: "Jugador agregado al room",
            roomId: roomDoc.id,
            code,
            userId,
            name: userData.name,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al entrar al room",
        });
    }
});
app.patch("/api/rooms/:roomId/game/:userId", async (req, res) => {
    try {
        const { roomId, userId } = req.params;
        const data = req.body;

        const allowedFields = ["start", "choice", "online"];
        const updates = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No hay datos válidos para actualizar",
            });
        }

        await rtdb
            .ref(`rooms/${roomId}/currentGame/${userId}`)
            .update(updates);

        res.json({
            message: "Estado del jugador actualizado",
            data: updates,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al actualizar el estado del jugador",
        });
    }
});
app.post("/api/rooms/:roomId/results", async (req, res) => {
    try {
        const { roomId } = req.params;

        const gameRef = rtdb.ref(`rooms/${roomId}`);
        const snapshot = await gameRef.get();
        const realtimeData = snapshot.val();

        if (!realtimeData?.currentGame) {
            return res.status(404).json({
                message: "Partida no encontrada",
            });
        }

        // Evita contar dos veces la misma partida
        if (realtimeData.roundResolved) {
            return res.status(409).json({
                message: "Esta partida ya fue resuelta",
            });
        }

        const players = realtimeData.currentGame;
        const playerIds = Object.keys(players);

        if (playerIds.length !== 2) {
            return res.status(400).json({
                message: "Se necesitan dos jugadores",
            });
        }

        const [playerOneId, playerTwoId] = playerIds;

        const playerOne = players[playerOneId];
        const playerTwo = players[playerTwoId];

        if (!playerOne.choice || !playerTwo.choice) {
            return res.status(400).json({
                message: "Ambos jugadores deben elegir una jugada",
            });
        }

        const result = getWinner(
            playerOne.choice,
            playerTwo.choice
        );

        let winnerId = null;

        if (result === "ganaste") {
            winnerId = playerOneId;
        } else if (result === "perdiste") {
            winnerId = playerTwoId;
        }

        // Si hubo ganador, aumenta su score en Firestore
        if (winnerId) {
            const roomRef = db.collection("rooms").doc(roomId);
            const roomDoc = await roomRef.get();
            const roomData = roomDoc.data();

            const currentScore =
                roomData.players[winnerId].score || 0;

            await roomRef.update({
                [`players.${winnerId}.score`]: currentScore + 1,
            });
        }

        // Marco esta ronda como resuelta
        await gameRef.update({
            roundResolved: true,
            lastResult: {
                winnerId,
                playerOneChoice: playerOne.choice,
                playerTwoChoice: playerTwo.choice,
                createdAt: Date.now(),
            },
        });

        res.json({
            message: "Partida resuelta",
            winnerId,
            winnerName: winnerId
                ? players[winnerId].name
                : null,
            result: winnerId ? "hay ganador" : "empate",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al resolver la partida",
        });
    }
});
app.post("/api/rooms/:roomId/reset", async (req, res) => {
    try {
        const { roomId } = req.params;

        const gameRef = rtdb.ref(`rooms/${roomId}`);
        const snapshot = await gameRef.get();
        const roomData = snapshot.val();

        if (!roomData?.currentGame) {
            return res.status(404).json({
                message: "Room no encontrado",
            });
        }

        const players = roomData.currentGame;
        const updates = {};

        for (const userId of Object.keys(players)) {
            updates[`currentGame/${userId}/choice`] = null;
            updates[`currentGame/${userId}/start`] = false;
        }

        updates["roundResolved"] = false;

        await gameRef.update(updates);

        res.json({
            message: "Ronda reiniciada",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al reiniciar la ronda",
        });
    }
});
app.get("/api/rooms/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;

        const roomDoc = await db
            .collection("rooms")
            .doc(roomId)
            .get();

        if (!roomDoc.exists) {
            return res.status(404).json({
                message: "Room no encontrado",
            });
        }

        res.json({
            roomId: roomDoc.id,
            ...roomDoc.data(),
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener el room",
        });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});