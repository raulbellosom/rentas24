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
  apiKey: "AIzaSyDdHyB0c08IlsNapfHE55g4qI2HPz1okIg",
  authDomain: "rentas24-606a9.firebaseapp.com",
  projectId: "rentas24-606a9",
  storageBucket: "rentas24-606a9.appspot.com",
  messagingSenderId: "235599254503",
  appId: "1:235599254503:web:4271da7a19f6cd7bc0e342",
  measurementId: "G-90J0SGHZYH",
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
