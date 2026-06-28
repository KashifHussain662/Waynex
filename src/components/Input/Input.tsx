import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";

type InputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Input({ icon = "search", style, ...props }: InputProps) {
  const { theme } = useWaynexTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Ionicons name={icon} color={theme.muted} size={19} />
      <TextInput
        placeholderTextColor={theme.muted}
        selectionColor={theme.primary}
        style={[styles.input, { color: theme.text }, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
});
