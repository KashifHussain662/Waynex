import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseMessagingService } from "../firebase";

export type NotificationCategory = "community" | "chat" | "weather" | "navigation" | "trips" | "followers";

export type NotificationPreferences = Record<NotificationCategory, boolean>;

const PREFERENCES_KEY = "waynex:notification-preferences";

const defaultPreferences: NotificationPreferences = {
  community: true,
  chat: true,
  weather: true,
  navigation: true,
  trips: true,
  followers: true,
};

export const notificationService = {
  async register() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    return firebaseMessagingService.registerDevice();
  },
  async scheduleLocal(title: string, body: string, seconds = 1) {
    return Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
    });
  },
  async getPreferences() {
    const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
    return raw ? ({ ...defaultPreferences, ...JSON.parse(raw) } as NotificationPreferences) : defaultPreferences;
  },
  async setPreference(category: NotificationCategory, enabled: boolean) {
    const preferences = await this.getPreferences();
    const next = { ...preferences, [category]: enabled };
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
    return next;
  },
};
