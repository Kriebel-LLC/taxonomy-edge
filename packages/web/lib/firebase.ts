import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "@/env.mjs";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "saas-test-fcce6.firebaseapp.com",
  databaseURL: "https://saas-test-fcce6-default-rtdb.firebaseio.com",
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "saas-test-fcce6.appspot.com",
  messagingSenderId: "695159131699",
  appId: "1:695159131699:web:05e9fdc2e23a95bd7b9d46",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
