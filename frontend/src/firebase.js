import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD2CyMcOiMGqQq9MMhlY1mrA3JPxDwXFT8",
    authDomain: "blockchainvoting-cfe12.firebaseapp.com",
    projectId: "blockchainvoting-cfe12",
    storageBucket: "blockchainvoting-cfe12.appspot.com",
    messagingSenderId: "708937790645",
    appId: "1:708937790645:web:6c0c08fcefd912332afafc",
    measurementId: "G-G1Z0CHSJ7L"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();