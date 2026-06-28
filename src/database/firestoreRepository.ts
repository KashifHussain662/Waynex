import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { CollectionName, waynexCollection, waynexDoc } from "./collections";
import { WaynexCollectionMap } from "./schema";

export type CreateDocument<TName extends CollectionName> = Omit<
  WaynexCollectionMap[TName],
  "id" | "createdAt" | "updatedAt"
> &
  Partial<WaynexCollectionMap[TName]>;

export class FirestoreRepository<TName extends CollectionName> {
  constructor(private readonly name: TName) {}

  async get(id: string) {
    const reference = waynexDoc(this.name, id);
    if (!reference) {
      return null;
    }

    const snapshot = await getDoc(reference);
    return snapshot.exists() ? snapshot.data() : null;
  }

  async list(constraints: QueryConstraint[] = []) {
    const reference = waynexCollection(this.name);
    if (!reference) {
      return [];
    }

    const snapshot = await getDocs(query(reference, ...constraints));
    return snapshot.docs.map((item) => item.data());
  }

  subscribe(constraints: QueryConstraint[], onData: (items: WaynexCollectionMap[TName][]) => void) {
    const reference = waynexCollection(this.name);
    if (!reference) {
      return () => undefined;
    }

    return onSnapshot(query(reference, ...constraints), (snapshot) => {
      onData(snapshot.docs.map((item) => item.data()));
    });
  }

  async create(input: CreateDocument<TName>) {
    const reference = waynexCollection(this.name);
    if (!reference) {
      return null;
    }

    const payload = {
      ...input,
      createdAt: "createdAt" in input && input.createdAt ? input.createdAt : serverTimestamp(),
      ...(!("updatedAt" in input) || input.updatedAt ? {} : { updatedAt: serverTimestamp() }),
    } as WaynexCollectionMap[TName];

    if (input.id) {
      await setDoc(waynexDoc(this.name, input.id)!, payload);
      return input.id;
    }

    const created = await addDoc(reference, payload);
    return created.id;
  }

  async update(id: string, input: Partial<WaynexCollectionMap[TName]>) {
    const reference = waynexDoc(this.name, id);
    if (!reference) {
      return false;
    }

    await updateDoc(reference, { ...input, updatedAt: serverTimestamp() });
    return true;
  }

  async upsert(id: string, input: Partial<WaynexCollectionMap[TName]>) {
    const reference = waynexDoc(this.name, id);
    if (!reference) {
      return false;
    }

    await setDoc(reference, { ...input, id, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  }

  async delete(id: string) {
    const reference = waynexDoc(this.name, id);
    if (!reference) {
      return false;
    }

    await deleteDoc(reference);
    return true;
  }

  recent(count = 30) {
    return this.list([orderBy("createdAt", "desc"), limit(count)]);
  }

  byUser(userId: string, count = 30) {
    return this.list([where("userId", "==", userId), orderBy("createdAt", "desc"), limit(count)]);
  }
}

export const dbRepositories = {
  users: new FirestoreRepository("users"),
  posts: new FirestoreRepository("posts"),
  comments: new FirestoreRepository("comments"),
  stories: new FirestoreRepository("stories"),
  chatRooms: new FirestoreRepository("chatRooms"),
  messages: new FirestoreRepository("messages"),
  trips: new FirestoreRepository("trips"),
  tripMembers: new FirestoreRepository("tripMembers"),
  notifications: new FirestoreRepository("notifications"),
  followers: new FirestoreRepository("followers"),
  following: new FirestoreRepository("following"),
  savedPosts: new FirestoreRepository("savedPosts"),
  savedPlaces: new FirestoreRepository("savedPlaces"),
  memories: new FirestoreRepository("memories"),
  reports: new FirestoreRepository("reports"),
  hotels: new FirestoreRepository("hotels"),
  places: new FirestoreRepository("places"),
  roadReports: new FirestoreRepository("roadReports"),
  weatherCache: new FirestoreRepository("weatherCache"),
  settings: new FirestoreRepository("settings"),
};
