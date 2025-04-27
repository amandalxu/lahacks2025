// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAl4wqD5S84GsREP66jtJ1SNJqYNStVaF0",
    authDomain: "lahacks2025-34c0e.firebaseapp.com",
    projectId: "lahacks2025-34c0e",
    storageBucket: "lahacks2025-34c0e.firebasestorage.app",
    messagingSenderId: "652533473249",
    appId: "1:652533473249:web:fb271067624bb4867dfca0",
    measurementId: "G-BT2EWTKKJD"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
