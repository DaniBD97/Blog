// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-b9b05.firebaseapp.com",
  projectId: "blog-b9b05",
  storageBucket: "blog-b9b05.appspot.com",
  messagingSenderId: "300234460977",
  appId: "1:300234460977:web:d380553139f9432cdaaa10"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);