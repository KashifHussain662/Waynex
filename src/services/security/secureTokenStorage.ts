import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "waynex_access-token";
const REFRESH_TOKEN_KEY = "waynex_refresh-token";

export type TokenPair = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
};

export const secureTokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setTokens(tokens: TokenPair) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    if (tokens.refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },
  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
