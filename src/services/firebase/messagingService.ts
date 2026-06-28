import * as Notifications from "expo-notifications";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { waynexDoc } from "../../database/collections";

export type PushRegistration = {
  expoPushToken?: string;
  fcmToken?: string;
  permissionGranted: boolean;
};

export const firebaseMessagingService = {
  async registerDevice(): Promise<PushRegistration> {
    const permissions = await Notifications.requestPermissionsAsync();
    if (!permissions.granted) {
      return { permissionGranted: false };
    }

    const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
    return {
      expoPushToken: token?.data,
      permissionGranted: true,
    };
  },
  async registerDeviceForUser(userId: string): Promise<PushRegistration> {
    const registration = await this.registerDevice();
    const token = registration.fcmToken ?? registration.expoPushToken;
    const userReference = waynexDoc("users", userId);

    if (token && userReference) {
      await updateDoc(userReference, {
        fcmTokens: arrayUnion(token),
      });
    }

    return registration;
  },
};
