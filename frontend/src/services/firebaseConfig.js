import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDeVomDUr5v7KYYiLfL7-56LVcfm_9bTVQ",
    authDomain: "portal-95d84.firebaseapp.com",
    projectId: "portal-95d84",
    storageBucket: "portal-95d84.appspot.com",
    messagingSenderId: "887415931428",
    appId: "1:887415931428:web:29081b666e6a1e077a8eb1",
    measurementId: "G-Q60VQZVNGT"
  };

  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };