import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";

export function Card({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  const { theme } = useWaynexTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    padding: 16,
  },
});
