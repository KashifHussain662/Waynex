import { httpClient } from "../api/httpClient";
import * as data from "../constants/mockData";
import { ExploreDto, InboxDto, ProfileDto, RouteDashboardDto, SocialFeedDto } from "../dtos/waynexDtos";
import {
  AuthRepository,
  ChatRepository,
  ExploreRepository,
  ProfileRepository,
  RouteRepository,
  SocialRepository,
} from "../interfaces/repositories";
import { AuthProvider, AuthSession, TripConversation, WaynexPost } from "../types";
import { ChatRoomDocument, MemoryDocument, NotificationDocument, PostDocument, UserDocument } from "../database";
import { User } from "firebase/auth";
import { collection, getDocs, orderBy, query, where, Timestamp } from "firebase/firestore";
import { analyticsService, firebaseAuthService, firestoreService, getWaynexAuth, getWaynexFirestore } from "./firebase";
import { secureTokenStorage } from "./security/secureTokenStorage";
import { realtimeHub } from "./realtime/realtimeHub";
import { travelRecommendationEngine } from "./ai/travelRecommendationEngine";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withSeedFallback<T>(apiCall: () => Promise<T>, fallback: () => Promise<T>) {
  try {
    return await apiCall();
  } catch {
    return fallback();
  }
}

function buildSeedDashboard(destination: string): RouteDashboardDto {
  const feed = data.routeFeed
    .filter((post) => post.route?.toLowerCase().includes(destination.toLowerCase()) || (post.relevanceScore ?? 0) > 80)
    .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

  return {
    insights: data.routeInsights,
    feed,
    markers: data.liveMarkers,
    recommendations: data.aiRecommendations,
    stories: data.stories,
    nearbyTravelers: data.nearbyTravelers,
    weather: { condition: "Crisp air", temperature: "14 C", wind: "9 km/h" },
  };
}

function timeAgo(timestamp?: Timestamp) {
  if (!timestamp) {
    return "Live";
  }

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp.toDate().getTime()) / 60000));
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return `${Math.floor(hours / 24)}d ago`;
}

function toWaynexPost(post: PostDocument, likedPostIds = new Set<string>(), savedPostIds = new Set<string>()): WaynexPost {
  return {
    id: post.id,
    authorId: post.authorId,
    kind: post.category === "road-report" ? "Warning" : post.category === "hotel" ? "Hotel" : post.category === "restaurant" ? "Restaurant" : "Beautiful View",
    title: post.text,
    place: post.location?.address ?? post.destination ?? "Waynex",
    distance: "Nearby",
    timeAgo: timeAgo(post.createdAt),
    visibility:
      post.visibility === "public"
        ? "Public"
        : post.visibility === "private"
          ? "Private"
          : post.visibility === "friends"
            ? "Friends Only"
            : "Trip Members",
    hashtags: post.hashtags.map((tag) => `#${tag}`),
    relevanceScore: 90,
    route: post.route?.name,
    coordinates: {
      latitude: post.location?.geopoint.latitude ?? 0,
      longitude: post.location?.geopoint.longitude ?? 0,
    },
    media: ["#101820", "#255F85", "#9EE6D0"],
    mediaUrls: post.media.map((item) => item.downloadURL),
    likes: post.likesCount,
    comments: post.commentsCount,
    shares: post.sharesCount,
    saved: savedPostIds.has(post.id),
    liked: likedPostIds.has(post.id),
  };
}

function toTripConversation(room: ChatRoomDocument, uid: string): TripConversation {
  return {
    id: room.id,
    name: room.title ?? (room.kind === "direct" ? "Direct chat" : room.kind === "trip" ? "Trip chat" : "Group chat"),
    lastMessage: room.lastMessage?.text ?? (room.lastMessage?.attachmentKind ? `${room.lastMessage.attachmentKind} attachment` : "No messages yet"),
    unread: room.participants[uid]?.unreadCount ?? 0,
    activeNow: false,
    kind: room.kind === "direct" ? "one-to-one" : room.kind,
    readReceipt: room.lastMessage ? "delivered" : "sent",
  };
}

async function currentEngagementSets(posts: PostDocument[]) {
  const uid = getWaynexAuth()?.currentUser?.uid;
  const db = getWaynexFirestore();
  if (!uid || !db || posts.length === 0) {
    return { likedPostIds: new Set<string>(), savedPostIds: new Set<string>() };
  }

  const savedSnapshot = await getDocs(query(collection(db, "savedPosts"), where("userId", "==", uid)));
  const savedPostIds = new Set(savedSnapshot.docs.map((item) => String(item.data().postId)));
  const likedPostIds = new Set<string>();

  await Promise.all(
    posts.map(async (post) => {
      const likeSnapshot = await getDocs(query(collection(db, "posts", post.id, "likes"), where("userId", "==", uid)));
      if (!likeSnapshot.empty) {
        likedPostIds.add(post.id);
      }
    }),
  );

  return { likedPostIds, savedPostIds };
}

async function userToSession(user: User, provider: AuthProvider = user.isAnonymous ? "guest" : "email"): Promise<AuthSession> {
  const token = await user.getIdToken();
  return {
    token,
    provider,
    profile: {
      ...data.currentTraveler,
      id: user.uid,
      name: user.displayName ?? data.currentTraveler.name,
      handle: user.email ? `@${user.email.split("@")[0]}` : data.currentTraveler.handle,
    },
    isGuest: user.isAnonymous,
  };
}

function demoProfileForEmail(email: string) {
  if (email === "ayesha.demo@waynex.app") {
    return { ...data.travelers[1], id: "demo-ayesha" };
  }

  if (email === "zain.demo@waynex.app") {
    return { ...data.travelers[2], id: "demo-zain" };
  }

  if (email === "traveler@waynex.app") {
    return { ...data.currentTraveler, id: "demo-traveler", name: "Waynex Traveler", handle: "@traveler" };
  }

  return { ...data.currentTraveler, id: "demo-kashif" };
}

function toTravelerProfile(user: UserDocument) {
  return {
    id: user.id,
    name: user.displayName,
    handle: `@${user.username}`,
    avatar: ["#19C7A8", "#9EE6D0"] as const,
    cover: ["#080A0F", "#123E43", "#19C7A8"] as const,
    bio: user.bio ?? "",
    country: user.country ?? "",
    languages: user.languages,
    verified: false,
    badges: [`Level ${user.badgeLevel}`, ...(user.travelXP > 500 ? ["Trusted Traveler"] : [])],
    stats: {
      countries: user.country ? 1 : 0,
      trips: user.tripCount,
      reports: user.postsCount,
      xp: user.travelXP,
      level: user.badgeLevel,
    },
  };
}

function toNotificationItem(notification: NotificationDocument) {
  const categoryMap = {
    community: "Community",
    chat: "Messages",
    weather: "Weather",
    navigation: "Navigation",
    trips: "Trips",
    followers: "Followers",
  } as const;

  return {
    id: notification.id,
    category: categoryMap[notification.category],
    title: notification.title,
    body: notification.body,
    timeAgo: timeAgo(notification.createdAt),
    unread: !notification.read,
  };
}

function toTravelMemory(memory: MemoryDocument) {
  return {
    id: memory.id,
    tripName: memory.album,
    title: memory.title,
    note: memory.notes ?? "",
    date: memory.memoryDate ? memory.memoryDate.toDate().toLocaleDateString() : "",
    place: memory.gps?.address ?? memory.gps?.city ?? "Saved place",
    weather: memory.weather ? `${memory.weather.temperatureC} C ${memory.weather.condition}` : "Weather saved",
    gradient: ["#141820", "#432C54", "#FF8A4C"] as const,
  };
}

async function ensureUserDocument(user: User) {
  const timestamp = Timestamp.now();
  await firestoreService.upsert("users", user.uid, {
    id: user.uid,
    username: user.email?.split("@")[0] ?? `guest-${user.uid.slice(0, 6)}`,
    email: user.email ?? "",
    displayName: user.displayName ?? (user.isAnonymous ? "Guest Traveler" : data.currentTraveler.name),
    photoURL: user.photoURL ?? "",
    coverPhoto: "",
    bio: "",
    country: data.currentTraveler.country,
    languages: data.currentTraveler.languages,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    tripCount: 0,
    badgeLevel: 1,
    travelXP: 0,
    privacy: { profileVisibility: "public", locationSharing: "friends", searchable: true },
    notificationSettings: { community: true, chat: true, weather: true, navigation: true, trips: true, followers: true },
    fcmTokens: [],
    createdAt: timestamp,
  });
}

class ProductionAuthRepository implements AuthRepository {
  async signIn(provider: AuthProvider, identifier = "guest"): Promise<AuthSession> {
    let firebaseUser: User | null = null;
    try {
      if (provider === "email") {
        const [email, password = "Waynex@12345"] = identifier.split("|");
        try {
          firebaseUser = await firebaseAuthService.signInOrCreateDemoEmail(email, password);
        } catch (error) {
          const isDemoEmail = email.endsWith("@waynex.app") && password === "Waynex@12345";
          if (!isDemoEmail) {
            throw error;
          }
        }
      } else {
        firebaseUser = await firebaseAuthService.signIn(provider, identifier);
      }
    } catch (error) {
      if (provider === "email") {
        throw error;
      }
    }

    const shouldCallBackend = Boolean(firebaseUser) || provider === "email";
    const apiSession = shouldCallBackend
      ? await httpClient
          .post<AuthSession & { refreshToken?: string }>("/auth/sign-in", { provider, identifier, firebaseUid: firebaseUser?.uid }, { auth: false })
          .catch(() => null)
      : null;

    const session: AuthSession =
      apiSession ??
      (firebaseUser
        ? await userToSession(firebaseUser, provider)
        : ({
            token: `waynex-local-${provider}-${Date.now()}`,
            provider,
            profile: provider === "guest" ? { ...data.currentTraveler, name: "Guest Traveler", handle: "@guest.route" } : data.currentTraveler,
            isGuest: provider === "guest",
          } satisfies AuthSession));

    if (!firebaseUser && provider === "email") {
      const [email] = identifier.split("|");
      const localSession: AuthSession = {
        token: `waynex-local-email-${Date.now()}`,
        provider,
        profile: demoProfileForEmail(email),
        isGuest: false,
      };
      await secureTokenStorage.setTokens({ accessToken: localSession.token });
      return localSession;
    }

    if (firebaseUser) {
      await ensureUserDocument(firebaseUser).catch(() => undefined);
    }

    await secureTokenStorage.setTokens({
      accessToken: session.token,
      refreshToken: apiSession?.refreshToken,
    });
    await analyticsService.track(provider === "guest" ? "login" : "signup", { provider });

    return session;
  }

  async registerWithEmail(email: string, password: string, displayName?: string) {
    const firebaseUser = await firebaseAuthService.registerWithEmail(email, password, displayName);
    if (!firebaseUser) {
      throw new Error("Firebase is not configured.");
    }

    const session = await userToSession(firebaseUser, "email");
    await ensureUserDocument(firebaseUser).catch(() => undefined);
    await secureTokenStorage.setTokens({ accessToken: session.token });
    await analyticsService.track("signup", { provider: "email" });
    return session;
  }

  async sendPasswordReset(email: string) {
    await firebaseAuthService.sendPasswordReset(email);
  }

  async getCurrentSession() {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) {
      return new Promise<AuthSession | null>((resolve) => {
        let settled = false;
        const unsubscribe = this.onAuthStateChanged((session) => {
          if (!settled) {
            settled = true;
            unsubscribe();
            resolve(session);
          }
        });

        setTimeout(() => {
          if (!settled) {
            settled = true;
            unsubscribe();
            resolve(null);
          }
        }, 2500);
      });
    }

    return userToSession(user);
  }

  onAuthStateChanged(onSession: (session: AuthSession | null) => void) {
    return firebaseAuthService.onAuthStateChanged(async (user) => {
      onSession(user ? await userToSession(user) : null);
    });
  }

  async signOut() {
    await Promise.all([firebaseAuthService.signOut(), secureTokenStorage.clear()]);
  }
}

class ProductionRouteRepository implements RouteRepository {
  async getDashboard(destination: string) {
    return withSeedFallback(
      async () => {
        const dashboard = await httpClient.get<RouteDashboardDto>(`/routes/dashboard?destination=${encodeURIComponent(destination)}`);
        const aiRecommendations = await travelRecommendationEngine.recommend({
          userId: "current",
          interests: ["safe routes", "scenic stops"],
          previousTrips: [],
          destination,
          reports: dashboard.feed,
          weather: dashboard.weather.condition,
        });
        return { ...dashboard, recommendations: [...aiRecommendations, ...dashboard.recommendations] };
      },
      async () => {
        await delay(180);
        return buildSeedDashboard(destination);
      },
    );
  }

  subscribeDashboard(destination: string, onData: (dashboard: RouteDashboardDto) => void) {
    const unsubscribePosts = firestoreService.subscribeList<PostDocument>(
      "posts",
      (posts) => {
        const seed = buildSeedDashboard(destination);
        onData({
          ...seed,
          feed: posts.length ? posts.map((post) => toWaynexPost(post)) : seed.feed,
        });
      },
      firestoreService.newestFirst(),
    );

    const unsubscribeSocket = realtimeHub.subscribeChannel<RouteDashboardDto>("route-updates", (event) => {
      if (event.type === "route.dashboard.updated") {
        onData(event.payload);
      }
    });

    return () => {
      unsubscribePosts?.();
      unsubscribeSocket();
    };
  }
}

class ProductionSocialRepository implements SocialRepository {
  async getSocialFeed() {
    const posts = await firestoreService.list<PostDocument>("posts", firestoreService.newestFirst("createdAt", 30));
    if (posts?.length) {
      const { likedPostIds, savedPostIds } = await currentEngagementSets(posts);
      return { stories: data.stories, posts: posts.map((post) => toWaynexPost(post, likedPostIds, savedPostIds)) };
    }

    return withSeedFallback(
      () => httpClient.get<SocialFeedDto>("/community/feed"),
      async () => ({ stories: [], posts: [] }),
    );
  }

  subscribeSocialFeed(onData: (feed: SocialFeedDto) => void) {
    const unsubscribePosts = firestoreService.subscribeList<PostDocument>(
      "posts",
      async (posts) => {
        const { likedPostIds, savedPostIds } = await currentEngagementSets(posts);
        onData({ stories: data.stories, posts: posts.map((post) => toWaynexPost(post, likedPostIds, savedPostIds)) });
      },
      firestoreService.newestFirst("createdAt", 30),
    );

    const unsubscribeSocket = realtimeHub.subscribeCollection<PostDocument>("posts", (posts) => {
      if (posts.length) {
        onData({ stories: data.stories, posts: posts.map((post) => toWaynexPost(post)) });
      }
    });

    return () => {
      unsubscribePosts?.();
      unsubscribeSocket();
    };
  }
}

class ProductionChatRepository implements ChatRepository {
  async getInbox() {
    const uid = getWaynexAuth()?.currentUser?.uid;
    if (uid) {
      const rooms = await firestoreService.list<ChatRoomDocument>("chatRooms", [where("participantIds", "array-contains", uid), orderBy("updatedAt", "desc")]);
      if (rooms?.length) {
        return {
          conversations: rooms.map((room) => toTripConversation(room, uid)),
          tripGroups: data.tripGroups,
        };
      }
    }

    return withSeedFallback(() => httpClient.get<InboxDto>("/chat/inbox"), async () => ({ conversations: [], tripGroups: [] }));
  }

  subscribeInbox(onData: (inbox: InboxDto) => void) {
    const uid = getWaynexAuth()?.currentUser?.uid;
    const unsubscribeRooms = uid
      ? firestoreService.subscribeList<ChatRoomDocument>(
          "chatRooms",
          (rooms) => {
            onData({
              conversations: rooms.map((room) => toTripConversation(room, uid)),
              tripGroups: data.tripGroups,
            });
          },
          [where("participantIds", "array-contains", uid), orderBy("updatedAt", "desc")],
        )
      : null;
    const unsubscribeSocket = realtimeHub.subscribeChannel<InboxDto>("chat", (event) => {
      if (event.type === "chat.inbox.updated") {
        onData(event.payload);
      }
    });
    return () => {
      unsubscribeRooms?.();
      unsubscribeSocket();
    };
  }
}

class ProductionExploreRepository implements ExploreRepository {
  async getExplore() {
    return withSeedFallback(
      () => httpClient.get<ExploreDto>("/explore"),
      async () => {
        await delay(160);
        return {
          collections: data.exploreCollections,
          posts: data.routeFeed,
          recommendations: data.aiRecommendations,
        };
      },
    );
  }
}

class ProductionProfileRepository implements ProfileRepository {
  async getProfile() {
    const uid = getWaynexAuth()?.currentUser?.uid;
    if (uid) {
      const user = await firestoreService.get<UserDocument>("users", uid);
      const [notifications, memories] = await Promise.all([
        firestoreService.list<NotificationDocument>("notifications", [where("userId", "==", uid), orderBy("createdAt", "desc")]),
        firestoreService.list<MemoryDocument>("memories", [where("userId", "==", uid), orderBy("memoryDate", "desc")]),
      ]);

      if (user) {
        return {
          profile: toTravelerProfile(user),
          notifications: (notifications ?? []).map(toNotificationItem),
          memories: (memories ?? []).map(toTravelMemory),
          journal: (memories ?? []).slice(0, 8).map((memory) => ({
            id: memory.id,
            title: memory.title,
            place: memory.gps?.address ?? memory.gps?.city ?? "Saved place",
            time: memory.memoryDate ? timeAgo(memory.memoryDate) : "Recent",
            icon: memory.video ? "videocam" : "images",
          })),
        };
      }
    }

    return withSeedFallback(() => httpClient.get<ProfileDto>("/me/profile"), async () => ({
      profile: data.currentTraveler,
      notifications: [],
      memories: [],
      journal: [],
    }));
  }
}

export const authRepository = new ProductionAuthRepository();
export const routeRepository = new ProductionRouteRepository();
export const socialRepository = new ProductionSocialRepository();
export const chatRepository = new ProductionChatRepository();
export const exploreRepository = new ProductionExploreRepository();
export const profileRepository = new ProductionProfileRepository();
