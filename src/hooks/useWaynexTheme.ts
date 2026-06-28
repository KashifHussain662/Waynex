import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../theme";
import { useAppStore } from "../store/useAppStore";

export function useWaynexTheme() {
  const scheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);
  const effectiveMode = themeMode === "system" ? scheme ?? "light" : themeMode;

  return {
    theme: effectiveMode === "dark" ? darkTheme : lightTheme,
    isDark: effectiveMode === "dark",
  };
}
