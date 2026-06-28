export type RealtimeChannel =
  | "community-feed"
  | "comments"
  | "likes"
  | "chat"
  | "stories"
  | "notifications"
  | "trip-members"
  | "live-gps"
  | "route-updates";

export type RealtimeEvent<TPayload = unknown> = {
  id: string;
  channel: RealtimeChannel;
  type: string;
  payload: TPayload;
  sentAt: string;
};

export type Unsubscribe = () => void;
