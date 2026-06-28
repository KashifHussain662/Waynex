import * as data from "../constants/mockData";
import { AuthProvider } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authRepository = {
  async signIn(provider: AuthProvider, identifier = "guest") {
    await delay(240);
    return {
      token: `waynex-${provider}-${Date.now()}`,
      provider,
      profile: provider === "guest" ? { ...data.currentTraveler, name: "Guest Traveler", handle: "@guest.route" } : data.currentTraveler,
      isGuest: provider === "guest",
      identifier,
    };
  },
};

export const routeRepository = {
  async getDashboard(destination: string) {
    await delay(280);
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
  },
};

export const socialRepository = {
  async getSocialFeed() {
    await delay(260);
    return {
      stories: data.stories,
      posts: data.routeFeed,
    };
  },
};

export const chatRepository = {
  async getInbox() {
    await delay(220);
    return {
      conversations: data.conversations,
      tripGroups: data.tripGroups,
    };
  },
};

export const exploreRepository = {
  async getExplore() {
    await delay(240);
    return {
      collections: data.exploreCollections,
      posts: data.routeFeed,
      recommendations: data.aiRecommendations,
    };
  },
};

export const profileRepository = {
  async getProfile() {
    await delay(180);
    return {
      profile: data.currentTraveler,
      notifications: data.notifications,
      memories: data.memories,
      journal: data.journalEvents,
    };
  },
};
