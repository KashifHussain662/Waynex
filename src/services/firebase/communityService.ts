import {
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getWaynexAuth, getWaynexFirestore } from "./firebaseApp";
import { firebaseStorageService, UploadProgress } from "./storageService";
import {
  CommentDocument,
  MediaAsset,
  PostCategory,
  PostDocument,
  ReportDocument,
  StoryDocument,
  Visibility,
  WaynexLocation,
  WeatherSnapshot,
} from "../../database";
import { ApiError } from "../../api/errors";

type DraftMedia = {
  uri: string;
  kind: "image" | "video";
  contentType?: string;
  fileName?: string;
};

export type CreatePostInput = {
  text: string;
  media?: DraftMedia[];
  location?: { latitude: number; longitude: number; address?: string; city?: string; country?: string };
  destination?: string;
  weather?: Omit<WeatherSnapshot, "fetchedAt">;
  category?: PostCategory;
  visibility?: Visibility;
  tripId?: string;
  routeName?: string;
  onUploadProgress?: (index: number, progress: UploadProgress) => void;
};

export type CreateStoryInput = {
  media: DraftMedia;
  text?: string;
  location?: CreatePostInput["location"];
  visibility?: Visibility;
  onUploadProgress?: (progress: UploadProgress) => void;
};

function db() {
  const firestore = getWaynexFirestore();
  if (!firestore) {
    throw new ApiError("Firebase is not configured.", "UNKNOWN");
  }
  return firestore;
}

function userId() {
  const user = getWaynexAuth()?.currentUser;
  if (!user) {
    throw new ApiError("Please sign in before performing this action.", "AUTH_REQUIRED");
  }
  return user.uid;
}

function keywords(...values: (string | undefined)[]) {
  return Array.from(
    new Set(
      values
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9#@]+/i)
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function hashtags(text: string) {
  return Array.from(new Set(Array.from(text.matchAll(/#([\w-]+)/g)).map((match) => match[1].toLowerCase())));
}

function toLocation(location?: CreatePostInput["location"]): WaynexLocation | undefined {
  if (!location) {
    return undefined;
  }

  return {
    geopoint: new GeoPoint(location.latitude, location.longitude),
    geohash: `${location.latitude.toFixed(3)}_${location.longitude.toFixed(3)}`,
    address: location.address,
    city: location.city,
    country: location.country,
  };
}

async function uploadDraftMedia(ownerId: string, media: DraftMedia[], onProgress?: CreatePostInput["onUploadProgress"]) {
  const uploaded: MediaAsset[] = [];

  for (const [index, item] of media.entries()) {
    const contentType = item.contentType ?? (item.kind === "video" ? "video/mp4" : "image/jpeg");
    const fileName = item.fileName ?? `${item.kind}-${index}.${item.kind === "video" ? "mp4" : "jpg"}`;
    const downloadURL = await firebaseStorageService.uploadMedia({
      uri: item.uri,
      folder: item.kind === "video" ? "videos" : "post-images",
      ownerId,
      fileName,
      contentType,
      compress: item.kind === "image",
      onProgress: (progress) => onProgress?.(index, progress),
    });

    if (!downloadURL) {
      throw new ApiError("Media upload is queued and will retry when the network is available.", "NETWORK_ERROR");
    }

    uploaded.push({
      id: `${Date.now()}-${index}`,
      kind: item.kind,
      storagePath: "",
      downloadURL,
      contentType,
      sizeBytes: 0,
      createdAt: Timestamp.now(),
    });
  }

  return uploaded;
}

export const communityService = {
  async createPost(input: CreatePostInput) {
    const authorId = userId();
    const media = await uploadDraftMedia(authorId, input.media ?? [], input.onUploadProgress);
    const reference = doc(collection(db(), "posts"));
    const now = serverTimestamp();
    const text = input.text.trim();

    const post: Omit<PostDocument, "createdAt" | "updatedAt"> & Record<string, unknown> = {
      id: reference.id,
      authorId,
      tripId: input.tripId,
      text,
      media,
      location: toLocation(input.location),
      destination: input.destination?.trim() || undefined,
      weather: input.weather ? { ...input.weather, fetchedAt: Timestamp.now() } : undefined,
      route: input.routeName ? { name: input.routeName, updatedAt: Timestamp.now() } : undefined,
      category: input.category ?? (media.some((item) => item.kind === "video") ? "video" : media.length ? "image" : "text"),
      visibility: input.visibility ?? "public",
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savedCount: 0,
      hashtags: hashtags(text),
      searchKeywords: keywords(text, input.destination, input.routeName),
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(reference, post);
    await updateDoc(doc(db(), "users", authorId), { postsCount: increment(1), travelXP: increment(5), updatedAt: now }).catch(() => undefined);
    return reference.id;
  },

  updatePost(postId: string, input: Partial<Pick<CreatePostInput, "text" | "destination" | "category" | "visibility">>) {
    const text = input.text?.trim();
    return updateDoc(doc(db(), "posts", postId), {
      ...input,
      ...(text ? { text, hashtags: hashtags(text), searchKeywords: keywords(text, input.destination) } : {}),
      updatedAt: serverTimestamp(),
    });
  },

  async deletePost(postId: string) {
    const uid = userId();
    await runTransaction(db(), async (transaction) => {
      const reference = doc(db(), "posts", postId);
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists()) {
        return;
      }
      if (snapshot.data().authorId !== uid) {
        throw new ApiError("Only the author can delete this post.", "FORBIDDEN");
      }
      transaction.delete(reference);
      transaction.update(doc(db(), "users", uid), { postsCount: increment(-1), updatedAt: serverTimestamp() });
    });
  },

  async likePost(postId: string) {
    const uid = userId();
    await runTransaction(db(), async (transaction) => {
      const likeReference = doc(db(), "posts", postId, "likes", uid);
      if ((await transaction.get(likeReference)).exists()) {
        return;
      }
      transaction.set(likeReference, { id: uid, postId, userId: uid, createdAt: serverTimestamp() });
      transaction.update(doc(db(), "posts", postId), { likesCount: increment(1), updatedAt: serverTimestamp() });
    });
  },

  async unlikePost(postId: string) {
    const uid = userId();
    await runTransaction(db(), async (transaction) => {
      const likeReference = doc(db(), "posts", postId, "likes", uid);
      if (!(await transaction.get(likeReference)).exists()) {
        return;
      }
      transaction.delete(likeReference);
      transaction.update(doc(db(), "posts", postId), { likesCount: increment(-1), updatedAt: serverTimestamp() });
    });
  },

  async savePost(postId: string) {
    const uid = userId();
    const saveId = `${uid}_${postId}`;
    await setDoc(doc(db(), "savedPosts", saveId), { id: saveId, userId: uid, postId, createdAt: serverTimestamp() });
    await updateDoc(doc(db(), "posts", postId), { savedCount: increment(1), updatedAt: serverTimestamp() });
  },

  async unsavePost(postId: string) {
    const uid = userId();
    await deleteDoc(doc(db(), "savedPosts", `${uid}_${postId}`));
    await updateDoc(doc(db(), "posts", postId), { savedCount: increment(-1), updatedAt: serverTimestamp() });
  },

  async sharePost(postId: string) {
    await updateDoc(doc(db(), "posts", postId), { sharesCount: increment(1), updatedAt: serverTimestamp() });
  },

  async comment(postId: string, text: string, parentCommentId?: string) {
    const authorId = userId();
    const reference = doc(collection(db(), "comments"));
    await setDoc(reference, {
      id: reference.id,
      postId,
      authorId,
      parentCommentId,
      text: text.trim(),
      media: [],
      likesCount: 0,
      visibility: "public",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies Omit<CommentDocument, "createdAt" | "updatedAt"> & Record<string, unknown>);
    await updateDoc(doc(db(), "posts", postId), { commentsCount: increment(1), updatedAt: serverTimestamp() });
    return reference.id;
  },

  async reportPost(postId: string, reason: ReportDocument["reason"] = "other", details?: string) {
    const reporterId = userId();
    const reference = doc(collection(db(), "reports"));
    await setDoc(reference, {
      id: reference.id,
      reporterId,
      targetType: "post",
      targetId: postId,
      reason,
      details,
      status: "open",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies Omit<ReportDocument, "createdAt" | "updatedAt"> & Record<string, unknown>);
    return reference.id;
  },

  subscribeComments(postId: string, onData: (comments: CommentDocument[]) => void) {
    return onSnapshot(query(collection(db(), "comments"), where("postId", "==", postId), orderBy("createdAt", "asc")), (snapshot) => {
      onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CommentDocument));
    });
  },

  subscribeStories(onData: (stories: StoryDocument[]) => void) {
    return onSnapshot(
      query(collection(db(), "stories"), where("expiresAt", ">", Timestamp.now()), orderBy("expiresAt", "asc"), limit(30)),
      (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as StoryDocument)),
    );
  },

  async createStory(input: CreateStoryInput) {
    const authorId = userId();
    const [media] = await uploadDraftMedia(authorId, [input.media], (_, progress) => input.onUploadProgress?.(progress));
    const reference = doc(collection(db(), "stories"));
    await setDoc(reference, {
      id: reference.id,
      authorId,
      media,
      text: input.text,
      location: toLocation(input.location),
      visibility: input.visibility ?? "public",
      viewersCount: 0,
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      createdAt: serverTimestamp(),
    } satisfies Omit<StoryDocument, "createdAt"> & Record<string, unknown>);
    return reference.id;
  },

  async follow(followingId: string) {
    const followerId = userId();
    const id = `${followerId}_${followingId}`;
    await setDoc(doc(db(), "followers", id), { id, followerId, followingId, createdAt: serverTimestamp() });
    await updateDoc(doc(db(), "users", followerId), { followingCount: increment(1), updatedAt: serverTimestamp() });
    await updateDoc(doc(db(), "users", followingId), { followersCount: increment(1), updatedAt: serverTimestamp() });
  },

  async unfollow(followingId: string) {
    const followerId = userId();
    await deleteDoc(doc(db(), "followers", `${followerId}_${followingId}`));
    await updateDoc(doc(db(), "users", followerId), { followingCount: increment(-1), updatedAt: serverTimestamp() });
    await updateDoc(doc(db(), "users", followingId), { followersCount: increment(-1), updatedAt: serverTimestamp() });
  },

  async recentPosts(count = 30) {
    const snapshot = await getDocs(query(collection(db(), "posts"), orderBy("createdAt", "desc"), limit(count)));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as PostDocument);
  },
};
