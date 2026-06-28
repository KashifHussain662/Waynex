export type AlertKind =
  | "Road Closed"
  | "Heavy Traffic"
  | "Landslide"
  | "Flood"
  | "Snowfall"
  | "Police Checkpoint"
  | "Petrol Pump"
  | "Restaurant"
  | "Hotel"
  | "Beautiful View"
  | "Camping Spot"
  | "Emergency";

export type WaynexPost = {
  id: string;
  kind: AlertKind;
  title: string;
  place: string;
  distance: string;
  timeAgo: string;
  visibility: "Public" | "Trip";
  coordinates: {
    latitude: number;
    longitude: number;
  };
  media: readonly [string, string, string];
  likes: number;
  comments: number;
  shares: number;
  saved: boolean;
};

export type RouteInsight = {
  id: string;
  label: string;
  value: string;
  tone: "calm" | "alert" | "premium";
};

export type TripConversation = {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  activeNow: boolean;
};
