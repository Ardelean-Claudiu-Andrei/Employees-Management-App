// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import firestore from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-_q0Vk7RvxEUqYNFTpKV46Q1cFU_0sYE",
  authDomain: "iss2024.firebaseapp.com",
  databaseURL: "https://iss2024-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iss2024",
  storageBucket: "iss2024.appspot.com",
  messagingSenderId: "744784187687",
  appId: "1:744784187687:web:e6cb9648bd5073c8b5d902",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
// const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = getDatabase(app);

export { auth, db };
