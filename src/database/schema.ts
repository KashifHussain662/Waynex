import { GeoPoint, Timestamp } from "firebase/firestore";

export type DocumentTimestamp = Timestamp;

export type Visibility = "public" | "private" | "friends" | "trip-members";

export type MediaKind = "image" | "video" | "voice" | "file";

export type StorageFolder =
  | "profile-images"
  | "post-images"
  | "stories"
  | "trip-images"
  | "chat"
  | "memories"
  | "voice"
  | "videos";

export type WaynexLocation = {
  geopoint: GeoPoint;
  geohash: string;
  address?: string;
  city?: string;
  country?: string;
  accuracyMeters?: number;
};

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  storagePath: string;
  downloadURL: string;
  thumbnailURL?: string;
  contentType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  durationMs?: number;
  createdAt: DocumentTimestamp;
};

export type UserPrivacySettings = {
  profileVisibility: Visibility;
  locationSharing: "off" | "friends" | "trip-members";
  searchable: boolean;
};

export type UserNotificationSettings = {
  community: boolean;
  chat: boolean;
  weather: boolean;
  navigation: boolean;
  trips: boolean;
  followers: boolean;
};

export interface UserDocument {
  id: string;
  username: string;
  email: string;
  displayName: string;
  photoURL?: string;
  coverPhoto?: string;
  bio?: string;
  country?: string;
  languages: string[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  tripCount: number;
  badgeLevel: number;
  travelXP: number;
  currentLocation?: WaynexLocation;
  privacy: UserPrivacySettings;
  notificationSettings: UserNotificationSettings;
  fcmTokens: string[];
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export type PostCategory =
  | "text"
  | "image"
  | "video"
  | "road-report"
  | "destination"
  | "hotel"
  | "restaurant"
  | "memory";

export interface PostDocument {
  id: string;
  authorId: string;
  tripId?: string;
  text: string;
  media: MediaAsset[];
  location?: WaynexLocation;
  destination?: string;
  weather?: WeatherSnapshot;
  route?: RouteSnapshot;
  category: PostCategory;
  visibility: Visibility;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savedCount: number;
  hashtags: string[];
  searchKeywords: string[];
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface RouteSnapshot {
  name?: string;
  origin?: string;
  destination?: string;
  distanceKm?: number;
  etaMinutes?: number;
  trafficLevel?: "clear" | "moderate" | "heavy";
  updatedAt?: DocumentTimestamp;
}

export interface PostLikeDocument {
  id: string;
  postId: string;
  userId: string;
  createdAt: DocumentTimestamp;
}

export interface CommentDocument {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId?: string;
  text: string;
  media: MediaAsset[];
  likesCount: number;
  visibility: Visibility;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface StoryDocument {
  id: string;
  authorId: string;
  media: MediaAsset;
  text?: string;
  location?: WaynexLocation;
  visibility: Visibility;
  viewersCount: number;
  expiresAt: DocumentTimestamp;
  createdAt: DocumentTimestamp;
}

export type ChatRoomKind = "direct" | "group" | "trip";

export interface ChatParticipant {
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: DocumentTimestamp;
  lastSeenAt?: DocumentTimestamp;
  unreadCount: number;
  mutedUntil?: DocumentTimestamp;
}

export interface ChatRoomDocument {
  id: string;
  kind: ChatRoomKind;
  title?: string;
  tripId?: string;
  participantIds: string[];
  participants: Record<string, ChatParticipant>;
  lastMessage?: MessagePreview;
  createdBy: string;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export type MessageAttachment = MediaAsset & {
  caption?: string;
};

export interface MessageDocument {
  id: string;
  chatRoomId: string;
  senderId: string;
  text?: string;
  attachments: MessageAttachment[];
  voiceNotes: MessageAttachment[];
  images: MessageAttachment[];
  videos: MessageAttachment[];
  readBy: Record<string, DocumentTimestamp>;
  deliveredTo: Record<string, DocumentTimestamp>;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export type MessagePreview = {
  messageId: string;
  senderId: string;
  text?: string;
  attachmentKind?: MediaKind;
  createdAt: DocumentTimestamp;
};

export interface TripExpense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitWith: string[];
  createdAt: DocumentTimestamp;
}

export interface TripTimelineItem {
  id: string;
  type: "start" | "stop" | "photo" | "note" | "expense" | "weather" | "arrival";
  title: string;
  note?: string;
  location?: WaynexLocation;
  media?: MediaAsset[];
  createdBy: string;
  createdAt: DocumentTimestamp;
}

export interface TripJournalEntry {
  id: string;
  title: string;
  notes: string;
  location?: WaynexLocation;
  weather?: WeatherSnapshot;
  createdBy: string;
  createdAt: DocumentTimestamp;
}

export interface TripDocument {
  id: string;
  ownerId: string;
  title: string;
  start: WaynexLocation;
  destination: WaynexLocation;
  destinationName: string;
  memberIds: string[];
  expenses: TripExpense[];
  timeline: TripTimelineItem[];
  photos: MediaAsset[];
  weather?: WeatherSnapshot;
  journal: TripJournalEntry[];
  visibility: Visibility;
  status: "planned" | "active" | "completed" | "cancelled";
  startedAt?: DocumentTimestamp;
  endedAt?: DocumentTimestamp;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface TripMemberDocument {
  id: string;
  tripId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "invited" | "joined" | "left" | "removed";
  liveLocationEnabled: boolean;
  joinedAt?: DocumentTimestamp;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface MemoryDocument {
  id: string;
  userId: string;
  tripId?: string;
  album: string;
  title: string;
  notes?: string;
  image?: MediaAsset;
  video?: MediaAsset;
  gps?: WaynexLocation;
  weather?: WeatherSnapshot;
  memoryDate: DocumentTimestamp;
  visibility: Visibility;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface NotificationDocument {
  id: string;
  userId: string;
  category: "community" | "chat" | "weather" | "navigation" | "trips" | "followers";
  title: string;
  body: string;
  data: Record<string, string>;
  read: boolean;
  delivered: boolean;
  createdAt: DocumentTimestamp;
  scheduledFor?: DocumentTimestamp;
}

export interface FollowDocument {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: DocumentTimestamp;
}

export interface SavedPostDocument {
  id: string;
  userId: string;
  postId: string;
  createdAt: DocumentTimestamp;
}

export interface SavedPlaceDocument {
  id: string;
  userId: string;
  placeId: string;
  notes?: string;
  createdAt: DocumentTimestamp;
}

export type ReportTargetType = "post" | "comment" | "story" | "user" | "message" | "place" | "hotel";

export interface ReportDocument {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: "spam" | "harassment" | "unsafe-advice" | "sensitive-content" | "misinformation" | "other";
  details?: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface HotelDocument {
  id: string;
  name: string;
  placeId?: string;
  location: WaynexLocation;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4 | 5;
  amenities: string[];
  photos: MediaAsset[];
  verified: boolean;
  searchKeywords: string[];
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface PlaceDocument {
  id: string;
  name: string;
  category: "destination" | "restaurant" | "camping" | "viewpoint" | "fuel" | "hospital" | "police" | "other";
  location: WaynexLocation;
  description?: string;
  rating: number;
  photos: MediaAsset[];
  verified: boolean;
  searchKeywords: string[];
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export type RoadReportKind =
  | "road-closed"
  | "traffic"
  | "flood"
  | "snow"
  | "landslide"
  | "police"
  | "accident"
  | "petrol-pump"
  | "restaurant"
  | "camping";

export interface RoadReportDocument {
  id: string;
  authorId: string;
  kind: RoadReportKind;
  title: string;
  description?: string;
  location: WaynexLocation;
  routeName?: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "expired" | "resolved";
  expiresAt: DocumentTimestamp;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface WeatherSnapshot {
  condition: string;
  temperatureC: number;
  windKph?: number;
  precipitationMm?: number;
  fetchedAt: DocumentTimestamp;
  provider?: string;
}

export interface WeatherCacheDocument {
  id: string;
  locationKey: string;
  location: WaynexLocation;
  current: WeatherSnapshot;
  forecast: WeatherSnapshot[];
  expiresAt: DocumentTimestamp;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export interface SettingsDocument {
  id: string;
  reportExpiryHours: Partial<Record<RoadReportKind, number>>;
  featureFlags: Record<string, boolean>;
  minimumSupportedBuild: number;
  createdAt: DocumentTimestamp;
  updatedAt: DocumentTimestamp;
}

export type WaynexCollectionMap = {
  users: UserDocument;
  posts: PostDocument;
  comments: CommentDocument;
  stories: StoryDocument;
  chatRooms: ChatRoomDocument;
  messages: MessageDocument;
  trips: TripDocument;
  tripMembers: TripMemberDocument;
  notifications: NotificationDocument;
  followers: FollowDocument;
  following: FollowDocument;
  savedPosts: SavedPostDocument;
  savedPlaces: SavedPlaceDocument;
  memories: MemoryDocument;
  reports: ReportDocument;
  hotels: HotelDocument;
  places: PlaceDocument;
  roadReports: RoadReportDocument;
  weatherCache: WeatherCacheDocument;
  settings: SettingsDocument;
};
