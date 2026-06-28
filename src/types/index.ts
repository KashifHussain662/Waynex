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
  | "Emergency"
  | "Warning";

export type PrivacyMode = "Public" | "Friends Only" | "Trip Members" | "Private";

export type AuthProvider = "email" | "google" | "apple" | "phone" | "guest";

export type TravelerProfile = {
  id: string;
  name: string;
  handle: string;
  avatar: readonly [string, string];
  cover: readonly [string, string, string];
  bio: string;
  country: string;
  languages: string[];
  verified: boolean;
  badges: string[];
  stats: {
    countries: number;
    trips: number;
    reports: number;
    xp: number;
    level: number;
  };
};

export type AuthSession = {
  token: string;
  provider: AuthProvider;
  profile: TravelerProfile;
  isGuest: boolean;
};

export type WaynexPost = {
  id: string;
  kind: AlertKind;
  title: string;
  place: string;
  distance: string;
  timeAgo: string;
  visibility: PrivacyMode;
  author?: TravelerProfile;
  hashtags?: string[];
  mentions?: string[];
  relevanceScore?: number;
  distanceAheadKm?: number;
  route?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  media: readonly [string, string, string];
  mediaUrls?: string[];
  authorId?: string;
  likes: number;
  comments: number;
  shares: number;
  saved: boolean;
  liked?: boolean;
  reposts?: number;
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
  kind?: "one-to-one" | "group" | "trip";
  typing?: string;
  readReceipt?: "sent" | "delivered" | "read";
};

export type Story = {
  id: string;
  author: TravelerProfile;
  gradient: readonly [string, string, string];
  location: string;
  weather: string;
  expiresIn: string;
  hasVideo: boolean;
};

export type LiveMarker = {
  id: string;
  kind: AlertKind | "Hospital" | "Police" | "Camp" | "View Point" | "Traffic";
  icon: string;
  title: string;
  distance: string;
  description: string;
  gradient: readonly [string, string, string];
  reviews: number;
  comments: number;
};

export type RouteRecommendation = {
  id: string;
  mode: "Better" | "Safer" | "Scenic";
  title: string;
  reason: string;
  impact: string;
};

export type NotificationItem = {
  id: string;
  category: "Messages" | "Trips" | "Followers" | "Community" | "Weather" | "Navigation";
  title: string;
  body: string;
  timeAgo: string;
  unread: boolean;
};

export type ExploreCollection = {
  id: string;
  title: string;
  subtitle: string;
  gradient: readonly [string, string, string];
  icon: string;
};

export type TravelMemory = {
  id: string;
  tripName: string;
  title: string;
  note: string;
  date: string;
  place: string;
  weather: string;
  gradient: readonly [string, string, string];
};

export type JournalEvent = {
  id: string;
  title: string;
  place: string;
  time: string;
  icon: string;
};

export type NearbyTraveler = {
  id: string;
  profile: TravelerProfile;
  distance: string;
  privacy: "Everyone" | "Friends" | "Nobody";
  status: string;
};

export type TripGroup = {
  id: string;
  name: string;
  route: string[];
  members: TravelerProfile[];
  sharedExpenses: string;
  timelineItems: number;
};
