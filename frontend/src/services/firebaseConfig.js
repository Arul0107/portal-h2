import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeVomDUr5v7KYYiLfL7-56LVcfm_9bTVQ",
  authDomain: "portal-95d84.firebaseapp.com",
  projectId: "portal-95d84",
  storageBucket: "portal-95d84.appspot.com",
  messagingSenderId: "887415931428",
  appId: "1:887415931428:web:29081b666e6a1e077a8eb1",
  measurementId: "G-Q60VQZVNGT",
  databaseURL: "https://portal-95d84-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase Storage and export it
const storage = getStorage(app); // Add this line to initialize Firebase Storage

export { database, storage }; // Export both database and storage
