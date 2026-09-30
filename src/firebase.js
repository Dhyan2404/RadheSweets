// Firebase SDK Integration for Radhe Sweets Cloud ERP
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBwwDF69fFaa0dT7praHTIpwmL4RlQ24i0",
  authDomain: "radhesweets0.firebaseapp.com",
  projectId: "radhesweets0",
  storageBucket: "radhesweets0.firebasestorage.app",
  messagingSenderId: "968718161119",
  appId: "1:968718161119:web:30822e03e06865eb25056a",
  measurementId: "G-6S1GR5B6TF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.log("Firebase analytics initialized in browser mode.");
}

export { analytics };
