// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-i7J-YobRrnyvSx0-k1C2o1Y5WmKiJUI",
  authDomain: "invitaciones-a8875.firebaseapp.com",
  projectId: "invitaciones-a8875",
  storageBucket: "invitaciones-a8875.firebasestorage.app",
  messagingSenderId: "598552031289",
  appId: "1:598552031 289:web:1dc833934e2943fd929de8",
  measurementId: "G-V2QB9YZHHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);