export const palette = {
  ink: "#080A0F",
  graphite: "#141820",
  mist: "#F4F7F8",
  porcelain: "#FFFFFF",
  line: "#DDE4E8",
  muted: "#6B7680",
  teal: "#19C7A8",
  ember: "#FF8A4C",
  sky: "#7CCBFF",
  violet: "#9D8CFF",
  danger: "#FF5A69",
  success: "#3DDC97",
};

export const lightTheme = {
  background: "#EEF3F4",
  surface: "rgba(255,255,255,0.82)",
  elevated: "#FFFFFF",
  text: palette.ink,
  muted: palette.muted,
  border: "rgba(8,10,15,0.1)",
  primary: palette.teal,
  accent: palette.ember,
  tab: "rgba(255,255,255,0.9)",
};

export const darkTheme = {
  background: "#080A0F",
  surface: "rgba(20,24,32,0.78)",
  elevated: "#141820",
  text: "#F8FAFC",
  muted: "#9AA6B2",
  border: "rgba(255,255,255,0.12)",
  primary: palette.teal,
  accent: palette.ember,
  tab: "rgba(20,24,32,0.92)",
};

export type WaynexTheme = typeof lightTheme;
