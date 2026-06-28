export const remoteConfigService = {
  async activate() {
    return false;
  },
  getString(_key: string, fallback = "") {
    return fallback;
  },
  getBoolean(_key: string, fallback = false) {
    return fallback;
  },
};
