import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import fs from "fs";

const serviceAccount = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf8")
);

const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    databaseURL:
        "https://piedra-papel-tijera-onli-92052-default-rtdb.firebaseio.com/",
});

export const db = getFirestore(firebaseApp);
export const rtdb = getDatabase(firebaseApp);