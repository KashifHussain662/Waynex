import { collection, doc, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ChatRoomDocument, ChatRoomKind, MediaAsset, MessageDocument } from "../../database";
import { ApiError } from "../../api/errors";
import { getWaynexAuth, getWaynexFirestore } from "./firebaseApp";
import { firebaseStorageService, UploadProgress } from "./storageService";

type ChatAttachmentInput = {
  uri: string;
  kind: "image" | "video" | "voice" | "file";
  contentType?: string;
  fileName?: string;
  caption?: string;
};

function db() {
  const firestore = getWaynexFirestore();
  if (!firestore) {
    throw new ApiError("Firebase is not configured.", "UNKNOWN");
  }
  return firestore;
}

function uid() {
  const user = getWaynexAuth()?.currentUser;
  if (!user) {
    throw new ApiError("Please sign in before chatting.", "AUTH_REQUIRED");
  }
  return user.uid;
}

async function uploadAttachment(item: ChatAttachmentInput, index: number, onProgress?: (index: number, progress: UploadProgress) => void) {
  const ownerId = uid();
  const contentType = item.contentType ?? (item.kind === "video" ? "video/mp4" : item.kind === "voice" ? "audio/m4a" : "image/jpeg");
  const downloadURL = await firebaseStorageService.uploadMedia({
    uri: item.uri,
    folder: item.kind === "voice" ? "voice" : item.kind === "video" ? "videos" : "chat",
    ownerId,
    fileName: item.fileName ?? `chat-${Date.now()}-${index}`,
    contentType,
    compress: item.kind === "image",
    onProgress: (progress) => onProgress?.(index, progress),
  });

  if (!downloadURL) {
    throw new ApiError("Attachment upload is queued and will retry when the network is available.", "NETWORK_ERROR");
  }

  return {
    id: `${Date.now()}-${index}`,
    kind: item.kind,
    storagePath: "",
    downloadURL,
    contentType,
    sizeBytes: 0,
    caption: item.caption,
    createdAt: serverTimestamp(),
  } as unknown as MediaAsset & { caption?: string };
}

export const chatService = {
  async createRoom(kind: ChatRoomKind, participantIds: string[], title?: string, tripId?: string) {
    const currentUserId = uid();
    const id = kind === "direct" ? participantIds.sort().join("_") : doc(collection(db(), "chatRooms")).id;
    const participants = Array.from(new Set([currentUserId, ...participantIds])).reduce<ChatRoomDocument["participants"]>((acc, userId) => {
      acc[userId] = {
        userId,
        role: userId === currentUserId ? "owner" : "member",
        joinedAt: serverTimestamp() as never,
        unreadCount: 0,
      };
      return acc;
    }, {});

    await setDoc(
      doc(db(), "chatRooms", id),
      {
        id,
        kind,
        title,
        tripId,
        participantIds: Object.keys(participants),
        participants,
        createdBy: currentUserId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return id;
  },

  async sendMessage(chatRoomId: string, text?: string, attachments: ChatAttachmentInput[] = [], onProgress?: (index: number, progress: UploadProgress) => void) {
    const senderId = uid();
    const uploaded = await Promise.all(attachments.map((item, index) => uploadAttachment(item, index, onProgress)));
    const messageReference = doc(collection(db(), "chatRooms", chatRoomId, "messages"));
    const images = uploaded.filter((item) => item.kind === "image");
    const videos = uploaded.filter((item) => item.kind === "video");
    const voiceNotes = uploaded.filter((item) => item.kind === "voice");

    await setDoc(messageReference, {
      id: messageReference.id,
      chatRoomId,
      senderId,
      text: text?.trim() || undefined,
      attachments: uploaded,
      images,
      videos,
      voiceNotes,
      readBy: { [senderId]: serverTimestamp() },
      deliveredTo: { [senderId]: serverTimestamp() },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies Omit<MessageDocument, "createdAt" | "updatedAt" | "readBy" | "deliveredTo"> & Record<string, unknown>);

    await updateDoc(doc(db(), "chatRooms", chatRoomId), {
      lastMessage: {
        messageId: messageReference.id,
        senderId,
        text,
        attachmentKind: uploaded[0]?.kind,
        createdAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
      [`participants.${senderId}.unreadCount`]: 0,
    });
  },

  markRead(chatRoomId: string, messageId: string) {
    const currentUserId = uid();
    return updateDoc(doc(db(), "chatRooms", chatRoomId, "messages", messageId), {
      [`readBy.${currentUserId}`]: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  setTyping(chatRoomId: string, isTyping: boolean) {
    const currentUserId = uid();
    return updateDoc(doc(db(), "chatRooms", chatRoomId), {
      [`typing.${currentUserId}`]: isTyping ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  },

  bumpUnread(chatRoomId: string, participantId: string) {
    return updateDoc(doc(db(), "chatRooms", chatRoomId), {
      [`participants.${participantId}.unreadCount`]: increment(1),
      updatedAt: serverTimestamp(),
    });
  },

  subscribeMessages(chatRoomId: string, onData: (messages: MessageDocument[]) => void) {
    return onSnapshot(query(collection(db(), "chatRooms", chatRoomId, "messages"), orderBy("createdAt", "asc")), (snapshot) => {
      onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as MessageDocument));
    });
  },
};
