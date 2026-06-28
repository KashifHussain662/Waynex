import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { authRepository } from "../services/repositories";
import { AuthProvider, AuthSession } from "../types";

type ThemeMode = "system" | "light" | "dark";

type AppState = {
  themeMode: ThemeMode;
  destination: string;
  radiusKm: number;
  session: AuthSession | null;
  isAuthLoading: boolean;
  setThemeMode: (themeMode: ThemeMode) => void;
  setDestination: (destination: string) => void;
  setRadiusKm: (radiusKm: number) => void;
  signIn: (provider: AuthProvider, identifier?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SESSION_KEY = "waynex:session";

export const useAppStore = create<AppState>((set) => ({
  themeMode: "system",
  destination: "Nathia Gali",
  radiusKm: 25,
  session: null,
  isAuthLoading: false,
  setThemeMode: (themeMode) => set({ themeMode }),
  setDestination: (destination) => set({ destination }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  signIn: async (provider, identifier) => {
    set({ isAuthLoading: true });
    try {
      const session = await authRepository.signIn(provider, identifier);
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
      set({ session, isAuthLoading: false });
    } catch (error) {
      set({ isAuthLoading: false });
      throw error;
    }
  },
  signOut: async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    set({ session: null });
  },
}));
