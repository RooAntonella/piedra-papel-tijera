import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCdCitJBpeN9GvECHfEudzyKyPtKRajr3Y",
    authDomain: "piedra-papel-tijera-onli-92052.firebaseapp.com",
    databaseURL: "https://piedra-papel-tijera-onli-92052-default-rtdb.firebaseio.com",
    projectId: "piedra-papel-tijera-onli-92052",
    storageBucket: "piedra-papel-tijera-onli-92052.firebasestorage.app",
    messagingSenderId: "525434883667",
    appId: "1:525434883667:web:f0691b2eae98ebb18500a6"
};

const firebaseApp = initializeApp(firebaseConfig);

export const rtdb = getDatabase(firebaseApp);