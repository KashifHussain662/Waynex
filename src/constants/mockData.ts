import {
  ExploreCollection,
  JournalEvent,
  LiveMarker,
  NearbyTraveler,
  NotificationItem,
  RouteInsight,
  RouteRecommendation,
  Story,
  TravelMemory,
  TravelerProfile,
  TripConversation,
  TripGroup,
  WaynexPost,
} from "../types";

export const currentTraveler: TravelerProfile = {
  id: "traveler-1",
  name: "Kashif Hussain",
  handle: "@kashif.explores",
  avatar: ["#19C7A8", "#7CCBFF"],
  cover: ["#080A0F", "#123E43", "#19C7A8"],
  bio: "Road trips, mountain routes, clean stops and community-first travel safety.",
  country: "Pakistan",
  languages: ["English", "Urdu", "Punjabi"],
  verified: true,
  badges: ["Explorer", "Road Hero", "Top Guide"],
  stats: {
    countries: 4,
    trips: 38,
    reports: 142,
    xp: 18400,
    level: 7,
  },
};

export const travelers: TravelerProfile[] = [
  currentTraveler,
  {
    id: "traveler-2",
    name: "Ayesha Khan",
    handle: "@ayesha.routes",
    avatar: ["#FF8A4C", "#FFD1B8"],
    cover: ["#141820", "#432C54", "#FF8A4C"],
    bio: "Family travel planner and hotel finder.",
    country: "Pakistan",
    languages: ["English", "Urdu"],
    verified: true,
    badges: ["Community Helper", "Top Photographer"],
    stats: { countries: 3, trips: 24, reports: 88, xp: 12900, level: 6 },
  },
  {
    id: "traveler-3",
    name: "Zain Malik",
    handle: "@zain.onroad",
    avatar: ["#9D8CFF", "#7CCBFF"],
    cover: ["#101820", "#255F85", "#9EE6D0"],
    bio: "Convoy lead, safe route obsessive, tea stop critic.",
    country: "Pakistan",
    languages: ["English", "Urdu", "Pashto"],
    verified: false,
    badges: ["Mountain Lover", "Road Hero"],
    stats: { countries: 2, trips: 31, reports: 106, xp: 15100, level: 7 },
  },
];

export const routeInsights: RouteInsight[] = [
  { id: "eta", label: "Smart ETA", value: "4h 18m", tone: "premium" },
  { id: "traffic", label: "Traffic Flow", value: "Clear after Murree", tone: "calm" },
  { id: "fuel", label: "Fuel Planner", value: "Stop in 82 km", tone: "alert" },
  { id: "weather", label: "Weather", value: "Light snow 7 PM", tone: "premium" },
];

export const routeFeed: WaynexPost[] = [
  {
    id: "1",
    kind: "Beautiful View",
    title: "Golden hour viewpoint is open",
    place: "Pir Sohawa Ridge",
    distance: "2.4 km",
    timeAgo: "12 min",
    visibility: "Public",
    author: travelers[1],
    hashtags: ["#sunset", "#islamabad", "#viewpoint"],
    mentions: ["@zain.onroad"],
    relevanceScore: 96,
    distanceAheadKm: 2.4,
    route: "Islamabad to Nathia Gali",
    coordinates: { latitude: 33.78, longitude: 73.07 },
    media: ["#10233f", "#1d735f", "#f7c46c"],
    likes: 284,
    comments: 31,
    shares: 17,
    saved: true,
    reposts: 11,
  },
  {
    id: "2",
    kind: "Heavy Traffic",
    title: "Slow climb near toll plaza",
    place: "Murree Expressway",
    distance: "18 km",
    timeAgo: "24 min",
    visibility: "Trip Members",
    author: travelers[2],
    hashtags: ["#traffic", "#murree"],
    relevanceScore: 91,
    distanceAheadKm: 18,
    route: "Islamabad to Nathia Gali",
    coordinates: { latitude: 33.9, longitude: 73.39 },
    media: ["#15171a", "#7d3e30", "#ffb15e"],
    likes: 96,
    comments: 14,
    shares: 8,
    saved: false,
    reposts: 5,
  },
  {
    id: "3",
    kind: "Petrol Pump",
    title: "Premium fuel available, card accepted",
    place: "Bhurban Connector",
    distance: "41 km",
    timeAgo: "38 min",
    visibility: "Public",
    author: travelers[0],
    hashtags: ["#fuel", "#cardsaccepted"],
    relevanceScore: 84,
    distanceAheadKm: 41,
    route: "Islamabad to Nathia Gali",
    coordinates: { latitude: 33.95, longitude: 73.45 },
    media: ["#101820", "#255f85", "#9ee6d0"],
    likes: 141,
    comments: 19,
    shares: 12,
    saved: false,
    reposts: 9,
  },
];

export const stories: Story[] = [
  { id: "s1", author: travelers[0], gradient: ["#080A0F", "#123E43", "#19C7A8"], location: "Lahore", weather: "28 C", expiresIn: "8h", hasVideo: true },
  { id: "s2", author: travelers[1], gradient: ["#141820", "#432C54", "#FF8A4C"], location: "Monal", weather: "14 C", expiresIn: "13h", hasVideo: false },
  { id: "s3", author: travelers[2], gradient: ["#101820", "#255F85", "#9EE6D0"], location: "Bhurban", weather: "11 C", expiresIn: "20h", hasVideo: true },
];

export const liveMarkers: LiveMarker[] = [
  { id: "m1", kind: "Road Closed", icon: "construct", title: "Road closed", distance: "10 km ahead", description: "Single lane blocked by repair crew. Use safe bypass.", gradient: ["#15171A", "#7D3E30", "#FF8A4C"], reviews: 48, comments: 22 },
  { id: "m2", kind: "Traffic", icon: "car-sport", title: "Heavy traffic", distance: "18 km ahead", description: "Convoy slowdown near toll plaza. ETA +22 minutes.", gradient: ["#101820", "#255F85", "#7CCBFF"], reviews: 31, comments: 14 },
  { id: "m3", kind: "Petrol Pump", icon: "flame", title: "Fuel and restrooms", distance: "41 km ahead", description: "Premium fuel, clean stop, cards accepted.", gradient: ["#08251F", "#19C7A8", "#9EE6D0"], reviews: 72, comments: 19 },
  { id: "m4", kind: "Hospital", icon: "medkit", title: "Emergency clinic", distance: "55 km ahead", description: "24/7 first response and ambulance contact.", gradient: ["#211016", "#FF5A69", "#FFD1B8"], reviews: 18, comments: 6 },
];

export const aiRecommendations: RouteRecommendation[] = [
  { id: "r1", mode: "Safer", title: "Shift to Lower Topa bypass", reason: "Two warnings and light snow on the upper road.", impact: "Adds 9 min, lowers risk" },
  { id: "r2", mode: "Scenic", title: "Pause at Pir Sohawa before 5:40 PM", reason: "High-rated viewpoint with clear weather window.", impact: "Best light in 42 min" },
  { id: "r3", mode: "Better", title: "Fuel before Bhurban", reason: "Next reliable card-supported station is 82 km away.", impact: "Avoids range anxiety" },
];

export const conversations: TripConversation[] = [
  { id: "c1", name: "Northern Loop Crew", lastMessage: "Ayesha shared live location for the convoy.", unread: 3, activeNow: true, kind: "trip", typing: "Zain typing", readReceipt: "read" },
  { id: "c2", name: "Hunza June Plan", lastMessage: "Hotel shortlist updated with breakfast filters.", unread: 0, activeNow: false, kind: "group", readReceipt: "delivered" },
  { id: "c3", name: "Zain", lastMessage: "Voice note: road is clear after Abbottabad.", unread: 1, activeNow: true, kind: "one-to-one", readReceipt: "sent" },
];

export const notifications: NotificationItem[] = [
  { id: "n1", category: "Navigation", title: "Traffic 10 km ahead", body: "AI recommends Lower Topa bypass.", timeAgo: "2 min", unread: true },
  { id: "n2", category: "Messages", title: "Northern Loop Crew", body: "Ayesha replied to your live location.", timeAgo: "8 min", unread: true },
  { id: "n3", category: "Followers", title: "New follower", body: "Zain started following your road updates.", timeAgo: "25 min", unread: false },
  { id: "n4", category: "Weather", title: "Snow window", body: "Light snowfall expected near Nathia Gali at 7 PM.", timeAgo: "41 min", unread: false },
];

export const exploreCollections: ExploreCollection[] = [
  { id: "e1", title: "Trending", subtitle: "Routes travelers are saving today", gradient: ["#080A0F", "#123E43", "#19C7A8"], icon: "trending-up" },
  { id: "e2", title: "Popular Destinations", subtitle: "Naran, Hunza, Skardu, Kumrat", gradient: ["#101820", "#255F85", "#7CCBFF"], icon: "location" },
  { id: "e3", title: "Camping", subtitle: "Verified spots with water and safe access", gradient: ["#09251D", "#1D735F", "#9EE6D0"], icon: "bonfire" },
  { id: "e4", title: "Restaurants", subtitle: "Clean stops on your active route", gradient: ["#211016", "#7D3E30", "#FF8A4C"], icon: "restaurant" },
  { id: "e5", title: "Hotels", subtitle: "Parking, late check-in and family filters", gradient: ["#141820", "#432C54", "#9D8CFF"], icon: "bed" },
];

export const memories: TravelMemory[] = [
  { id: "mem1", tripName: "Northern Loop", title: "Golden hour album", note: "14 photos, 2 clips, weather and GPS saved offline.", date: "Jun 26", place: "Pir Sohawa", weather: "Clear", gradient: ["#10233F", "#1D735F", "#F7C46C"] },
  { id: "mem2", tripName: "Family Hills", title: "Hotel and food notes", note: "Receipts, ratings, rest stops and route notes.", date: "Jun 25", place: "Bhurban", weather: "Cold", gradient: ["#101820", "#255F85", "#9EE6D0"] },
];

export const journalEvents: JournalEvent[] = [
  { id: "j1", title: "Started from Lahore", place: "DHA Phase 6", time: "6:10 AM", icon: "flag" },
  { id: "j2", title: "Reached Islamabad", place: "M2 entry", time: "10:42 AM", icon: "navigate" },
  { id: "j3", title: "Visited Monal", place: "Pir Sohawa", time: "12:26 PM", icon: "restaurant" },
  { id: "j4", title: "Stayed overnight", place: "Bhurban", time: "8:05 PM", icon: "bed" },
];

export const nearbyTravelers: NearbyTraveler[] = [
  { id: "near1", profile: travelers[1], distance: "1.8 km", privacy: "Everyone", status: "Open to waves" },
  { id: "near2", profile: travelers[2], distance: "4.2 km", privacy: "Friends", status: "Leading convoy" },
];

export const tripGroups: TripGroup[] = [
  { id: "trip1", name: "Lahore to Naran", route: ["Lahore", "Islamabad", "Naran"], members: travelers, sharedExpenses: "Rs 42,800", timelineItems: 18 },
];
