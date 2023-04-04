import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadProfile(file) {
  const name = uuidv4();

  const storageRef = ref(storage, `user_profile/${name}`);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return url;
}

export async function uploadPortada(file) {
  const name = uuidv4();

  const storageRef = ref(storage, `user_portada/${name}`);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export function deleteProfileImage(file) {
  const desertRef = ref(storage, `user_profile/${file}`);

  deleteObject(desertRef)
    .then((data) => {
      console.log("objeto eliminado: ", data);
    })
    .catch((err) => {
      console.log("err", err);
    });
}
