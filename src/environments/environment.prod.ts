// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWyWRpyaVDTbVkEmVCt62DNIi_cjKlTgw",
    authDomain: "fintrack-2025-v1.firebaseapp.com",
    projectId: "fintrack-2025-v1",
    storageBucket: "fintrack-2025-v1.firebasestorage.app",
    messagingSenderId: "1055834061231",
    appId: "1:1055834061231:web:0b9d1e72a6cb728e3d975a",
    measurementId: "G-49FQSLN4E5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);