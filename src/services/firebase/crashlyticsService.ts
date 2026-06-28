export const crashlyticsService = {
  recordError(error: unknown, context?: Record<string, string | number | boolean>) {
    if (__DEV__) {
      console.warn("Crashlytics adapter pending native binding", { error, context });
    }
  },
  setUserId(_userId: string) {
    // Native Crashlytics can be attached here in a bare build.
  },
};
