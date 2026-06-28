export type AnalyticsEventName =
  | "login"
  | "signup"
  | "trip_created"
  | "route_started"
  | "community_post_created"
  | "chat_started"
  | "hotel_viewed"
  | "destination_opened";

export const analyticsService = {
  async track(_name: AnalyticsEventName, _params: Record<string, string | number | boolean> = {}) {
    // Firebase Analytics from the web SDK is intentionally not initialized in Expo React Native.
    // A native analytics adapter can be added here when the app moves to a native Firebase module.
  },
};
