import { GeoPoint, Timestamp } from "firebase/firestore";
import {
  ChatRoomDocument,
  HotelDocument,
  MemoryDocument,
  MessageDocument,
  PlaceDocument,
  PostDocument,
  RoadReportDocument,
  SettingsDocument,
  TripDocument,
  TripMemberDocument,
  UserDocument,
  WaynexLocation,
} from "./schema";

const now = Timestamp.now();
const tomorrow = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

function location(latitude: number, longitude: number, geohash: string, address: string): WaynexLocation {
  return {
    geopoint: new GeoPoint(latitude, longitude),
    geohash,
    address,
    country: "Pakistan",
  };
}

export const seedUsers: UserDocument[] = [
  {
    id: "demo-kashif",
    username: "kashif.explores",
    email: "kashif.demo@waynex.app",
    displayName: "Kashif Hussain",
    photoURL: "",
    coverPhoto: "",
    bio: "Road trips, mountain routes, clean stops and community-first travel safety.",
    country: "Pakistan",
    languages: ["English", "Urdu", "Punjabi"],
    followersCount: 1280,
    followingCount: 214,
    postsCount: 42,
    tripCount: 18,
    badgeLevel: 7,
    travelXP: 18400,
    currentLocation: location(33.738, 73.084, "ttnf", "Islamabad"),
    privacy: { profileVisibility: "public", locationSharing: "friends", searchable: true },
    notificationSettings: { community: true, chat: true, weather: true, navigation: true, trips: true, followers: true },
    fcmTokens: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-ayesha",
    username: "ayesha.routes",
    email: "ayesha.demo@waynex.app",
    displayName: "Ayesha Khan",
    bio: "Family travel planner and hotel finder.",
    country: "Pakistan",
    languages: ["English", "Urdu"],
    followersCount: 840,
    followingCount: 190,
    postsCount: 28,
    tripCount: 12,
    badgeLevel: 6,
    travelXP: 12900,
    currentLocation: location(33.91, 73.39, "ttqx", "Murree Expressway"),
    privacy: { profileVisibility: "public", locationSharing: "trip-members", searchable: true },
    notificationSettings: { community: true, chat: true, weather: true, navigation: true, trips: true, followers: true },
    fcmTokens: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-zain",
    username: "zain.onroad",
    email: "zain.demo@waynex.app",
    displayName: "Zain Malik",
    bio: "Convoy lead, safe route obsessive, tea stop critic.",
    country: "Pakistan",
    languages: ["English", "Urdu", "Pashto"],
    followersCount: 670,
    followingCount: 144,
    postsCount: 35,
    tripCount: 16,
    badgeLevel: 7,
    travelXP: 15100,
    currentLocation: location(33.95, 73.45, "ttr8", "Bhurban Connector"),
    privacy: { profileVisibility: "public", locationSharing: "friends", searchable: true },
    notificationSettings: { community: true, chat: true, weather: true, navigation: true, trips: true, followers: true },
    fcmTokens: [],
    createdAt: now,
    updatedAt: now,
  },
];

export const seedTrips: TripDocument[] = [
  {
    id: "demo-trip-northern-loop",
    ownerId: "demo-kashif",
    title: "Northern Loop Crew",
    start: location(31.5204, 74.3587, "tsq6", "Lahore"),
    destination: location(34.0729, 73.3818, "ttrg", "Nathia Gali"),
    destinationName: "Nathia Gali",
    memberIds: ["demo-kashif", "demo-ayesha", "demo-zain"],
    expenses: [
      { id: "fuel-1", title: "Fuel", amount: 12800, currency: "PKR", paidBy: "demo-kashif", splitWith: ["demo-ayesha", "demo-zain"], createdAt: now },
    ],
    timeline: [
      { id: "start-1", type: "start", title: "Started from Lahore", location: location(31.5204, 74.3587, "tsq6", "Lahore"), createdBy: "demo-kashif", createdAt: now },
    ],
    photos: [],
    weather: { condition: "Light snow expected", temperatureC: 8, windKph: 9, fetchedAt: now, provider: "demo" },
    journal: [
      { id: "journal-1", title: "Smooth first leg", notes: "Traffic opened after Islamabad.", createdBy: "demo-ayesha", createdAt: now },
    ],
    visibility: "trip-members",
    status: "active",
    startedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedTripMembers: TripMemberDocument[] = seedTrips[0].memberIds.map((userId) => ({
  id: `${seedTrips[0].id}_${userId}`,
  tripId: seedTrips[0].id,
  userId,
  role: userId === seedTrips[0].ownerId ? "owner" : "member",
  status: "joined",
  liveLocationEnabled: userId !== "demo-ayesha",
  joinedAt: now,
  createdAt: now,
  updatedAt: now,
}));

export const seedPosts: PostDocument[] = [
  {
    id: "demo-post-viewpoint",
    authorId: "demo-ayesha",
    tripId: "demo-trip-northern-loop",
    text: "Golden hour viewpoint is open and the road is dry.",
    media: [],
    location: location(33.78, 73.07, "ttnh", "Pir Sohawa Ridge"),
    destination: "Nathia Gali",
    weather: { condition: "Clear", temperatureC: 14, windKph: 6, fetchedAt: now, provider: "demo" },
    route: {
      name: "Islamabad to Nathia Gali",
      origin: "Islamabad",
      destination: "Nathia Gali",
      distanceKm: 84,
      etaMinutes: 258,
      trafficLevel: "clear",
      updatedAt: now,
    },
    category: "destination",
    visibility: "public",
    likesCount: 284,
    commentsCount: 31,
    sharesCount: 17,
    savedCount: 74,
    hashtags: ["sunset", "islamabad", "viewpoint"],
    searchKeywords: ["golden", "hour", "viewpoint", "pir", "sohawa", "nathia", "gali"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-post-traffic",
    authorId: "demo-zain",
    tripId: "demo-trip-northern-loop",
    text: "Slow climb near toll plaza. Keep water and patience handy.",
    media: [],
    location: location(33.9, 73.39, "ttqx", "Murree Expressway"),
    destination: "Nathia Gali",
    weather: { condition: "Cloudy", temperatureC: 12, windKph: 10, fetchedAt: now, provider: "demo" },
    category: "road-report",
    visibility: "trip-members",
    likesCount: 96,
    commentsCount: 14,
    sharesCount: 8,
    savedCount: 21,
    hashtags: ["traffic", "murree"],
    searchKeywords: ["traffic", "murree", "expressway", "toll", "plaza"],
    createdAt: now,
    updatedAt: now,
  },
];

export const seedRoadReports: RoadReportDocument[] = [
  {
    id: "demo-road-traffic",
    authorId: "demo-zain",
    kind: "traffic",
    title: "Heavy traffic near toll plaza",
    description: "Convoy slowdown. ETA plus 22 minutes.",
    location: location(33.9, 73.39, "ttqx", "Murree Expressway"),
    routeName: "Islamabad to Nathia Gali",
    severity: "medium",
    status: "active",
    expiresAt: tomorrow,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-road-fuel",
    authorId: "demo-kashif",
    kind: "petrol-pump",
    title: "Premium fuel available",
    description: "Cards accepted, restrooms clean.",
    location: location(33.95, 73.45, "ttr8", "Bhurban Connector"),
    routeName: "Islamabad to Nathia Gali",
    severity: "low",
    status: "active",
    expiresAt: tomorrow,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedPlaces: PlaceDocument[] = [
  {
    id: "demo-place-pir-sohawa",
    name: "Pir Sohawa Ridge",
    category: "viewpoint",
    location: location(33.78, 73.07, "ttnh", "Pir Sohawa"),
    description: "Sunset viewpoint with route visibility.",
    rating: 4.8,
    photos: [],
    verified: true,
    searchKeywords: ["pir", "sohawa", "viewpoint", "sunset"],
    createdAt: now,
    updatedAt: now,
  },
];

export const seedHotels: HotelDocument[] = [
  {
    id: "demo-hotel-hillstay",
    name: "Hillstay Nathia",
    location: location(34.0729, 73.3818, "ttrg", "Nathia Gali"),
    rating: 4.6,
    priceLevel: 3,
    amenities: ["parking", "family rooms", "late check-in", "breakfast"],
    photos: [],
    verified: true,
    searchKeywords: ["hillstay", "nathia", "hotel", "parking", "family"],
    createdAt: now,
    updatedAt: now,
  },
];

export const seedMemories: MemoryDocument[] = [
  {
    id: "demo-memory-golden-hour",
    userId: "demo-kashif",
    tripId: "demo-trip-northern-loop",
    album: "Northern Loop",
    title: "Golden hour album",
    notes: "Photos, route notes, GPS and weather saved offline.",
    gps: location(33.78, 73.07, "ttnh", "Pir Sohawa"),
    weather: { condition: "Clear", temperatureC: 14, fetchedAt: now, provider: "demo" },
    memoryDate: now,
    visibility: "private",
    createdAt: now,
    updatedAt: now,
  },
];

export const seedChatRooms: ChatRoomDocument[] = [
  {
    id: "demo-chat-northern-loop",
    kind: "trip",
    title: "Northern Loop Crew",
    tripId: "demo-trip-northern-loop",
    participantIds: ["demo-kashif", "demo-ayesha", "demo-zain"],
    participants: {
      "demo-kashif": { userId: "demo-kashif", role: "owner", joinedAt: now, unreadCount: 0, lastSeenAt: now },
      "demo-ayesha": { userId: "demo-ayesha", role: "member", joinedAt: now, unreadCount: 1 },
      "demo-zain": { userId: "demo-zain", role: "member", joinedAt: now, unreadCount: 0, lastSeenAt: now },
    },
    lastMessage: { messageId: "demo-message-location", senderId: "demo-ayesha", text: "Shared live location for the convoy.", createdAt: now },
    createdBy: "demo-kashif",
    createdAt: now,
    updatedAt: now,
  },
];

export const seedMessages: MessageDocument[] = [
  {
    id: "demo-message-location",
    chatRoomId: "demo-chat-northern-loop",
    senderId: "demo-ayesha",
    text: "Shared live location for the convoy.",
    attachments: [],
    voiceNotes: [],
    images: [],
    videos: [],
    readBy: { "demo-kashif": now },
    deliveredTo: { "demo-kashif": now, "demo-zain": now },
    createdAt: now,
    updatedAt: now,
  },
];

export const seedSettings: SettingsDocument[] = [
  {
    id: "production",
    reportExpiryHours: {
      "road-closed": 24,
      traffic: 4,
      flood: 24,
      snow: 12,
      landslide: 24,
      police: 6,
      accident: 8,
      "petrol-pump": 48,
      restaurant: 48,
      camping: 72,
    },
    featureFlags: {
      liveGps: true,
      aiRecommendations: true,
      roadReportTtl: true,
    },
    minimumSupportedBuild: 1,
    createdAt: now,
    updatedAt: now,
  },
];
