import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";
import { getWaynexAuth, getWaynexStorage } from "./firebaseApp";
import { buildStoragePath } from "../../database/storagePaths";
import { StorageFolder } from "../../database/schema";
import { ApiError } from "../../api/errors";

export type UploadProgress = {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
};

export type UploadMediaOptions = {
  uri: string;
  path?: string;
  folder?: StorageFolder;
  ownerId?: string;
  fileName?: string;
  contentType?: string;
  compress?: boolean;
  onProgress?: (progress: UploadProgress) => void;
};

function requireStorageUser() {
  const user = getWaynexAuth()?.currentUser;
  if (!user) {
    throw new ApiError("Please sign in before uploading media.", "AUTH_REQUIRED");
  }
  return user;
}

function mapStorageError(error: unknown): ApiError {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "storage/unknown";
  const message =
    code === "storage/unauthorized"
      ? "You do not have permission to upload this file."
      : code === "storage/retry-limit-exceeded"
        ? "Upload timed out. Please try again."
        : code === "storage/canceled"
          ? "Upload was cancelled."
          : "Media upload failed. Please try again.";

  return new ApiError(message, code === "storage/unauthorized" ? "FORBIDDEN" : "NETWORK_ERROR", undefined, error);
}

export const firebaseStorageService = {
  async uploadMedia({ uri, path, folder, ownerId, fileName, contentType, compress = true, onProgress }: UploadMediaOptions) {
    const user = requireStorageUser();
    const storage = getWaynexStorage();
    if (!storage) {
      return null;
    }

    try {
      const uploadUri =
        compress && contentType?.startsWith("image/")
          ? (
              await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1600 } }], {
                compress: 0.78,
                format: ImageManipulator.SaveFormat.JPEG,
              })
            ).uri
          : uri;
      const storagePath = path ?? buildStoragePath(folder ?? "post-images", ownerId ?? user.uid, fileName ?? "upload");
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      const task = uploadBytesResumable(ref(storage, storagePath), blob, { contentType });

      return await new Promise<string>((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) => {
            onProgress?.({
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: snapshot.totalBytes === 0 ? 0 : snapshot.bytesTransferred / snapshot.totalBytes,
            });
          },
          reject,
          async () => resolve(await getDownloadURL(task.snapshot.ref)),
        );
      });
    } catch (error) {
      throw mapStorageError(error);
    }
  },
  uploadProfileImage(uri: string, onProgress?: (progress: UploadProgress) => void) {
    return this.uploadMedia({ uri, folder: "profile-images", contentType: "image/jpeg", onProgress });
  },
  uploadPostImage(uri: string, onProgress?: (progress: UploadProgress) => void) {
    return this.uploadMedia({ uri, folder: "post-images", contentType: "image/jpeg", onProgress });
  },
  uploadStoryImage(uri: string, onProgress?: (progress: UploadProgress) => void) {
    return this.uploadMedia({ uri, folder: "stories", contentType: "image/jpeg", onProgress });
  },
  uploadChatImage(uri: string, onProgress?: (progress: UploadProgress) => void) {
    return this.uploadMedia({ uri, folder: "chat", contentType: "image/jpeg", onProgress });
  },
  uploadVideo(uri: string, onProgress?: (progress: UploadProgress) => void) {
    return this.uploadMedia({ uri, folder: "videos", contentType: "video/mp4", compress: false, onProgress });
  },
  uploadMemoryMedia(uri: string, contentType: string, onProgress?: (progress: UploadProgress) => void) {
    return this.uploadMedia({ uri, folder: "memories", contentType, compress: contentType.startsWith("image/"), onProgress });
  },
};
