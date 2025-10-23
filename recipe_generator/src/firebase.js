// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBJoQgunUF1Mo7MweqQqkXG0wcdRJIg2yY",
//   authDomain: "food-recipe-generator-8805.firebaseapp.com",
//   projectId: "food-recipe-generator-8805",
//   storageBucket: "food-recipe-generator-8805.firebasestorage.app",
//   messagingSenderId: "428009874193",
//   appId: "1:428009874193:web:c9d87fea2e9feefa89e2b0",
//   measurementId: "G-9TB6KN25TC"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);


// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with your Firebase project config values
const firebaseConfig = {
  apiKey: "AIzaSyBJoQgunUF1Mo7MweqQqkXG0wcdRJIg2yY",
  authDomain: "food-recipe-generator-8805.firebaseapp.com",
  projectId: "food-recipe-generator-8805",
  storageBucket: "food-recipe-generator-8805.firebasestorage.app",
  messagingSenderId: "428009874193",
  appId: "1:428009874193:web:c9d87fea2e9feefa89e2b0",
  measurementId: "G-9TB6KN25TC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
