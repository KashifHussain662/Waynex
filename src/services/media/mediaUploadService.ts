import * as FileSystem from "expo-file-system";
import { firebaseStorageService, UploadProgress } from "../firebase";
import { syncEngine } from "../sync/offlineSyncEngine";

export type MediaUploadRequest = {
  localUri: string;
  remotePath: string;
  contentType?: string;
  compress?: boolean;
  background?: boolean;
  onProgress?: (progress: UploadProgress) => void;
};

export const mediaUploadService = {
  async upload(request: MediaUploadRequest) {
    const file = await FileSystem.getInfoAsync(request.localUri);
    if (!file.exists) {
      throw new Error("Media file does not exist.");
    }

    const url = await firebaseStorageService.uploadMedia({
      uri: request.localUri,
      path: request.remotePath,
      contentType: request.contentType,
      onProgress: request.onProgress,
    });

    if (!url) {
      await syncEngine.enqueue({
        type: "media.upload",
        payload: request,
        priority: "high",
      });
    }

    return url;
  },
};
