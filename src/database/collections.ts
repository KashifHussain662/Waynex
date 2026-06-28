import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { getWaynexFirestore } from "../services/firebase/firebaseApp";
import { WaynexCollectionMap } from "./schema";

export const collectionNames = {
  users: "users",
  posts: "posts",
  comments: "comments",
  stories: "stories",
  chatRooms: "chatRooms",
  messages: "messages",
  trips: "trips",
  tripMembers: "tripMembers",
  notifications: "notifications",
  followers: "followers",
  following: "following",
  savedPosts: "savedPosts",
  savedPlaces: "savedPlaces",
  memories: "memories",
  reports: "reports",
  hotels: "hotels",
  places: "places",
  roadReports: "roadReports",
  weatherCache: "weatherCache",
  settings: "settings",
} as const satisfies Record<keyof WaynexCollectionMap, string>;

export type CollectionName = keyof WaynexCollectionMap;

export function converter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(value: WithFieldValue<T>) {
      return value;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
      return { id: snapshot.id, ...snapshot.data(options) } as unknown as T;
    },
  };
}

export function waynexCollection<TName extends CollectionName>(
  name: TName,
): CollectionReference<WaynexCollectionMap[TName]> | null {
  const db = getWaynexFirestore();
  return db ? collection(db, collectionNames[name]).withConverter(converter<WaynexCollectionMap[TName]>()) : null;
}

export function waynexDoc<TName extends CollectionName>(name: TName, id: string) {
  const db = getWaynexFirestore();
  return db ? doc(db, collectionNames[name], id).withConverter(converter<WaynexCollectionMap[TName]>()) : null;
}

export const subcollectionPaths = {
  postComments: (postId: string) => `posts/${postId}/comments`,
  postLikes: (postId: string) => `posts/${postId}/likes`,
  chatMessages: (chatRoomId: string) => `chatRooms/${chatRoomId}/messages`,
  tripMembers: (tripId: string) => `trips/${tripId}/members`,
  userFollowers: (userId: string) => `users/${userId}/followers`,
  userFollowing: (userId: string) => `users/${userId}/following`,
  userNotifications: (userId: string) => `users/${userId}/notifications`,
  userSavedPosts: (userId: string) => `users/${userId}/savedPosts`,
  userSavedPlaces: (userId: string) => `users/${userId}/savedPlaces`,
  userMemories: (userId: string) => `users/${userId}/memories`,
};
