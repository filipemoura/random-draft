import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAQYCkgAfWJT86qpbjNvUotOpZLIDvMS2g",
  authDomain: "random-draft-457cb.firebaseapp.com",
  databaseURL: "https://random-draft-457cb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "random-draft-457cb",
  storageBucket: "random-draft-457cb.firebasestorage.app",
  messagingSenderId: "441147357738",
  appId: "1:441147357738:web:1b79de105155875813a153",
  measurementId: "G-8Z51HVX18T"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);