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
  authError: string | null;
  setThemeMode: (themeMode: ThemeMode) => void;
  setDestination: (destination: string) => void;
  setRadiusKm: (radiusKm: number) => void;
  signIn: (provider: AuthProvider, identifier?: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrateSession: () => Promise<void>;
};

const SESSION_KEY = "waynex_session";

export const useAppStore = create<AppState>((set) => ({
  themeMode: "system",
  destination: "Nathia Gali",
  radiusKm: 25,
  session: null,
  isAuthLoading: false,
  authError: null,
  setThemeMode: (themeMode) => set({ themeMode }),
  setDestination: (destination) => set({ destination }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  signIn: async (provider, identifier) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const session = await authRepository.signIn(provider, identifier);
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
      set({ session, isAuthLoading: false, authError: null });
    } catch (error) {
      set({ isAuthLoading: false, authError: error instanceof Error ? error.message : "Sign in failed." });
      throw error;
    }
  },
  registerWithEmail: async (email, password, displayName) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const session = await authRepository.registerWithEmail(email, password, displayName);
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
      set({ session, isAuthLoading: false, authError: null });
    } catch (error) {
      set({ isAuthLoading: false, authError: error instanceof Error ? error.message : "Registration failed." });
      throw error;
    }
  },
  sendPasswordReset: async (email) => {
    set({ isAuthLoading: true, authError: null });
    try {
      await authRepository.sendPasswordReset(email);
      set({ isAuthLoading: false, authError: null });
    } catch (error) {
      set({ isAuthLoading: false, authError: error instanceof Error ? error.message : "Password reset failed." });
      throw error;
    }
  },
  signOut: async () => {
    await authRepository.signOut();
    await SecureStore.deleteItemAsync(SESSION_KEY);
    set({ session: null });
  },
  hydrateSession: async () => {
    set({ isAuthLoading: true });
    try {
      const [firebaseSession, raw] = await Promise.all([authRepository.getCurrentSession(), SecureStore.getItemAsync(SESSION_KEY)]);
      const session = firebaseSession ?? (raw ? (JSON.parse(raw) as AuthSession) : null);
      set({ session, isAuthLoading: false });
    } catch {
      set({ session: null, isAuthLoading: false });
    }
  },
}));
