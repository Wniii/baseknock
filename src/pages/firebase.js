// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAS9i4vURpqqpi8hsSV20RSFi6DqUU8Cc8",
    authDomain: "baseknock-b309d.firebaseapp.com",
    databaseURL: "https://baseknock-b309d-default-rtdb.firebaseio.com",
    projectId: "baseknock-b309d",
    storageBucket: "baseknock-b309d.appspot.com",
    messagingSenderId: "833396187285",
    appId: "1:833396187285:web:1fc67e53a4ead9cd997b9c",
    measurementId: "G-GCJLCCW76J"
  };

let app;
let analytics;
let firestore;

if (typeof window !== 'undefined') {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    firestore = getFirestore(app);
}

// Initialize Firebase
export { firestore };
