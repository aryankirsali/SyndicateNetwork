import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCz9muO-2NTuyJxnGeLnVRNh1Pdzhmklx8",
    authDomain: "syndicate-network-363ee.firebaseapp.com",
    projectId: "syndicate-network-363ee",
    storageBucket: "syndicate-network-363ee.appspot.com",
    messagingSenderId: "990253238125",
    appId: "1:990253238125:web:5c9b90e26598828b99fc64",
    measurementId: "G-84H4J6X2F5"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
