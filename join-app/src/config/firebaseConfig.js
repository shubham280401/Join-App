import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrv_CCalKIg-cGQECwU8CZ0F5UZaiQKs0",
  authDomain: "join-app-a680a.firebaseapp.com",
  projectId: "join-app-a680a",
  storageBucket: "join-app-a680a.appspot.com",
  messagingSenderId: "900145231197",
  appId: "1:900145231197:web:dc8a1e075b6e7ea9f6a4b4",
  measurementId: "G-VN2F0RK64G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  writeBatch,
};
