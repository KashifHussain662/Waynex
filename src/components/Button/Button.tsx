import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";

type ButtonProps = PressableProps & {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "ghost";
};

export function Button({ title, icon, variant = "primary", style, ...props }: ButtonProps) {
  const { theme } = useWaynexTheme();
  const primary = variant === "primary";

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: primary ? theme.primary : "transparent",
          borderColor: primary ? theme.primary : theme.border,
          opacity: pressed ? 0.78 : 1,
        },
        style as object,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={primary ? "#06110F" : theme.text} /> : null}
      <Text style={[styles.text, { color: primary ? "#06110F" : theme.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 18,
  },
  text: {
    fontSize: 15,
    fontWeight: "800",
  },
});
