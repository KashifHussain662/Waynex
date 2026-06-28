import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, GeoPoint, Timestamp, getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";

const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "waynex-490e1";
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

function credential() {
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    return cert(JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")));
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  return applicationDefault();
}

if (!getApps().length) {
  initializeApp({
    credential: credential(),
    projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const auth = getAuth();
const db = getFirestore();
const now = Timestamp.now();
const tomorrow = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
const demoPassword = "Waynex@12345";

function location(latitude, longitude, geohash, address) {
  return {
    geopoint: new GeoPoint(latitude, longitude),
    geohash,
    address,
    country: "Pakistan",
  };
}

async function ensureAuthUser({ uid, email, displayName }) {
  try {
    await auth.getUser(uid);
  } catch {
    await auth.createUser({
      uid,
      email,
      password: demoPassword,
      displayName,
      emailVerified: true,
    });
  }
}

const users = [
  {
    id: "demo-kashif",
    username: "kashif.explores",
    email: "kashif.demo@waynex.app",
    displayName: "Kashif Hussain",
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
  {
    id: "demo-traveler",
    username: "traveler",
    email: "traveler@waynex.app",
    displayName: "Waynex Traveler",
    bio: "Demo account for Waynex setup.",
    country: "Pakistan",
    languages: ["English", "Urdu"],
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    tripCount: 1,
    badgeLevel: 1,
    travelXP: 250,
    currentLocation: location(33.738, 73.084, "ttnf", "Islamabad"),
    privacy: { profileVisibility: "public", locationSharing: "friends", searchable: true },
    notificationSettings: { community: true, chat: true, weather: true, navigation: true, trips: true, followers: true },
    fcmTokens: [],
    createdAt: now,
    updatedAt: now,
  },
];

const collections = {
  users,
  trips: [
    {
      id: "demo-trip-northern-loop",
      ownerId: "demo-kashif",
      title: "Northern Loop Crew",
      start: location(31.5204, 74.3587, "tsq6", "Lahore"),
      destination: location(34.0729, 73.3818, "ttrg", "Nathia Gali"),
      destinationName: "Nathia Gali",
      memberIds: ["demo-kashif", "demo-ayesha", "demo-zain", "demo-traveler"],
      expenses: [],
      timeline: [],
      photos: [],
      weather: { condition: "Light snow expected", temperatureC: 8, windKph: 9, fetchedAt: now, provider: "demo" },
      journal: [],
      visibility: "trip-members",
      status: "active",
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ],
  tripMembers: ["demo-kashif", "demo-ayesha", "demo-zain", "demo-traveler"].map((userId) => ({
    id: `demo-trip-northern-loop_${userId}`,
    tripId: "demo-trip-northern-loop",
    userId,
    role: userId === "demo-kashif" ? "owner" : "member",
    status: "joined",
    liveLocationEnabled: userId !== "demo-ayesha",
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  })),
  posts: [
    {
      id: "demo-post-viewpoint",
      authorId: "demo-ayesha",
      tripId: "demo-trip-northern-loop",
      text: "Golden hour viewpoint is open and the road is dry.",
      media: [],
      location: location(33.78, 73.07, "ttnh", "Pir Sohawa Ridge"),
      destination: "Nathia Gali",
      weather: { condition: "Clear", temperatureC: 14, windKph: 6, fetchedAt: now, provider: "demo" },
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
  ],
  roadReports: [
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
  ],
  places: [
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
  ],
  hotels: [
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
  ],
  memories: [
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
  ],
  chatRooms: [
    {
      id: "demo-chat-northern-loop",
      kind: "trip",
      title: "Northern Loop Crew",
      tripId: "demo-trip-northern-loop",
      participantIds: ["demo-kashif", "demo-ayesha", "demo-zain", "demo-traveler"],
      participants: {
        "demo-kashif": { userId: "demo-kashif", role: "owner", joinedAt: now, unreadCount: 0, lastSeenAt: now },
        "demo-ayesha": { userId: "demo-ayesha", role: "member", joinedAt: now, unreadCount: 1 },
        "demo-zain": { userId: "demo-zain", role: "member", joinedAt: now, unreadCount: 0, lastSeenAt: now },
        "demo-traveler": { userId: "demo-traveler", role: "member", joinedAt: now, unreadCount: 0, lastSeenAt: now },
      },
      lastMessage: { messageId: "demo-message-location", senderId: "demo-ayesha", text: "Shared live location for the convoy.", createdAt: now },
      createdBy: "demo-kashif",
      createdAt: now,
      updatedAt: now,
    },
  ],
  messages: [
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
      deliveredTo: { "demo-kashif": now, "demo-zain": now, "demo-traveler": now },
      createdAt: now,
      updatedAt: now,
    },
  ],
  settings: [
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
      featureFlags: { liveGps: true, aiRecommendations: true, roadReportTtl: true },
      minimumSupportedBuild: 1,
      createdAt: now,
      updatedAt: now,
    },
  ],
};

let authUsersSeeded = false;

try {
  for (const user of users) {
    await ensureAuthUser({ uid: user.id, email: user.email, displayName: user.displayName });
  }
  authUsersSeeded = true;
} catch (error) {
  console.warn("Auth users were not seeded. Firestore demo data will still be seeded.");
  console.warn("Enable Firebase Authentication -> Sign-in method -> Email/Password, then run npm run firebase:seed again.");
  console.error(`Project: ${projectId}`);
  console.error(error instanceof Error ? error.message : error);
}

let count = 0;
let batch = db.batch();
let batchSize = 0;

async function commitIfNeeded(force = false) {
  if (batchSize >= 450 || (force && batchSize > 0)) {
    await batch.commit();
    batch = db.batch();
    batchSize = 0;
  }
}

for (const [collectionName, documents] of Object.entries(collections)) {
  for (const item of documents) {
    batch.set(db.collection(collectionName).doc(item.id), { ...item, seededAt: FieldValue.serverTimestamp() }, { merge: true });
    count += 1;
    batchSize += 1;
    await commitIfNeeded();
  }
}

await commitIfNeeded(true);
console.log(`Seeded ${count} Waynex demo documents and ${authUsersSeeded ? users.length : 0} Auth users.`);
console.log(`Demo password for every seeded Auth user: ${demoPassword}`);
console.log("Seeded demo accounts:");
for (const user of users) {
  console.log(`- ${user.email} / ${demoPassword}`);
}
