import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, Persistence, getAuth, initializeAuth } from "firebase/auth";
import * as FirebaseAuth from "firebase/auth";
import { Firestore, getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { environment, hasFirebaseConfig } from "../../config/environment";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;
let firebaseStorage: FirebaseStorage | null = null;

const reactNativePersistence = (FirebaseAuth as unknown as {
  getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
}).getReactNativePersistence?.(AsyncStorage);

export function getWaynexFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApp() : initializeApp(environment.firebase);
  }

  return firebaseApp;
}

export function getWaynexAuth() {
  const app = getWaynexFirebaseApp();
  if (!app) {
    return null;
  }

  if (!firebaseAuth) {
    try {
      firebaseAuth = reactNativePersistence ? initializeAuth(app, { persistence: reactNativePersistence }) : getAuth(app);
    } catch {
      firebaseAuth = getAuth(app);
    }
  }

  return firebaseAuth;
}

export function getWaynexFirestore() {
  const app = getWaynexFirebaseApp();
  if (!app) {
    return null;
  }

  if (!firebaseDb) {
    try {
      firebaseDb = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch {
      firebaseDb = getFirestore(app);
    }
  }

  return firebaseDb;
}

export function getWaynexStorage() {
  const app = getWaynexFirebaseApp();
  if (!app) {
    return null;
  }

  if (!firebaseStorage) {
    firebaseStorage = getStorage(app);
  }

  return firebaseStorage;
}

export const firebase = {
  get app() {
    return getWaynexFirebaseApp();
  },
  get auth() {
    return getWaynexAuth();
  },
  get db() {
    return getWaynexFirestore();
  },
  get storage() {
    return getWaynexStorage();
  },
};

export const app = getWaynexFirebaseApp();
export const auth = getWaynexAuth();
export const db = getWaynexFirestore();
export const storage = getWaynexStorage();
