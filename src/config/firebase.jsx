// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (which you already have)
const firebaseConfig = {
  apiKey: "AIzaSyDrVsq3bMvhFg2RVHmt981FgF1EtjLhHrQ",
  authDomain: "flappyu-4f455.firebaseapp.com",
  projectId: "flappyu-4f455",
  storageBucket: "flappyu-4f455.appspot.com",
  messagingSenderId: "508701564965",
  appId: "1:508701564965:web:49d9905a3d072dee021fcc",
  measurementId: "G-H6EP5KP55Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);