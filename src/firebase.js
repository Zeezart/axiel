// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "axiel-174e8.firebaseapp.com",
  projectId: "axiel-174e8",
  storageBucket: "axiel-174e8.appspot.com",
  messagingSenderId: "406003838665",
  appId: "1:406003838665:web:b5b0d4a45aa6cb796fa718"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const storage = getStorage()
export const db = getFirestore(app)