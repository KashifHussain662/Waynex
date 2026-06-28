import { firestoreService } from "../firebase";
import { socketService } from "./socketService";
import { RealtimeChannel, RealtimeEvent, Unsubscribe } from "../../models/realtime";

export const realtimeHub = {
  connect(token?: string) {
    socketService.connect(token);
  },
  subscribeChannel<T>(channel: RealtimeChannel, listener: (event: RealtimeEvent<T>) => void): Unsubscribe {
    return socketService.subscribe(channel, listener);
  },
  subscribeCollection<T>(path: string, onData: (items: T[]) => void): Unsubscribe {
    const unsubscribe = firestoreService.subscribeList<T>(path, onData, firestoreService.newestFirst());
    return unsubscribe ?? (() => undefined);
  },
  publish<T>(channel: RealtimeChannel, type: string, payload: T) {
    socketService.publish(channel, type, payload);
  },
};
