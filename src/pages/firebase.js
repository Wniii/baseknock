// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 导入getStorage

const firebaseConfig = {
    apiKey: "AIzaSyCCKNU9obvHvR8dh82qPT7qBmSs0icpZBw",
    authDomain: "test-e9b32.firebaseapp.com",
    projectId: "test-e9b32",
    storageBucket: "test-e9b32.appspot.com",
    messagingSenderId: "198527740789",
    appId: "1:198527740789:web:58d86bcf0c84628505813c",
    measurementId: "G-R83MG1D5MM"
  };

let app;
let analytics;
let firestore;
let storage; // 声明storage变量

if (typeof window !== 'undefined') {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    firestore = getFirestore(app);
    storage = getStorage(app); // 初始化storage

}

// Initialize Firebase
export { firestore, storage }; // 导出storage
