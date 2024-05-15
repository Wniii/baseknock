// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCKNU9obvHvR8dh82qPT7qBmSs0icpZBw",
    authDomain: "test-e9b32.firebaseapp.com",
    projectId: "test-e9b32",
    storageBucket: "test-e9b32.appspot.com",
    messagingSenderId: "198527740789",
    appId: "1:198527740789:web:58d86bcf0c84628505813c",
    measurementId: "G-R83MG1D5MM"
};

// Initialize Firebase App once
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Services
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);
let analytics;

if (typeof window !== 'undefined') {
    // Initialize Analytics only on client-side
    analytics = getAnalytics(firebaseApp);
}

// Export initialized Firebase services
export { firestore, storage, auth, analytics, firebaseApp };
