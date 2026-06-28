import { StorageFolder } from "./schema";

export const storageFolders: Record<StorageFolder, StorageFolder> = {
  "profile-images": "profile-images",
  "post-images": "post-images",
  stories: "stories",
  "trip-images": "trip-images",
  chat: "chat",
  memories: "memories",
  voice: "voice",
  videos: "videos",
};

export function buildStoragePath(folder: StorageFolder, ownerId: string, fileName: string) {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${storageFolders[folder]}/${ownerId}/${Date.now()}-${safeFileName}`;
}
