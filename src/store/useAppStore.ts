import { create } from "zustand";

type ThemeMode = "system" | "light" | "dark";

type AppState = {
  themeMode: ThemeMode;
  destination: string;
  radiusKm: number;
  setThemeMode: (themeMode: ThemeMode) => void;
  setDestination: (destination: string) => void;
  setRadiusKm: (radiusKm: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  themeMode: "system",
  destination: "Nathia Gali",
  radiusKm: 25,
  setThemeMode: (themeMode) => set({ themeMode }),
  setDestination: (destination) => set({ destination }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
}));
