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

export type AuthSessionDto = {
  token: string;
  refreshToken?: string;
  provider: string;
  profile: TravelerProfile;
  isGuest: boolean;
};

export type RouteDashboardDto = {
  insights: RouteInsight[];
  feed: WaynexPost[];
  markers: LiveMarker[];
  recommendations: RouteRecommendation[];
  stories: Story[];
  nearbyTravelers: NearbyTraveler[];
  weather: {
    condition: string;
    temperature: string;
    wind: string;
  };
};

export type SocialFeedDto = {
  stories: Story[];
  posts: WaynexPost[];
};

export type InboxDto = {
  conversations: TripConversation[];
  tripGroups: TripGroup[];
};

export type ExploreDto = {
  collections: ExploreCollection[];
  posts: WaynexPost[];
  recommendations: RouteRecommendation[];
};

export type ProfileDto = {
  profile: TravelerProfile;
  notifications: NotificationItem[];
  memories: TravelMemory[];
  journal: JournalEvent[];
};
