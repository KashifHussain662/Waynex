import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";
import { getWaynexAuth, getWaynexFirestore } from "./firebaseApp";
import { ApiError } from "../../api/errors";

function database() {
  return getWaynexFirestore();
}

function requireAuth() {
  const user = getWaynexAuth()?.currentUser;
  if (!user) {
    throw new ApiError("Please sign in before performing this action.", "AUTH_REQUIRED");
  }
  return user;
}

function mapFirestoreError(error: unknown): ApiError {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "firestore/unknown";
  const message =
    code === "permission-denied"
      ? "You do not have permission to access this data."
      : code === "unavailable"
        ? "Network unavailable. Your changes will sync when connection returns."
        : code === "not-found"
          ? "The requested document was not found."
          : "Database request failed. Please try again.";

  return new ApiError(message, code === "unavailable" ? "NETWORK_ERROR" : code === "permission-denied" ? "FORBIDDEN" : "UNKNOWN", undefined, error);
}

export const firestoreService = {
  requireAuth,
  mapFirestoreError,
  async get<T>(path: string, id: string) {
    const db = database();
    if (!db) {
      return null;
    }

    try {
      const snapshot = await getDoc(doc(db, path, id));
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
    } catch (error) {
      throw mapFirestoreError(error);
    }
  },
  async list<T>(path: string, constraints: QueryConstraint[] = []) {
    const db = database();
    if (!db) {
      return null;
    }

    try {
      const snapshot = await getDocs(query(collection(db, path), ...constraints));
      return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
    } catch (error) {
      throw mapFirestoreError(error);
    }
  },
  subscribeList<T>(
    path: string,
    onData: (items: T[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (error: ApiError) => void,
  ): Unsubscribe | null {
    const db = database();
    if (!db) {
      return null;
    }

    return onSnapshot(
      query(collection(db, path), ...constraints),
      (snapshot) => {
        onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T));
      },
      (error) => {
        onError?.(mapFirestoreError(error));
      },
    );
  },
  async upsert<T extends DocumentData>(path: string, id: string, value: T) {
    requireAuth();
    const db = database();
    if (!db) {
      return false;
    }

    try {
      await setDoc(doc(db, path, id), { ...value, updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch (error) {
      throw mapFirestoreError(error);
    }
  },
  async create<T extends DocumentData>(path: string, id: string, value: T) {
    requireAuth();
    const db = database();
    if (!db) {
      return false;
    }

    try {
      await setDoc(doc(db, path, id), { ...value, id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      return true;
    } catch (error) {
      throw mapFirestoreError(error);
    }
  },
  async update<T extends DocumentData>(path: string, id: string, value: Partial<T>) {
    requireAuth();
    const db = database();
    if (!db) {
      return false;
    }

    try {
      await updateDoc(doc(db, path, id), { ...value, updatedAt: serverTimestamp() });
      return true;
    } catch (error) {
      throw mapFirestoreError(error);
    }
  },
  async delete(path: string, id: string) {
    requireAuth();
    const db = database();
    if (!db) {
      return false;
    }

    try {
      await deleteDoc(doc(db, path, id));
      return true;
    } catch (error) {
      throw mapFirestoreError(error);
    }
  },
  newestFirst(field = "createdAt", count = 50) {
    return [orderBy(field, "desc"), limit(count)];
  },
  expiresIn(hours: number) {
    return Timestamp.fromDate(new Date(Date.now() + hours * 60 * 60 * 1000));
  },
};
