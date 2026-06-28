import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { firestoreService } from "../firebase";
import { realtimeHub } from "../realtime/realtimeHub";

const LIVE_LOCATION_TASK = "WAYNEX_LIVE_LOCATION_TASK";

export type LiveLocationPrivacy = "friends" | "trip-members" | "private";

export type LiveLocationPoint = {
  userId: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  batteryMode: "balanced" | "high-accuracy";
  privacy: LiveLocationPrivacy;
  recordedAt: string;
};

TaskManager.defineTask(LIVE_LOCATION_TASK, async ({ data, error }) => {
  if (error || !data || typeof data !== "object") {
    return;
  }
});

export const liveLocationService = {
  async requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    const background = await Location.requestBackgroundPermissionsAsync();
    return { foreground: foreground.granted, background: background.granted };
  },
  async startSharing(userId: string, options: { tripId?: string; privacy?: LiveLocationPrivacy; background?: boolean } = {}) {
    const permissions = await this.requestPermissions();
    if (!permissions.foreground) {
      return false;
    }

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    await this.publishPoint({
      userId,
      tripId: options.tripId,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      heading: location.coords.heading,
      speed: location.coords.speed,
      accuracy: location.coords.accuracy,
      batteryMode: "balanced",
      privacy: options.privacy ?? "friends",
      recordedAt: new Date().toISOString(),
    });

    if (options.background && permissions.background) {
      await Location.startLocationUpdatesAsync(LIVE_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 75,
        deferredUpdatesInterval: 30000,
        foregroundService: {
          notificationTitle: "Waynex live journey",
          notificationBody: "Sharing your trip location with selected people.",
        },
        pausesUpdatesAutomatically: true,
      });
    }

    return true;
  },
  async stopSharing(userId: string, tripId?: string) {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LIVE_LOCATION_TASK).catch(() => false);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LIVE_LOCATION_TASK);
    }

    realtimeHub.publish("live-gps", "location.stopped", { userId, tripId });
  },
  async publishPoint(point: LiveLocationPoint) {
    realtimeHub.publish("live-gps", "location.updated", point);
    await firestoreService.upsert("liveLocations", point.userId, point);
  },
};
