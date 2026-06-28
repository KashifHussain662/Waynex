import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../../api/httpClient";

export type SyncActionType =
  | "posts.create"
  | "comments.create"
  | "likes.toggle"
  | "memories.create"
  | "trips.update"
  | "messages.send"
  | "media.upload";

export type SyncAction = {
  id: string;
  type: SyncActionType;
  payload: unknown;
  priority: "low" | "normal" | "high";
  attempts: number;
  createdAt: string;
};

const QUEUE_KEY = "waynex:sync-queue";

async function readQueue() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? (JSON.parse(raw) as SyncAction[]) : [];
}

async function writeQueue(queue: SyncAction[]) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export const syncEngine = {
  async enqueue(action: Omit<SyncAction, "id" | "attempts" | "createdAt">) {
    const queue = await readQueue();
    const next: SyncAction = {
      ...action,
      id: `${action.type}-${Date.now()}`,
      attempts: 0,
      createdAt: new Date().toISOString(),
    };
    await writeQueue([...queue, next]);
    return next;
  },
  async flush() {
    const queue = await readQueue();
    const remaining: SyncAction[] = [];

    for (const action of queue) {
      try {
        await httpClient.post(`/sync/${action.type}`, action.payload);
      } catch {
        remaining.push({ ...action, attempts: action.attempts + 1 });
      }
    }

    await writeQueue(remaining.filter((item) => item.attempts < 5));
    return { synced: queue.length - remaining.length, remaining: remaining.length };
  },
};
